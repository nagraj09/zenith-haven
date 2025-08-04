import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, Clock, Eye, Shield, ExternalLink, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { LinkData } from "@shared/api";

export default function LinkPage() {
  const { linkId } = useParams<{ linkId: string }>();
  const [linkData, setLinkData] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(10);
  const [canDownload, setCanDownload] = useState(false);

  useEffect(() => {
    if (!linkId) {
      setError("Invalid link");
      setLoading(false);
      return;
    }

    fetchLinkData();
  }, [linkId]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanDownload(true);
    }
  }, [countdown]);

  const fetchLinkData = async () => {
    try {
      const response = await fetch(`/api/link/${linkId}`);
      if (response.ok) {
        const data = await response.json();
        setLinkData(data.linkData);
      } else {
        const error = await response.json();
        setError(error.message || "Link not found");
      }
    } catch (error) {
      console.error("Error fetching link data:", error);
      setError("Failed to load link data");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (linkData?.videoInfo.downloadUrl) {
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = linkData.videoInfo.downloadUrl;
      link.download = `${linkData.videoInfo.title}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading video information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !linkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Link Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Header */}
      <header className="px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">StanDrop</h1>
              <p className="text-sm text-gray-500">Watermark-Free Video Downloads</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Video Info */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <img
                      src={linkData.videoInfo.thumbnail}
                      alt="Video thumbnail"
                      className="w-32 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{linkData.videoInfo.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {linkData.videoInfo.duration && (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{Math.floor(linkData.videoInfo.duration / 60)}:{(linkData.videoInfo.duration % 60).toString().padStart(2, '0')}</span>
                          </div>
                        )}
                        {linkData.videoInfo.quality && (
                          <Badge variant="outline">{linkData.videoInfo.quality}</Badge>
                        )}
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{linkData.clicks} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!canDownload ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-8 w-8 text-indigo-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Removing watermarks...
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Please wait {countdown} seconds while we process and clean your video
                      </p>
                      <Progress 
                        value={(10 - countdown) * 10} 
                        className="w-full max-w-xs mx-auto mb-4"
                      />
                      <p className="text-sm text-gray-500">
                        This helps us keep the service free and secure
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Download className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Watermark-Free Video Ready!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Your clean video is ready for download. No watermarks, original quality.
                      </p>
                      <Button
                        onClick={handleDownload}
                        size="lg"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-semibold px-8"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download Video
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar with Ads */}
            <div className="space-y-6">
              {/* Ad Space 1 */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-900">Featured</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-purple-900 mb-2">Premium VPN</h4>
                    <p className="text-sm text-purple-700 mb-4">Secure your downloads with our premium VPN service</p>
                    <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Safe Download
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                      <span>Watermarks removed</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                      <span>Original video quality</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                      <span>Clean, brand-free files</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Ad Space 2 */}
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h4 className="font-semibold text-orange-900 mb-2">Video Converter</h4>
                    <p className="text-sm text-orange-700 mb-4">Convert videos to any format instantly</p>
                    <Button variant="outline" size="sm" className="border-orange-300 text-orange-700 hover:bg-orange-50">
                      Try Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
