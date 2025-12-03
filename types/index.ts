type ParsedRow = {
  heading: string;
  body: string;
  batchId: string;
  sheetId: number;
};

type Course = {
    id: string
    created_at: string
    internal_title: string
    external_title: string    
    description: string
    icon: string
    skill_level: object
    status: string
    ranks: object
}

enum EntryVisiblity {
    Production,
    Testing,
    ComingSoon,
    None
}

type Activity = {
    id?: string
    created_at?: string
    external_title: string
    internal_title: string
    status?: EntryVisiblity
    time_est: string
    time_est_num: string
    about_text: string
    learning_objectives: string
    params: Record<string, any>
    type: string
    qr_url: string
    icon_url: string
    title_asset_url: string
    dir_name: string
}

type CourseActivityWithDetails = {
    id: any
    course_id: any
    activity_id: any
    order: any
    course: {
        id: any
        external_title: any
    };
    activity: {
        id: any
        external_title: any
    };
}


type Stage = {
    id: string,
    created_at: string,
    type: string,
    assets: object,
    params: Record<string, any>,
    batch_id: string
}

type StageWithInfoText = {
    stage: Stage,
    related_info_text: InfoText | null
}

type InfoText = {
    id: string,
    created_at: string,
    text_en_uk: any,
    media_en_uk: string,
    batch_id: string,
    sheet_id: number
}

type QuizQuestion = {
    id: string,
    created_at: string,
    question_text_en_uk: string,
    correct_answer_en_uk: {
        answer: string,
        feedback: string[]
    },
    incorrect_answers_en_uk: {
        answer: string,
        feedback: string[]
    }[],
    question_text_media_en_uk: string | null,
    batch_id: string
}

type StageWithQuestions = {
    stage: Stage,
    related_questions: QuizQuestion[]
}

type CourseActivity = {
    id: string
    course_id: string
    activity_id: string
    order: number
    created_at: string
}

type SynthesiaVideo = {
  title: string;
  captions: SynthesiaCaptions;
  download: string;
  duration: string;
  createdAt: number
  lastUpdatedAt: number;
  status: string;
};
type SynthesiaCaptions = {
    srt: string;
    vtt: string;
}

type SynthesiaPayload = {
  videos: SynthesiaVideo[];
  nextOffset?: number;
};

