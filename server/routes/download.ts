import { RequestHandler } from "express";
import { DownloadRequest, DownloadResponse, VideoInfo, LinkData } from "@shared/api";
import { shortenUrl } from "./shrinkme";
import crypto from "crypto";

// In-memory storage for demo (in production, use a database)
const linkStorage: Map<string, LinkData> = new Map();

// Mock video API integration (replace with actual video API like yt-dlp, etc.)
async function fetchVideoInfo(url: string): Promise<VideoInfo> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Basic URL validation
  const urlPattern = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|tiktok\.com|instagram\.com|twitter\.com|x\.com|facebook\.com|dailymotion\.com)/i;
  
  if (!urlPattern.test(url)) {
    throw new Error("Unsupported platform. Please use a supported video platform URL.");
  }

  // Mock video info (in production, use actual video extraction API)
  const videoInfo: VideoInfo = {
    title: "Sample Video Title - Amazing Content",
    thumbnail: "https://via.placeholder.com/640x360?text=Video+Thumbnail",
    downloadUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    duration: 120,
    quality: "720p"
  };

  return videoInfo;
}

export const handleDownload: RequestHandler = async (req, res) => {
  try {
    const { url } = req.body as DownloadRequest;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        message: "Valid video URL is required"
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format"
      });
    }

    // Fetch video information
    let videoInfo: VideoInfo;
    try {
      videoInfo = await fetchVideoInfo(url);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch video information"
      });
    }

    // Generate unique link ID
    const linkId = crypto.randomBytes(8).toString('hex');

    // Create the redirect URL for our link page
    const redirectUrl = `${req.protocol}://${req.get('host')}/link/${linkId}`;

    // Generate shortened URL using ShrinkMe API
    let shrinkMeUrl: string | undefined;
    try {
      const shrinkResult = await shortenUrl(redirectUrl);
      shrinkMeUrl = shrinkResult.shortenedUrl;
    } catch (error) {
      console.error('Failed to create shortened URL:', error);
      // Continue without shortened URL
    }

    // Store link data
    const linkData: LinkData = {
      id: linkId,
      originalUrl: url,
      videoInfo,
      shrinkMeUrl,
      createdAt: new Date(),
      clicks: 0
    };

    linkStorage.set(linkId, linkData);

    const response: DownloadResponse = {
      success: true,
      linkId,
      originalUrl: url,
      title: videoInfo.title,
      thumbnail: videoInfo.thumbnail
    };

    res.json(response);
  } catch (error) {
    console.error('Download handler error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const handleGetLink: RequestHandler = async (req, res) => {
  try {
    const { linkId } = req.params;

    if (!linkId) {
      return res.status(400).json({
        success: false,
        message: "Link ID is required"
      });
    }

    const linkData = linkStorage.get(linkId);

    if (!linkData) {
      return res.status(404).json({
        success: false,
        message: "Link not found or expired"
      });
    }

    // Increment click count
    linkData.clicks++;
    linkStorage.set(linkId, linkData);

    res.json({
      success: true,
      linkData
    });
  } catch (error) {
    console.error('Get link handler error:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Export storage for other routes to access
export { linkStorage };
