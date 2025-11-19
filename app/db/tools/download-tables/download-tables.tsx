"use client"
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import { fetchTablesInSchema, fetchTablesAsCSV } from '../../general/utils';
import { Button } from '@/components/ui/button';

export function CreateTableToggleGroup(props: any){
    return (
        <ToggleGroup 
            type="multiple"
            className="grid grid-cols-3 gap-2"
            onValueChange={props.setSelectedFunc}>

            {props.tables.map((table: any) => (
                <ToggleGroupItem
                    key={table.name}
                    value={table.name}
                    className="data-copy-toggle"
                >
                    {table.name}
                </ToggleGroupItem>
            ))} 
        </ToggleGroup>
    )
}

async function downloadAll(tables: string[]) {
    console.log("Downloading tables:", tables);
    const files = await fetchTablesAsCSV(tables);

    for (const { table, blob } of files) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `${table}.csv`;
        link.click();

        URL.revokeObjectURL(url);
    }
}

export function DownloadTablesTool() {  
    const [tables, setTables] = useState([]);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);

    async function fetchTables() {
        const temp = await fetchTablesInSchema('public');
        console.log(temp);
        setTables(temp);
    }

    useEffect(() => {
        fetchTables();
    }, []);

    return (
        <>
        <h1 className='header'>Download Tables as CSV</h1><br/>
        <div>
            <p>Select which tables you wish to download</p>
        </div>
        <br/>
        <CreateTableToggleGroup tables={tables} setSelectedFunc={setSelectedTables} />
        <br/>
        <Button className='green-shadcn-button' onClick={async () => {downloadAll(selectedTables)} }>Download</Button>
        </>
    )
}