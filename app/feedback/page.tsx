"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";

export default function FeedbackPage(){
    const [feedbackType, setFeedbackType] = useState("");

    const submitFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        const resp = await fetch(`/api/test/feedback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                type: feedbackType,
                email: (document.getElementById("email") as HTMLInputElement)?.value,
                content: (document.getElementById("content") as HTMLTextAreaElement)?.value
            })
        });

        const result = await resp.json();
        console.log(result);

    }


    return (
        <div className="dark grid items-center justify-items-center min-h-screen p-8 pb-20">
            <form onSubmit={submitFeedback}>
                <h1 className="text-2xl font-bold mb-4">We value your feedback!</h1>
                <p className="mb-6 text-center">Please let us know your thoughts and suggestions to help us improve.</p>
                <p className="mb-">First, tell us what kind of feedback you have:</p>
                <br/>
                <Select name="type" onValueChange={v => setFeedbackType(v)} required>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Type of feedback" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Type</SelectLabel>
                            <SelectItem value="general">General Feedback</SelectItem>
                            <SelectItem value="bug">Report a Bug</SelectItem>
                            <SelectItem value="feature">Request a Feature</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <br />
                <p>Enter your email address</p>
                <Input name="email" type="text" placeholder="email@example.com" className="p-2 border rounded mt-4 w-full" />
                <br />
                {feedbackType === "general" && <GeneralSection />}
                {feedbackType === "bug" && <BugSection />}
                {feedbackType === "feature" && <FeatureRequestSection />}
                <br/>
                <Button type="submit" disabled>Submit Feedback</Button>
            </form>

        </div>
    );
}


export function GeneralSection(){
    return(
        <>
            <p>Please provide your feedback below:</p>
            <br/>
            <textarea name="content" className="mb-4 w-full p-2 border rounded" rows={5} placeholder="Your feedback..."></textarea>
        </>
    )
}

export function BugSection(){
    return(
        <>
            <p>Where did you encounter the issue?</p>
            <br/>
            <Select name="page" required>
                <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Select a page" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Pages</SelectLabel>
                        <SelectItem value="modules">On the Modules page</SelectItem>
                        <SelectItem value="my-learning">On the My Learning page</SelectItem>
                        <SelectItem value="settings">On the Settings page</SelectItem>
                        <SelectItem value="in-module">Within a Module</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
}

export function FeatureRequestSection(){
    return(
        <>
            <p>What type of feature would you like to see?</p>
            <br/>
            <textarea name="content" className="mb-4 w-full p-2 border rounded" rows={5} placeholder="Your feedback..."></textarea>
        </>
    )
}
