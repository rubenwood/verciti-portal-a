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

import { showConfetti,
    fetchActivities,
    insertActivity,
    updateActivity,
    fetchStagesByIds,
    updateStage,
    fetchInfoTextById,
    updateInfoTextFull } from "../../general/utils"
import { PostgrestError } from "@supabase/supabase-js"
import { supabaseTest } from "@/lib/supabase";

// CONTEXT
const EditingActivityContext = createContext<{ editingActivity: Activity | null; setEditingActivity: (a: Activity | null) => void;} | null>(null);

export function ActivityBrowser({ activities }: { activities: Activity[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {activities
        .filter((act) => act.params.stage_ids != null) // change this, sometimes we'll want o modify activities without stages
        .map((act) => (
          <div key={act.id}>
            <ActivityCard activity={act} />
          </div>
        ))}
    </div>
  );
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
            </div>
            <Button
                size="sm"
                variant="ghost"
                className="gap-1 h-8"
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
            <Textarea
            className="editable-textarea"
            id={detailName}
            value={value ?? ""}
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
        await updateActivity(supabaseTest, editingActivity);
        showConfetti(saveBtnRef);
    }

    useEffect(() => {}, [editingActivity]);
    
    return (
        <Card className="border-gray-400">
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
                        <CardTitle className="text-lg">Activity Details - {editingActivity.external_title}</CardTitle>
                        <div className="flex gap-1 mb-1">
                            <Badge className="text-xs bg-blue-500">{editingActivity.id}</Badge>
                            <Badge className="text-xs bg-blue-500">{editingActivity.type}</Badge>
                        </div>                    
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

                <ActivityDetailElement 
                detailName="status"
                colName="status"
                value={editingActivity.status}
                onChange={handleActivityUpdate} />

                <ActivityDetailElement 
                detailName="dirName"
                colName="dir_name"
                value={editingActivity.dir_name}
                onChange={handleActivityUpdate} />
                </div>
                
                <Button ref={saveBtnRef} onClick={saveChanges} className="w-full md:w-auto">Save Activity Changes</Button>
            </CardContent>
            )}
        </Card>
    )
}

// STAGE EDITOR COMPONENTS
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
                const tmpStages = await fetchStagesByIds(supabaseTest, editingActivity.params.stage_ids);

                if(!Array.isArray(tmpStages)){
                    console.error("Error fetching stages:", tmpStages);
                    return;
                }

                setStages(tmpStages);
            }
        };
        loadStages();
    }, [editingActivity]);

    return(
        <div>
            {/* display a list of stage here, each should have an edit button*/}
            {stages.length === 0 ? (
                <div>No stages found for this activity.</div>
            ) : (stages.map((s: Stage, index: number) => (
                <StageDetailsEditor stage={s} index={index} key={s.id} />
            )))}
        </div>
    )
}
export function StageDetailsEditor({ stage, index }: {stage: Stage, index: number}){
    const [inStage, setStage] = useState<Stage>(stage);
    const [stageValue, setStageValue] = useState("");

    const [editingContent, setEditingContent] = useState(false);

    const saveBtnRef = useRef<HTMLButtonElement>(null);
    const saveChanges = async () => {
        const updatedStage: Stage = JSON.parse(stageValue);
        setStage(updatedStage);
        await updateStage(supabaseTest, updatedStage);
        showConfetti(saveBtnRef);
    }

    useEffect(() => {
        setStage(stage);
        setStageValue(JSON.stringify(stage, null, 2));
    }, [stage]);

    if (!inStage) return <p>Loading...</p>;

    return(
        <Card key={stage.id} className="mb-4">
            <CardHeader>
                <CardTitle className="text-md">
                    Stage #: {index + 1}<br/>
                    Stage ID: {stage.id}<br/>
                    Type: {stage.type}
                </CardTitle>
            </CardHeader>            
            <CardContent>
                <Button onClick={() => { setEditingContent(!editingContent); }} className="mb-4">
                    {editingContent ? "Hide Stage Editor" : "Edit Stage"}
                </Button>
                {editingContent ? (
                <div className="space-y-2">
                    <div>
                        <Label>Stage Data:</Label>
                        <Textarea 
                        className="editable-textarea" 
                        rows={10}
                        value={stageValue}
                        onChange={(e) => setStageValue(e.target.value)} />
                    </div>
                    <br/>
                    <Button ref={saveBtnRef} onClick={saveChanges} className="w-full md:w-auto">Save Stage Changes</Button>
                    <br />
                    {stage.type === 'info' ? 
                        <InfoTextEditor infoTextId={stage.params.infoTextId} />
                    : null
                    }
                </div>
                ) : null}                   
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
        <Card className="border-gray-400">
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
                    <StageList />
                </CardContent>
            )}
        </Card>
    )
}

// INFO TEXT EDITOR COMPONENTS
export function InfoTextEditor({ infoTextId }: {infoTextId: string}){
    const [infoText, setInfoText] = useState<InfoText | PostgrestError>();
    const [infoTextValue, setInfoTextValue] = useState("");

    const saveBtnRef = useRef<HTMLButtonElement>(null);
    const saveChanges = async () => {
        const updatedInfoText: InfoText = JSON.parse(infoTextValue);
        setInfoText(updatedInfoText);
        await updateInfoTextFull(supabaseTest, updatedInfoText);
        showConfetti(saveBtnRef);
    }

    useEffect(() => {
        // load info text by id
        const loadInfoText = async () => {
            if (infoTextId) {
                const fetchedInfoText = await fetchInfoTextById(supabaseTest, infoTextId);
                if(!fetchedInfoText || 'message' in fetchedInfoText){
                    console.error("Error fetching info text:", fetchedInfoText);
                    return;
                }
                setInfoText(fetchedInfoText);
                setInfoTextValue(JSON.stringify(fetchedInfoText, null, 2));
            }
        }
        loadInfoText();
    }, [infoTextId]);

    if (!infoText || "message" in infoText) return <p>Loading...</p>;

    return(
        <div>
            <b>Info Text Editor</b>
            <Textarea 
                className="editable-textarea" 
                rows={20}
                value={infoTextValue}
                onChange={(e) => setInfoTextValue(e.target.value)}
            />
            <br />
            <Button ref={saveBtnRef} onClick={saveChanges} className="w-full md:w-auto">Save Info Text Changes</Button>
        </div>
    )
}

// MAIN COMPONENT
export default function ActivityEditorSimple() {
    const [activities, setActivities] = useState<PostgrestError | Activity[]>();
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

    const getActivities = async () => {
        let temp = await fetchActivities(supabaseTest);
        setActivities(temp);
    };

    const showActivityCreator = async () => {
        const newAct: Activity = {
            external_title: "New Activity",
            internal_title: "New Activity Internal",
            time_est: "10 mins~",
            time_est_num: "600",
            about_text: "This is a new activity.",
            learning_objectives: "Learn about something new.",
            params: { assets: [], stage_ids: [] },
            type: "lesson",
            qr_url: "",
            icon_url: "",
            title_asset_url: "",
            dir_name: "Dev"
        };
        const tmp = await insertActivity(supabaseTest, newAct);
        console.log("Inserted activity:", tmp);
        await getActivities();
    }

    return (
    <div className="space-y-6">
        <div className="space-x-4">
            <Button className="green-shadcn-button" onClick={getActivities}><Edit />Edit Existing</Button>
            <Button className="green-shadcn-button" onClick={showActivityCreator}><Plus />Create New</Button>
        </div>

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