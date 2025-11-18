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

import { fetchTablesInSchema } from '../../general/utils';

export function CreateTableToggleGroup(props: any){
    return (
        <ToggleGroup type="multiple" className="grid grid-cols-3 gap-2">
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

export function DownloadTablesTool() {  
    const [tables, setTables] = useState([]);

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
        <CreateTableToggleGroup tables={tables} />
        </>
    )
}