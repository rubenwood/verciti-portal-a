type Course = {
    id: number
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
    id: number
    created_at: string
    external_title: string
    internal_title: string
    status: string
    time_est: string
    time_est_num: string
    about_text: string
    learning_objectives: string
    params: object
    type: string
    qr_url: string
    icon_url: string
    title_asset_url: string
}

type CourseActivity = {
    id: number
    course_id: number
    activity_id: number
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