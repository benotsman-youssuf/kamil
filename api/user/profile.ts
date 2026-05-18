import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyQFJwt } from "@/server/verify-qf-jwt";
import { supabase } from "@/server/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    return getProfile(req, res);
  }

  if (req.method === "PUT") {
    return updateProfile(req, res);
  }

  return res.status(405).json({ error: "Method not allowed" });
}

async function getProfile(req: VercelRequest, res: VercelResponse) {
  try {
    const token = req.headers["x-auth-token"] as string;
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const payload = await verifyQFJwt(token);
    const qfUserId = payload.sub;

    // Try to get existing profile
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("qf_user_id", qfUserId)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      return res.status(200).json({ profile: data });
    }

    // Auto-create profile from QF JWT data
    const displayName = [payload.first_name, payload.last_name].filter(Boolean).join(" ") || "User";
    const { data: newProfile, error: createError } = await supabase
      .from("user_profiles")
      .insert({
        qf_user_id: qfUserId,
        display_name: displayName,
        username: payload.email?.split("@")[0] || null,
      })
      .select()
      .single();

    if (createError) throw createError;

    return res.status(200).json({ profile: newProfile, created: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

async function updateProfile(req: VercelRequest, res: VercelResponse) {
  try {
    const token = req.headers["x-auth-token"] as string;
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const payload = await verifyQFJwt(token);
    const qfUserId = payload.sub;

    const { display_name, username, bio } = req.body;

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (display_name !== undefined) updates.display_name = display_name;
    if (username !== undefined) updates.username = username;
    if (bio !== undefined) updates.bio = bio;

    const { data, error } = await supabase
      .from("user_profiles")
      .upsert({ qf_user_id: qfUserId, ...updates })
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ profile: data });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
