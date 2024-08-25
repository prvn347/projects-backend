#!/usr/bin/env node
import express from "express";
import { createClient } from "redis";
import axios from "axios";
const app = express();

const orgs = process.argv;
const client = createClient();
client.on("error", () => {
  console.error("error while setting up redis");
});

app.use(async (req, res) => {
  try {
    const cacheKey = req.originalUrl;

    let cachedResponse = await client.get(cacheKey);
    if (cachedResponse) {
      console.log(`Cache HIT: ${cacheKey}`);
      res.setHeader("X-Cache", "HIT");
      res.send(JSON.parse(cachedResponse));
    } else {
      console.log(`MISS: ${cacheKey}`);
      const originResponse = await axios.get(`${orgs[3]}${req.originalUrl}`);
      const responseData = originResponse.data;
      await client.set(cacheKey, JSON.stringify(responseData), {
        EX: 60 * 5, // Cache expiration time (5 minutes)
      });
      res.setHeader("X-Cache", "MISS");
      res.send(responseData);
    }
  } catch (error) {
    console.error("Error forwarding request to origin:", error);
    res.status(500).send("Error forwarding request to origin server.");
  }
});

const startServer = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");

    app.listen({ host: "0.0.0.0", port: 3000 }, () => {
      console.log("Proxy server running on port:", 3000);
    });
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
};

startServer();
