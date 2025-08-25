import DashboardNavbar from "@/components/dashboard-navbar";
import VideoUpload from "@/components/video-upload";
import { Video, Settings, BarChart3 } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { checkUserExists, createUserManually } from "@/utils/database";
import { Card, CardContent } from "@/components/ui/card";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user exists in our users table
  const dbUser = await checkUserExists(user.id);
  
  // If user doesn't exist in our table, create them
  if (!dbUser) {
    console.log("User not found in database, creating manually...");
    const newUser = await createUserManually(user.id, user.email || '', user.user_metadata?.full_name);
    if (!newUser) {
      console.error("Failed to create user in database");
    }
  }

  return (
    <>
      <DashboardNavbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="relative overflow-hidden bg-transparent">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
            <div className="container mx-auto px-4">
              <div className="w-full max-w-4xl mx-auto space-y-8">
                {/* Welcome Header */}
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                    Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Converter</span>
                  </h1>
                  <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                    Upload and convert your videos with professional quality
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-400/30">
                          <Video className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Total Videos</p>
                          <p className="text-2xl font-bold text-white">{dbUser?.total_conversions || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-green-500/20 border border-green-400/30">
                          <BarChart3 className="h-6 w-6 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Credits Remaining</p>
                          <p className="text-2xl font-bold text-white">{dbUser?.credits_remaining || 0}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-400/30">
                          <Settings className="h-6 w-6 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Plan</p>
                          <p className="text-2xl font-bold text-white capitalize">{dbUser?.subscription_tier || 'Free'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Video Upload Section */}
                <VideoUpload />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
