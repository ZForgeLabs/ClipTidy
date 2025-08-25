import DashboardNavbar from "@/components/dashboard-navbar";
import { UserCircle, CheckCircle, Settings, Shield, CreditCard, ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { checkUserExists } from "@/utils/database";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user exists in our users table
  const dbUser = await checkUserExists(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background gradients and blur effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 animate-gradient-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-blob-1"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-blob-2"></div>
      
      <DashboardNavbar />
      
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 pt-24">
        <div className="w-full max-w-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-white">Account Settings</h1>
            <p className="text-sm text-gray-400">
              Manage your account information and preferences
            </p>
          </div>

          {/* Account Overview */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-400/30">
                  <UserCircle className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">Account Overview</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your profile information and account status
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-6 rounded-xl border border-white/10 bg-white/5">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/20">
                  <UserCircle size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-white">{user.user_metadata?.full_name || user.email}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <Badge variant="outline" className="mt-2 border-blue-400/30 text-blue-400 bg-blue-500/10">
                    {dbUser?.subscription_tier || 'Free'} Plan
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>Active</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription & Credits */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-500/20 border border-green-400/30">
                  <CreditCard className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">Subscription & Credits</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your subscription plan and video credits
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <span className="font-medium text-white">Current Plan</span>
                  </div>
                  <p className="text-2xl font-semibold capitalize text-white">{dbUser?.subscription_tier || 'Free'}</p>
                  <p className="text-sm text-gray-400">Video conversion plan</p>
                </div>
                <div className="p-6 rounded-xl border border-white/10 bg-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="h-4 w-4 text-green-400" />
                    <span className="font-medium text-white">Credits Remaining</span>
                  </div>
                  <p className="text-2xl font-semibold text-white">{dbUser?.credits_remaining || 0}</p>
                  <p className="text-sm text-gray-400">Video conversions left</p>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                Upgrade Plan
              </Button>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-orange-500/20 border border-orange-400/30">
                  <Settings className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-xl text-white">Account Actions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account settings and preferences
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30">
                Update Profile
              </Button>
              <Button variant="outline" className="w-full justify-start bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30">
                Download Data
              </Button>
              <Button variant="destructive" className="w-full justify-start bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50">
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Back to Dashboard */}
          <div className="text-center">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
