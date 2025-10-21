"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";


export function BSTDropdown(props: {items: any, placeholder: string, setSelectedFunc: any }) {
    return (
        <Select onValueChange={props.setSelectedFunc}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {props.items.map((element: any) => (
                        <SelectItem key={element.id} value={element.id.toString()}>
                            {element.name} 
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export function DataCopyTool() {    
    const [branches, setBranches] = useState([]);
    const [schemas, setSchemas] = useState([]);
    const [tables, setTables] = useState([]);

    const [selectedFromBranch, setSelectedFromBranch] = useState(null);
    const [selectedToBranch, setSelectedToBranch] = useState(null);
    const [selectedFromSchema, setSelectedFromSchema] = useState(null);
    const [selectedToSchema, setSelectedToSchema] = useState(null);
    const [selectedFromTable, setSelectedFromTable] = useState(null);
    const [selectedToTable, setSelectedToTable] = useState(null);

    useEffect(() => {
        async function fetchSchemas() {
            const { data, error } = await supabase.rpc('list_schemas');
            console.log(data);
            if (!error) {
                setSchemas(data
                    .filter((s: any) => !s.schema_name.startsWith('pg_'))
                    .map((s: any, i: any) => ({ id: i, name: s.schema_name }))
                );
            }
        }
        fetchSchemas();
    }, []);

    return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Data Copy Tool</h1>
        <p>This tool will help you copy data between different database tables.</p>
        <br/>
        <b>Branches:</b>
        <div>
            From: <BSTDropdown items={branches} placeholder="Select branch" setSelectedFunc={setSelectedFromBranch}/>
            To: <BSTDropdown items={branches} placeholder="Select branch" setSelectedFunc={setSelectedToBranch}/>
        </div>
        <br/>
        <b>Schemas:</b>
        <div>
            From: <BSTDropdown items={schemas} placeholder="Select schema" setSelectedFunc={setSelectedFromSchema}/>
            To: <BSTDropdown items={schemas} placeholder="Select schema" setSelectedFunc={setSelectedToSchema}/>
        </div>
        <br/>
        <b>Tables:</b>
        <div>
            From: <BSTDropdown items={tables} placeholder="Select table" setSelectedFunc={setSelectedFromTable}/>
            To: <BSTDropdown items={tables} placeholder="Select table" setSelectedFunc={setSelectedToTable}/>
        </div>
        <Button className="green-shadcn-button mt-4">Copy</Button>
    </div>
    );
}