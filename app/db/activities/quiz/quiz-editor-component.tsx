'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchQuizStagesByBatchId } from "../../general/utils";



export default function QuizEditor(){
    const [searchTerm, setSearchTerm] = useState('');

    const searchClicked = async () => {
        const quizStages = await fetchQuizStagesByBatchId(searchTerm);
        if ('message' in quizStages) {
            console.error('Error fetching quiz stages:', quizStages.message);
            return;
        }
        console.log('Quiz stages:', quizStages);
    }

    return (
        <div className="grey-border">
            <b>Quiz editor</b><br />
            <i>Search by activity id, stage id, or batch id</i>
            <br /><br />

            <div>
                <Input
                    type="text"
                    placeholder="Enter search term..."
                    className="mb-2"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={searchClicked} className="green-shadcn-button">
                    Search By Batch Id
                </Button>
            </div>
        </div>
    );
}