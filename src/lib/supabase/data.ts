import { createClient } from "@/lib/supabase/client"

export type ProfileRecord = {
  id?: string
  full_name?: string
  avatar_url?: string
  current_streak?: number
  last_study_date?: string
  branch?: string
  onboarding_completed?: boolean
  [key: string]: unknown
}

export type SubjectRecord = {
  id: string
  name: string
  color?: string
  icon?: string
  order_index?: number
  description?: string
  [key: string]: unknown
}

export type LessonRecord = {
  id: string
  subject_id: string
  title: string
  order_index?: number
  content?: string
  review_method?: string
  bac_frequency?: number
  anki_cards_count?: number
  anki_count?: number
  anki_link?: string
  bac_appearances?: number
  bac_years?: string[]
  [key: string]: unknown
}

export type LessonProgressRecord = {
  lesson_id: string
  user_id?: string
  completed: boolean
  next_review_date?: string
  box_level?: number
  level?: number
  [key: string]: unknown
}

export type ResourceRecord = {
  id: string
  lesson_id: string
  title: string
  description?: string
  link?: string
  created_by?: string
  upvotes?: number
  created_at?: string
  [key: string]: unknown
}

export type ResourceRecord = {
  id: string
  lesson_id: string
  title: string
  description?: string
  link?: string
  created_by?: string
  upvotes?: number
  created_at?: string
  [key: string]: unknown
}

export type TipRecord = {
  id: string
  text: string
  created_at?: string
  [key: string]: unknown
}

export type DashboardData = {
  user: { id: string; email?: string | null } | null
  profile: ProfileRecord | null
  subjects: SubjectRecord[]
  lessons: LessonRecord[]
  progress: LessonProgressRecord[]
}

type QueryResult<T> = {
  data: T | null
  error: unknown | null
}

async function safeSelect<T>(
  query: () => Promise<QueryResult<T>>,
  fallback: T
): Promise<T> {
  try {
    const result = await query()
    if (result.error) return fallback
    return (result.data ?? fallback) as T
  } catch {
    return fallback
  }
}

export async function fetchDashboardData(
  supabase: ReturnType<typeof createClient> | null
): Promise<DashboardData> {
  if (!supabase) {
    return {
      user: null,
      profile: null,
      subjects: [],
      lessons: [],
      progress: [],
    }
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      user: null,
      profile: null,
      subjects: [],
      lessons: [],
      progress: [],
    }
  }

  const [profile, subjects, lessons, progress] = await Promise.all([
    safeSelect(
      () =>
        supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle() as unknown as Promise<QueryResult<ProfileRecord>>,
      null
    ),
    safeSelect(
      () =>
        supabase
          .from("subjects")
          .select("*")
          .order("order_index", { ascending: true }) as unknown as Promise<QueryResult<SubjectRecord[]>>,
      [] as SubjectRecord[]
    ),
    safeSelect(
      () =>
        supabase
          .from("lessons")
          .select("*")
          .order("order_index", { ascending: true }) as unknown as Promise<QueryResult<LessonRecord[]>>,
      [] as LessonRecord[]
    ),
    safeSelect(
      () =>
        supabase
          .from("lesson_progress")
          .select("*")
          .eq("user_id", user.id) as unknown as Promise<QueryResult<LessonProgressRecord[]>>,
      [] as LessonProgressRecord[]
    ),
  ])

  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile: (profile as ProfileRecord | null) ?? null,
    subjects: subjects ?? [],
    lessons: lessons ?? [],
    progress: progress ?? [],
  }
}

export async function fetchCityData(supabase: ReturnType<typeof createClient> | null) {
  if (!supabase) {
    return { user: null, subjects: [] }
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { user: null, subjects: [] }
  }

  const subjects = await safeSelect(
    () =>
      supabase
        .from("subjects")
        .select("*")
        .order("order_index", { ascending: true }) as unknown as Promise<QueryResult<SubjectRecord[]>>,
    [] as SubjectRecord[]
  )

  return { user, subjects: subjects ?? [] }
}

export async function fetchSubjectData(
  supabase: ReturnType<typeof createClient> | null,
  subjectId: string
) {
  if (!supabase) {
    return { user: null, subject: null, lessons: [], progress: [] }
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { user: null, subject: null, lessons: [] }
  }

  const [subject, lessons, progress] = await Promise.all([
    safeSelect(
      () =>
        supabase
          .from("subjects")
          .select("*")
          .eq("id", subjectId)
          .maybeSingle() as unknown as Promise<QueryResult<SubjectRecord>>,
      null
    ),
    safeSelect(
      () =>
        supabase
          .from("lessons")
          .select("*")
          .eq("subject_id", subjectId)
          .order("order_index", { ascending: true }) as unknown as Promise<QueryResult<LessonRecord[]>>,
      [] as LessonRecord[]
    ),
    safeSelect(
      () =>
        supabase
          .from("lesson_progress")
          .select("*")
          .eq("user_id", user.id) as unknown as Promise<QueryResult<LessonProgressRecord[]>>,
      [] as LessonProgressRecord[]
    ),
  ])

  return {
    user,
    subject: (subject as SubjectRecord | null) ?? null,
    lessons: lessons ?? [],
    progress: progress ?? [],
  }
}