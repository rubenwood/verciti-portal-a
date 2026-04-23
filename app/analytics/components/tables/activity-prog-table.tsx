"use client"
import { JSX, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog,  DialogContent,  DialogHeader,  DialogTitle,  DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, Bell, Book, ChevronDown, ChevronRight, Clock, Layers, User, Play, Award, Trophy } from "lucide-react";
import { getMasteredActivities } from "@/app/db/user/user-prog-analytics"; // TODO: improve this


export function ActivityProgressTable(props: any){
    const [masteryByUser, setMasteryByUser] = useState<Record<string, { masteredCajIds: string[]; masteredStageIds: string[] }>>({});

     useEffect(() => {
        if (!props.userProfilesWithAttempts?.length || !props.supabaseClient) return;

        const userIds = props.userProfilesWithAttempts.map((u: any) => u.Id);
        getMasteredActivities(props.supabaseClient, userIds).then(setMasteryByUser);
    }, [props.userProfilesWithAttempts]);


    // TODO: improve these, would be better that they are passed in
    const attemptsByActivityId = useMemo(() => {
        const map: Record<string, number> = {};

        if (!props.userProfilesWithAttempts){ return map; }

        for (const user of props.userProfilesWithAttempts) {
            const attempts = user.ActivityAttempts ?? [];

            for (const attempt of attempts) {
                const activityId = attempt.caj_id;
                map[activityId] = (map[activityId] ?? 0) + 1;
            }
        }

        return map;
    }, [props.userProfilesWithAttempts]);

    const usersByActivity = useMemo(() => {
        const map: Record<string, number> = {};

        if (!props.userProfilesWithAttempts) return map;

        for (const user of props.userProfilesWithAttempts) {
            const groupedActivities = user.GroupedActivityAttempts ?? [];
            for (const group of groupedActivities) {
                const activityId = group.id;
                map[activityId] = (map[activityId] ?? 0) + 1;
            }
        }

        return map;
    }, [props.userProfilesWithAttempts]);

    const completedCountByCajId = useMemo(() => {
        const map: Record<string, number> = {};
        if (!props.userProgressData) return map;

        for (const user of props.userProgressData) {
            for(const prog of user?.generic_activity_progress){
                if (prog.completion >= 1) {
                    const activityId = prog.caj_id;
                    map[activityId] = (map[activityId] ?? 0) + 1;
                }
            }
        }

        return map;

    }, [props.userProgressData])

    const masteredCountByCajId = useMemo(() => {
        const map: Record<string, number> = {};

        for (const { masteredCajIds } of Object.values(masteryByUser)) {
            for (const cajId of masteredCajIds) {
                map[cajId] = (map[cajId] ?? 0) + 1;
            }
        }

        return map;
    }, [masteryByUser]);


    const populateRows = () => {
        const rows: JSX.Element[] = [];
        if (props.userProfilesWithAttempts == null || props.orgCoursesActivities == null) { return rows; }

        for (const activity of props.orgCoursesActivities) {
            {/* activity.id here is actually a caj id, since props.orgCoursesActivities is results from the caj table */}
            const totalUsersPerActivity = usersByActivity[activity.id] ?? 0;
            const totalAttemptsPerActivity = attemptsByActivityId[activity.id] ?? 0;  
            const totalCompletionsPerActivity = completedCountByCajId[activity.id] ?? 0;
            const totalMasteredPerActivity = masteredCountByCajId[activity.id] ?? 0;

            rows.push(
                <TableRow key={`caj-${activity.id}`} className="border-border hover:bg-transparent">
                    <TableCell>{activity?.course?.external_title}</TableCell>
                    <TableCell>{activity?.activity?.external_title}</TableCell>
                    <TableCell>{totalUsersPerActivity || 0}</TableCell> 
                    <TableCell>{totalAttemptsPerActivity || 0}</TableCell>
                    <TableCell>{totalCompletionsPerActivity || 0}</TableCell>
                    <TableCell>{totalMasteredPerActivity || 0}</TableCell>
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
                            <TableHead className="text-muted-foreground">
                                <div className="items-center gap-2 flex">
                                    Attempts <Play size={16} />
                                </div>
                            </TableHead>
                            <TableHead className="text-muted-foreground">
                                <div className="items-center gap-2 flex">
                                    Completed <Award size={16} />
                                </div>
                            </TableHead>
                            <TableHead className="text-muted-foreground">
                                <div className="items-center gap-2 flex">
                                    Mastered <Trophy size={16} />
                                </div>
                            </TableHead>
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