"use client";

import { Bell, Settings, Download, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopTabProps {
  activeTab: "analytics" | "workforce" | "skills-map";
  onTabChange: (tab: "analytics" | "workforce" | "skills-map") => void;
}

export function TopTabs({ activeTab, onTabChange }: TopTabProps){
    return (
        <div className="flex items-center gap-1 px-6 pb-0">
        <button
          onClick={() => onTabChange("analytics")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors",
            activeTab === "analytics"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          App Analytics
        </button>
        <button
          onClick={() => onTabChange("workforce")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors",
            activeTab === "workforce"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          Workforce
        </button>
        <button
          onClick={() => onTabChange("skills-map")}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors",
            activeTab === "skills-map"
              ? "border-primary text-primary bg-primary/5"
              : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          Skills Map
        </button>
      </div>
    )
}