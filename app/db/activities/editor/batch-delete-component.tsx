'use client'
import { useState } from "react";
import { deleteInfoTextByBatchId, deleteStageByBatchId } from "../../general/utils";
import { Button } from "@/components/ui/button";

export default function BatchDelete(){
    const [batchId, setBatchId] = useState<string>("");

    const handleDelete = async () => {
        if (!batchId) {
            alert("Please enter a Batch ID");
            return;
        }

        try {
            await deleteInfoTextByBatchId(batchId);
            await deleteStageByBatchId(batchId);
            alert("Batch deleted successfully");
        } catch (error) {
            console.error("Error deleting batch:", error);
            alert("Failed to delete batch. Check console for details.");
        }
    }

    return (
        <>
        <div className="grey-border">
            <b>Batch delete</b><br/>
            <i>
                Enter the Batch ID to delete all info texts and stages associated with it.<br/>
                This action cannot be undone.
            </i>
            <input 
                id='batch-id-input' 
                type='text' 
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)} 
                placeholder='Batch ID' className='input input-bordered w-full max-w-xs border rounded px-2 py-1' />
            <Button className='green-shadcn-button' onClick={handleDelete}>Delete</Button>
        </div>
        </>
    )
}