import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Play, Shield, Zap, Globe } from "lucide-react";

export default function Index() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to the shortened link page
        window.location.href = `/link/${data.linkId}`;
      } else {
        const error = await response.json();
        alert(error.message || "Failed to process video");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to process video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const supportedPlatforms = [
    "Instagram Reels", "YouTube Shorts", "TikTok Videos"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">StanDrop</h1>
              <p className="text-sm text-gray-500">Watermark-Free Video Downloads</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
            100% Free
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-gray-200">
            <Shield className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">Watermark Removal</span>
          </div>

          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Download
            <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent"> Watermark-Free</span> Videos
          </h2>

          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Paste Instagram, YouTube, or TikTok reel/shorts URL and get clean downloads without watermarks. Perfect quality, no branding.
          </p>

          {/* Download Form */}
          <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
                <Play className="h-6 w-6 text-indigo-600" />
                <span>Paste Reel/Shorts URL</span>
              </CardTitle>
              <CardDescription className="text-base">
                Instagram Reels • YouTube Shorts • TikTok Videos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDownload} className="space-y-4">
                <div className="flex space-x-3">
                  <Input
                    type="url"
                    placeholder="https://www.instagram.com/reel/... or YouTube Shorts/TikTok URL"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 h-12 text-base bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={!url.trim() || isLoading}
                    className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Supported Platforms */}
          <div className="mt-12">
            <p className="text-sm text-gray-500 mb-4">Supported Platforms</p>
            <div className="flex flex-wrap justify-center gap-3">
              {supportedPlatforms.map((platform) => (
                <Badge key={platform} variant="outline" className="bg-white/60 backdrop-blur-sm">
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-6 py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose StanDrop?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Remove Watermarks</h4>
              <p className="text-gray-600">Automatically detect and remove watermarks from Instagram, YouTube, and TikTok videos.</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Extract Clean Files</h4>
              <p className="text-gray-600">Get original quality video files without platform branding or overlays.</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Short Links</h4>
              <p className="text-gray-600">Generated shortened URLs with ads for easy sharing and monetization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500">
            © 2024 StanDrop. Watermark-free video downloads for reels and shorts.
          </p>
        </div>
      </footer>
    </div>
  );
}
