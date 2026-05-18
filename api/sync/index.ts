import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyQFJwt } from "../../server/verify-qf-jwt.js";
import { supabase } from "../../server/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return pullFromRemote(req, res);
  }

  if (req.method === "POST") {
    return pushToRemote(req, res);
  }

  return res.status(405).json({ error: "Method not allowed" });
}

async function pullFromRemote(req: VercelRequest, res: VercelResponse) {
  try {
    const token = req.headers["x-auth-token"] as string;
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const payload = await verifyQFJwt(token);
    const qfUserId = payload.sub;

    const since = req.query.since as string;

    let query = supabase
      .from("pages")
      .select("id, title, content, is_public, is_fork, forked_from, fork_count, created_at, updated_at")
      .eq("qf_user_id", qfUserId)
      .order("updated_at", { ascending: false });

    if (since) {
      query = query.gt("updated_at", since);
    }

    const { data, error } = await query;

    if (error) throw error;

    return res.status(200).json({
      pages: data || [],
      since: since || null,
      synced_at: new Date().toISOString(),
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

async function pushToRemote(req: VercelRequest, res: VercelResponse) {
  try {
    const token = req.headers["x-auth-token"] as string;
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const payload = await verifyQFJwt(token);
    const qfUserId = payload.sub;

    const { pages } = req.body;

    if (!Array.isArray(pages) || pages.length === 0) {
      return res.status(400).json({ error: "pages array is required" });
    }

    const results: { id: string; action: "upserted" | "skipped" }[] = [];

    for (const page of pages) {
      if (!page.id || !page.title || !page.content) continue;

      const { data: existing } = await supabase
        .from("pages")
        .select("id, updated_at")
        .eq("id", page.id)
        .eq("qf_user_id", qfUserId)
        .maybeSingle();

      if (existing) {
        const localUpdated = new Date(page.updated_at).getTime();
        const remoteUpdated = new Date(existing.updated_at).getTime();

        if (localUpdated <= remoteUpdated) {
          results.push({ id: page.id, action: "skipped" });
          continue;
        }

        await supabase
          .from("pages")
          .update({
            title: page.title,
            content: page.content,
            updated_at: new Date(page.updated_at || Date.now()).toISOString(),
          })
          .eq("id", page.id);
      } else {
        await supabase.from("pages").insert({
          id: page.id,
          qf_user_id: qfUserId,
          title: page.title,
          content: page.content,
          is_public: page.is_public || false,
          is_fork: page.is_fork || false,
          forked_from: page.forked_from || null,
          created_at: new Date(page.created_at || Date.now()).toISOString(),
          updated_at: new Date(page.updated_at || Date.now()).toISOString(),
        });
      }

      results.push({ id: page.id, action: "upserted" });
    }

    return res.status(200).json({ synced: results });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
