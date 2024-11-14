"use client";

import { cn } from "@/lib/utils";
import {
  Brain,
  LayoutDashboard,
  FileText,
  Video,
  BarChart,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Resume",
    icon: FileText,
    href: "/dashboard/resume",
    color: "text-violet-500",
  },
  {
    label: "Practice",
    icon: Video,
    href: "/dashboard/practice",
    color: "text-pink-700",
  },
  {
    label: "Reviews",
    icon: MessageSquare,
    href: "/dashboard/reviews",
    color: "text-green-700",
  },
  {
    label: "Analytics",
    icon: BarChart,
    href: "/dashboard/analytics",
    color: "text-orange-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-background text-primary">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <Brain className="h-8 w-8" />
          <h1 className="text-xl font-bold ml-2">Interview Buddy</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-primary hover:bg-primary hover:text-white"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut(auth)}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}