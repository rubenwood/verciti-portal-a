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


async function copyData(fromClient: SupabaseClient, toClient: SupabaseClient, tables: string[]){
    copyDataBetweenTables(fromClient, toClient, tables);
}

export function DownloadTablesTool() {
    const [selectedFromClientString, setSelectedFromClientString] = useState<string>('test');
    const [selectedToClientString, setSelectedToClientString] = useState<string>('live');
    const [selectedFromClient, setSelectedFromClient] = useState<SupabaseClient>(supabaseTest);
    const [selectedToClient, setSelectedToClient] = useState<SupabaseClient>(supabase);
    const [tables, setTables] = useState([]);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);

    function setFromClient(input: string) {
        setSelectedFromClientString(input.toLowerCase());
        if (input == 'test') {
            setSelectedFromClient(supabaseTest);
        } else {
            setSelectedFromClient(supabase);
        }

        fetchTables();
    }

    function setToClient(input: string) {
        setSelectedToClientString(input.toLowerCase());
        if (input == 'test') {
            setSelectedToClient(supabaseTest);
        } else {
            setSelectedToClient(supabase);
        }
    }


    async function fetchTables() {
        const temp = await fetchTablesInSchema(selectedFromClient, 'public');
        setTables(temp);
    }

    return (
        <>
        <h1 className='header'>Download Tables as CSV</h1><br/>
        <div>
            <p>First select either Test or Live database</p>
        </div>
        <br/>
        <label>From:</label>
        <select onChange={(e) => { setFromClient(e.target.value); }} value={selectedFromClientString}>
            <option value="test">Test</option>
            <option value="live">Live</option>
        </select>
        <br/>
        <label>To:</label>
        <select onChange={(e) => { setToClient(e.target.value); }} value={selectedToClientString}>
            <option value="test">Test</option>
            <option value="live">Live</option>
        </select>
        <br/>
        <div>
            <p>Then select the tables you wish to copy</p>
        </div>
        <br/>
        <CreateTableToggleGroup tables={tables} setSelectedFunc={setSelectedTables} />
        <br/>
        <Button 
            onClick={()=> { copyData(selectedFromClient, selectedToClient, selectedTables) } } 
            className='green-shadcn-button mb-4'>
            Copy data
        </Button>
        <Button 
            className='green-shadcn-button' 
            onClick={async () => {await downloadTables(selectedFromClient, selectedTables, `${selectedFromClientString}-${new Date(Date.now()).toISOString()}`)} }>
            Download CSV
        </Button>
        </>
    )
}