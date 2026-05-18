import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "@/server/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const sort = (req.query.sort as string) || "recent";
    const q = (req.query.q as string)?.trim();

    let query = supabase
      .from("pages")
      .select(`
        id,
        title,
        content,
        is_fork,
        fork_count,
        created_at,
        updated_at,
        qf_user_id,
        user_profiles(display_name, username, avatar_url)
      `)
      .eq("is_public", true);

    if (q) {
      query = query.ilike("title", `%${q}%`);
    }

    if (sort === "most_forked") {
      query = query.order("fork_count", { ascending: false });
    } else {
      query = query.order("updated_at", { ascending: false });
    }

    const offset = (page - 1) * limit;
    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    const pages = (data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      snippet: extractSnippet(p.content),
      author: p.user_profiles || { display_name: "Unknown", username: null, avatar_url: null },
      is_fork: p.is_fork,
      fork_count: p.fork_count,
      created_at: p.created_at,
      updated_at: p.updated_at,
    }));

    return res.status(200).json({
      pages,
      total: count || 0,
      page,
      limit,
      has_more: (count || 0) > offset + limit,
    });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}

function extractSnippet(content: any): string {
  try {
    const nodes = typeof content === "string" ? JSON.parse(content) : content;
    if (!Array.isArray(nodes)) return "";

    const texts: string[] = [];
    const extractText = (node: any) => {
      if (node.children) {
        node.children.forEach(extractText);
      }
      if (node.text) texts.push(node.text);
    };
    nodes.forEach(extractText);

    const full = texts.join(" ").trim();
    return full.length > 200 ? full.slice(0, 200) + "..." : full;
  } catch {
    return "";
  }
}
