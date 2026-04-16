"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {  Dialog,  DialogContent,  DialogHeader,  DialogTitle,  DialogDescription } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, Bell, ChevronDown, ChevronRight, Clock } from "lucide-react";
import { JSX, useEffect, useState } from "react";

function ActivityAttemptsModal(props: any) {
    return (
        <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
            <DialogContent className="w-[80vw] !max-w-[80vw] sm:!max-w-[80vw] max-h-[80vh] overflow-y-auto p-0">
                <div className="inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                    <div className="bottom-0 left-0 right-0 p-6">
                        <DialogHeader>
                        <DialogTitle className="text-3xl font-bold text-foreground">
                            Attempts
                        </DialogTitle>
                        <DialogDescription className="flex items-center gap-3 text-base">
                            {props.userProf?.Email} attempts for {props.activity?.external_title}
                        </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6">
                            {props.activity?.attempts?.map((attempt: any, index: number) => (
                                <div key={`attempt-${attempt.id}`} className="bg-secondary/50 rounded-md p-3 mb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-foreground">Attempt {index + 1} </span>
                                        <span className="text-sm text-muted-foreground">Attempted on {attempt.attempted_at}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
            </DialogContent>
        </Dialog>
    )
}

function ActivitiesSection(props: any) {
    const [isOpen, setIsOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState<any[]>([]);

    const openModalWithAttempts = (activity: any) => {
        console.log("Opening modal with attempts:", activity?.attempts);
        setSelectedActivity(activity);
        setIsModalOpen(true);
    }

  return (
    <>
    {props.userProf.GroupedActivityAttempts != null ?
        <>            
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="text-foreground">{props.userProf.GroupedActivityAttempts.length} modules</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="mt-3 space-y-3 pl-6">
                {props.userProf.GroupedActivityAttempts.map((activity: any) => (
                    <div onClick={() => openModalWithAttempts(activity)} key={`activity-${activity?.id}`} className="bg-secondary/50 rounded-md p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-foreground">{activity?.external_title}</span>
                            <span className="text-sm text-muted-foreground font-light">{activity?.attempts?.length || 0} attempts</span>
                        </div>                        
                    </div>
                ))}
                </div>
            </CollapsibleContent>
        </Collapsible> 
        <ActivityAttemptsModal 
            isOpen={isModalOpen}
            setIsOpen={setIsModalOpen}
            userProf={props.userProf}
            activity={selectedActivity}
        />
        </>
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
                {props.userProf.PreviousLogins != null ? 
                    props.userProf.PreviousLogins.map((login: any) => (
                        <div key={`login-${login}`} className="bg-secondary/50 rounded-md p-3">
                            <div className="flex items-center justify-between">
                                <span className="flex text-xs font-light gap-1">
                                    <Clock className="size-3 text-muted-foreground"/>{formatLoginString(login)}
                                </span>
                            </div>
                        </div>
                )) : 
                    null
                }
                </div>
            </CollapsibleContent>
        </Collapsible> 
        </>
    )
}


export function UserProgressTable(props: any) {
    const populateRows = () => {
        const rows: JSX.Element[] = [];
        if (props.userProfilesWithAttempts == null) { return rows; }

        for (const userProf of props.userProfilesWithAttempts) {
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
                        <ActivitiesSection userProf={userProf} />
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