"use client"

import { formatDuration, formatDate } from "@/app/db/general/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, Bell, ChevronDown, ChevronRight } from "lucide-react";
import { JSX, useEffect, useState } from "react";


function QuizScoresDetailElement(props: any){
    return (
        <span key={props.attempt.id}>
            Score: {(props.attempt.score * 100).toFixed(2)}% <br/>
            Achieved On: {props.attempt.attempted_at || ""}<br/>
            Completed On: {props.attempt.completed_on || ""}<br/>
        </span>
    )
}

function QuizScoresDisplay(props: any){
    const [detailsVisible, setDetailsVisible] = useState(false);

    const populateAllScoresDetails = (quizAttempts: any[]) => {
        const elements: JSX.Element[] = [];
        quizAttempts.map(attempt => {
            elements.push(
                <>
                    <br/>
                    <QuizScoresDetailElement key={attempt.id} attempt={attempt} />
                </>
            );
        });

        return elements;
    }

    useEffect(() => {

    }, [detailsVisible]);

    const showDetails = () => {
        setDetailsVisible(!detailsVisible);
    }

    const getPrimaryScore = (quizAttempts: any[]) => {
        const completedAttempts = quizAttempts.filter(attempt => attempt.completed_on != null && attempt.completed_on !== "");
        const highestMostRecentAttempt = completedAttempts.sort((a, b) => {
            if(b.score === a.score){ // TODO: check this
                return new Date(b.completed_on).getTime() - new Date(a.completed_on).getTime();
            }
            return b.score - a.score;
        })[0];

        if(highestMostRecentAttempt){
            return (
                <span key={highestMostRecentAttempt?.id} className="cursor-pointer underline">
                    {(highestMostRecentAttempt?.score * 100).toFixed(2)}%
                </span>
            )
        }else if(quizAttempts.length > 0){
            return (
                <span key={quizAttempts[0]?.id} className="cursor-pointer underline">
                    {(quizAttempts[0]?.score * 100).toFixed(2)}%
                </span>
            )
        }else{
            return <span className="text-gray-500">N/A</span>;
        }
        
    }

    return (
        <span onClick={showDetails}>
            {getPrimaryScore(props.quizAttempts)}
            {detailsVisible ? 
                populateAllScoresDetails(props.quizAttempts) : <></>}        
        </span>
    )
}



function ActivitiesSection(props: any) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
    {props.userProg.generic_activity_progress != null ?
            
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="font-medium text-foreground">{props.userProg.generic_activity_progress.length} activities</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <div className="mt-3 space-y-3 pl-6">
            {props.userProg.generic_activity_progress.map((prog: any) => (
                <div key={`prog-${prog?.activity_id}`} className="bg-secondary/50 rounded-md p-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{prog?.external_title}</span>
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


export function UserQuizTable(props: any) {
    const findQuizAttemptsByActivityAndUser = (quizData: any[], activityId: string, userId: string) => {
        const quizAttemptsByUserInActivity = quizData.filter(quiz => quiz.activity_id === activityId && quiz.user_id === userId);
        if(quizAttemptsByUserInActivity.length === 0){
            return [];
        }

        return quizAttemptsByUserInActivity;
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
            //console.log(`UQ:`);
            //console.log(userQuizAttempt);
            rows.push(
                <TableRow key={`userquiz-${userQuizAttempt.id}`}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary/20 text-foreground text-xs font-medium">AV</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="font-medium text-foreground">{}</span>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell>
                    </TableCell>
                    <TableCell className="font-extralight">
                        {formatDate(userQuizAttempt?.attempted_at)}
                    </TableCell>
                    <TableCell className="font-extralight">
                        {`${(userQuizAttempt?.score *100).toFixed(0)}%`}
                    </TableCell>
                    <TableCell className="font-extralight">
                        {`${countCorrect(userQuizAttempt.questions_answered)} / ${userQuizAttempt.total_questions}`}
                    </TableCell>
                    <TableCell className="font-extralight">
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
                <CardTitle className="text-foreground">Quiz / Assessment Attempts</CardTitle>
                <CardDescription>Detailed view of assessment attempts with questions and answers</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground">User</TableHead>
                            <TableHead className="text-muted-foreground">Quiz / Assessment</TableHead>
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