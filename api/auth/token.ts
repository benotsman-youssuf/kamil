import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { code, code_verifier, redirect_uri, grant_type } = req.body;

  if (grant_type !== "authorization_code") {
    return res.status(400).json({ error: "Invalid grant_type" });
  }

  if (!code || !code_verifier || !redirect_uri) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const authBaseUrl = process.env.AUTH_BASE_URL || "https://oauth2.quran.foundation";

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Server configuration error" });
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri,
    code_verifier,
  });

  try {
    const response = await fetch(`${authBaseUrl}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body,
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error,
        error_description: data.error_description,
        error_hint: data.error_hint,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Token exchange failed" });
  }
}
