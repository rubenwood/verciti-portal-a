'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { insertInfoTexts } from '../../general/utils';
import { supabaseTest } from '@/lib/supabase';

export function InfoTextAdder() {
  const [isAdding, setIsAdding] = useState(false);
  const [row, setRow] = useState({
    batchId: '',
    sheetId: '',
    heading: '',
    body: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    try {
      setLoading(true);
      setError(null);

      await insertInfoTexts(supabaseTest,
        [
          {
            heading: row.heading,
            body: row.body,
            sheetId: Number(row.sheetId),
          },
        ],
        row.batchId
      );

      // success: clear and hide form
      setRow({ batchId: '', sheetId: '', heading: '', body: '' });
      setIsAdding(false);
    } catch (err: any) {
      console.error('Insert failed:', err);
      setError(err.message ?? 'Failed to save info text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      {!isAdding && (
        <Button className="green-shadcn-button" onClick={() => setIsAdding(true)}>
          Add
        </Button>
      )}

      {isAdding && (
        <div className="mt-2 border p-4 rounded shadow">
          <table className="w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="pr-4 text-left">Batch ID</th>
                <th className="pr-4 text-left">Sheet ID</th>
                <th className="pr-4 text-left">Title</th>
                <th className="pr-4 text-left">Body</th>
                <th className="pr-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="align-top divide-y divide-x divide-gray-200">
                <td className="pr-4">
                  <Input
                    value={row.batchId}
                    onChange={(e) => setRow({ ...row, batchId: e.target.value })}
                    placeholder="Batch ID"
                  />
                </td>
                <td className="pr-4">
                  <Input
                    type="number"
                    value={row.sheetId}
                    onChange={(e) => setRow({ ...row, sheetId: e.target.value })}
                    placeholder="Sheet ID"
                  />
                </td>
                <td className="pr-4 w-1/4">
                  <Input
                    value={row.heading}
                    onChange={(e) => setRow({ ...row, heading: e.target.value })}
                    placeholder="Title"
                  />
                </td>
                <td className="pr-4 w-1/2">
                  <textarea
                    className="w-full border rounded p-1"
                    rows={3}
                    value={row.body}
                    onChange={(e) => setRow({ ...row, body: e.target.value })}
                    placeholder="Body"
                  />
                </td>
                <td className="pr-4 space-x-2">
                  <Button size="sm" onClick={save} disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAdding(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>

          {error && <div className="text-red-500 mt-2">Error: {error}</div>}
        </div>
      )}
    </div>
  );
}
