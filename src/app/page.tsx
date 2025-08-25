import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  Smartphone,
  Scissors,
  Download,
  Zap,
} from "lucide-react";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Perfect for Every Platform
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Transform your videos into engaging vertical content
              optimized for mobile phones and social media platforms.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Mobile-First Design",
                description:
                  "Perfect 9:16 aspect ratio for all mobile platforms",
              },
              {
                icon: <Scissors className="w-8 h-8" />,
                title: "Smart Cropping",
                description:
                  "Intelligent positioning with manual fine-tuning controls",
              },
              {
                icon: <Download className="w-8 h-8" />,
                title: "High Quality Export",
                description: "Multiple resolution options with fast processing",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="text-blue-400 mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Simple 3-Step Process
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Get your vertical videos ready in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto border border-blue-400/30">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Upload Video</h3>
              <p className="text-gray-300">Drop your video file</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto border border-purple-400/30">
                <span className="text-2xl font-bold text-purple-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white">
                Adjust & Preview
              </h3>
              <p className="text-gray-300">
                Fine-tune positioning and cropping
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-400/30">
                <span className="text-2xl font-bold text-green-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white">Download</h3>
              <p className="text-gray-300">Get your optimized vertical video</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Ready to Transform Your Videos?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
            Join creators who are already making engaging vertical content with
            ClipTidy.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl"
          >
            Start Converting Now
            <ArrowUpRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
