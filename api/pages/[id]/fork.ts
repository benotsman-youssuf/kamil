import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyQFJwt } from "@/server/verify-qf-jwt";
import { supabase } from "@/server/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
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

    // Fetch original page (must be public)
    const { data: original, error: fetchError } = await supabase
      .from("pages")
      .select("*")
      .eq("id", id)
      .eq("is_public", true)
      .single();

    if (fetchError || !original) {
      return res.status(404).json({ error: "Page not found or not public" });
    }

    // Create fork
    const { data: forked, error: createError } = await supabase
      .from("pages")
      .insert({
        qf_user_id: qfUserId,
        title: original.title + " (fork)",
        content: original.content,
        is_public: false,
        is_fork: true,
        forked_from: original.id,
      })
      .select()
      .single();

    if (createError) throw createError;

    // Increment fork count on original
    await supabase
      .from("pages")
      .update({ fork_count: (original.fork_count || 0) + 1 })
      .eq("id", original.id);

    return res.status(201).json({ page: forked });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
