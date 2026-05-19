import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyQFJwt } from "../../server/verify-qf-jwt.js";
import { supabase } from "../../server/supabase.js";

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

    // Create bare profile — client fills with real data via PUT
    const { data: newProfile, error: createError } = await supabase
      .from("user_profiles")
      .insert({ qf_user_id: qfUserId, display_name: "User" })
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

    const { display_name, username, avatar_url, bio } = req.body;

    // Verify profile exists before updating
    const { data: existing, error: fetchError } = await supabase
      .from("user_profiles")
      .select("qf_user_id")
      .eq("qf_user_id", qfUserId)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!existing) {
      return res.status(404).json({ error: "Profile not found" });
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    if (display_name !== undefined) updates.display_name = display_name;
    if (username !== undefined) updates.username = username;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;
    if (bio !== undefined) updates.bio = bio;

    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("qf_user_id", qfUserId)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ profile: data });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
