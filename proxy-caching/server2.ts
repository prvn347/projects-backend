import express, { Request, Response } from "express";
import morgan from "morgan";
import {
  createProxyMiddleware,
  Options as ProxyOptions,
} from "http-proxy-middleware";
import redis, { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Redis client
const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis Client Error", err));

// Connect to Redis
(async () => {
  await redisClient.connect();
})();

// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const { API_BASE_URL, API_KEY_VALUE } = process.env;
const API_SERVICE_URL = `${API_BASE_URL}?q=London&appid=${API_KEY_VALUE}`;

// Logging the requests
app.use(morgan("dev"));

// Proxy and Cache Logic
const proxyOptions: ProxyOptions & {
  onProxyRes?: (proxyRes: any, req: Request, res: Response) => Promise<void>;
  onProxyReq?: (proxyReq: any, req: Request, res: Response) => Promise<void>;
} = {
  target: "https://synclistener-backend.onrender.com/track/search?q=baby",
  changeOrigin: true,
  selfHandleResponse: true,
  pathRewrite: {
    "^/search": "",
  },
  onProxyRes: async (proxyRes: any, req: Request, res: Response) => {
    let body = "";

    proxyRes.on("data", (chunk: Buffer) => {
      body += chunk;
    });

    proxyRes.on("end", async () => {
      const cacheKey = req.originalUrl;
      const cachedResponse = await redisClient.get(cacheKey);

      if (cachedResponse) {
        res.setHeader("X-Cache", "HIT");
        res.send(cachedResponse);
      } else {
        await redisClient.set(cacheKey, body, { EX: 3600 }); // Cache for 1 hour
        res.setHeader("X-Cache", "MISS");
        res.set(proxyRes.headers);
        res.send(body);
      }
    });
  },
  onProxyReq: async (proxyReq: any, req: Request, res: Response) => {
    const cacheKey = req.originalUrl;
    const cachedResponse = await redisClient.get(cacheKey);

    if (cachedResponse) {
      res.setHeader("X-Cache", "HIT");
      res.send(cachedResponse);
      proxyReq.destroy(); // Stop the request from being sent to the origin server
    }
  },
};

app.use("/search", createProxyMiddleware(proxyOptions));

// Starting our Proxy server
app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
