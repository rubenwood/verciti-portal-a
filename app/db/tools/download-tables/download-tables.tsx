"use client"
import { useRef, useState } from 'react'
import { supabase, supabaseTest } from '@/lib/supabase';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import { fetchTablesInSchema, fetchTablesAsCSV, copyDataBetweenTables, showConfetti } from '../../general/utils';
import { Button } from '@/components/ui/button';
import { SupabaseClient } from '@supabase/supabase-js';

export function TableToggleGroup(props: any){
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
        link.download = `${table}-${suffix}-${new Date(Date.now()).toISOString()}.csv`;
        link.click();

        URL.revokeObjectURL(url);
    }
}

async function copyData(fromClient: SupabaseClient, toClient: SupabaseClient, tables: string[]){
    await copyDataBetweenTables(fromClient, toClient, tables);;
}

export function ClientSelect(props: any) {
    return (        
        <select onChange={(e) => { props.setClient(e.target.value); }} value={props.inValue}>
            {props.branches.map((branch: any) => (
                <option key={branch.name} value={branch.name}>{branch.name}</option>
            ))}
        </select>        
    )
}

export function CopyTablesTool() {
    const [branches, setBranches] = useState([]);
    const [selectedFromClientString, setSelectedFromClientString] = useState<string>('test');
    const [selectedToClientString, setSelectedToClientString] = useState<string>('live');
    const [selectedFromClient, setSelectedFromClient] = useState<SupabaseClient>(supabaseTest);
    const [selectedToClient, setSelectedToClient] = useState<SupabaseClient>(supabase);
    const [tables, setTables] = useState([]);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);

    const copyBtn = useRef<HTMLButtonElement | null>(null);

    async function mapClients() {
        const clients = [supabase, supabaseTest];
        const mapping = await fetch(`/api/db/map-branches-clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clients })
        });
        const mappingData = await mapping.json();
        console.log('Mapping data:', mappingData);
    }

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

    async function fetchBranches() {
        const branches = await fetch(`/api/db/get-branches`);
        const branchData = await branches.json();
        setBranches(branchData);
        console.log(branchData);
        console.log(supabase);
        console.log(supabaseTest);
        mapClients();
    }

    async function fetchTables() {
        const temp = await fetchTablesInSchema(selectedFromClient, 'public');
        setTables(temp);
    }

    return (
        <>
        <h1 className='header'>Copy data between tables</h1><br/>
        <Button className='green-shadcn-button' onClick={fetchBranches}>Click here to begin</Button>
        <br/>
        {branches.length <= 0 ? null : (
            <>
            <p>First select the databases to copy between</p>
            <label className='bold-label'>From:</label>
            <ClientSelect branches={branches} inValue={selectedFromClientString} setClient={setFromClient} />
            <br/>
            <label className='bold-label'>To:</label>
            <ClientSelect branches={branches} inValue={selectedToClientString} setClient={setToClient} />
            <br/>
            <div>
                <p>Then select the tables you wish to copy</p>
            </div>
            <br/>
            <TableToggleGroup tables={tables} setSelectedFunc={setSelectedTables} />
            <br/>
            <Button 
                ref={copyBtn}
                onClick={async () => { 
                        console.log('Copying from', selectedFromClientString, 'to', selectedToClientString);
                        await copyData(selectedFromClient, selectedToClient, selectedTables) 
                        showConfetti(copyBtn);
                    } 
                } 
                className='green-shadcn-button mb-4'>
                Copy data
            </Button>
            <Button 
                className='green-shadcn-button' 
                onClick={async () => {await downloadTables(selectedFromClient, selectedTables, `${selectedFromClientString}`)} }>
                Download CSV
            </Button>
            </>
        )}
        </>
    )
}