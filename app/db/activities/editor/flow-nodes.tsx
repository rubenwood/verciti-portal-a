import React from "react";
import { Handle, Position } from "@xyflow/react";

export const ActivityNode = React.memo((props: any) => {
    return (
         <div className="bg-sky-100 border rounded shadow p-2 text-xs max-w-md">
            <Handle type="source" position={Position.Right} />
            <p><strong>External Title:</strong><br/>{props.data.selectedActivity.external_title}</p><br/>
            <p><strong>Params:</strong><br/>{JSON.stringify(props.data.selectedActivity.params)}</p><br/>
        </div>
    );
});


export const StageNode = React.memo((props: any) => {
    return (
         <div className="bg-lime-100 border rounded shadow p-2 text-xs max-w-md">
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <p><strong>Id:</strong>{props.data.stage.id}</p>
            <p><strong>Batch Id:</strong>{props.data.stage.batch_id}</p>
            <p><strong>Type:</strong>{props.data.stage.type}</p>
            <p><strong>Assets:</strong>{JSON.stringify(props.data.stage.assets)}</p>
            <p><strong>Params:</strong>{JSON.stringify(props.data.stage.params)}</p>
        </div>
    );
});

export const InfoTextNode = React.memo((props: any) => {
    return (
         <div className="bg-teal-100 border rounded shadow p-2 text-xs max-w-md">
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <p><strong>Id:</strong>{props.data.info_text.id}</p>
            <p><strong>Batch Id:</strong>{props.data.info_text.batch_id}</p>
            <p><strong>Text (En-UK)</strong>{props.data.info_text.text_en_uk}</p>
            <p><strong>Media (En-UK)</strong>{props.data.info_text.media_en_uk}</p>
        </div>
    );
});