"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog,  DialogContent,  DialogHeader,  DialogTitle,  DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, Bell, Book, ChevronDown, ChevronRight, Clock, Layers, User } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { fetchStagesWithInfoTexts, formatDuration, formatDate } from "@/app/db/general/utils";


export function ActivityProgressTable(props: any){
    const populateRows = () => {
        const rows: JSX.Element[] = [];
        if (props.userProfilesWithAttempts == null || props.orgCoursesActivities == null) { return rows; }

        {/* need to calculate the user count and attempts per activity */}
        for (const activity of props.orgCoursesActivities) {
            rows.push(
                <TableRow key={`caj-${activity.id}`} className="border-border hover:bg-transparent">
                    <TableCell>{activity?.course?.external_title}</TableCell>
                    <TableCell>{activity?.activity?.external_title}</TableCell>
                    <TableCell>{activity?.user_count || 0}</TableCell> 
                    <TableCell>{activity?.attempts || 0}</TableCell>
                    <TableCell>
                        <Button variant="ghost" size="sm">
                            <ChevronRight size={16} />
                        </Button>
                    </TableCell>
                </TableRow>
            );
        }

        return rows;
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-foreground">Modules</CardTitle>
                <CardDescription>Displays stats for each module</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground">
                                <div className="items-center gap-2 flex">
                                    Course <Layers size={16}/>
                                </div>
                            </TableHead>
                            <TableHead className="items-center gap-2 text-muted-foreground">
                                <div className="items-center gap-2 flex">
                                    Module <Book size={16}/>
                                </div>
                            </TableHead>
                            <TableHead className="items-center gap-2 text-muted-foreground">
                                <div className="items-center gap-2 flex">
                                    Users <User size={16}/>
                                </div>
                            </TableHead>
                            <TableHead className="text-muted-foreground">Attempts</TableHead>
                            <TableHead className="text-muted-foreground w-[80px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {populateRows()}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}