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

type Activity = {
    id: string
    created_at: string
    external_title: string
    internal_title: string
    status: string
    time_est: string
    time_est_num: string
    about_text: string
    learning_objectives: string
    params: Record<string, any>
    type: string
    qr_url: string
    icon_url: string
    title_asset_url: string
}

type Stage = {
    id: string,
    created_at: string,
    type: string,
    assets: object,
    params: Record<string, any>
}

type InfoText = {
    id: string,
    created_at: string,
    text_en_uk: string,
    media_en_uk: string
}

type CourseActivity = {
    id: string
    course_id: string
    activity_id: string
    order: number
    created_at: string
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