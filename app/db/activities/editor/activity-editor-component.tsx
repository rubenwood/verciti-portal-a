"use client"
import { fetchStages, fetchActivities, updateActivity } from "../../general/utils";
import { 
    ReactFlow,
    Background,
    Controls,
    applyNodeChanges,
    applyEdgeChanges,
    Handle,
    Position,
    addEdge,
    Node,
    Edge,
    Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEffect, useState, useCallback } from "react";
import React from "react";

import ActivitySelectTable from "./activity-select-table-component"

import { Button } from "@/components/ui/button";

const ActivityNode = React.memo((props: any) => {
    return (
         <div className="bg-sky-100 border rounded shadow p-2 text-xs max-w-md">
            <Handle type="source" position={Position.Right} />
            <p><strong>External Title:</strong><br/>{props.data.selectedActivity.external_title}</p><br/>
            <p><strong>Params:</strong><br/>{JSON.stringify(props.data.selectedActivity.params)}</p><br/>
        </div>
    );
});

const StageNode = React.memo((props: any) => {
    return (
         <div className="bg-lime-100 border rounded shadow p-2 text-xs max-w-md">
            <Handle type="target" position={Position.Left} />
            <p><strong>Id:</strong>{props.data.stage.id}</p>
            <p><strong>Type:</strong>{props.data.stage.type}</p>
            <p><strong>Assets:</strong>{JSON.stringify(props.data.stage.assets)}</p>
            <p><strong>Params:</strong>{JSON.stringify(props.data.stage.params)}</p>
        </div>
    );
});

export default function ActivityEditor(){
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([])
    const [allActivities, setActivities] = useState<Activity[]>([]);
    const [allStages, setStages] = useState<Stage[]>([]);

    const [selectedActivity, setSelectedActivity] = useState<Activity>();
    const selectActivity = (activity: Activity) => {
        setSelectedActivity(activity)
    }

    const nodeTypes = { stageNode: StageNode, activityNode: ActivityNode }; 

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback((cbConnection: Connection) => {
        if(selectedActivity == undefined) { return; }

        selectedActivity.params.stage_ids.push(cbConnection.target.replace('stage-',''));

        // need to pass a new object to force re-render
        setSelectedActivity({ ...selectedActivity }); 
        setEdges((eds: Edge[]) => addEdge(cbConnection, eds));

    }, [selectedActivity]);

    const onEdgeContextMenu = useCallback((event: any, edge: any) => {
        event.preventDefault();
        if(selectedActivity == undefined){ return; }

        const stageIdToRemove = edge.target.replace('stage-', '');
        selectedActivity.params.stage_ids = selectedActivity.params.stage_ids.filter(
            (id: any) => id !== stageIdToRemove
        );

        // need to pass a new object to force re-render
        setSelectedActivity({ ...selectedActivity }); 
        setEdges((eds) => eds.filter((e: any) => e.id !== edge.id));

    }, [selectedActivity]);

    const createNodesForSelectedActivity = () => {
        if(selectedActivity == undefined){ return; }

        let tempNodes: any = [];
        let xPos = 0;

        // create a node for this activity
        let tempActivityNode = {
            id: `activity-${selectedActivity.id}`,
            type: 'activityNode',
            position: { x: xPos, y: 100 },
            data: { selectedActivity }
        }
        
        tempNodes.push(tempActivityNode);
        
        xPos = 500;
        let yPos = 0;
        // create nodes for all the stages on Supabase
        for(const stage of allStages){
            let tempStageNode = {
                id: `stage-${stage.id}`,
                type: 'stageNode',
                position: { x: xPos, y: yPos },
                data: { stage }
            }
            tempNodes.push(tempStageNode);
            yPos += 100;
        }        
        
        setNodes(tempNodes);
    }

    // creates edges that connect stages to an activity
    const connectStagesActivity = () => {
        if(selectedActivity == undefined){ return; }

        let activityStageIds = selectedActivity?.params?.stage_ids;
        if(activityStageIds == undefined || activityStageIds.length == 0){ return; }
        let tempEdges = [];

        for(const stageId of activityStageIds){
            let newEdge = {
                id:`${selectedActivity.id}_${stageId}`,
                source:`activity-${selectedActivity.id}`,
                target:`stage-${stageId}`
            }
            tempEdges.push(newEdge);
        }

        setEdges(tempEdges);
    }

    const saveChanges = () =>{
        if(selectedActivity == undefined){ return; }
        // save the modified params back to supabase
        updateActivity(selectedActivity);
    }

    const init = async () => {
        const tempActivities = await fetchActivities();
        setActivities(tempActivities as Activity[]);

        const tempStages = await fetchStages();
        setStages(tempStages as Stage[]);
    }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        createNodesForSelectedActivity();
    }, [selectedActivity]);

    useEffect(() => {
    }, [nodes]);

    useEffect(() => {
        if (selectedActivity && nodes.length > 0) {
            connectStagesActivity();
        }
    }, [nodes, selectedActivity]);

    return (
        <>
        <ActivitySelectTable setSelectedFunc={selectActivity} />
        <br/>
        <div className="w-[180vh] h-[80vh] bg-gray-100 relative">
            <div className="p-5">
                <Button className="green-shadcn-button" onClick={saveChanges}>Save</Button>
            </div>
            <ReactFlow 
                nodes={nodes}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeContextMenu={onEdgeContextMenu}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            >                
                <Background />
                <Controls />
            </ReactFlow>
        </div>
        </>
    );
}
