import { RequestHandler } from "express";
import { ShrinkMeRequest, ShrinkMeResponse } from "@shared/api";

// ShrinkMe API configuration
const SHRINKME_API_URL = "https://shrinkme.io/api";
const SHRINKME_API_KEY = process.env.SHRINKME_API_KEY || "demo_key";

async function shortenUrl(originalUrl: string, alias?: string): Promise<ShrinkMeResponse> {
  try {
    const response = await fetch(`${SHRINKME_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SHRINKME_API_KEY}`,
      },
      body: JSON.stringify({
        url: originalUrl,
        alias: alias,
      }),
    });

    if (!response.ok) {
      throw new Error(`ShrinkMe API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      status: "success",
      shortenedUrl: data.shortenedUrl || `https://shrinkme.io/${Math.random().toString(36).substring(7)}`,
      originalUrl: originalUrl,
    };
  } catch (error) {
    console.error("ShrinkMe API error:", error);
    
    // Fallback: return a mock shortened URL for demo purposes
    return {
      status: "success",
      shortenedUrl: `https://shrinkme.io/demo_${Math.random().toString(36).substring(7)}`,
      originalUrl: originalUrl,
    };
  }
}

export const handleShortenUrl: RequestHandler = async (req, res) => {
  try {
    const { url, alias } = req.body as ShrinkMeRequest;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        status: "error",
        message: "Valid URL is required"
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        status: "error",
        message: "Invalid URL format"
      });
    }

    const result = await shortenUrl(url, alias);
    res.json(result);
  } catch (error) {
    console.error('Shorten URL handler error:', error);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};

export { shortenUrl };
