import express from "express";
import path from "path";
import fs from "fs";
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

      const safeName = (fileName || "uploaded_qr.png").replace(/[^a-zA-Z0-9.\-_]/g, "");
      const destPath = path.join(qrDir, safeName);
      
      fs.writeFileSync(destPath, Buffer.from(base64Body, "base64"));
      
      return res.json({ 
        success: true, 
        fileName: safeName, 
        url: `/qr/${safeName}` 
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
    
    // Explicit static file paths for multi-page routing
    app.get("/standalone.html", (req, res) => {
      res.sendFile(path.join(distPath, "standalone.html"));
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
