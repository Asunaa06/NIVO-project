-- ============================================================================
-- Nivo Project - Supabase Schema
-- ============================================================================
-- This SQL script creates all necessary tables for the Nivo educational app.
-- Execute this in your Supabase SQL Editor.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. PROFILES TABLE - ملف الطالب
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  avatar_url text,
  branch text,
  target_goal integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  onboarding_completed boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT target_goal_positive CHECK (target_goal >= 0),
  CONSTRAINT streak_days_non_negative CHECK (streak_days >= 0)
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- RLS Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policy: Service role can insert profiles during signup
CREATE POLICY "Allow public signup to create profile" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 2. SUBJECTS TABLE - المواد الدراسية
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.subjects (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  color text DEFAULT '#d9752e',
  icon text DEFAULT 'N',
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_subjects_order ON public.subjects(order_index);

-- Enable Row Level Security (RLS)
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view subjects
CREATE POLICY "Anyone can view subjects" ON public.subjects
  FOR SELECT USING (true);

-- ============================================================================
-- 3. LESSONS TABLE - الدروس
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lessons (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id uuid NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer DEFAULT 0,
  bac_frequency integer DEFAULT 5,
  anki_cards_count integer DEFAULT 0,
  anki_link text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT bac_frequency_positive CHECK (bac_frequency > 0),
  CONSTRAINT anki_cards_non_negative CHECK (anki_cards_count >= 0)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lessons_subject_id ON public.lessons(subject_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON public.lessons(order_index);

-- Enable Row Level Security (RLS)
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view lessons
CREATE POLICY "Anyone can view lessons" ON public.lessons
  FOR SELECT USING (true);

-- ============================================================================
-- 4. LESSON_PROGRESS TABLE - تقدم الطالب
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  box_level integer DEFAULT 0,
  last_review_date timestamp with time zone,
  next_review_date timestamp with time zone,
  review_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  CONSTRAINT unique_user_lesson UNIQUE (user_id, lesson_id),
  CONSTRAINT box_level_valid CHECK (box_level >= 0 AND box_level <= 5),
  CONSTRAINT review_count_non_negative CHECK (review_count >= 0)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_completed ON public.lesson_progress(completed);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_next_review ON public.lesson_progress(next_review_date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own progress
CREATE POLICY "Users can view their own progress" ON public.lesson_progress
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policy: Users can update their own progress
CREATE POLICY "Users can update their own progress" ON public.lesson_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own progress
CREATE POLICY "Users can insert their own progress" ON public.lesson_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- SAMPLE DATA - بيانات تجريبية
-- ============================================================================

-- Insert sample subjects
INSERT INTO public.subjects (name, description, color, icon, order_index) VALUES
  ('الرياضيات', 'مادة الرياضيات وفروعها المختلفة', '#d9752e', '∑', 1),
  ('الفيزياء', 'مادة الفيزياء والظواهر الطبيعية', '#1f9d61', '⚡', 2),
  ('الكيمياء', 'مادة الكيمياء والتفاعلات', '#7b5bd6', '⚗', 3),
  ('اللغة الإنجليزية', 'مادة اللغة الإنجليزية', '#0ea5e9', '🌍', 4),
  ('اللغة العربية', 'مادة اللغة العربية والأدب', '#f59e0b', '✍', 5),
  ('التاريخ', 'مادة التاريخ والأحداث التاريخية', '#ef4444', '📚', 6)
ON CONFLICT DO NOTHING;

-- Insert sample lessons for Mathematics (assuming subjects table has been populated)
INSERT INTO public.lessons (subject_id, title, description, order_index, bac_frequency, anki_cards_count) 
SELECT 
  (SELECT id FROM public.subjects WHERE name = 'الرياضيات' LIMIT 1),
  lesson_title,
  lesson_desc,
  idx,
  freq,
  cards
FROM (
  VALUES
    ('المتطابقات الجبرية', 'تعلم المتطابقات الأساسية والمتقدمة', 1, 5, 15),
    ('حل المعادلات التربيعية', 'حل المعادلات من الدرجة الثانية', 2, 4, 12),
    ('الدوال والرسوم البيانية', 'فهم الدوال وتمثيلها بيانياً', 3, 3, 18),
    ('المتتاليات والمتسلسلات', 'الحسابية والهندسية', 4, 5, 20),
    ('حساب المثلثات', 'النسب المثلثية والزوايا', 5, 4, 16)
) AS lessons_data(lesson_title, lesson_desc, idx, freq, cards)
ON CONFLICT DO NOTHING;

-- Insert sample lessons for Physics
INSERT INTO public.lessons (subject_id, title, description, order_index, bac_frequency, anki_cards_count)
SELECT 
  (SELECT id FROM public.subjects WHERE name = 'الفيزياء' LIMIT 1),
  lesson_title,
  lesson_desc,
  idx,
  freq,
  cards
FROM (
  VALUES
    ('قوانين نيوتن للحركة', 'القوانين الثلاثة للحركة والقوة', 1, 5, 14),
    ('الطاقة والعمل', 'مفاهيم الطاقة والعمل والقوة', 2, 4, 13),
    ('الموجات والصوت', 'خصائص الموجات والصوت', 3, 3, 11),
    ('الكهرباء والمغناطيسية', 'المجالات الكهربائية والمغناطيسية', 4, 5, 19),
    ('الحرارة والديناميكا', 'قوانين الديناميكا الحرارية', 5, 4, 17)
) AS lessons_data(lesson_title, lesson_desc, idx, freq, cards)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run the function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update profile's updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for updating profile timestamp
DROP TRIGGER IF EXISTS update_profile_updated_at ON public.profiles;
CREATE TRIGGER update_profile_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_timestamp();

-- ============================================================================
-- NOTES / ملاحظات
-- ============================================================================
-- 1. تأكد من تفعيل Row Level Security (RLS) في إعدادات Supabase
-- 2. تحقق من صحة Foreign Keys والعلاقات بين الجداول
-- 3. يمكنك إضافة بيانات إضافية حسب احتياجاتك
-- 4. الحقول ذات القيم الافتراضية (DEFAULT) اختيارية عند الإدراج
-- 5. تأكد من أن المستخدمين مصرح لهم بالوصول إلى بياناتهم فقط من خلال RLS
