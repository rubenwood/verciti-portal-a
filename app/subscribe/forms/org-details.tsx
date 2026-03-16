"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";


function TierSelector(props: any) {
  return (
    <Select onValueChange={props.setSelectedFunc}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={`Select Tier`} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tiers</SelectLabel>
          {props.tiers.map((element: string) => (
            <SelectItem key={element} value={element}>
              {element}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

function OrganisationDetails(props: any){
    const [selectedTier, setSelectedTier] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setSuccess(false)

        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())
        data.tier = selectedTier;

        const res = await fetch("/api/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

        if (res.ok) {
            setSuccess(true)
        }

        setLoading(false)
    }
    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Organisation Details</CardTitle>
                <CardDescription>Please provide your organisation's details below.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="email-addr">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="border p-2 rounded"
                            placeholder="example@example.com"
                        />
                        <br/>
                        <label htmlFor="email-addr">What product tier are you most interested in?</label>
                        <TierSelector tiers={props.tiers} setSelectedFunc={setSelectedTier} />
                        <br/>
                        <label htmlFor="org-name">Organisation Name</label>
                        <input
                            name="orgName"
                            type="text"
                            required
                            className="border p-2 rounded"
                        />
                        <br/>
                        <label htmlFor="org-type">Organisation Type</label>
                        <input
                            name="orgType"
                            type="text"
                            required
                            className="border p-2 rounded"
                        />
                    </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Submit"}
                </Button>
                {success && <p className="text-green-500">Details submitted successfully!</p>}
                </form>
            </CardContent>
        </Card>
        </>
    )
}

export function OrgDetailsModal(props: any) {
    return (
        <Dialog open={props.open} onOpenChange={props.setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Contact Us</DialogTitle>
                    <DialogDescription>
                        Tell us about your organisation and we'll be in touch.
                    </DialogDescription>
                </DialogHeader>
                
                <OrganisationDetails tiers={props.tiers} />
            </DialogContent>
        </Dialog>
    )
}