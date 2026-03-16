"use client"
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrgDetailsModal } from "../forms/org-details";


export function TrainingProviderTable(props: any) {
    const [open, setOpen] = useState(false);
    
    const contactUsClicked = () => {
        console.log("Contact Us clicked");
        setOpen(true);
    }

    return (
        <div>
            <table className="w-full mb-4">
                <thead>
                    <tr>
                        <th></th>
                        <th className="px-4 text-xl">Core</th>
                        <th className="px-4 text-xl">Accredited</th>
                        <th className="px-4 text-xl">Strategic</th>
                    </tr>
                    <tr>
                        <th className="text-sm text-right font-normal italic">Intended For</th>
                        <th className="px-8 font-normal">FE colleges, ITPs</th>
                        <th className="px-8 font-normal">Funded / Regulated Delivery</th>
                        <th className="px-8 font-normal">Anchor Partners</th>
                    </tr>
                    <tr>
                        <th className="py-2 text-lg text-left">Feature</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="py-2">Learner allowance (up to)</td>
                        <td className="py-2 text-center">250</td>
                        <td className="py-2 text-center">500</td>
                        <td className="py-2 text-center">Unlimited</td>
                    </tr>
                    <tr>
                        <td className="py-2">Tutor / Assessor Accounts</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Curriculum Aligned Modules</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Assessment Tools *</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Reporting</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Awarding Body Alignment</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">External Verifier Access</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Audit-ready Assessment Records</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Co-branded Certificates</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">White Labelling</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">API Integrations *</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>                    
                    <tr>
                        <td className="py-2">Employer Co-delivery Tools *</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Eligible for Trace™ *</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4"></td>
                        <td colSpan={3} className="py-4 text-center">
                            <Button className="w-full" onClick={contactUsClicked}>Contact Us</Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>* Features may be work in progress and/or vary per tier and specification</p>
            
            <OrgDetailsModal open={open} setOpen={setOpen} tiers={["Core", "Accredited", "Strategic"]} />
        </div>
    );
}