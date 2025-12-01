'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostgrestError } from '@supabase/supabase-js';
import { fetchActivityById, updateActivity } from '../../general/utils';
import { supabaseTest } from '@/lib/supabase';

import { Card, CardContent } from '@/components/ui/card';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableStageItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card 
        ref={setNodeRef} 
        style={style} 
        className="p-2 mb-2 cursor-grab select-none"
        {...attributes}
        {...listeners}
    >
      <CardContent className="flex items-center">{id}</CardContent>
    </Card>
  );
}

export function ActivityParamsEditor({ activity }: any) {
  const [stageIds, setStageIds] = useState<string[]>(activity?.params?.stage_ids || []);
  const tempActivity = activity;

  useEffect(() => {
    if (activity?.params?.stage_ids) setStageIds(activity.params.stage_ids);
  }, [activity]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stageIds.indexOf(active.id as string);
    const newIndex = stageIds.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    setStageIds((items) => arrayMove(items, oldIndex, newIndex));
  };

  const saveOrder = async () => {
    const updatedActivity = { ...tempActivity, params: { ...tempActivity.params, stage_ids: stageIds } };

    const resp = await updateActivity(supabaseTest, updatedActivity);
    console.log('Update response:', resp);
    if(resp.error == null){
        alert('Activity updated successfully');
    }else{
        console.error('Error updating activity:', resp.error);
    }
  };

  return (
    <div>
      <Button className="green-shadcn-button-fw" onClick={saveOrder}>
        Save Order
      </Button>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={stageIds} strategy={verticalListSortingStrategy}>
          {stageIds.map((id) => (
            <SortableStageItem key={id} id={id} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}


export default function StageOrderer() {
    const [activityId, setActivityId] = useState('');
    const [activity , setActivity] = useState<Activity | null>(null);
    const [stagesResults, setStagesResults] = useState<Stage[] | null>();
    const [error, setError] = useState<PostgrestError | null>(null);

    const getStagesClicked = async () => {
        if(!activityId || activityId.trim() === '') {
            setStagesResults(null);
            return;
        }
        const activityResponse = await fetchActivityById(supabaseTest, activityId);
        setActivity(activityResponse as Activity);
    }

    return (
        <div className="grey-border">
            <b>Stage Orderer</b><br />
            <i>Drag and drop to reorder stages, then click Save Order.</i><br/>
            <Input 
                type="text" 
                placeholder="Enter Activity Id" 
                onChange={(e) => setActivityId(e.target.value)}
            />
            <Button className="green-shadcn-button" onClick={getStagesClicked} >Get Stages</Button>
            <br />
            { activity ? <ActivityParamsEditor activity={activity} /> : null }
            { error ? <p className="error-text">Error: {error.message}</p> : null }
            
        </div>
    );
}