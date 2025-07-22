import React from "react";
import { Handle, Position } from "@xyflow/react";

export const ActivityNode = React.memo((props: any) => {
    return (
         <div className="bg-sky-100 border rounded shadow p-2 text-xs max-w-md">
            <Handle type="source" position={Position.Right} />
            <strong>External Title:</strong><br/>
            <input type="text" value={props.data.selectedActivity.external_title} onChange={() => {}}/>
            <br/>
            <br/>
            <strong>Params:</strong><br/>
            <input type="text" value={JSON.stringify(props.data.selectedActivity.params)} onChange={() => {}}/>
            <br/>
        </div>
    );
});


export const StageNode = React.memo((props: any) => {
    return (
         <div className="bg-lime-100 border rounded shadow p-2 text-xs max-w-md">
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <strong>Id:</strong>
            <input type="text" value={props.data.stage.id} readOnly/>
            <br/>
            <strong>Batch Id:</strong>
            <input type="text" value={props.data.stage.batch_id} readOnly/>
            <br/>
            <strong>Type:</strong>
            <input type="text" value={props.data.stage.type} onChange={()=>{}}/>
            <br/>
            <strong>Assets:</strong>
            <input type="text" value={JSON.stringify(props.data.stage.assets)} onChange={()=>{}}/>
            <br/>
            <strong>Params:</strong>
            <input type="text" value={JSON.stringify(props.data.stage.params)} onChange={()=>{}}/>
            <br/>
        </div>
    );
});

export const InfoTextNode = React.memo((props: any) => {
    return (
         <div className="bg-teal-100 border rounded shadow p-2 text-xs max-w-md">
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
            <strong>Id:</strong>
            <input type="text" value={props.data.info_text.id} readOnly/>
            <br/>
            <strong>Batch Id:</strong>
            <input type="text" value={props.data.info_text.batch_id} readOnly/>
            <br/>
            <strong>Text (En-UK)</strong>
            <input type="text" value={props.data.info_text.text_en_uk} onChange={() => {}}/>
            <br/>
            <strong>Media (En-UK)</strong>
            <input type="text" value={props.data.info_text.media_en_uk} onChange={() => {}}/>
        </div>
    );
});