"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { createContext, useContext, useState } from "react";

interface CertificateContextType {
    name: string;
    setName: (value: string) => void;
    date: string;
    setDate: (value: string) => void;
    message: string;
    setMessage: (value: string) => void;
}

const CertificateContext = createContext<CertificateContextType | null>(null);
export function CertificateProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  return (
    <CertificateContext.Provider
      value={{ name, setName, date, setDate, message, setMessage }}
    >
      {children}
    </CertificateContext.Provider>
  );
}

export function useCertificate() {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error("useCertificate must be used within CertificateProvider");
  }
  return context;
}

export default function CertificatePage() {

    return (
        <>
            <CertificateProvider>
                <CertificateForm />
                <CertificatePreview />
            </CertificateProvider>
        </>
    )
}

export function CertificateForm(){
    const { name, setName } = useCertificate();
    const { date, setDate } = useCertificate();
    const { message, setMessage } = useCertificate();

    return (
        <>
            <form className="flex flex-col gap-4 w-[400px]">
                <input type="text" placeholder="Recipient's Name" className="border p-2 rounded" />
                <br/>
                <input type="date" placeholder="Date of Issuance" className="border p-2 rounded" />
                <br/>
                <textarea 
                    placeholder="Your custom message" 
                    className="border p-2 rounded"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button type="submit">Generate Certificate</Button>
            </form>
        </>
    );
}

/* Default message:
Awarded in recognition of completing the Green Energy Bootcamp
and actively engaging in studies of Hydrogen, Solar, Energy
Conversion, and Electrical Theory, equipping the learner with
essential knowledge and skills for the clean energy workforce
*/

export function CertificatePreview() {
    const { message, name, date } = useCertificate();

    return (
        <div className="relative w-[717px] h-[1000px]">
            {/* Background Image */}
            <Image
                src="/blank-cert.png"
                alt="Certificate Example"
                fill
                className="object-contain"
            />
            {/* Preamble */}
            <div className="absolute top-[33%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-center w-[80%] text-black">
                <p className="mb-4 text-5xl">CERTIFICATE</p>
                <p className="text-xl">OF ACHIEVEMENT</p>
                <br/>
                <p className="translate-y-5/2 text-sm font-light">
                    This certificate is awarded to
                </p>
            </div>
            {/* Name */}
            <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-center w-[80%] text-black">
                {name}
            </div>

            {/* Lower Section*/}
            <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2">
                <p className="text-black text-sm font-light">
                    {message}
                </p>
                <p className="text-black text-sm font-light mt-4">
                    Issued on: {date}
                </p>
            </div>
        </div>
    )
}