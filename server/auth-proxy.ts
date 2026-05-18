import { createServer } from "http";
import { loadEnv } from "vite";

const env = loadEnv("development", process.cwd(), "");
const AUTH_BASE_URL = env.VITE_OAUTH_ENDPOINT || "https://prelive-oauth2.quran.foundation";
const CLIENT_ID = env.VITE_CLIENT_ID;
const CLIENT_SECRET = env.CLIENT_SECRET;
const PORT = 3001;

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const url = new URL(req.url || "/", `http://localhost:${PORT}`);
  const path = url.pathname;

  if (!path.startsWith("/api/auth/token") && !path.startsWith("/api/auth/refresh") && !path.startsWith("/api/auth/content-token")) {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  if (path.startsWith("/api/auth/content-token")) {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Server configuration error" }));
      return;
    }

    try {
      const response = await fetch(`${AUTH_BASE_URL}/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          scope: "content",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        res.writeHead(response.status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        access_token: result.access_token,
        expires_in: result.expires_in,
      }));
    } catch {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Content token exchange failed" }));
    }
    return;
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", async () => {
    try {
      const data = JSON.parse(body);
      const { grant_type } = data;

      if (!CLIENT_ID || !CLIENT_SECRET) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Server configuration error" }));
        return;
      }

      const tokenBody = new URLSearchParams();

      if (grant_type === "authorization_code") {
        if (!data.code || !data.code_verifier || !data.redirect_uri) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing required parameters" }));
          return;
        }
        tokenBody.append("grant_type", "authorization_code");
        tokenBody.append("code", data.code);
        tokenBody.append("redirect_uri", data.redirect_uri);
        tokenBody.append("code_verifier", data.code_verifier);
      } else if (grant_type === "refresh_token") {
        if (!data.refresh_token) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing refresh_token" }));
          return;
        }
        tokenBody.append("grant_type", "refresh_token");
        tokenBody.append("refresh_token", data.refresh_token);
      } else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid grant_type" }));
        return;
      }

      const response = await fetch(`${AUTH_BASE_URL}/oauth2/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: tokenBody,
      });

      const result = await response.json();

      if (!response.ok) {
        res.writeHead(response.status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
        return;
      }

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Token exchange failed" }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Auth proxy server running on http://localhost:${PORT}`);
});
