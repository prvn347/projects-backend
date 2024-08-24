import express, { Request, Response } from "express";
import axios from "axios";
require("dotenv").config();
import { createClient } from "redis";
const app = express();

const API_KEY = process.env.WEATHER_KEY;
console.log(API_KEY);

const client = createClient();

client.on("error", (err) => console.log("Redis Client Error", err));

app.get("/search", async (req: Request, res: Response) => {
  let isCached = false;
  let results: any;
  try {
    const query = req.query.q as string;
    console.log(query);
    const cacheResults = await client.get(query);
    if (cacheResults) {
      console.log("found cache hurreh");
      isCached = true;
      results = JSON.parse(cacheResults);
    } else {
      console.log("dont got cache fetching the api");
      const resp = await axios.get(
        `https://synclistener-backend.onrender.com/track/search?q=${query}`
      );
      results = resp.data;

      await client.set(query, JSON.stringify(results), {
        EX: 60,
        NX: true,
      });
    }
    res.status(200).json({
      isCached: isCached,
      data: results,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // If the request was made and the server responded with a status code
        // that falls out of the range of 2xx
        res.status(error.response.status).json({
          error: `Error from Weather API: ${error.response.statusText}`,
          details: error.response.data,
        });
      } else if (error.request) {
        // The request was made but no response was received
        res.status(503).json({
          error:
            "Weather API is currently unavailable. Please try again later.",
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        res.status(500).json({
          error: "An error occurred while setting up the request.",
        });
      }
    } else {
      // Handle other errors
      res.status(500).json({
        error: "An unexpected error occurred.",
      });
    }
  }
});
async function startServer() {
  try {
    await client.connect();
    console.log("Connected to Redis");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error("Failed to connect to Redis", error);
  }
}

startServer();
