"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/app/db/general/utils";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function QuizCard(props: any){
    const [isOpen, setIsOpen] = useState(false);

    // TODO: change this to use the totals

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <Card className="mb-2">
                <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer flex flex-row items-center justify-between p-4">
                        <CardTitle className="text-lg font-semibold">
                            Assessment Stats
                        </CardTitle>
                        {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </CardHeader>
                </CollapsibleTrigger>                    
                <CollapsibleContent>
                        <Table className="w-full border-1">
                            <TableBody>
                                <TableRow className="border-1">
                                    <TableCell className="border-1">Total Assessments attempted</TableCell>
                                    <TableCell className="border-1">{props.totalQuizzes}</TableCell>
                                </TableRow>
                                <TableRow className="border-1">
                                    <TableCell className="border-1">Total Assessment attempts</TableCell>
                                    <TableCell className="border-1">{props.totalQuizAttempts}</TableCell>
                                </TableRow>
                                <TableRow className="border-1">
                                    <TableCell className="border-1">Total Assessments completed</TableCell>
                                    <TableCell className="border-1">{props.completedQuizzes.length}</TableCell>
                                </TableRow>
                                <TableRow className="border-1">
                                    <TableCell className="border-1">Total Time spent</TableCell>
                                    <TableCell className="border-1">{formatDuration(props.totalQuizDuration)}</TableCell>
                                </TableRow>
                            </TableBody>        
                        </Table>        
                </CollapsibleContent>
            </Card>
        </Collapsible>
    )
}