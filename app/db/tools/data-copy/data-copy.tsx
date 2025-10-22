"use client"
import { useEffect, useRef, useState } from 'react'
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
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Shuffle } from 'lucide-react';

import { showConfetti, copyDataBetweenTables } from '../../general/utils';


export function BSTDropdown(props: {items: any, placeholder: string, setSelectedFunc: any }) {
    return (
        <Select onValueChange={props.setSelectedFunc}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={props.placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {props.items.map((element: any) => (
                        <SelectItem key={element.id} value={element.name.toString()}>
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
    const [tablesInFromSchema, setTablesInFromSchema] = useState([]);
    const [tablesInToSchema, setTablesInToSchema] = useState([]);
    const [selectedFromTable, setSelectedFromTable] = useState(null);
    const [selectedToTable, setSelectedToTable] = useState(null);
    const [rowLimit, setRowLimit] = useState(1000);

    const copyBtnRef = useRef<HTMLButtonElement>(null)

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

    async function fetchTables(toOrFrom: string, schema: string, setTableFunc: any) {
        console.log(`Fetching tables for ${toOrFrom} schema: ${schema}`);
        if(!schema) return;

        console.log("schema" + schema);
        const { data, error } = await supabase.rpc('list_tables', { schema_name: schema.toLowerCase() });

        if (error) {
            console.error('Error fetching tables:', error);
            return;
        }

        if (!data) {
            console.log('No tables returned');
            setTableFunc([]);
            return;
        }

        console.log('Tables:', data);
        setTableFunc(data.map((t: any, i: number) => ({ id: i, name: t.table_name })));
    }

    async function copyData() {
        await copyDataBetweenTables(
            rowLimit,
            false,
            selectedFromSchema!,
            selectedToSchema!,
            selectedFromTable!,            
            selectedToTable!,
        );
        showConfetti(copyBtnRef);
    }


    useEffect(() => {
        fetchSchemas();
    }, []);

    useEffect(() => {
        if (!selectedFromSchema) return;
        fetchTables("fromTables", selectedFromSchema, setTablesInFromSchema);
    }, [selectedFromSchema]);

    useEffect(() => {
        if (!selectedToSchema) return;
        fetchTables("toTables", selectedToSchema, setTablesInToSchema);
    }, [selectedToSchema]);

    return (
    <div>
        <h2 className="text-2xl font-bold mb-4">Data Copy Tool</h2>
        <p>This tool will help you copy data between different database tables.</p>
        <Separator className="my-4 bg-[#bcc7d1]" />
        <b>Branches:</b>
        <div className="flex items-center space-x-4">
            From: <BSTDropdown items={branches} placeholder="Select branch" setSelectedFunc={setSelectedFromBranch}/>
            To: <BSTDropdown items={branches} placeholder="Select branch" setSelectedFunc={setSelectedToBranch}/>
        </div>
        <Separator className="my-4 bg-[#bcc7d1]" />
        <b>Schemas:</b>
        <div className="flex items-center space-x-4">
            From: <BSTDropdown items={schemas} placeholder="Select schema" setSelectedFunc={setSelectedFromSchema}/>
            To: <BSTDropdown items={schemas} placeholder="Select schema" setSelectedFunc={setSelectedToSchema}/>
        </div>
        <Separator className="my-4 bg-[#bcc7d1]" />
        <b>Tables:</b>
        <div className="flex items-center space-x-4">
            From: <BSTDropdown items={tablesInFromSchema} placeholder="Select table" setSelectedFunc={setSelectedFromTable}/>
            To: <BSTDropdown items={tablesInToSchema} placeholder="Select table" setSelectedFunc={setSelectedToTable}/>
        </div>
        <Separator className="my-4 bg-[#bcc7d1]" />
        <div className="flex items-center space-x-4">
            <input onChange={(e) => setRowLimit(Number(e.target.value))} type="number" placeholder="Row Limit" className="border border-[#bcc7d1] rounded-md px-2 py-1 w-32" />
            {/* <Toggle 
                id="random-toggle" 
                className="border-1 border-[#bcc7d1] data-[state=on]:bg-[#83d84d]"
            >
                <Shuffle />
                Random 
            </Toggle> */}
        </div>
        <Separator className="mt-4 bg-[#bcc7d1]" />
        <Button ref={copyBtnRef} className="green-shadcn-button mt-4" onClick={copyData}>Copy</Button>
    </div>
    );
}