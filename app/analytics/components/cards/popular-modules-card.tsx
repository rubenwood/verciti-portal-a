"use client"
import { ReactNode, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/app/db/general/utils";
import { ChevronDown, ChevronRight, Clock, Play, User } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface MostPopularRowProps {
    title: ReactNode | string;
    value: ReactNode | string;
    count: ReactNode | number;
}

function MostPopularRow(props: MostPopularRowProps) {
    return (
        <TableRow className="border-1">
            <TableCell className="flex items-center gap-2">
                {props.title}
            </TableCell>
            <TableCell className="border-1">
                {props?.value || ""}
            </TableCell>
            <TableCell className="border-1">
                {props?.count || 0} 
            </TableCell>
        </TableRow>);
}

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
            <CollapsibleContent >
                    <Table className="w-full border-1">
                        <TableBody>
                            <MostPopularRow 
                                title={<>Most Played<Play className="size-4" /></>}
                                value={props.mostPlayed?.moduleTitle} 
                                count={props.mostPlayed?.playCount} 
                            />
                            <MostPopularRow 
                                title={<>Most Users <User className="size-4" /></>} 
                                value={props.mostPlayedByUserCount?.moduleTitles?.map((title: string, index: number) => (
                                    <div key={`most-played-${title}-${index}`}>
                                        <span>{title}</span><br/><br/>
                                    </div>
                                ))} 
                                count={props.mostPlayedByUserCount?.userCount} />
                            <MostPopularRow 
                                title={<>Longest Played <Clock className="size-4" /></>}
                                value={props.mostPlayedTime?.moduleTitle} 
                                count={formatDuration(props.mostPlayedTime?.playTime)} 
                            />
                        </TableBody>
                    </Table>
            </CollapsibleContent>
        </Card>
    </Collapsible>
  );
}