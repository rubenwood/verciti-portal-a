"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, Bell, ChevronDown, ChevronRight, Clock } from "lucide-react";
import { JSX, useEffect, useState } from "react";

function ActivitiesSection(props: any) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
    {props.userActivityAttempts != null ?
            
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="text-foreground">{props.userActivityAttempts.length} modules</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="mt-3 space-y-3 pl-6">
                {props.userActivityAttempts.map((attempt: any) => (
                    <div key={`prog-${attempt?.activity_id}`} className="bg-secondary/50 rounded-md p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-foreground">{attempt?.external_title}</span>
                        </div>
                        {/* <AttemptsSection attempts={activity.attempts} /> */}
                    </div>
                ))}
                </div>
            </CollapsibleContent>
        </Collapsible> 
    : null}
    </>
  )
}

function LoginsSection(props: any){
    const [isOpen, setIsOpen] = useState(false)

    const formatLoginString = (login: string) => {
        const date = login.split('T')[0];
        const time = login.split('T')[1].split('+')[0];

        return `${date} ${time}`
    }

    return (
        <>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="text-foreground">{props.userProf.TotalLogins} logins</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="mt-3 space-y-3 pl-3">
                {props.userProf?.PreviousLogins.map((login: any) => (
                    <div key={`login-${login}`} className="bg-secondary/50 rounded-md p-3">
                        <div className="flex items-center justify-between">
                            <span className="flex text-xs font-light gap-1">
                                <Clock className="size-3 text-muted-foreground"/>{formatLoginString(login)}
                            </span>
                        </div>
                    </div>
                ))}
                </div>
            </CollapsibleContent>
        </Collapsible> 
        </>
    )
}


export function UserProgressTable(props: any) {
    const findQuizAttemptsByActivityAndUser = (quizData: any[], activityId: string, userId: string) => {
        const quizAttemptsByUserInActivity = quizData.filter(quiz => quiz.activity_id === activityId && quiz.user_id === userId);
        if(quizAttemptsByUserInActivity.length === 0){
            return [];
        }

        return quizAttemptsByUserInActivity;
    }

    const populateRows = () => {
        console.log("PROPS");
        console.log(props);

        const rows: JSX.Element[] = [];
        if (props.userProfilesWithAttempts == null) { return rows; }

        for (const userProf of props.userProfilesWithAttempts) {
            console.log(`UP:`);
            console.log(userProf);
            //const userProf = props.userProfilesWithAttempts.find((element: any) => element.Id == userProg.id)
            rows.push(
                <TableRow key={`userprog-${userProf.Id}`}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/20 text-foreground text-xs font-medium">AV</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-foreground">{userProf.Email}</span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        <LoginsSection userProf={userProf} />
                    </TableCell>
                    <TableCell >
                        <ActivitiesSection userActivityAttempts={userProf.ActivityAttempts} />
                        {/* <QuizScoresDisplay quizAttempts={findQuizAttemptsByActivityAndUser(props.quizData, prog.activity_id, userProg.id)} /> */}
                    </TableCell>
                    <TableCell>
                        <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                            <Bell className="h-4 w-4" />
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
                <CardTitle className="text-foreground">User Activity</CardTitle>
                <CardDescription>Track user logins, activity and detailed attempt data</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground">User</TableHead>
                            <TableHead className="text-muted-foreground">Logins</TableHead>
                            <TableHead className="text-muted-foreground">Activity</TableHead>
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