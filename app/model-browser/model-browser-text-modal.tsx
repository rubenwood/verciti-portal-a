'use client'
import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export function MBTextModelButton(props: any) {
    const [annotationModalOpen, setAnnotationModalOpen] = useState<boolean>(false);

    return (
        <>
        <Button onClick={() => setAnnotationModalOpen(!annotationModalOpen)}>
            Add Annotation
        </Button>
        <MBTextModal open={annotationModalOpen} setOpen={setAnnotationModalOpen} />
        </>
    )
}


export function MBTextModal(props: any) {

    const saveAnnotation = () => {
        // Logic to save the annotation goes here
        console.log("Annotation saved");
        props.setOpen(false);
    }

    return (
        props.open ? (
            <Card>
                <CardContent>
                    <CardHeader>
                        <CardTitle>Annotation</CardTitle>
                        <CardDescription>
                            Enter an annotation for this model.
                        </CardDescription>
                    </CardHeader>
                    <textarea className="w-full h-40 border p-2 rounded" placeholder="Enter annotation here..." />
                    <Button className="mt-4" onClick={saveAnnotation}>
                        Save Annotation
                    </Button>
                </CardContent>
            </Card>
        ) : null
    )
}