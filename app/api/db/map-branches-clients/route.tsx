import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    const reqJson = await req.json();
    const clients = reqJson.clients;


    const branchesReq = await fetch(
      `https://api.supabase.com/v1/projects/${process.env.SUPABASE_PROJECT_REF}/branches`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_PAT_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const branches = await branchesReq.json();
    console.log('Branch details response:', branches);

    const mapping = [];
    for(const branch of branches){
        for(const client of clients){
            if(branch.project_ref == client.supabaseUrl.replace('https://','').split('.')[0]){
                mapping.push({ branch: branch.name, client });
            }
        }       
    }
    return NextResponse.json({ mapping });
}
