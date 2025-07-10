"use client";
import React from "react";

type InfoTextContextMenuProps = {
    visible: boolean;
    x: number;
    y: number;
    nodeId: string;
    onClose: () => void;
};

export default function InfoTextContextMenu({ visible, x, y, nodeId, onClose,}: InfoTextContextMenuProps) {
    if (!visible) return null;

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleEditInfoText(nodeId);
        onClose();
    };
    const handleShowAllClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleShowAllInfoTexts();
        onClose();
    };

    const handleEditInfoText = (nodeId: string) => {
        console.log("Edit info text for", nodeId);
        // Launch modal or editor
    };

    const handleShowAllInfoTexts = () => {
        console.log("Show all info texts");
        // Launch modal or drawer
    };

    return (
        <div
            className="absolute z-50 bg-white shadow-lg rounded p-2"
            style={{ top: y, left: x }}
            onClick={(e) => e.stopPropagation()}
        >
            <div
                className="hover:bg-gray-100 p-1 cursor-pointer"
                onClick={handleEditClick}
            >
                ✏️ Edit Text
            </div>
            <div
                className="hover:bg-gray-100 p-1 cursor-pointer"
                onClick={handleShowAllClick}
            >
                📜 Show All Info Texts
            </div>
        </div>
    );
}
