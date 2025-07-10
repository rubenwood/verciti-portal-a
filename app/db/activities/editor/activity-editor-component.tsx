"use client"
import { useEffect, useState, useCallback, useRef } from "react";
import React from "react";
import { 
    fetchStages, 
    updateActivity, 
    fetchInfoText,
    fetchAllInfoText, 
    showConfetti } from "../../general/utils";

import { 
    ReactFlow,
    Background,
    Controls,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Node,
    Edge,
    Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ActivityNode, StageNode, InfoTextNode } from "./flow-nodes";
import ActivitySelectTable from "./activity-select-table-component"
import InfoTextContextMenu from "./info-context-menu-component";

import { Button } from "@/components/ui/button";

export default function ActivityEditor(){
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([])
    const [allStages, setStages] = useState<Stage[]>([]);

    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        nodeId: string;
    } | null>(null);

    const saveButtonRef = useRef<HTMLButtonElement | null>(null);

    const [selectedActivity, setSelectedActivity] = useState<Activity>();
    const selectActivity = (activity: Activity) => {
        setSelectedActivity(activity);
    }

    const nodeTypes = { activityNode: ActivityNode, stageNode: StageNode, infoTextNode: InfoTextNode }; 

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );
    const onNodeContextMenu = useCallback((event: any, node: any) => {
        event.preventDefault();
        switch(node.type){
            case 'activityNode':
                console.log("ACTIVITY NODE");
                break;
            case 'stageNode':
                console.log("STAGE NODE");
                createInfoTextNode(node);
                break;
            case 'infoTextNode':
                showInfoTextMenu(event, node);
                console.log("INFO NODE");
                
                break;
        }
    }, [nodes, edges]);

    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback((cbConnection: Connection) => {
        if(selectedActivity == undefined) { return; }
        
        // activity - stage connection
        if(cbConnection.source.startsWith('activity-') && cbConnection.target.startsWith('stage-')){
            selectedActivity.params.stage_ids.push(cbConnection.target.replace('stage-',''));
        }
        // stage - info connection
        if(cbConnection.source.startsWith('stage-') && cbConnection.target.startsWith('info-')){
        
        }

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
    const createInfoTextNode = async (node: any) => {
        let stageParams = node.data.stage.params;
        console.log(stageParams);
        
        const infoTextData: InfoText = await fetchInfoText(stageParams.infoTextId);
        console.log(infoTextData);

        let info_text = {
            id: stageParams.infoTextId,
            text_en_uk: JSON.stringify(infoTextData.text_en_uk),
            media_en_uk: JSON.stringify(infoTextData.media_en_uk)
        };
        let tempInfoNode = {
            id: `info-${stageParams.infoTextId}`,
            type: 'infoTextNode',
            position: {x:node.position.x+300, y:node.position.y},
            data: { info_text }
        }

        let newEdge = {
            id:`${node.data.stage.id}_${stageParams.infoTextId}`,
            source:`stage-${node.data.stage.id}`,
            target:`info-${stageParams.infoTextId}`
        }

        setNodes((prev) => [...prev, tempInfoNode]);
        // TODO: edges not updated
        setTimeout(() => {
            setEdges((prev) => [...prev, newEdge]);
        }, 10);
    }
    const showInfoTextMenu = async (event: React.MouseEvent, node: any) => {
        setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            nodeId: node.id
        });
        
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

    const saveChanges = async () => {
        if(selectedActivity == undefined){ return; }
        // save the modified params back to supabase
        const result = await updateActivity(selectedActivity);
        if(result.error){
            console.log(result.error);
        } else {
            showConfetti(saveButtonRef);
        }
    }

    const init = async () => {
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
                <Button ref={saveButtonRef} className="green-shadcn-button" onClick={saveChanges}>Save</Button>
            </div>
            <ReactFlow 
                nodes={nodes}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onNodeContextMenu={onNodeContextMenu}
                edges={edges}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeContextMenu={onEdgeContextMenu}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            >                
                <Background />
                <Controls />
            </ReactFlow>
            <InfoTextContextMenu
                visible={contextMenu?.visible ?? false}
                x={contextMenu?.x ?? 0}
                y={contextMenu?.y ?? 0}
                nodeId={contextMenu?.nodeId ?? ""}
                onClose={() => setContextMenu(null)}
            />
        </div>
        </>
    );
}
