"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Trash2,
  FileText,
  HelpCircle,
  Settings,
  ChevronUp,
  ChevronDown,
  Edit,
  Save,
  X,
  Search,
  BookOpen,
  Clock,
  Edit3,
} from "lucide-react"

import { fetchActivities } from "../../general/utils"
import { PostgrestError } from "@supabase/supabase-js"


export function ActivityCardList({ activities }: { activities: Activity[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {activities.map((act, idx) => (
        <div key={idx}>
          <ActivityCard activity={act} />
        </div>
      ))}
    </div>
  );
}
export function ActivityCard({ activity }: { activity: Activity }){
    return(
        <Card
        key={activity.id}
        >
        <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
            <CardTitle className="text-lg text-balance leading-tight">{activity.external_title}</CardTitle>
            </div>
            <CardDescription className="text-pretty">{activity.about_text}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{activity.time_est}</span>
                </div>
                <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{activity?.params?.stage_ids != null ? activity.params.stage_ids.length : 0} stages</span>
                </div>
            </div>
            <Button
                size="sm"
                variant="ghost"
                className="gap-1 h-8"
                onClick={(e) => {
                    e.stopPropagation()
                    //handleEditActivity(activity)
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

export default function ActivityEditorSimple() {
  const [activities, setActivities] = useState<PostgrestError | Activity[]>();

  const getActivities = async () => {
    let temp = await fetchActivities();
    setActivities(temp);
  };

  return (
    <div className="space-y-6">
      <Button onClick={getActivities}>Begin</Button>

      {
        Array.isArray(activities) ? (
            <ActivityCardList activities={activities} />
        ) : activities ? (
            <div className="text-red-500">Error: {activities.message}</div>
        ) : null
      }
    </div>
  );
}