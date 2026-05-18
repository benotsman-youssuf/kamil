import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyQFJwt } from "../../server/verify-qf-jwt.js";
import { supabase } from "../../server/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Missing page id" });
  }

  if (req.method === "GET") {
    return getPage(req, res, id);
  }

  if (req.method === "PUT") {
    return updatePage(req, res, id);
  }

  if (req.method === "DELETE") {
    return deletePage(req, res, id);
  }

  if (req.method === "PATCH") {
    return togglePublic(req, res, id);
  }

  if (req.method === "POST") {
    return forkPage(req, res, id);
  }

  return res.status(405).json({ error: "Method not allowed" });
}

async function getPage(req: VercelRequest, res: VercelResponse, pageId: string) {
  try {
    const token = req.headers["x-auth-token"] as string;

    let qfUserId: string | null = null;
    if (token) {
      try {
        const payload = await verifyQFJwt(token);
        qfUserId = payload.sub;
      } catch {
        // Token invalid, continue as anonymous
      }
    }

    const { data: page, error } = await supabase
      .from("pages")
      .select("*")
      .eq("id", pageId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Page not found" });
      }
      throw error;
    }

    // If page is private and user is not the owner, deny access
    if (!page.is_public && qfUserId !== page.qf_user_id) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.status(200).json({ page });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

async function updatePage(req: VercelRequest, res: VercelResponse, pageId: string) {
  try {
    const token = req.headers["x-auth-token"] as string;
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const payload = await verifyQFJwt(token);
    const qfUserId = payload.sub;

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
      .from("pages")
      .select("id")
      .eq("id", pageId)
      .eq("qf_user_id", qfUserId)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: "Page not found or access denied" });
    }

    const { title, content, is_public } = req.body;

    const updates: Record<string, any> = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (is_public !== undefined) updates.is_public = is_public;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("pages")
      .update(updates)
      .eq("id", pageId)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ page: data });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

async function deletePage(req: VercelRequest, res: VercelResponse, pageId: string) {
  try {
    const token = req.headers["x-auth-token"] as string;
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const payload = await verifyQFJwt(token);
    const qfUserId = payload.sub;

    const { error } = await supabase
      .from("pages")
      .delete()
      .eq("id", pageId)
      .eq("qf_user_id", qfUserId);

    if (error) throw error;

    return res.status(200).json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

async function togglePublic(req: VercelRequest, res: VercelResponse, pageId: string) {
  try {
    const token = req.headers["x-auth-token"] as string;
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const payload = await verifyQFJwt(token);
    const qfUserId = payload.sub;

    const { is_public } = req.body;
    if (typeof is_public !== "boolean") {
      return res.status(400).json({ error: "is_public boolean is required" });
    }

    const { data: existing, error: fetchError } = await supabase
      .from("pages")
      .select("id")
      .eq("id", pageId)
      .eq("qf_user_id", qfUserId)
      .single();

    if (fetchError || !existing) {
      return res.status(404).json({ error: "Page not found or access denied" });
    }

    const { data, error } = await supabase
      .from("pages")
      .update({ is_public, updated_at: new Date().toISOString() })
      .eq("id", pageId)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ page: data });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

async function forkPage(req: VercelRequest, res: VercelResponse, pageId: string) {
  try {
    const token = req.headers["x-auth-token"] as string;
    if (!token) return res.status(401).json({ error: "Missing auth token" });

    const payload = await verifyQFJwt(token);
    const qfUserId = payload.sub;

    const { data: original, error: fetchError } = await supabase
      .from("pages")
      .select("*")
      .eq("id", pageId)
      .eq("is_public", true)
      .single();

    if (fetchError || !original) {
      return res.status(404).json({ error: "Page not found or not public" });
    }

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

    await supabase
      .from("pages")
      .update({ fork_count: (original.fork_count || 0) + 1 })
      .eq("id", original.id);

    return res.status(201).json({ page: forked });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
