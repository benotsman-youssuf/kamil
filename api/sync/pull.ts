import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyQFJwt } from "@/server/verify-qf-jwt";
import { supabase } from "@/server/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
