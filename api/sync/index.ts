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
      .select("id, name, title, content, description, is_public, is_fork, forked_from, fork_count, created_at, updated_at, isPinned, _deleted")
      .eq("qf_user_id", qfUserId)
      .order("updated_at", { ascending: true });

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
      return res.status(200).json({ synced: [], conflicts: [] });
    }

    const conflicts: any[] = [];
    const toUpsert: any[] = [];

    for (const page of pages) {
      if (!page.id) continue;

      if (page._deleted || page.deleted) {
        const { error: delErr } = await supabase
          .from("pages")
          .update({ _deleted: true, updated_at: page.updated_at })
          .eq("id", page.id)
          .eq("qf_user_id", qfUserId);

        if (delErr) {
          console.error("[sync] soft-delete error:", delErr);
        } else {
          conflicts.push({
            id: page.id,
            name: page.name || "",
            title: page.title || "",
            content: page.content || "",
            description: page.description || "",
            is_public: false,
            is_fork: false,
            fork_count: 0,
            forked_from: "",
            created_at: page.created_at,
            updated_at: page.updated_at,
            isPinned: false,
            _deleted: true,
          });
        }
        continue;
      }

      if (!page.title || !page.content) continue;

      const now = new Date().toISOString();
      toUpsert.push({
        id: page.id,
        qf_user_id: qfUserId,
        name: page.name || page.title || null,
        title: page.title || "بدون عنوان",
        content: typeof page.content === "string" ? page.content : JSON.stringify(page.content),
        description: page.description || "",
        is_public: page.is_public ?? false,
        is_fork: page.is_fork ?? false,
        forked_from: page.forked_from || null,
        fork_count: page.fork_count ?? 0,
        created_at: page.created_at || now,
        updated_at: page.updated_at || now,
        isPinned: page.isPinned ?? false,
      });
    }

    if (toUpsert.length > 0) {
      const ids = toUpsert.map((p) => p.id);
      const { data: existing, error: fetchErr } = await supabase
        .from("pages")
        .select("id, updated_at")
        .in("id", ids)
        .eq("qf_user_id", qfUserId);

      if (fetchErr) throw fetchErr;

      const conflictIds: string[] = [];
      const existingMap = new Map<string, string>();
      if (existing) {
        for (const row of existing) {
          existingMap.set(row.id, row.updated_at);
        }
      }

      const toInsert: any[] = [];
      const toUpdate: any[] = [];

      for (const page of toUpsert) {
        const remoteUpdated = existingMap.get(page.id);
        if (remoteUpdated) {
          const localTime = new Date(page.updated_at).getTime();
          const remoteTime = new Date(remoteUpdated).getTime();

          if (localTime <= remoteTime) {
            conflictIds.push(page.id);
            continue;
          }

          toUpdate.push(page);
        } else {
          toInsert.push(page);
        }
      }

      // Fetch full documents for conflicts so RxDB can resolve them correctly
      if (conflictIds.length > 0) {
        const { data: conflictDocs } = await supabase
          .from("pages")
          .select("*")
          .in("id", conflictIds)
          .eq("qf_user_id", qfUserId);

        if (conflictDocs) {
          for (const doc of conflictDocs) {
            conflicts.push({
              id: doc.id,
              name: doc.name || doc.title,
              title: doc.title,
              content: typeof doc.content === "string" ? doc.content : JSON.stringify(doc.content),
              description: doc.description || "",
              is_public: doc.is_public ?? false,
              is_fork: doc.is_fork ?? false,
              fork_count: doc.fork_count ?? 0,
              forked_from: doc.forked_from || "",
              created_at: doc.created_at,
              updated_at: doc.updated_at,
              isPinned: doc.isPinned ?? false,
              _deleted: doc._deleted ?? false,
            });
          }
        }
      }

      if (toUpdate.length > 0) {
        for (const page of toUpdate) {
          const { error: updateErr } = await supabase
            .from("pages")
            .update({
              name: page.name,
              title: page.title,
              content: page.content,
              description: page.description,
              is_public: page.is_public,
              is_fork: page.is_fork,
              forked_from: page.forked_from,
              fork_count: page.fork_count,
              updated_at: page.updated_at,
              isPinned: page.isPinned,
            })
            .eq("id", page.id)
            .eq("qf_user_id", qfUserId);

          if (updateErr) throw updateErr;
        }
      }

      if (toInsert.length > 0) {
        const { error: insertErr } = await supabase.from("pages").insert(
          toInsert.map((page) => ({
            id: page.id,
            qf_user_id: page.qf_user_id,
            name: page.name,
            title: page.title,
            content: page.content,
            description: page.description,
            is_public: page.is_public,
            is_fork: page.is_fork,
            forked_from: page.forked_from,
            fork_count: page.fork_count,
            created_at: page.created_at,
            updated_at: page.updated_at,
            isPinned: page.isPinned,
          }))
        );

        if (insertErr) throw insertErr;
      }
    }

    return res.status(200).json({
      synced: pages
        .filter((p: any) => !conflicts.some((c: any) => c.id === p.id))
        .map((p: any) => ({ id: p.id, action: "upserted" })),
      conflicts,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
