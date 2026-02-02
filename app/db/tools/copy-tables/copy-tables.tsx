"use client"
import { useRef, useState } from 'react'
import { supabaseMain, supabaseTest } from '@/lib/supabase';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import { fetchTablesInSchema, fetchTablesAsCSV, copyDataBetweenTables, showConfetti } from '../../general/utils';
import { Button } from '@/components/ui/button';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseClientWithKey } from '@/types/supabase-ext';

export function TableToggleGroup(props: any){
    return (
        <ToggleGroup 
            type="multiple"
            className="grid grid-cols-3 gap-2"
            onValueChange={props.setSelectedFunc}>
            {
                props.tables
                .filter((table: any) => !table.name.toLowerCase().startsWith('versions_'))
                .map((table: any) => (
                    <ToggleGroupItem
                        key={table.name}
                        value={table.name}
                        className="data-copy-toggle"
                    >
                        {table.name}
                    </ToggleGroupItem>
                ))
            } 
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

// dropdown to select db
export function ClientSelect(props: any) {
    return (        
        <>
        <select onChange={(e) => { props.setClient(e.target.value); }} value={props.inValue}>
            {props.branches.map((branch: any) => (
                <option key={branch.name} value={branch.name}>{branch.name}</option>
            ))}
        </select>
        </>
    )
}

const allClients: SupabaseClientWithKey[] = [
  { key: "live", client: supabaseMain },
  { key: "test", client: supabaseTest },
];

export function CopyTablesTool() {
    const [branches, setBranches] = useState([]);
    const [selectedFromClientString, setSelectedFromClientString] = useState("test");
    const [selectedToClientString, setSelectedToClientString] = useState("live");
    const [selectedFromClient, setSelectedFromClient] =
        useState<SupabaseClient>(supabaseTest);

    const [selectedToClient, setSelectedToClient] =
        useState<SupabaseClient>(supabaseMain);

    const [mappedClients, setMappedClients] = useState<{ branch: string, clientKey: string }[]>([]);

    const [tables, setTables] = useState([]);
    const [selectedTables, setSelectedTables] = useState<string[]>([]);

    const copyBtn = useRef<HTMLButtonElement | null>(null);
    const syncVerBtn = useRef<HTMLButtonElement | null>(null);

    async function mapClients() {
        const minimalClients = allClients.map(c => ({ key: c.key }));

        const res = await fetch(`/api/db/map-branches-clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clients: minimalClients })
        });

        const { mapping } = await res.json();
        setMappedClients(mapping);
    }

    function setFromClient(branchName: string) {
        setSelectedFromClientString(branchName);

        const mapping = mappedClients.find(
            m => m.branch.toLowerCase() === branchName.toLowerCase()
        );
        if (!mapping) return;

        const client = allClients.find(c => c.key === mapping.clientKey);
        if (!client) return;

        setSelectedFromClient(client.client);
        fetchTables(client.client);
    }

    function setToClient(branchName: string) {
        setSelectedToClientString(branchName);

        const mapping = mappedClients.find(
            m => m.branch.toLowerCase() === branchName.toLowerCase()
        );
        if (!mapping) return;

        const client = allClients.find(c => c.key === mapping.clientKey);
        if (!client) return;

        setSelectedToClient(client.client);
    }

    async function fetchBranches() {
        const branches = await fetch(`/api/db/get-branches`);
        const branchData = await branches.json();
        setBranches(branchData);
        await mapClients();
    }

    async function fetchTables(client: SupabaseClient) {
        const temp = await fetchTablesInSchema(client, 'public');
        setTables(temp);
        console.log('Fetched tables:', temp);
    }

    return (
        <>
        <h1 className='header'>Copy data between tables</h1><br/>
        <Button className='green-shadcn-button' onClick={fetchBranches}>Click here to begin</Button>
        <br/>
        {branches.length <= 0 && mappedClients.length <= 0 ? null : (
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
                        await copyDataBetweenTables(selectedFromClient, selectedToClient, selectedTables, true); 
                        showConfetti(copyBtn);
                    } 
                } 
                className='green-shadcn-button mb-4'>
                Copy data
            </Button>
            <br/>
            <Button 
                ref={syncVerBtn}
                onClick={ async () => {
                        console.log('sync versions from', selectedFromClientString, 'to', selectedToClientString);
                        await copyDataBetweenTables(selectedFromClient, selectedToClient, ["versions_android", "versions_ios"], false); 
                        showConfetti(copyBtn);
                    }
                }
                className='green-shadcn-button mb-4'>
                    Sync Version #
            </Button>
            <br/>
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