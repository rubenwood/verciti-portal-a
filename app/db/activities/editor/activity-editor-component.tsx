"use client"
import { useEffect, useState, useCallback, useRef } from "react";
import React from "react";
import { fetchStages, fetchInfoText, fetchAllInfoText, insertStages } from "../../general/utils";
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
import ActivitySelectTable from "./activity-select-table-component";
import StageContextMenu from "./stage-context-menu-component";
import InfoTextContextMenu from "./info-context-menu-component";
import EditorSaveButton from "./editor-save-btn-component";
import { Button } from "@/components/ui/button";

export default function ActivityEditor(){
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([])
    const [allStages, setStages] = useState<Stage[]>([]);
    const [showOnlyConnected, setShowOnlyConnected] = useState(true);
    const [stageContextMenu, setStageContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        node: Node | null;
    } | null>(null);
    const [infoContextMenu, setInfoContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        nodeId: string;
    } | null>(null);    

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
                showStageContextMenu(event, node);
                break;
            case 'infoTextNode':
                showInfoTextMenu(event, node);
                console.log("INFO NODE");                
                break;
            default:
                console.warn("Unknown node type:", node.type);
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
        const updatedStageIds = selectedActivity.params.stage_ids.filter(
            (id: any) => id !== stageIdToRemove
        );

        const updatedActivity: Activity = {
            ...selectedActivity,
            params: {
                ...selectedActivity.params,
                stage_ids: updatedStageIds
            }
        };

        setSelectedActivity(updatedActivity);

    }, [selectedActivity]);

    const createNodesForSelectedActivity = async () => {
        if (!selectedActivity) return;

        const connectedStageIds = selectedActivity.params?.stage_ids ?? [];
        const tempNodes: Node[] = [];
        let xPos = 0;

        // Activity node
        const activityNode = {
            id: `activity-${selectedActivity.id}`,
            type: 'activityNode',
            position: { x: xPos, y: 100 },
            data: { selectedActivity },
        };
        tempNodes.push(activityNode);

        xPos = 500;
        let yPos = 0;

        for (const stage of allStages) {
            const isConnected = connectedStageIds.includes(stage.id);
            if (showOnlyConnected && !isConnected) continue;

            const stageNode = {
                id: `stage-${stage.id}`,
                type: 'stageNode',
                position: { x: xPos, y: yPos },
                data: { stage },
            };

            tempNodes.push(stageNode);
            yPos += 100;

            await createInfoTextNode(stageNode);
        }

        setNodes(tempNodes);
    };
    const createNewStageFromContext = async () => {
        if (!selectedActivity) return;
        
        const inserted = await insertStages([{
            stageType: "",
            stageAssets: {},
            stageParams: {}, 
            stageBatchId: ""
        }]);
        console.log("Inserted stage:", inserted);

        const newStage: Stage = {
            id: inserted[0].id,
            type: inserted[0].type,
            assets: inserted[0].assets,
            params: inserted[0].params,
            batch_id: inserted[0].batch_id,
            created_at: inserted[0].created_at
        };

        // Add to allStages
        const updatedStages = [...allStages, newStage];
        setStages(updatedStages);

        // Add to selectedActivity's stage_ids
        const updatedStageIds = [...(selectedActivity.params.stage_ids ?? []), newStage.id];
        const updatedActivity: Activity = {
            ...selectedActivity,
            params: {
                ...selectedActivity.params,
                stage_ids: updatedStageIds
            }
        };
        setSelectedActivity(updatedActivity);
    };
    const createInfoTextNode = async (stageNode: any) => {
        let stageParams = stageNode.data.stage.params;

        if (!stageParams.infoTextId) {
            console.warn(`No infoTextId on stage ${stageNode.id}`);
            return;
        }
        
        if (nodes.some(n => n.id === `info-${stageParams.infoTextId}`)) {
            console.log(`Info node info-${stageParams.infoTextId} already exists.`);
            return;
        }
        
        const infoTextData: InfoText = await fetchInfoText(stageParams.infoTextId);

        let info_text = {
            id: infoTextData.id,
            text_en_uk: JSON.stringify(infoTextData.text_en_uk),
            media_en_uk: JSON.stringify(infoTextData.media_en_uk),
            batch_id: infoTextData.batch_id
        };
        let tempInfoNode = {
            id: `info-${infoTextData.id}`,
            type: 'infoTextNode',
            position: {x:stageNode.position.x+300, y:stageNode.position.y},
            data: { info_text },
            targetPosition:'left',
            sourcePosition:'right'
        }

        let newEdge = {
            id:`${stageNode.data.stage.id}_${stageParams.infoTextId}`,
            source:`stage-${stageNode.data.stage.id}`,
            target:`info-${stageParams.infoTextId}`
        }

        setNodes((prev) => [...prev, tempInfoNode]);
        setEdges((prev) => [...prev, newEdge]);        
    }

    // CONTEXT MENU
    const showStageContextMenu = async (event: React.MouseEvent, node: any) => {
        console.log(node);        
        event.preventDefault();
        setInfoContextMenu(null);
        const pos = getNodeContainerPosition(event);        
        setStageContextMenu({
            visible: true,
            x: pos.x,
            y: pos.y,
            node: node
        });
    }
    const showInfoTextMenu = async (event: React.MouseEvent, node: any) => {
        event.preventDefault();
        setStageContextMenu(null);
        const pos = getNodeContainerPosition(event);
        setInfoContextMenu({
            visible: true,
            x: pos.x,
            y: pos.y,
            nodeId: node.id
        });        
    }
    const getNodeContainerPosition = (event: React.MouseEvent) => {
        const container = event.currentTarget.closest(".react-flow");
        if (!container) return { x: 0, y: 0 };
        const containerRect = container.getBoundingClientRect();
        return {
            x: event.clientX - containerRect.left,
            y: event.clientY - containerRect.top
        };
    }
    const preventDefaultOnFlowDiv = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.react-flow__node')) return;
        e.preventDefault();
        setStageContextMenu(null);
        setInfoContextMenu(null);
    }


    const buildEdges = () => {
        if (!selectedActivity) return;

        const stageEdges: Edge[] = [];
        const infoTextEdges: Edge[] = [];

        // Build edges from activity to stages
        const activityStageIds = selectedActivity.params?.stage_ids ?? [];
        for (const stageId of activityStageIds) {
            stageEdges.push({
                id: `edge-activity-${selectedActivity.id}-stage-${stageId}`,
                source: `activity-${selectedActivity.id}`,
                target: `stage-${stageId}`,
            });
        }

        // Build edges from stages to their associated info texts
        for (const stage of allStages) {
            const infoId = stage.params?.infoTextId;
            if (infoId) {
                infoTextEdges.push({
                    id: `edge-stage-${stage.id}-info-${infoId}`,
                    source: `stage-${stage.id}`,
                    target: `info-${infoId}`,
                });
            }
        }

        // Combine both sets
        setEdges([...stageEdges, ...infoTextEdges]);
    };

    const filterToConnectedOnly = () => {
        setShowOnlyConnected(true);
    };

    const showAllNodes = () => {
        setShowOnlyConnected(false);
    };

    const init = async () => {
        const tempStages = await fetchStages();
        setStages(tempStages as Stage[]);
    }
    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        createNodesForSelectedActivity();
    }, [selectedActivity, showOnlyConnected]);

    useEffect(() => {
        if (selectedActivity && nodes.length > 0) {
            buildEdges();
        }
    }, [nodes, selectedActivity, allStages]);

    return (
        <>
        <ActivitySelectTable setSelectedFunc={selectActivity} />
        <br/>
        <div className="mb-2">
            <Button
                variant="outline"
                className="mr-2"
                onClick={() => filterToConnectedOnly()}
            >
                Show Only Connected Nodes
            </Button>
            <Button
                variant="outline"
                onClick={() => showAllNodes()}
            >
                Show All Nodes
            </Button>
        </div>
        <div className="w-[180vh] h-[80vh] bg-gray-100 relative" onContextMenu={(e) => preventDefaultOnFlowDiv(e)}>
            <EditorSaveButton selectedActivity={selectedActivity} />
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

            <StageContextMenu 
                visible={stageContextMenu?.visible ?? false}                
                x={stageContextMenu?.x ?? 0}
                y={stageContextMenu?.y ?? 0}
                createStageFunc={createNewStageFromContext}
                showConnectedFunc={createInfoTextNode}
                node={stageContextMenu?.node ?? null}
                onClose={() => setStageContextMenu(null)}
            />
            <InfoTextContextMenu
                visible={infoContextMenu?.visible ?? false}
                x={infoContextMenu?.x ?? 0}
                y={infoContextMenu?.y ?? 0}
                nodeId={infoContextMenu?.nodeId ?? ""}
                onClose={() => setInfoContextMenu(null)}
            />
        </div>
        </>
    );
}
