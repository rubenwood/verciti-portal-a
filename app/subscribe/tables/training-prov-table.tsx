"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TrainingProviderTable() {
    return (
        <div>
            <h1 className="text-2xl">Colleges & Training Providers</h1>
            <br/>
            <table className="w-full mb-4">
                <thead>
                    <tr>
                        <th></th>
                        <th className="px-4 text-xl">Core</th>
                        <th className="px-4 text-xl">Accredited</th>
                        <th className="px-4 text-xl">Strategic</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th className="text-sm">£6,000</th>
                        <th className="text-sm">£18,000</th>
                        <th className="text-sm">£80,000</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th className="text-sm">per year</th>
                        <th className="text-sm">per year</th>
                        <th className="text-sm">per year</th>
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
                        <td className="py-4 text-center">250</td>
                        <td className="py-4 text-center">500</td>
                        <td className="py-4 text-center">Unlimited</td>
                    </tr>
                    <tr>
                        <td className="py-4">Tutor / Assessor Accounts</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Curriculum Aligned Modules</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Assessment Tools</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Reporting</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Awarding Body Alignment</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">External Verifier Access</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Audit-ready Assessment Records</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Co-branded Certificates</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Employer Co-delivery Tools</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">White Labelling</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">API Integrations</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                    <tr>
                        <td className="py-4">Eligible for Trace™</td>
                        <td className="py-4 text-center">❌</td>
                        <td className="py-4 text-center">✔️</td>
                        <td className="py-4 text-center">✔️</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}