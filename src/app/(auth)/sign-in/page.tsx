import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Scissors, ArrowLeft } from "lucide-react";

interface LoginProps {
  searchParams: Promise<Message>;
}

export default async function SignInPage({ searchParams }: LoginProps) {
  const message = await searchParams;

  if ("message" in message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background gradients and blur effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10 animate-gradient-pulse"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-blob-1"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-blob-2"></div>
      
      {/* Navigation */}
      <nav className="w-full border-b border-white/10 bg-black/20 backdrop-blur-md py-4 fixed top-0 z-50">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-white">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <span>ClipTidy</span>
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-8 pt-24">
        <div className="w-full max-w-md">
          <Card className="border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
            <CardHeader className="space-y-4 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/20">
                <Scissors className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-semibold text-white">Welcome Back</CardTitle>
                <CardDescription className="text-gray-400 mt-2">
                  Sign in to your ClipTidy account to continue converting videos
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="w-full bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                        Password
                      </Label>
                      <Link
                        className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-all"
                        href="/forgot-password"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Your password"
                      required
                      className="w-full bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>
                </div>

                <SubmitButton
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                  pendingText="Signing in..."
                  formAction={signInAction}
                >
                  Sign In
                </SubmitButton>

                <div className="text-center">
                  <p className="text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link
                      className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-all"
                      href="/sign-up"
                    >
                      Create one now
                    </Link>
                  </p>
                </div>

                <FormMessage message={message} />
              </form>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Secure authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>No data sharing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Instant access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
