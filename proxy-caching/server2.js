"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Create Redis client
const redisClient = (0, redis_1.createClient)();
redisClient.on("error", (err) => console.error("Redis Client Error", err));
// Connect to Redis
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield redisClient.connect();
}))();
// Create Express Server
const app = (0, express_1.default)();
// Configuration
const PORT = 3000;
const HOST = "localhost";
const { API_BASE_URL, API_KEY_VALUE } = process.env;
const API_SERVICE_URL = `${API_BASE_URL}?q=London&appid=${API_KEY_VALUE}`;
// Logging the requests
app.use((0, morgan_1.default)("dev"));
// Proxy and Cache Logic
const proxyOptions = {
    target: "https://synclistener-backend.onrender.com/track/search?q=baby",
    changeOrigin: true,
    selfHandleResponse: true,
    pathRewrite: {
        "^/search": "",
    },
    onProxyRes: (proxyRes, req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let body = "";
        proxyRes.on("data", (chunk) => {
            body += chunk;
        });
        proxyRes.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
            const cacheKey = req.originalUrl;
            const cachedResponse = yield redisClient.get(cacheKey);
            if (cachedResponse) {
                res.setHeader("X-Cache", "HIT");
                res.send(cachedResponse);
            }
            else {
                yield redisClient.set(cacheKey, body, { EX: 3600 }); // Cache for 1 hour
                res.setHeader("X-Cache", "MISS");
                res.set(proxyRes.headers);
                res.send(body);
            }
        }));
    }),
    onProxyReq: (proxyReq, req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const cacheKey = req.originalUrl;
        const cachedResponse = yield redisClient.get(cacheKey);
        if (cachedResponse) {
            res.setHeader("X-Cache", "HIT");
            res.send(cachedResponse);
            proxyReq.destroy(); // Stop the request from being sent to the origin server
        }
    }),
};
app.use("/search", (0, http_proxy_middleware_1.createProxyMiddleware)(proxyOptions));
// Starting our Proxy server
app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
