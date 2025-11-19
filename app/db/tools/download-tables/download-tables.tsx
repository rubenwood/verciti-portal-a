"use client"
import { useState } from 'react'
import { supabase, supabaseTest } from '@/lib/supabase';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import { fetchTablesInSchema, fetchTablesAsCSV, copyDataBetweenTables } from '../../general/utils';
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


async function copyData(fromClient: SupabaseClient, tables: string[], clientString: string){
    let toClient; 
    if(clientString === 'test'){
        toClient = supabase;
    } else{
        toClient = supabaseTest;
    }
    copyDataBetweenTables(fromClient, toClient, tables);
}

export function DownloadTablesTool() {
    const [selectedClientString, setSelectedClientString] = useState<string>('test');
    const [selectedClient, setSelectedClient] = useState<SupabaseClient>(supabaseTest);
    const [tables, setTables] = useState([]);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);

    function setClient(input: string) {
        setSelectedClientString(input.toLowerCase());
        if (input == 'test') {
            setSelectedClient(supabaseTest);
        } else {
            setSelectedClient(supabase);
        }

        fetchTables();
    }

    async function fetchTables() {
        const temp = await fetchTablesInSchema(selectedClient, 'public');
        setTables(temp);
    }

    return (
        <>
        <h1 className='header'>Download Tables as CSV</h1><br/>
        <div>
            <p>First select either Test or Live database</p>
        </div>
        <br/>
        <select onChange={(e) => { setClient(e.target.value); }} value={selectedClientString}>
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
        <Button onClick={async ()=> { copyData(selectedClient, selectedTables, selectedClientString) } } className='green-shadcn-button mb-4'>Copy data </Button>
        <Button 
            className='green-shadcn-button' 
            onClick={async () => {downloadTables(selectedClient, selectedTables, selectedClientString)} }>
            Download CSV
        </Button>
        </>
    )
}