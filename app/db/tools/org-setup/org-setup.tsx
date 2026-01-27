import { Button } from '@/components/ui/button';
import { supabaseTest } from "@/lib/supabase";

export function OrgSetupTool(){

    async function createOrg(formData: FormData) {
        const output = await fetch('/api/db/create-org', {
            method: 'POST',
            body: formData
        });

        console.log("Org setup output:", output);
    }

    return (
        <>
        <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4">Organization Setup Tool</h2>
            <p>This tool will help you set up your organization in the database.</p>
            <br/>
            <form action={async (formData) => { await createOrg(formData); }}>
                <input name="org_name" type="text" placeholder="Organization Name" className="border p-2 mb-4 w-64" />
                <br/>
                <input name="lic_count" type="number" placeholder="Number of Users / licences" className="border p-2 mb-4 w-64" />
                <p>Enter a list email domains (comma separated)</p>
                <input name="suffixes" type="text" placeholder="suffixes" className="border p-2 mb-4 w-64" />
                <p>you may also provide a list of specific email address (comma separated)</p>
                <input name="email_addresses" type="text" placeholder="email addresses" className="border p-2 mb-4 w-64" />
                <br/>
                <input name="content_tags" type="text" placeholder="content tags" className="border p-2 mb-4 w-64" />
                <p> product details (shold be provded on stripe)</p>
                <input name="product" type="text" placeholder="product" className="border p-2 mb-4 w-64" />
                <br/>
                <input name="renewal" type="date" placeholder="renewal" className="border p-2 mb-4 w-64" />
                <br/>
                <Button className="mt-2" type="submit">Create Organization</Button>
            </form>
        </div>
        </>
    )

}