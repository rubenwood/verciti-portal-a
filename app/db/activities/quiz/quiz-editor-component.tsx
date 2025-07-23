'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";



export default function QuizEditor(){
    const [searchTerm, setSearchTerm] = useState('');

    const searchClicked = async () => {
    
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