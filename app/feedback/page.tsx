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
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function FeedbackPage(){
    const [feedbackType, setFeedbackType] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const submitFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

         try {
            const resp = await fetch(`/api/feedback/live`, {
                method: "POST",
                body: formData
            });

            let result;
            try {
                result = await resp.json();
            } catch {
                throw new Error("Invalid server response");
            }

            if (!resp.ok) {
                throw new Error(result?.error || "Something went wrong");
            }

            setStatus("success");
            setMessage(
                formData.get("feedback-type") === "delete"
                    ? "Account deletion request submitted."
                    : "Feedback submitted successfully!"
            );

            form.reset(); // optional: clear form

        } catch (err: any) {
            setStatus("error");
            setMessage(err.message || "Failed to submit feedback");
        }
    }


    return (
        <div className="dark grid items-center justify-items-center min-h-screen p-8 pb-20">
            <form onSubmit={submitFeedback}>
                <h1 className="text-2xl font-bold mb-4">We value your feedback!</h1>
                <p className="mb-6">Please let us know your thoughts and suggestions to help us improve.</p>
                <p>First, tell us what kind of feedback you have:</p>
                <br/>
                <Select name="feedback-type" onValueChange={v => setFeedbackType(v)} required>
                    <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Type of feedback" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Type</SelectLabel>
                            <SelectItem value="bug">Report a Bug</SelectItem>
                            <SelectItem value="general">General Feedback</SelectItem>
                            <SelectItem value="feature">Request a Feature</SelectItem>
                            <SelectItem value="delete">Delete my account</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                                <Separator className="my-4" />
                <br/>
                <p>Enter your email address (the same as your Verciti app account)</p>
                <Input name="email" type="text" placeholder="email@example.com" className="p-2 border rounded mt-4 w-full" />
                <br/>
                {feedbackType === "delete" ? (
                    <>
                        <br/>
                        <p className="text-red-600 mt-4">
                        Warning: Selecting this option will delete your account and all associated data.                        
                        </p>
                        <p className="text-red-600 mb-4">
                        This action is cannot be undone.
                        </p>
                        <br/>
                    </>
                    ) : (
                    <>                        
                        <br />
                        {feedbackType === "general" && <GeneralSection />}
                        {feedbackType === "bug" && <BugSection />}
                        {feedbackType === "feature" && <FeatureRequestSection />}
                        <br/>
                    </>
                )}

                {status === "loading" && (
                    <p className="text-gray-500 mb-2">Submitting...</p>
                )}

                {status === "success" && (
                    <p className="text-green-600 mb-2">{message}</p>
                )}

                {status === "error" && (
                    <p className="text-red-600 mb-2">{message}</p>
                )}

                <Button type="submit" disabled={status === "loading"}>
                    {status === "loading" ? "Submitting..." : "Submit"}
                </Button>
            </form>
        </div>
    );
}


export function OperatingSystemSelect(){
    const [operatingSystem, setOperatingSystem] = useState("");

    return(
        <>
            <p>Which operating system are you using?</p>
            <br/>
            <Select name="operating-system" onValueChange={v => setOperatingSystem(v)} required>
                <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="Operating System" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Android / iOS</SelectLabel>
                        <SelectItem value="android">Android</SelectItem>
                        <SelectItem value="ios">iOS</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </>
    )
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
    const [page, setPage] = useState("");

    return(
        <>
            <OperatingSystemSelect />
            <br/>
            <p>Where did you encounter the issue?</p>
            <br/>
            <Select onValueChange={v => setPage(v)} name="page" required>
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
            {page === "in-module" && (
                <>
                    <br/>
                    <p>Please specify which module:</p>
                    <br/>
                    <Input name="module-name" type="text" placeholder="Module name" className="p-2 border rounded w-full" />
                </>
            )}
            <br/>
            <p>Please describe the issue you encountered:</p>
            <br/>
            <textarea name="content" className="mb-4 w-full p-2 border rounded" rows={5} placeholder="Describe the issue..."></textarea>
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
