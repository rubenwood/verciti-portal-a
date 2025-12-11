"use client"
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";


export function ActivityDetailElement( 
    {
        detailName,
        colName,
        value,
        onChange
    } : {
        detailName: string;
        colName:string;
        value: any;
        onChange:(colName:string, value: string) =>void}){
    return( 
        <div className="space-y-2">
            <Label htmlFor={detailName}>{detailName}</Label>
            <Textarea
                className="editable-textarea"
                id={detailName}
                value={value ?? ""}
                onChange={(e) => onChange(colName, e.target.value)}
                placeholder={detailName}
            />
        </div>
    );
}
