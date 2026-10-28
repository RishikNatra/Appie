-- ==============================================================================
-- APPIE HEALTHCARE PLATFORM - DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================
-- This script configures the database schema, role definitions, automated triggers,
-- and strict Row Level Security (RLS) policies for all Appie database tables.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('patient', 'health_professional', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE consultation_status AS ENUM ('pending', 'scheduled', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. USER PROFILES TABLE
-- ------------------------------------------------------------------------------
-- Tied directly to Supabase Auth (auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'patient',
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    medical_license_number TEXT, -- Only for health professionals
    specialization TEXT,         -- Only for health professionals
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Constraints
    CONSTRAINT username_length_check CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
    CONSTRAINT username_format_check CHECK (username ~* '^[a-zA-Z0-9_]+$'),
    CONSTRAINT email_format_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexing for fast queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies:
-- 1. Anyone authenticated can view their own profile.
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- 2. Authenticated users can view verified health professional profiles (for search and discovery).
CREATE POLICY "Anyone can view verified health professionals" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (role = 'health_professional' AND is_verified = true);

-- 3. Users can only update their own profile.
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 4. Insert is restricted to the user matching auth.uid() or service_role trigger.
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- 5. Delete only allowed for the account owner.
CREATE POLICY "Users can delete own profile" 
ON public.profiles 
FOR DELETE 
TO authenticated 
USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 3. HEALTH ASSESSMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.health_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    symptoms JSONB NOT NULL DEFAULT '[]'::jsonb,
    assessment_summary TEXT NOT NULL,
    recommended_action TEXT,
    urgency_level TEXT CHECK (urgency_level IN ('low', 'moderate', 'high', 'emergency')) DEFAULT 'low',
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.health_assessments ENABLE ROW LEVEL SECURITY;

-- Assessments RLS:
-- Patients can view and create their own assessments
CREATE POLICY "Patients view own assessments" 
ON public.health_assessments 
FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id);

CREATE POLICY "Patients create own assessments" 
ON public.health_assessments 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = patient_id);

-- Health professionals can view assessments they are reviewing
CREATE POLICY "Professionals view assigned assessments" 
ON public.health_assessments 
FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'health_professional'
    )
);

CREATE POLICY "Professionals update reviewed assessments" 
ON public.health_assessments 
FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'health_professional'
    )
);

-- ------------------------------------------------------------------------------
-- 4. PRESCRIPTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    medications JSONB NOT NULL DEFAULT '[]'::jsonb,
    instructions TEXT,
    valid_until DATE NOT NULL,
    status TEXT CHECK (status IN ('active', 'dispensed', 'expired', 'revoked')) DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Prescriptions RLS:
-- Patients can read their own prescriptions
CREATE POLICY "Patients view own prescriptions" 
ON public.prescriptions 
FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id);

-- Doctors can create prescriptions and view prescriptions they issued
CREATE POLICY "Professionals view issued prescriptions" 
ON public.prescriptions 
FOR SELECT 
TO authenticated 
USING (auth.uid() = professional_id);

CREATE POLICY "Professionals create prescriptions" 
ON public.prescriptions 
FOR INSERT 
TO authenticated 
WITH CHECK (
    auth.uid() = professional_id AND 
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'health_professional'
    )
);

CREATE POLICY "Professionals update own prescriptions" 
ON public.prescriptions 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = professional_id);

-- ------------------------------------------------------------------------------
-- 5. ORDERS TABLE (MEDICATION ORDERS)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.medication_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(10,2) NOT NULL,
    delivery_address TEXT NOT NULL,
    status order_status NOT NULL DEFAULT 'pending',
    tracking_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.medication_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own orders" 
ON public.medication_orders 
FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id);

CREATE POLICY "Patients create own orders" 
ON public.medication_orders 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = patient_id);

-- ------------------------------------------------------------------------------
-- 6. AUTOMATIC UPDATED_AT TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 7. AUTH SIGNUP HOOK (AUTO CREATE PROFILE)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    raw_role text;
    raw_username text;
BEGIN
    raw_role := COALESCE(NEW.raw_user_meta_data->>'role', 'patient');
    raw_username := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));

    INSERT INTO public.profiles (id, email, username, role, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        raw_username,
        raw_role::user_role,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        username = EXCLUDED.username;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users (runs on signup)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
