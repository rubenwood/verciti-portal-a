'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { insertInfoTexts, insertStages } from '../../general/utils';


type ParsedRow = {
  heading: string;
  body: string;
  batchId: string;
};

export default function InfoTextUploader() {
  const headingRowTitle = 'Heading Text';
  const bodyRowTitle = 'Body Text';
  const batchIdRowTitle = 'Batch Id';

  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    setStatus('');
    setParsedRows([]);

    if (!selectedFile) return;

    const reader = new FileReader();
    const isCSV = selectedFile.name.endsWith('.csv');

    reader.onload = (event) => {
      const data = event.target?.result;
      if (!data) return;

      if (isCSV) {
        Papa.parse(data as string, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsed = (results.data as any[]).map((row) => ({
              heading: row[headingRowTitle] || '',
              body: row[bodyRowTitle] || '',
              batchId: row[batchIdRowTitle] || ''
            }));
            setParsedRows(parsed.filter((r) => r.body.trim().length > 0));
          },
        });
      } else {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const parsed = (jsonData as any[]).map((row) => ({
          heading: row[headingRowTitle] || '',
          body: row[bodyRowTitle] || '',
          batchId: row[batchIdRowTitle] || ''
        }));
        setParsedRows(parsed.filter((r) => r.body.trim().length > 0));
      }
    };

    if (isCSV) {
      reader.readAsText(selectedFile);
    } else {
      reader.readAsBinaryString(selectedFile);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!parsedRows.length) {
        setStatus('No valid rows to submit.');
        return;
      }

      setStatus('Uploading to Supabase...');
      console.log(file?.name);
      const batchId = file?.name.split('.')[0] || 'default-batch';
      // inster info texts
      const infoTexts = await insertInfoTexts(parsedRows, batchId);
      const stageRows = infoTexts.map((infoText: InfoText) => ({
        stageType: 'info',
        stageAssets: [],
        stageParams: { infoTextId: infoText.id },
        stageBatchId: batchId
        //stageBatchId: infoText.batch_id
      }));
      // insert a new stage for each info text
      const insertedStages = await insertStages(stageRows);

      setStatus(`✅ Successfully inserted ${infoTexts.length} records!`);
    } catch (error: any) {
      setStatus(`❌ Failed to insert data: ${error.message}`);
    }
  };

  return (
    <div className="grey-border">
      <b>Batch Upload</b><br/>
      <i>
        Upload a csv with the heading, body and batch id columns.<br/>
        This tool will then create the info text entries and related stage for each.
      </i>
      <br/>
      <br/>
      <div className="grid w-full max-w-sm items-center gap-3">
        <Input
          id="dataFile"
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={handleFileChange}
        />
      </div>
      <div>
        <Button
          disabled={!parsedRows.length}
          onClick={handleSubmit}
          className="green-shadcn-button"
        >
          Submit to Supabase
        </Button>
      </div>

      {status && <p className="text-sm text-gray-700">{status}</p>}

      {parsedRows.length > 0 && (
        <div className="mt-4 border p-4 rounded shadow">
          <h2 className="font-bold mb-2">Parsed InfoTexts:</h2>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {parsedRows.map((row, i) => (
              <li key={i}>
                <strong>{row.heading}</strong>
                <p className="text-sm whitespace-pre-wrap">{row.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}