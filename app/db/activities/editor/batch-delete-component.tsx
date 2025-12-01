import { useState } from "react";
import { deleteByBatchId } from "../../general/utils";
import { Button } from "@/components/ui/button";
import { supabaseTest } from "@/lib/supabase";

export default function BatchDelete(){
    const [infoTextBatchId, setInfoBatchId] = useState<string>("");
    const [quizBatchId, setQuizBatchId] = useState<string>("");

    const handleDelete = async () => {
        if (!infoTextBatchId || !quizBatchId) {
            alert("Please enter a Batch ID for both Info Texts and Quizzes.");
            return;
        }

        try {
            await deleteByBatchId(supabaseTest, infoTextBatchId, 'info_texts');
            await deleteByBatchId(supabaseTest, infoTextBatchId, 'stages');
            await deleteByBatchId(supabaseTest, quizBatchId, 'quiz_questions');
            await deleteByBatchId(supabaseTest, quizBatchId, 'stages');
            alert("Batch deleted successfully");
        } catch (error) {
            console.error("Error deleting batch:", error);
            alert("Failed to delete batch. Check console for details.");
        }
    }

    return (
        <>
        <div className="red-border">
            <b>Batch Delete</b><br/>
            <i>
                Enter the Batch ID to delete all info texts and stages associated with it.<br/>
                This action cannot be undone.
            </i>
            <input 
                id='info-batch-id-input' 
                type='text' 
                value={infoTextBatchId}
                onChange={(e) => setInfoBatchId(e.target.value)} 
                placeholder='Info Batch ID' className='input input-bordered w-full max-w-xs border rounded px-2 py-1' />
            <br/>
            <input 
                id='quiz-batch-id-input' 
                type='text' 
                value={quizBatchId}
                onChange={(e) => setQuizBatchId(e.target.value)} 
                placeholder='Quiz Batch ID' className='input input-bordered w-full max-w-xs border rounded px-2 py-1' />
            <br/>
            <Button className='red-shadcn-button' onClick={handleDelete}>Delete</Button>
        </div>
        </>
    )
}