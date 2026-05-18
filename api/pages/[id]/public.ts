import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyQFJwt } from "../../../server/verify-qf-jwt";
import { supabase } from "../../../server/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = req.headers["x-auth-token"] as string;
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const payload = await verifyQFJwt(token);
    const qfUserId = payload.sub;

    const { id } = req.query;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Missing page id" });
    }

    const { is_public } = req.body;
    if (typeof is_public !== "boolean") {
      return res.status(400).json({ error: "is_public boolean is required" });
    }

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from("pages")
      .select("id")
      .eq("id", id)
      .eq("qf_user_id", qfUserId)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: "Page not found or access denied" });
    }

    const { data, error } = await supabase
      .from("pages")
      .update({ is_public, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ page: data });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
