/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Request type for video download
 */
export interface DownloadRequest {
  url: string;
}

/**
 * Response type for successful video download
 */
export interface DownloadResponse {
  success: boolean;
  linkId: string;
  originalUrl: string;
  title?: string;
  thumbnail?: string;
}

/**
 * Video information from external API
 */
export interface VideoInfo {
  title: string;
  thumbnail: string;
  downloadUrl: string;
  duration?: number;
  quality?: string;
}

/**
 * ShrinkMe API types
 */
export interface ShrinkMeRequest {
  url: string;
  alias?: string;
}

export interface ShrinkMeResponse {
  status: string;
  shortenedUrl: string;
  originalUrl: string;
}

/**
 * Link data stored in memory/database
 */
export interface LinkData {
  id: string;
  originalUrl: string;
  videoInfo: VideoInfo;
  shrinkMeUrl?: string;
  createdAt: Date;
  clicks: number;
}
