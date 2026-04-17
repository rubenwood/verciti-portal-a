"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/app/db/general/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function QuizCard(props: any){
    const [isOpen, setIsOpen] = useState(false);

    // TODO: change this to use the totals

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <Card className="mb-2">
                <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer flex flex-row items-center justify-between p-4">
                        <CardTitle className="text-lg font-semibold">
                            Quiz Stats
                        </CardTitle>
                        {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </CardHeader>
                </CollapsibleTrigger>
                    
                <CollapsibleContent>
                    <CardContent className="flex flex-col items-center justify-center">
                        <span className="grid grid-cols-2 rounded-sm w-full">
                            <p className="border-1 p-2">Total Quizzes attempted</p>
                            <p className="border-1 p-2">{props.totalQuizzes}</p>
                            <p className="border-1 p-2">Total Quiz attempts</p>
                            <p className="border-1 p-2">{props.totalQuizAttempts}</p>
                            <p className="border-1 p-2">Total Quizzes completed</p>
                            <p className="border-1 p-2">{props.completedQuizzes.length}</p>
                            <p className="border-1 p-2">Total Time spent</p>
                            <p className="border-1 p-2">{formatDuration(props.totalQuizDuration)}</p>
                        </span>          
                    </CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    )
}