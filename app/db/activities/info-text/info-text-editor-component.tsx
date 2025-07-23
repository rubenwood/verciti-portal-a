'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchInfoTextByBatchId, updateInfoText } from '../../general/utils';
import { PostgrestError } from '@supabase/supabase-js';

export default function InfoTextEditor() {
    const [searchTerm, setSearchTerm] = useState('');
    const [infoTextResults, setInfoTextResults] = useState<InfoText[] | null>();
    const [error, setError] = useState<PostgrestError | null>(null);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editFields, setEditFields] = useState<{ title: string; body: string }>({
        title: '',
        body: '',
    });

    const searchClicked = async () => {
        const output = await fetchInfoTextByBatchId(searchTerm);

        if ('message' in output) {
            setError(output);
            setInfoTextResults(null);
        } else {
            setInfoTextResults(output);
            setError(null);
        }

        console.log('Search results:', output);
    };

    const startEditing = (row: InfoText) => {
        setEditingId(row.id);
        setEditFields({
            title: row.text_en_uk.title,
            body: row.text_en_uk.body,
        });
    }
    const cancelEditing = () => {
        setEditingId(null);
        setEditFields({ title: '', body: '' });
    }

    const saveChanges = async (id: string) => {
        try {
            await updateInfoText({
                id,
                text_en_uk: {
                    title: editFields.title,
                    body: editFields.body,
                },
            });

            // update the local state to reflect changes
            setInfoTextResults((prev) =>
                prev?.map((item) =>
                    item.id === id
                        ? {
                              ...item,
                              text_en_uk: {
                                  ...item.text_en_uk,
                                  title: editFields.title,
                                  body: editFields.body,
                              },
                          }
                        : item
                ) ?? null
            );

            setEditingId(null);
            setEditFields({ title: '', body: '' });
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

            {infoTextResults && infoTextResults.length > 0 && (
                <div className="mt-4 border p-4 rounded shadow">
                    <h2 className="font-bold mb-2">InfoTexts:</h2>
                    <table className="w-full text-sm border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="pr-4 text-left">ID</th>
                                <th className="pr-4 text-left">Batch ID</th>
                                <th className="pr-4 text-left">Sheet ID</th>
                                <th className="pr-4 text-left">Title</th>
                                <th className="pr-4 text-left">Body</th>
                                <th className="pr-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {infoTextResults.map((row) => (
                                <tr key={row.id} className="align-top divide-y divide-x divide-gray-200">
                                    <td className="pr-4">{row.id}</td>
                                    <td className="pr-4">{row.batch_id}</td>
                                    <td className="pr-4">{row.sheet_id}</td>
                                    <td className="pr-4 w-1/4">
                                        {editingId === row.id ? (
                                            <Input
                                                value={editFields.title}
                                                onChange={(e) =>
                                                    setEditFields({ ...editFields, title: e.target.value })
                                                }
                                            />
                                        ) : (
                                            row.text_en_uk.title
                                        )}
                                    </td>
                                    <td className="pr-4 w-1/2">
                                        {editingId === row.id ? (
                                            <textarea
                                                className="w-full border rounded p-1"
                                                rows={3}
                                                value={editFields.body}
                                                onChange={(e) =>
                                                    setEditFields({ ...editFields, body: e.target.value })
                                                }
                                            />
                                        ) : (
                                            <pre className="whitespace-pre-wrap">{row.text_en_uk.body}</pre>
                                        )}
                                    </td>
                                    <td className="pr-4 space-x-2">
                                        {editingId === row.id ? (
                                            <>
                                                <Button size="sm" onClick={() => saveChanges(row.id)}>Save</Button>
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