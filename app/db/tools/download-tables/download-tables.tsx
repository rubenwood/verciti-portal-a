"use client"
import { useEffect, useState } from 'react';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import { fetchTablesAsCSV } from '../../general/utils';
import { Button } from '@/components/ui/button';
import { SupabaseClient } from '@supabase/supabase-js';

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

async function downloadTables(client: SupabaseClient, tables: string[], suffix: string) {
    const files = await fetchTablesAsCSV(client, tables);

    for (const { table, blob } of files) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `${table}-${suffix}.csv`;
        link.click();

        URL.revokeObjectURL(url);
    }
}


async function copyData(selectedClientString: string, tables: string[]){
    let toClientString = selectedClientString === "test" ? "live" : "test";
    await fetch("/api/db/copy-data", {
        method: "POST",
        body: JSON.stringify({
            from: selectedClientString,
            to: toClientString,
            tables: tables
        })
    });
}


export function DownloadTablesTool() {
    const [selectedFromClientString, setSelectedFromClientString] = useState<string>('test');
    const [selectedToClientString, setSelectedToClientString] = useState<string>('live');
    const [tables, setTables] = useState([]);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);

    async function fetchTables() {
        const res = await fetch("/api/db/get-tables", {
            method: "POST",
            body: JSON.stringify({
                branch: selectedFromClientString,
                schema: "public",
            }),
        });

        const data = await res.json();
        setTables(data);
    }

    useEffect(() => {
        fetchTables();
    }, [selectedFromClientString]);

    return (
        <>
        <h1 className='header'>Download Tables as CSV</h1><br/>
        <div>
            <p>First select either Test or Live database</p>
        </div>
        <br/>
        <label>From:</label>
        <select onChange={(e) => { setSelectedFromClientString(e.target.value); }} value={selectedFromClientString}>
            <option value="test">Test</option>
            <option value="live">Live</option>
        </select>
        <br/>
        <label> To:</label>
        <select onChange={(e) => { setSelectedToClientString(e.target.value); }} value={selectedToClientString}>
            <option value="test">Test</option>
            <option value="live">Live</option>
        </select>
        <br/>
        <div>
            <p>Then select the tables you wish to download</p>
        </div>
        <br/>
        <CreateTableToggleGroup tables={tables} setSelectedFunc={setSelectedTables} />
        <br/>
        <Button 
            onClick={async ()=> { copyData(selectedFromClientString, selectedTables) } } 
            className='green-shadcn-button mb-4'>
            Copy data 
        </Button>
        <br/>
        {/* <Button 
            className='green-shadcn-button' 
            onClick={async () => {downloadTables(selectedClient, selectedTables, selectedClientString)} }>
            Download CSV
        </Button> */}
        </>
    )
}