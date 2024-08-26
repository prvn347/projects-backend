import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

const app = express();
app.use(express.json());

app.post("/shorten", async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    const bcryptHash = await bcrypt.hash(url, 6);
    const shortCode = bcryptHash.replace(/\//g, "_").slice(12, 18);
    const resp = await prisma.url.create({
      data: {
        url,
        shortCode: shortCode,
      },
    });

    res.status(200).json({
      resp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "unable to convert into short string" + error,
    });
  }
});
app.put("/shorten/:id", async (req: Request, res: Response) => {
  try {
    const shortCode = req.params.id;
    const { url } = req.body;

    const shortUrl = await prisma.url.update({
      where: {
        shortCode: shortCode,
      },
      data: {
        url,
      },
    });
    res.status(200).json({
      status: "Url updated",
      updateUrl: shortUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "unable to update the long string" + error,
    });
  }
});
app.delete("/shorten/:id", async (req: Request, res: Response) => {
  try {
    const shortCode = req.params.id;
    const shortUrl = await prisma.url.delete({
      where: {
        shortCode: shortCode,
      },
    });
    res.status(200).json({
      status: "Url deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "unable to delete the long string" + error,
    });
  }
});
app.get("/shorten/:id", async (req: Request, res: Response) => {
  try {
    const shortCode = req.params.id;
    const body = req.body;
    const shortUrl = await prisma.url.update({
      where: {
        shortCode: shortCode,
      },
      data: {
        accessCount: { increment: 1 },
        clickedSites: {
          create: {
            name: body.site,
          },
        },
      },
      select: {
        url: true,
        shortCode: true,
        accessCount: true,
        clickedSites: true,
      },
    });
    if (!shortCode) {
      res.status(404).json({
        error: "code is invalid",
      });
    }
    res.status(200).json({
      shortUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "unable to get the long string" + error,
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
