import express from "express";
import path from "path";
import fs from "fs";
import https from "https";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set up standard express body parsing with a generous size limit for full base64 file payloads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Create necessary folders in /public if they don't exist
  const publicDir = path.join(process.cwd(), "public");
  const qrDir = path.join(publicDir, "qr");
  const uploadsDir = path.join(publicDir, "uploads");

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
  }
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // API endpoint - Proxy e-Solat for CORS-free and resilient caching behavior
  app.get("/api/prayer-times", (req, res) => {
    const zone = ((req.query.zone as string) || "WLY01").toUpperCase().trim();
    const force = req.query.force === "true";
    const cachePath = path.join(publicDir, `prayer_cache_${zone}.json`);
    const url = `https://api.e-solat.gov.my/index.php?r=esolat/getmain&zone=${zone}&period=today`;

    const getExistingCache = () => {
      if (fs.existsSync(cachePath)) {
        try {
          const raw = fs.readFileSync(cachePath, "utf-8");
          const cachedJson = JSON.parse(raw);
          return {
            source: "cache",
            lastUpdated: cachedJson.lastUpdated || "Sebelum ini",
            zone: zone,
            data: cachedJson.data
          };
        } catch (e) {
          return null;
        }
      }
      return null;
    };

    // If cache of today or within last 4 hours exists, and force is false, return it instantly!
    if (!force && fs.existsSync(cachePath)) {
      try {
        const stats = fs.statSync(cachePath);
        const ageMs = Date.now() - stats.mtimeMs;
        // 4 hours cache validation
        if (ageMs < 4 * 60 * 60 * 1000) {
          const cache = getExistingCache();
          if (cache) {
            return res.json(cache);
          }
        }
      } catch (err) {}
    }

    // Try live fetch
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/ 537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Cache-Control": "no-cache"
      },
      timeout: 10000,
      rejectUnauthorized: false
    };

    const request = https.get(options, (apiRes) => {
      // If server returns error status, fall back to local cache if available
      if (apiRes.statusCode !== 200) {
        const cache = getExistingCache();
        if (cache) {
          return res.json(cache);
        }
        return res.status(apiRes.statusCode || 502).json({ 
          error: `Server JAKIM mengembalikan status kod ralat: ${apiRes.statusCode}` 
        });
      }

      let dataStr = "";
      apiRes.on("data", (chunk) => { dataStr += chunk; });
      apiRes.on("end", () => {
        try {
          const parsed = JSON.parse(dataStr);
          if (parsed && (parsed.prayerTime || parsed.status === "OK")) {
            // Save to cache
            const lastUpdated = new Date().toLocaleString("ms-MY", { timeZone: "Asia/Kuala_Lumpur" });
            const cacheObj = {
              lastUpdated,
              data: parsed
            };
            fs.writeFileSync(cachePath, JSON.stringify(cacheObj, null, 2), "utf-8");
            return res.json({
              source: "live",
              lastUpdated,
              zone: zone,
              data: parsed
            });
          } else {
            throw new Error("Siri data tidak lengkap atau ralat daripada server JAKIM");
          }
        } catch (err: any) {
          const cache = getExistingCache();
          if (cache) {
            return res.json(cache);
          }
          return res.status(502).json({ error: "Gagal memproses data ralat JAKIM dan tiada cache sedia ada.", details: err.message });
        }
      });
    });

    request.on("error", (err) => {
      const cache = getExistingCache();
      if (cache) {
        return res.json(cache);
      }
      return res.status(502).json({ error: "Gagal menyambung ke server JAKIM dan tiada cache sedia ada.", details: err.message });
    });

    request.on("timeout", () => {
      request.destroy();
      const cache = getExistingCache();
      if (cache) {
        return res.json(cache);
      }
      return res.status(504).json({ error: "Masa tamat berhubung ke server JAKIM (Timeout) dan tiada cache sedia ada." });
    });
  });

  // API end points - Fetch current server configuration
  app.get("/api/config", (req, res) => {
    try {
      const configPath = path.join(publicDir, "config.json");
      if (fs.existsSync(configPath)) {
        const raw = fs.readFileSync(configPath, "utf-8");
        return res.json(JSON.parse(raw));
      }
      return res.status(404).json({ error: "config.json not found" });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // API endpoint - Directly write to public/config.json
  app.post("/api/save-config", (req, res) => {
    try {
      const configPath = path.join(publicDir, "config.json");
      fs.writeFileSync(configPath, JSON.stringify(req.body, null, 2), "utf-8");
      return res.json({ success: true, message: "config.json updated successfully on server" });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // API endpoint - Save QR code which replicates on server
  app.post("/api/upload-qr", (req, res) => {
    try {
      const { fileName, fileData } = req.body;
      if (!fileData) {
        return res.status(400).json({ error: "Missing fileData content" });
      }
      
      // Extract clean base64 data
      const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let base64Body = fileData;
      if (matches && matches.length === 3) {
        base64Body = matches[2];
      }

      const destPath = path.join(publicDir, "default_qr.png");
      
      fs.writeFileSync(destPath, Buffer.from(base64Body, "base64"));
      
      return res.json({ 
        success: true, 
        fileName: "default_qr.png", 
        url: `/default_qr.png?v=${Date.now()}` 
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // API endpoint - Save Slide Picture Uploads (Option to set as preset background images)
  app.post("/api/upload-photo", (req, res) => {
    try {
      const { fileName, fileData } = req.body;
      if (!fileData) {
        return res.status(400).json({ error: "Missing fileData content font-bold" });
      }

      const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let base64Body = fileData;
      if (matches && matches.length === 3) {
        base64Body = matches[2];
      }

      const safeName = (fileName || `${Date.now()}.png`).replace(/[^a-zA-Z0-9.\-_]/g, "");
      const destPath = path.join(uploadsDir, safeName);

      fs.writeFileSync(destPath, Buffer.from(base64Body, "base64"));

      return res.json({ 
        success: true, 
        fileName: safeName, 
        url: `/uploads/${safeName}` 
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  });

  // Serve static folders for uploaded files
  app.use("/qr", express.static(qrDir));
  app.use("/uploads", express.static(uploadsDir));

  // Serve static assets out of the traditional public directory
  app.use(express.static(publicDir));

  // Serve TV client application with Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    
    // Redirect old standalone.html requests to primary root /
    app.get("/standalone.html", (req, res) => {
      res.redirect(301, "/");
    });
    app.get("/settings.html", (req, res) => {
      res.sendFile(path.join(distPath, "settings.html"));
    });
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
