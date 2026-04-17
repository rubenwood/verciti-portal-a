"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/app/db/general/utils";
import { ChevronDown, ChevronRight, Clock, Play, User } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function PopularModulesCard(props: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-2">
        <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer flex flex-row items-center justify-between p-4">
                <CardTitle className="text-lg font-semibold">
                    Most Popular Modules
                </CardTitle>
                {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                ) : (
                    <ChevronRight className="h-4 w-4" />
                )}
            </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <CardContent className="pt-0">
                <div className="grid grid-cols-3 border rounded-sm w-full text-sm">                    
                    <p className="border-1 p-2 flex items-center gap-1">
                        Most Played <Play className="size-4" />
                    </p>
                    <p className="border-1 p-2">{props.mostPlayed?.moduleTitle}</p>
                    <p className="border-1 p-2">{props.mostPlayed?.playCount}</p>

                    <p className="border-1 p-2 flex items-center gap-1">
                        Most Users <User className="size-4" />
                    </p>
                    <p className="border-1 p-2">
                        {props.mostPlayedByUserCount?.moduleTitles?.join(", ")}
                    </p>
                    <p className="p-2">
                    {props.mostPlayedByUserCount?.userCount}
                    </p>

                    <p className="border-1 p-2 flex items-center gap-1">
                        Longest Played <Clock className="size-4" />
                    </p>
                    <p className="border-1 p-2">{props.mostPlayedTime?.moduleTitle}</p>
                    <p className="border-1 p-2">
                        {formatDuration(props.mostPlayedTime?.playTime)}
                    </p>
                </div>
            </CardContent>
        </CollapsibleContent>

      </Card>
    </Collapsible>
  );
}