import Link from "next/link";
import { Upload, Check, Play } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-transparent">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-6xl sm:text-7xl font-bold text-white mb-8 tracking-tight">
              Transform Videos for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                TikTok & Reels
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Convert horizontal videos to perfect vertical format with
              intelligent cropping and positioning controls. Optimized for
              TikTok, Instagram Reels, and YouTube Shorts.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link
                href="/dashboard"
                className="group inline-flex items-center px-10 py-5 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-xl font-semibold shadow-2xl hover:shadow-blue-500/25 hover:scale-105"
              >
                <Upload className="mr-3 w-6 h-6 group-hover:rotate-12 transition-transform" />
                Upload Video
              </Link>

              <button className="inline-flex items-center px-8 py-5 text-gray-300 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 transition-all duration-300 text-lg font-medium border border-white/10">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>No watermarks</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>High quality output</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                <span>Fast processing</span>
              </div>
            </div>

            {/* Preview mockup */}
            <div className="mt-20 relative">
              <div className="mx-auto w-80 h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 shadow-2xl border border-white/10">
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/20 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white/80 text-sm">
                      9:16 Vertical Preview
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-6 h-6 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
