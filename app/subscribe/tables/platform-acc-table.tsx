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
            <h1 className="text-2xl">Employer & Industry Platform Access</h1>
            <br/>
            <h2 className="text-lg">Comprehensive training solutions for organizations</h2>
            <br/>
            <table className="w-full mb-4">
                <thead>
                    <tr>
                        <th></th>
                        <th className="px-4 text-2xl">Foundation</th>
                        <th className="px-4 text-2xl">Professional</th>
                        <th className="px-4 text-2xl">Enterprise</th>
                    </tr>
                    <tr>
                        <th>Intended For</th>
                        <th className="px-8">SMEs & Suppliers</th>
                        <th className="px-8">Operators & Manufacturers</th>
                        <th className="px-8">Large employers & EPCs</th>
                    </tr>
                    <tr>
                        <th className="py-4 text-xl text-left">Feature</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="py-4">Learner allowance (up to)</td>
                        <td className="py-4 text-center">25</td>
                        <td className="py-4 text-center">100</td>
                        <td className="py-4 text-center">Unlimited</td>
                    </tr>
                    <tr>
                        <td className="py-4">Access to free courses</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Access to paid courses</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Core Technical Modules</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Role-based Learning Pathways</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Manager / Supervisor Dashboards</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Workforce Structuring (roles & cohorts)</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Reporting & analytics</td>
                        <td className="py-4 text-center">Basic</td>
                        <td className="py-4 text-center">Advanced</td>
                        <td className="py-4 text-center">Advanced & Custom</td>
                    </tr>
                    <tr>
                        <td className="py-4">API Access</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Custom Role Frameworks</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">SLA & Dedicated Account Manager</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Roadmap Influence</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Eligible for Trace™</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4"></td>
                        <td colSpan={3} className="py-4 text-center">
                            <Button className="w-full" onClick={contactUsClicked}>Contact Us</Button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <OrgDetailsModal open={open} setOpen={setOpen} tiers={["Foundation", "Professional", "Enterprise"]} />

        </div>
    );
}