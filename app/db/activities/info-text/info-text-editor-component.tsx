'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchStagesWithInfoTexts, updateInfoText } from '../../general/utils';
import { PostgrestError } from '@supabase/supabase-js';

export default function InfoTextEditor() {
    const [searchTerm, setSearchTerm] = useState('');
    const [stagesInfoTextResults, setStageInfoTextResults] = useState<StageWithInfoText[] | null>();
    //const [infoTextResults, setInfoTextResults] = useState<InfoText[] | null>();
    const [error, setError] = useState<PostgrestError | null>(null);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editFields, setEditFields] = useState<{ title: string; body: string }>({
        title: '',
        body: '',
    });

    const searchClicked = async () => {
        const stagesWithInfoText = await fetchStagesWithInfoTexts(searchTerm);
        //const output = await fetchInfoTextByBatchId(searchTerm);

        if ('message' in stagesWithInfoText) {
            setError(stagesWithInfoText);
            setStageInfoTextResults(null);
        } else {
            setStageInfoTextResults(stagesWithInfoText);
            setError(null);
        }

        console.log('Search results:', stagesWithInfoText);
    };

    const startEditing = (row: StageWithInfoText) => {
        if(row == null) { console.error("row is null!"); return; }
        if(row.related_info_text == null) { console.error("related info text is null!"); return; }
        setEditingId(row.stage.id);
        setEditFields({
            title: row.related_info_text.text_en_uk.title,
            body: row.related_info_text.text_en_uk.body,
        });
    };
    const cancelEditing = () => {
        setEditingId(null);
        setEditFields({ title: '', body: '' });
    }

    const saveChanges = async (row: StageWithInfoText) => {
        try {
            if(row == null) { console.error("no row!"); return; }
            if(row.related_info_text == null) { console.error("no related info text"); return; }
            
            await updateInfoText({
                id: row.related_info_text.id,
                text_en_uk: {
                    title: editFields.title,
                    body: editFields.body,
                },
            });

            // Update local state
            setStageInfoTextResults((prev) =>
                prev
                    ? prev.map((item) =>
                        item?.related_info_text?.id === row?.related_info_text?.id && item.related_info_text
                            ? {
                                ...item,
                                related_info_text: {
                                    ...item.related_info_text,
                                    text_en_uk: {
                                        title: editFields.title,
                                        body: editFields.body,
                                    },
                                    id: item.related_info_text.id,
                                    created_at: item.related_info_text.created_at,
                                    media_en_uk: item.related_info_text.media_en_uk,
                                    batch_id: item.related_info_text.batch_id,
                                    sheet_id: item.related_info_text.sheet_id,
                                },
                            }
                            : item
                    )
                    : null
            );

            cancelEditing();
        } catch (err) {
            console.error('Update failed:', err);
        }
    };

    return (
        <div className="grey-border">
            <b>Info text editor</b><br />
            <i>Search by activity id, stage id, info text id, batch id or title/heading</i>
            <br /><br />

            <div>
                <Input
                    type="text"
                    placeholder="Enter search term..."
                    className="mb-2"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={searchClicked} className="green-shadcn-button">
                    Search By Batch Id
                </Button>
            </div>

            {error && (
                <div className="text-red-500 mt-4">Error: {error.message}</div>
            )}

            {stagesInfoTextResults && stagesInfoTextResults.length > 0 && (
                <div className="mt-4 border p-4 rounded shadow">
                    <h2 className="font-bold mb-2">InfoTexts:</h2>
                    <table className="w-full text-sm border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="pr-4 text-left">Stage ID</th>
                                <th className="pr-4 text-left">Info Text ID</th>
                                <th className="pr-4 text-left">Batch ID</th>
                                <th className="pr-4 text-left">Sheet ID</th>
                                <th className="pr-4 text-left">Title</th>
                                <th className="pr-4 text-left">Body</th>
                                <th className="pr-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stagesInfoTextResults.map((row) => (
                                <tr key={row.stage.id} className="align-top divide-y divide-x divide-gray-200">
                                    <td className="pr-4">{row?.stage.id}</td>
                                    <td className="pr-4">{row?.related_info_text?.id}</td>
                                    <td className="pr-4">{row?.stage.batch_id}</td>
                                    <td className="pr-4">{row?.related_info_text?.sheet_id}</td>
                                    <td className="pr-4 w-1/4">
                                        {editingId === row.stage.id ? (
                                            <Input
                                                value={editFields.title}
                                                onChange={(e) =>
                                                    setEditFields({ ...editFields, title: e.target.value })
                                                }
                                            />
                                        ) : (
                                            row?.related_info_text?.text_en_uk.title
                                        )}
                                    </td>
                                    <td className="pr-4 w-1/2">
                                        {editingId === row.stage.id ? (
                                            <textarea
                                                className="w-full border rounded p-1"
                                                rows={3}
                                                value={editFields.body}
                                                onChange={(e) =>
                                                    setEditFields({ ...editFields, body: e.target.value })
                                                }
                                            />
                                        ) : (
                                            <pre className="whitespace-pre-wrap">{row?.related_info_text?.text_en_uk.body}</pre>
                                        )}
                                    </td>
                                    <td className="pr-4 space-x-2">
                                        {editingId === row.stage.id ? (
                                            <>
                                                <Button size="sm" onClick={() => saveChanges(row)}>Save</Button>
                                                <Button size="sm" variant="outline" onClick={cancelEditing}>Cancel</Button>
                                            </>
                                        ) : (
                                            <Button size="sm" variant="outline" onClick={() => startEditing(row)}>Edit</Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}