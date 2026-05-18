import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyQFJwt } from "../../server/verify-qf-jwt.js";
import { supabase } from "../../server/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return listPages(req, res);
  }

  if (req.method === "POST") {
    return createPage(req, res);
  }

  return res.status(405).json({ error: "Method not allowed" });
}

async function listPages(req: VercelRequest, res: VercelResponse) {
  try {
    const token = req.headers["x-auth-token"] as string;
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const payload = await verifyQFJwt(token);
    const qfUserId = payload.sub;

    const { data, error } = await supabase
      .from("pages")
      .select("id, title, is_public, is_fork, fork_count, created_at, updated_at")
      .eq("qf_user_id", qfUserId)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return res.status(200).json({ pages: data || [] });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

async function createPage(req: VercelRequest, res: VercelResponse) {
  try {
    const token = req.headers["x-auth-token"] as string;
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const payload = await verifyQFJwt(token);
    const qfUserId = payload.sub;

    const { title, content, is_public, is_fork, forked_from } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required" });
    }

    const { data, error } = await supabase
      .from("pages")
      .insert({
        qf_user_id: qfUserId,
        title,
        content,
        is_public: is_public || false,
        is_fork: is_fork || false,
        forked_from: forked_from || null,
      })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ page: data });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
