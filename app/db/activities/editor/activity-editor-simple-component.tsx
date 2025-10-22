"use client"

import { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react"
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

import { fetchActivities, updateActivity, fetchStagesByIds,showConfetti } from "../../general/utils"
import { PostgrestError } from "@supabase/supabase-js"

/* CONTEXT */
const EditingActivityContext = createContext<{ editingActivity: Activity | null; setEditingActivity: (a: Activity | null) => void;} | null>(null);

export function ActivityBrowser({ activities }: { activities: Activity[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {activities
        .filter((act) => act.params.stage_ids != null)
        .map((act) => (
          <div key={act.id}>
            <ActivityCard activity={act} />
          </div>
        ))}
    </div>
  );
}
export function ActivityCard({ activity }: { activity: Activity }){
    const context = useContext(EditingActivityContext);

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
                    e.stopPropagation();
                    context?.setEditingActivity(activity);
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

export function ActivityDetailElement( 
    {
        detailName,
        colName,
        value,
        onChange
    } : {
        detailName: string;
        colName:string;
        value: any;
        onChange:(colName:string, value: string) =>void}){
    return( 
        <div className="space-y-2">
            <Label htmlFor={detailName}>{detailName}</Label>
            <Input
            id={detailName}
            value={value}
            onChange={(e) => onChange(colName, e.target.value)}
            placeholder={detailName}
            />
        </div>
    );
}

export function ActivityDetailsEditor(){
    // establish the context
    const context = useContext(EditingActivityContext);
    if (!context || !context.editingActivity) { return null; }
    const { editingActivity, setEditingActivity } = context;
    // other state vars
    const [activityDetailsMinimized, setActivityDetailsMinimized] = useState(true);

    const saveBtnRef = useRef<HTMLButtonElement>(null);
    
    const handleActivityUpdate = (colName: string, value: any) => {
        setEditingActivity({
            ...editingActivity,
            [colName]: value,
        });
    }

    const saveChanges = async () => {
        await updateActivity(editingActivity);
        showConfetti(saveBtnRef);
    }
    
    return (
        <Card>
            <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActivityDetailsMinimized(!activityDetailsMinimized)}
                    className="gap-2 p-2"
                >
                    {activityDetailsMinimized ? (
                    <ChevronDown className="h-4 w-4" />
                    ) : (
                    <ChevronUp className="h-4 w-4" />
                    )}
                </Button>
                <div>
                    <CardTitle className="text-lg">Activity Details</CardTitle>
                    <CardDescription>
                    {activityDetailsMinimized
                        ? "Click to expand activity editor"
                        : "Update the basic information for this activity"}
                    </CardDescription>
                </div>
                </div>
            </div>
            </CardHeader>
            {!activityDetailsMinimized && (
            <CardContent className="pt-0 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                <ActivityDetailElement 
                detailName="title"
                colName="external_title"
                value={editingActivity.external_title}
                onChange={handleActivityUpdate} />

                <ActivityDetailElement 
                detailName="estimatedTime"
                colName="time_est"
                value={editingActivity.time_est}
                onChange={handleActivityUpdate} />

                <ActivityDetailElement 
                detailName="estimatedTimeNum"
                colName="time_est_num"
                value={editingActivity.time_est_num}
                onChange={handleActivityUpdate} />
                
                <ActivityDetailElement 
                detailName="about"
                colName="about_text"
                value={editingActivity.about_text}
                onChange={handleActivityUpdate} />

                <ActivityDetailElement 
                detailName="learningObjectives"
                colName="learning_objectives"
                value={editingActivity.learning_objectives}
                onChange={handleActivityUpdate} />
                </div>
                
                <Button ref={saveBtnRef} onClick={saveChanges} className="w-full md:w-auto">Save Activity Changes</Button>
            </CardContent>
            )}
        </Card>
    )
}


export function StageList(){
    // establish the context
    const context = useContext(EditingActivityContext);
    if (!context || !context.editingActivity) { return null; }
    const { editingActivity, setEditingActivity } = context;
    // other state vars
    const [stages, setStages] = useState<Stage[]>([]);

    useEffect(() => {
        console.log("Editing activity changed, load stages...");
        const loadStages = async () => {
            if (editingActivity && editingActivity.params.stage_ids) {
                const tmpStages = await fetchStagesByIds(editingActivity.params.stage_ids);

                if(!Array.isArray(tmpStages)){
                    console.error("Error fetching stages:", tmpStages);
                    return;
                }

                setStages(tmpStages);
                console.log("Fetched stages:", tmpStages);
            }
        };
        loadStages();
    }, [editingActivity]);

    return(
        <div>
            {/* display a list of stage here, each should have an edit button*/}
            {stages.length === 0 ? (
                <div>No stages found for this activity.</div>
            ) : (stages.map((stage) => (
                StageDetails(stage)
            )))}
        </div>
    )
}
export function StageDetails(stage: Stage){
    return(
        <Card key={stage.id} className="mb-4">
            <CardHeader>
                <CardTitle className="text-md">Stage ID: {stage.id}</CardTitle>
                <p>Type: {stage.type}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div>
                        <Label>Assets:</Label>
                        <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(stage.assets, null, 2)}</pre>
                    </div>
                    <div>
                        <Label>Params:</Label>
                        <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(stage.params, null, 2)}</pre>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export function ActivityStagesEditor(){
    // establish the context
    const context = useContext(EditingActivityContext);
    if (!context || !context.editingActivity) { return null; }
    const { editingActivity, setEditingActivity } = context;
    // other state vars
    const [stageDetailsMinimized, setStageDetailsMinimized] = useState(true);

    return (
        <Card>
            <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setStageDetailsMinimized(!stageDetailsMinimized)}
                    className="gap-2 p-2"
                >
                    {stageDetailsMinimized ? (
                    <ChevronDown className="h-4 w-4" />
                    ) : (
                    <ChevronUp className="h-4 w-4" />
                    )}
                </Button>
                <div>
                    <CardTitle className="text-lg">Stage Details</CardTitle>
                    <CardDescription>
                    {stageDetailsMinimized
                        ? "Click to expand stage editor"
                        : "Update the stages for this activity"}
                    </CardDescription>
                </div>
                </div>
            </div>
            </CardHeader>
            {!stageDetailsMinimized && (
                <CardContent className="pt-0 space-y-4">
                {/* 
                TODO:
                    Display list of stages associated with this activity
                    Reordering stages
                    Display stage details (edit stage)
                    Adding/removing stages
                */}
                    <StageList />
                </CardContent>
            )}
        </Card>
    )
}


export default function ActivityEditorSimple() {
  const [activities, setActivities] = useState<PostgrestError | Activity[]>();
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const getActivities = async () => {
    let temp = await fetchActivities();
    setActivities(temp);
  };

  return (
    <div className="space-y-6">
        <Button onClick={getActivities}>Begin</Button>

        <EditingActivityContext.Provider value={{ editingActivity, setEditingActivity }}>
        {/* Activity browser */
            Array.isArray(activities) ? (
                <ActivityBrowser activities={activities} />
            ) : activities ? (
                <div className="text-red-500">Error: {activities.message}</div>
            ) : null
        }
        { /* Activity editor, metadata and stages */
            editingActivity ?
                <>
                    <ActivityDetailsEditor />
                    <ActivityStagesEditor />
                </> : null
        }
      </EditingActivityContext.Provider>
    </div>
  );
}