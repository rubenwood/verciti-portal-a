'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PostgrestError } from '@supabase/supabase-js';
import { fetchActivityById } from '../../general/utils';
import type { DragEndEvent } from '@/components/ui/shadcn-io/list';
import {
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from '@/components/ui/shadcn-io/list';

export function ActivityParamsEditor(props: any) {
    
    useEffect(() => {
        console.log("ActivityParamsEditor props.activity:", props.activity);
    }, [props.activity]);

    if(!props.activity || !props.activity.params || !props.activity.params.stage_ids) {
        return <p>No stages found in activity params.</p>;
    }

    const handleDragEnd = (event: DragEndEvent) => {
    }

    const saveOrder = async () => {
        console.log("Saving new order:", props.activity.params.stage_ids);
    }

    return (
        <div>
            <i>Activity Params Editor</i><br/><br/>
            <ListProvider onDragEnd={handleDragEnd}>
                <ListGroup id='stages-list' key='stages-list' >
                    <ListHeader>
                        <h3>Stages</h3>
                    </ListHeader>
                    <ListItems>
                        {props.activity.params.stage_ids.map((stage: any, index: number) => (
                            <ListItem 
                                id={stage}
                                key={`id-${stage}`}
                                index={index}
                                name={`Stage-${stage}`}
                                parent='stages-list'
                            >
                                ID: {stage}
                            </ListItem>
                        ))}
                    </ListItems>
                </ListGroup>
            </ListProvider>
            <Button className="green-shadcn-button" onClick={saveOrder}>Save Order</Button>
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
            //setError({ message: 'Activity Id is required', details: null, hint: null, code: null });
            setStagesResults(null);
            return;
        }
        const activityResponse = await fetchActivityById(activityId);
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