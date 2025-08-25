"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UserCircle, Home, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();

  return (
    <nav className="w-full border-b border-white/10 bg-black/20 backdrop-blur-md py-4 fixed top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" prefetch className="flex items-center space-x-2 text-2xl font-bold text-white">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                <circle cx="6" cy="6" r="3"></circle>
                <path d="M8.12 8.12 12 12"></path>
                <path d="M20 4 8.12 15.88"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <path d="M14.8 14.8 20 20"></path>
              </svg>
            </div>
            <span>ClipTidy</span>
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900 border border-white/10">
              <DropdownMenuItem asChild>
                <Link href="/account" className="flex items-center gap-2 text-white hover:bg-white/10">
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.refresh();
                }}
                className="flex items-center gap-2 text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
