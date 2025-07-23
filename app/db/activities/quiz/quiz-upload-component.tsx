'use client';
import { useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type ParsedQuizRow = {
  sheet_id: number;
  quiz_number: number;
  question: string;
  correct_answer: string;
  correct_feedbacks: string[];
  incorrect_answer_1: string;
  incorrect_answer_2: string;
  incorrect_answer_3: string;
  incorrect_answer_1_feedbacks: string[];
  incorrect_answer_2_feedbacks: string[];
  incorrect_answer_3_feedbacks: string[];
};

export default function QuizUploader() {
  const [parsedRows, setParsedRows] = useState<ParsedQuizRow[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [batchId, setBatchId] = useState('');
  const [status, setStatus] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: ParsedQuizRow[] = results.data.map((row: any) => ({
          sheet_id: parseInt(row['sheet_id']),
          quiz_number: parseInt(row['Quiz']),
          question: row['Question'],
          correct_answer: row['Correct Answer'],
          correct_feedbacks: row['Correct Answer Feedback(s)'].split('|').map((s: string) => s.trim()),
          incorrect_answer_1: row['Incorrect Answer 1'],
          incorrect_answer_2: row['Incorrect Answer 2'],
          incorrect_answer_3: row['Incorrect Answer 3'],
          incorrect_answer_1_feedbacks: row['Incorrect Answer 1 (Feedback(s))'].split('|').map((s: string) => s.trim()),
          incorrect_answer_2_feedbacks: row['Incorrect Answer 2 (Feedback(s))'].split('|').map((s: string) => s.trim()),
          incorrect_answer_3_feedbacks: row['Incorrect Answer 3 (Feedback(s))'].split('|').map((s: string) => s.trim()),
        }));
        setParsedRows(rows);
        setStatus(`Parsed ${rows.length} rows.`);
      },
      error: (error) => {
        setStatus('Failed to parse CSV: ' + error.message);
      }
    });
  };

  const handleSubmit = async () => {
    if (!batchId) {
      setStatus('Please enter a batch ID.');
      return;
    }

    setStatus('Uploading to Supabase...');
    try {
      const payload = parsedRows.map(row => ({
        question_text: row.question,
        correct_answer: {
          answer: row.correct_answer,
          feedback: row.correct_feedbacks
        },
        incorrect_answers: [
          {
            answer: row.incorrect_answer_1,
            feedback: row.incorrect_answer_1_feedbacks
          },
          {
            answer: row.incorrect_answer_2,
            feedback: row.incorrect_answer_2_feedbacks
          },
          {
            answer: row.incorrect_answer_3,
            feedback: row.incorrect_answer_3_feedbacks
          }
        ],
        question_text_media_en_uk: null,
        batch_id: batchId
      }));

      const { data: insertedQuestions, error } = await supabase
        .from('quiz_questions')
        .insert(payload)
        .select('id, batch_id, question_text, correct_answer, incorrect_answers');

      if (error || !insertedQuestions) {
        console.error(error);
        setStatus('Error inserting questions: ' + error?.message);
        return;
      }

      const grouped = new Map<number, string[]>();
      parsedRows.forEach((row, i) => {
        const questionId = insertedQuestions[i]?.id;
        if (!grouped.has(row.quiz_number)) {
          grouped.set(row.quiz_number, []);
        }
        grouped.get(row.quiz_number)?.push(questionId);
      });

      const stagePayload = Array.from(grouped.entries()).map(([quizNumber, questionIds]) => ({
        type: 'quiz',
        assets: [],
        params: {
          questions: questionIds
        },
        batch_id: batchId
      }));

      const { error: stageError } = await supabase
        .from('stages')
        .insert(stagePayload);

      if (stageError) {
        console.error(stageError);
        setStatus('Error inserting stages: ' + stageError.message);
        return;
      }

      setStatus(`Successfully inserted ${insertedQuestions.length} questions and ${grouped.size} stages.`);
      setParsedRows([]);
      setFile(null);
      setBatchId('');
    } catch (err: any) {
      console.error(err);
      setStatus('Unexpected error: ' + err.message);
    }
  };

  return (
    <div className="grey-border">
      <b>Batch Upload Quiz Questions</b><br />
      <i>
        Upload a CSV<br />
        This tool will then:
        <br/>- create quiz question entries
        <br/>- create a stage per quiz (from the "Quiz" column)
        <br/>- tag all rows with a batch_id for tracking
      </i>
      <br /><br />

      <div className="grid w-full max-w-sm items-center gap-3">
        <Input
          type="text"
          placeholder="Enter batch ID"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
        />
        <Input
          id="dataFile"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>

      <div>
        <Button
          disabled={!parsedRows.length || !batchId}
          onClick={handleSubmit}
          className="green-shadcn-button mt-2"
        >
          Submit to Supabase
        </Button>
      </div>

      {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}

      {parsedRows.length > 0 && (
        <div className="mt-4 border p-4 rounded shadow">
          <h2 className="font-bold mb-2">Parsed Quizzes:</h2>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {parsedRows.map((row, i) => (
              <li key={i}>
                <strong>Quiz {row.quiz_number}</strong> – {row.question}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
