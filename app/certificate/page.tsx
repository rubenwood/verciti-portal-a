import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CertificatePage() {

    return (
        <>
            <CertificateForm />
            <CertificatePreview />
        </>
    )
}

export function CertificateForm(){
    return (
        <>
            <form className="flex flex-col gap-4 w-[400px]">
                <textarea placeholder="Your custom message" className="border p-2 rounded" />
                <Button type="submit">Generate Certificate</Button>
            </form>
        </>
    );
}

export function CertificatePreview() {

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
                Ruben Wood
            </div>

            {/* Lower Section*/}
            <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2">
                <p className="text-black text-sm font-light">
                    Awarded in recognition of completing the Green Energy Bootcamp
                    and actively engaging in studies of Hydrogen, Solar, Energy
                    Conversion, and Electrical Theory, equipping the learner with
                    essential knowledge and skills for the clean energy workforce
                </p>
                <p className="text-black text-sm font-light mt-4">
                    Issued on: 04/03/2026
                </p>
            </div>

        </div>


    )
}