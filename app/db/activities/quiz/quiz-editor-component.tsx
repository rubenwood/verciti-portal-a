'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchQuizStagesByBatchId } from "../../general/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { supabasePublicMain } from '@/lib/supabase'

export default function QuizEditor(){
    const [searchTerm, setSearchTerm] = useState('');
    const [stagesWithQuestions, setStagesWithQuestions] = useState<StageWithQuestions[] | null>(null);
    const [error, setError] = useState<PostgrestError | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedQuestions, setEditedQuestions] = useState<Record<string, Partial<QuizQuestion>>>({});

    const searchClicked = async () => {
        const quizStages = await fetchQuizStagesByBatchId(searchTerm);
        if ('message' in quizStages) {
            console.error('Error fetching quiz stages:', quizStages.message);
            setError(quizStages);
            setStagesWithQuestions(null);
            return;
        }else{
            console.log('Quiz stages:', quizStages);
            setStagesWithQuestions(quizStages);
            setError(null);
        }
    }

    const handleFieldChange = (id: string, field: keyof QuizQuestion, value: any) => {
        setEditedQuestions(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value
            }
        }));
    };


    const saveChanges = async (question: QuizQuestion) => {
        const updates = editedQuestions[question.id];
        if (!updates) return;

        const { error } = await supabasePublicMain
            .from("quiz_questions")
            .update(updates)
            .eq("id", question.id);

        if (error) {
            console.error("Failed to save:", error);
        } else {
            setEditingId(null);
            setEditedQuestions(prev => {
                const newState = { ...prev };
                delete newState[question.id];
                return newState;
            });
            await searchClicked(); // refresh updated data
        }
    };

    return (
        <div className="grey-border">
            <b>Quiz editor</b><br />
            <i>Search by activity id, stage id, or batch id</i>
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

        {stagesWithQuestions && stagesWithQuestions.length > 0 && (
             <div className="mt-4 border p-4 rounded shadow">
                <h2 className="font-bold mb-2">Quiz Stages:</h2>
                <table className="w-full text-sm border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left w-32">Stage ID</th>
                            <th className="text-left w-32">Batch ID</th>
                            <th className="text-left w-24">Type</th>
                            <th className="text-left w-full">Questions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stagesWithQuestions.map((row) => (
                            <tr key={row.stage.id} className="align-top divide-y divide-x divide-gray-200">
                                <td className="w-32">{row.stage.id}</td>
                                <td className="w-32">{row.stage.batch_id}</td>
                                <td className="w-24">{row.stage.type}</td>
                                <td className="w-full">
                                    <table className="w-full text-sm border border-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="pr-4 text-left border">Question ID</th>
                                                <th className="pr-4 text-left border">Question Text</th>
                                                <th className="pr-4 text-left border">Correct Answer</th>
                                                <th className="pr-4 text-left border">Incorrect Answers</th>
                                                <th className="pr-4 text-left border">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {row.related_questions.map((q) => (
                                                <tr key={q.id}>
                                                    <td className="pr-4 border">{q.id}</td>
                                                    {/* Question */}
                                                    <td className="pr-4 border">
                                                        {editingId === q.id ? (
                                                            <Input
                                                            value={editedQuestions[q.id]?.question_text_en_uk ?? q.question_text_en_uk}
                                                            onChange={(e) =>
                                                                handleFieldChange(q.id, 'question_text_en_uk', e.target.value)
                                                            }
                                                            />
                                                        ) : (
                                                            q.question_text_en_uk
                                                        )}
                                                    </td>
                                                    {/* Correct answer */}
                                                    <td className="pr-4 border">
                                                        {editingId === q.id ? (
                                                            <Input
                                                            value={
                                                                editedQuestions[q.id]?.correct_answer_en_uk?.answer ??
                                                                q.correct_answer_en_uk.answer
                                                            }
                                                            onChange={(e) =>
                                                                handleFieldChange(q.id, 'correct_answer_en_uk', {
                                                                ...q.correct_answer_en_uk,
                                                                answer: e.target.value,
                                                                })
                                                            }
                                                            />
                                                        ) : (
                                                            q.correct_answer_en_uk.answer
                                                        )}
                                                    </td>
                                                    {/* Incorrect answers */}
                                                    <td className="pr-4 border">
                                                        {editingId === q.id ? (
                                                            q.incorrect_answers_en_uk.map((ans, index) => (
                                                            <Input
                                                                key={index}
                                                                className="mb-1"
                                                                value={
                                                                editedQuestions[q.id]?.incorrect_answers_en_uk?.[index]?.answer ??
                                                                ans.answer
                                                                }
                                                                onChange={(e) => {
                                                                const updatedAnswers = [...q.incorrect_answers_en_uk];
                                                                updatedAnswers[index] = {
                                                                    ...updatedAnswers[index],
                                                                    answer: e.target.value,
                                                                };
                                                                handleFieldChange(q.id, 'incorrect_answers_en_uk', updatedAnswers);
                                                                }}
                                                            />
                                                            ))
                                                        ) : (
                                                            q.incorrect_answers_en_uk.map((ans, index) => (
                                                            <div key={index}>{ans.answer}</div>
                                                            ))
                                                        )}
                                                        </td>
                                                    {/* Actions */}
                                                    <td className="pr-4 border">
                                                        {editingId === q.id ? (
                                                            <>
                                                            <Button size="sm" onClick={() => saveChanges(q)}>Save</Button>
                                                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                                                            </>
                                                        ) : (
                                                            <Button size="sm" variant="outline" onClick={() => setEditingId(q.id)}>Edit</Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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