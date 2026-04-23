"use client"
import { formatDuration, formatDate } from "@/app/db/general/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { JSX, useEffect, useState } from "react";


export function UserQuizTable(props: any) {
    const getProfile = (userId:string) => {
        //console.log(props.userProfilesWithAttempts);
        return props.userProfilesWithAttempts.find((prof: any) => prof.Id == userId);
    }

    const countCorrect = (questionsAnswered: any[]) => {
        let count = 0;
        for(const answer of questionsAnswered){
            if(answer.isCorrect){ count++; }
        }
        return count;
    }

    const populateRows = () => {
        const rows: JSX.Element[] = [];
        if (props.quizData == null) { return rows; }

        for (const userQuizAttempt of props.quizData) {
            const profile = getProfile(userQuizAttempt.user_id);
            rows.push(
                <TableRow key={`userquiz-${userQuizAttempt.id}`}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/20 text-foreground text-xs font-medium">
                                    {profile.Email.split('@')[0].substring(0,2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="text-foreground">{profile?.Email}</span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                        {userQuizAttempt.activity.external_title}
                    </TableCell>
                    <TableCell className="font-light">
                        {formatDate(userQuizAttempt?.attempted_at)}
                    </TableCell>
                    <TableCell className="font-light">
                        {`${(userQuizAttempt?.score *100).toFixed(0)}%`}
                    </TableCell>
                    <TableCell className="font-light">
                        {`${countCorrect(userQuizAttempt.questions_answered)} / ${userQuizAttempt.total_questions}`}
                    </TableCell>
                    <TableCell className="font-light">
                        {formatDuration(userQuizAttempt.duration)}
                    </TableCell>
                    <TableCell>

                    </TableCell>
                </TableRow>
            );
            
        }
        return rows;
    }

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-foreground">Assessment Attempts</CardTitle>
                <CardDescription>Detailed view of assessment attempts with questions and answers</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground">User</TableHead>
                            <TableHead className="text-muted-foreground">Assessment</TableHead>
                            <TableHead className="text-muted-foreground">Date</TableHead>
                            <TableHead className="text-muted-foreground">%</TableHead>
                            <TableHead className="text-muted-foreground">#</TableHead>
                            <TableHead className="text-muted-foreground">Duration</TableHead>
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