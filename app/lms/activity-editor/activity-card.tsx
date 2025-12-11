"use client"
import { useContext } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Wrench,
    BadgeCheck,
    X,
    BookOpen,
    Clock,
    Edit3,
} from "lucide-react"
import { Button } from "@/components/ui/button";

import { EditingActivityContext } from "./activity-editor-simple-component";

export function StatusIcon({ activity }: { activity: Activity }) {
    switch (activity.status?.toString()) {
        case "Production":
            return <BadgeCheck className="h-4 w-4" />;
        case "Testing":
            return <Wrench className="h-4 w-4" />;
        case "ComingSoon":
            return <Clock className="h-4 w-4" />;
        case "None":
            return <X className="h-4 w-4" />;
        default:
            return null;
    }
}

export function ActivityCard({ activity }: { activity: Activity }){
    // establish the context
    const context = useContext(EditingActivityContext);
    if (!context) { return null; }
    const { editingActivity, setEditingActivity } = context;

    const isSelected = editingActivity?.id === activity.id;
    const cardClassName = isSelected
        ? "border-3 border-blue-600"
        : "shadow-md border-2 border-gray-400 hover:border-blue-500";

    return(
        <Card
        key={activity.id}
        className={cardClassName}
        >
        <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
            <CardTitle className="text-lg text-balance leading-tight">{activity.external_title}</CardTitle>
            </div>
            <CardDescription>{activity.about_text}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{activity.time_est}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{activity?.params?.stage_ids != null ? activity.params.stage_ids.length : 0} stages</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <StatusIcon activity={activity} />
                        <span>{activity.status}</span>
                    </div>
                </div>
                <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1 h-8 hover:bg-[#DEDEDE]"
                    onClick={(e) => {
                        e.stopPropagation();
                        setEditingActivity(activity);
                    }}
                >
                    <Edit3 className="h-3 w-3" />
                    Edit
                </Button>
            </div>
        </CardContent>
        </Card>
    )
}