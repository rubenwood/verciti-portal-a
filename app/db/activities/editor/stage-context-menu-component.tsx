"use client";
import React from "react";
import { Node } from '@xyflow/react';

type StageContextMenuProps = {
    visible: boolean;
    x: number;
    y: number;
    createStageFunc: any;
    showConnectedFunc: any;
    node: Node | null;
    onClose: () => void;
};

export default function StageContextMenu({ visible, x, y, createStageFunc, showConnectedFunc, node, onClose }:StageContextMenuProps) {
    if (!visible) return null;

    return (
        <div 
            className="absolute bg-white shadow-md border rounded z-50"
            style={{ top: y, left: x }}
            onClick={(e) => e.stopPropagation()}
        >
            <div 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={async () => {
                    showConnectedFunc(node);
                }}
            >
                Show connected node(s)
            </div>
            <div 
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                    createStageFunc();
                }}
            >
                Create new stage
            </div>
        </div>
    );
}