"use client"
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrgDetailsModal } from "../forms/org-details";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function PlatformAccessTable(props: any) {
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
                        <th className="px-4 text-xl">Foundation</th>
                        <th className="px-4 text-xl">Professional</th>
                        <th className="px-4 text-xl">Enterprise</th>
                    </tr>
                    <tr>
                        <th className="text-sm text-right font-normal italic">Intended For</th>
                        <th className="px-8 font-normal">SMEs & Suppliers</th>
                        <th className="px-8 font-normal">Operators & Manufacturers</th>
                        <th className="px-8 font-normal">Large employers & EPCs</th>
                    </tr>
                    <tr>
                        <th className="py-2 text-lg text-left">Feature</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="py-2">Learner allowance (up to)</td>
                        <td className="py-2 text-center">25</td>
                        <td className="py-2 text-center">100</td>
                        <td className="py-2 text-center">Unlimited</td>
                    </tr>
                    <tr>
                        <td className="py-2">Access to free courses</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Access to paid courses</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Core Technical Modules</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Role-based Learning Pathways *</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Manager / Supervisor Dashboards *</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Workforce Structuring (roles & cohorts) *</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Reporting & analytics *</td>
                        <td className="py-2 text-center">Basic</td>
                        <td className="py-2 text-center">Advanced</td>
                        <td className="py-2 text-center">Advanced & Custom</td>
                    </tr>
                    <tr>
                        <td className="py-2">API Access *</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Custom Role Frameworks *</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">SLA & Dedicated Account Manager</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Roadmap Influence</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2">Eligible for Trace™ *</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">❌</td>
                        <td className="py-2 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-2"></td>
                        <td colSpan={3} className="py-4 text-center">
                            <Button className="w-full" onClick={contactUsClicked}>Contact Us</Button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>* Features may be work in progress and/or vary per tier and specification</p>

            <OrgDetailsModal open={open} setOpen={setOpen} tiers={["Foundation", "Professional", "Enterprise"]} />

        </div>
    );
}