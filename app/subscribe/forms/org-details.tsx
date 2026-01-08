"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";


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

export function OrganisationDetails(props: any){
    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Organisation Details</CardTitle>
                <CardDescription>Please provide your organisation's details below.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="email-addr">Email Address</label>
                        <input type="text" id="email-addr" className="border p-2 rounded" placeholder="example@example.com" />
                        <br/>
                        <label htmlFor="email-addr">What product tier are you most interested in?</label>
                        <TierSelector tiers={props.tiers} />
                        <br/>
                        <label htmlFor="org-name">Organisation Name</label>
                        <input type="text" id="org-name" className="border p-2 rounded" placeholder="Enter organisation name" />
                        <br/>
                        <label htmlFor="org-type">Organisation Type</label>
                        <input type="text" id="org-type" className="border p-2 rounded" placeholder="Enter organisation type" />
                    </div>
                    <Button type="submit" className="mt-4 py-2 px-4">Submit</Button>
                </form>
            </CardContent>
        </Card>
        </>
    )
}