import { Button } from '@/components/ui/button';
import { showConfetti } from '../../general/utils';
import { useEffect, useRef, useState } from 'react';
import { Pen, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';


export function CreateOrg(){

    const submitBtnRef = useRef<any>(null);

    async function createOrg(formData: FormData) {
        const output = await fetch('/api/db/org/create-org', {
            method: 'POST',
            body: formData
        });

        if(!output.ok){
            console.error("Error creating organization:", await output.text());
        } else {
            showConfetti(submitBtnRef);
        }
    }


    return (
        <form action={async (formData) => { await createOrg(formData); }}>
            <input name="org_name" type="text" placeholder="Organization Name" className="border p-2 mb-4 w-64" />
            <br/>
            <input name="lic_count" type="number" placeholder="Number of Users / licences" className="border p-2 mb-4 w-64" />
            <p>Enter a list email domains (comma separated)</p>
            <input name="suffixes" type="text" placeholder="suffixes" className="border p-2 mb-4 w-64" />
            <p>you may also provide a list of specific email address (comma separated)</p>
            <input name="email_addresses" type="text" placeholder="email addresses" className="border p-2 mb-4 w-64" />
            <br/>
            <p>set what the user can see (includes Free & Premium by default, case sensitive)</p>
            <input name="content_tags" type="text" placeholder="content tags" className="border p-2 mb-4 w-64" />
            <br/>
            <input name="renewal" type="date" placeholder="renewal" className="border p-2 mb-4 w-64" />
            <br/>
            <Button ref={submitBtnRef} className="mt-2" type="submit">Create Organization</Button>
        </form>
    );
}

export function UpdateOrg(){

    const [testOrLive, setTestOrLive] = useState<string>("test");
    const [orgData, setOrgData] = useState<any>(null);
    const [selectedOrg, setSelectedOrg] = useState<any>(null);

    const submitBtnRef = useRef<any>(null);

    async function getOrgs(){
        console.log("get orgs for " + testOrLive);
        const resp = await fetch('/api/db/org/get-orgs', {
            method:'POST',
            body: JSON.stringify({ clientString: testOrLive })
        });

        const respJson = await resp.json();

        console.log(respJson.data);
        setOrgData(respJson.data);
    }

    async function updateOrg(formData: FormData) {
        const output = await fetch('/api/db/org/update-org', {
            method: 'POST',
            body: formData
        });

        if(!output.ok){
            console.error("Error updating organization:", await output.text());
        } else {
            showConfetti(submitBtnRef);
        }
    }

    useEffect(() => {
        if(selectedOrg){ console.log("select org: " + selectedOrg.id); }
    }, [orgData, selectedOrg]);

    
    return (
        <>
        <div className='flex space-x-4'>
            <p>Select DB:</p>
            <select onChange={e => setTestOrLive(e.target.value)} defaultValue="test">
                <option value="test">test</option>
                <option value="live">live</option>
            </select>
            <Button onClick={() => getOrgs()}>Get Orgs</Button>
        </div>
        <Separator className='m-4' />
        <div className='flex space-x-4'>
            {orgData != null ?
                <>
                    <p>Select Org:</p>
                    <select onChange={e => setSelectedOrg(orgData.find((org:any) => org.id == e.target.value))}>
                        {orgData.map((org: any) => 
                            <option key={`org-${org.id}`} value={org.id}>{org.id}</option>
                        )}
                    </select>
                </>
            : null}
        </div>
        <Separator className='m-4' />
        {selectedOrg != null ?
            <form action={async (formData) => { await updateOrg(formData); }}>
                
                <p>Max Licences</p>
                <input 
                    name="licence_count"
                    type="text"
                    defaultValue={selectedOrg.licence_count}
                    className="border p-2 mb-4 w-64" />
                <p>Licences Used</p>
                <input 
                    name="licence_count"
                    type="text"
                    defaultValue={selectedOrg.lic_used}
                    className="border p-2 mb-4 w-64" />
            </form>
        : null }
        </>
    );
}

export function OrgSetupTool(){

    const [formToggle, setFormToggle] = useState<string>('new');

    return (
        <>
        <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4">Organization Setup Tool</h2>
            <p>This tool will help you set up your organization in the database.</p>
            <br/>
            <div className="p-4 space-x-4">
                <Button onClick={()=>setFormToggle('new')}><Plus />Create New</Button>
                <Button onClick={()=>setFormToggle('update')}><Pen />Update Existing</Button>
            </div>
            <Separator className='m-4' />
            {formToggle == 'new' ?
                <CreateOrg /> 
                : <UpdateOrg />
            }

            <br/>
        </div>
        </>
    )

}