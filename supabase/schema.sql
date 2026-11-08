-- ==============================================================================
-- APPIE HEALTHCARE PLATFORM - COMPREHENSIVE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================
-- Enforces complete data integrity, roles, and Row Level Security (RLS)
-- for the Account System and supporting clinical operations.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ENUMS & TYPES
-- ------------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('patient', 'health_professional', 'pharmacist', 'delivery_partner', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status_type AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE consent_category_type AS ENUM ('data_processing', 'telehealth_consultation', 'pharmacy_sharing', 'emergency_access');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 2. USER PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'patient',
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    full_name TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    avatar_url TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relation TEXT,
    is_verified BOOLEAN DEFAULT false,
    two_factor_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Input & Format Constraints (enforced at DB level)
    CONSTRAINT username_length_check CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
    CONSTRAINT username_format_check CHECK (username ~* '^[a-zA-Z0-9_]+$'),
    CONSTRAINT email_format_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies:
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view verified health professionals" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (role = 'health_professional' AND is_verified = true);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile" 
ON public.profiles FOR DELETE 
TO authenticated 
USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 3. HEALTH PROFESSIONAL PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.health_professional_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    prefix TEXT DEFAULT 'Dr.',
    medical_license_number TEXT NOT NULL,
    medical_council_name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    qualifications TEXT NOT NULL,
    years_of_experience INTEGER DEFAULT 0 CHECK (years_of_experience >= 0 AND years_of_experience <= 70),
    clinic_address TEXT,
    verification_status verification_status_type NOT NULL DEFAULT 'pending',
    verification_notes TEXT,
    license_document_url TEXT,
    id_proof_url TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.health_professional_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Health professionals view own details" 
ON public.health_professional_profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view verified professional credentials" 
ON public.health_professional_profiles FOR SELECT 
TO authenticated 
USING (verification_status = 'verified');

CREATE POLICY "Health professionals insert own credentials" 
ON public.health_professional_profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Health professionals update own credentials" 
ON public.health_professional_profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 3B. PHARMACY PROFILES TABLE (Medication & Dispensing Partners)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pharmacy_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    pharmacy_name TEXT NOT NULL,
    pharmacist_name TEXT NOT NULL,
    pharmacy_type TEXT CHECK (pharmacy_type IN ('retail', 'hospital', 'community', 'chain')) DEFAULT 'retail',
    gst_number TEXT NOT NULL,
    drug_license_number TEXT NOT NULL, -- Form 20 / Form 21
    pharmacy_council_reg_no TEXT NOT NULL,
    pharmacy_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    phone TEXT NOT NULL,
    verification_status verification_status_type NOT NULL DEFAULT 'pending',
    verification_notes TEXT,
    certificate_url TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Database-level check constraints
    CONSTRAINT pharmacy_name_length_check CHECK (char_length(pharmacy_name) >= 2 AND char_length(pharmacy_name) <= 100),
    CONSTRAINT drug_license_length_check CHECK (char_length(drug_license_number) >= 4)
);

CREATE INDEX IF NOT EXISTS idx_pharmacy_profiles_user_id ON public.pharmacy_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_profiles_city ON public.pharmacy_profiles(city);
CREATE INDEX IF NOT EXISTS idx_pharmacy_profiles_status ON public.pharmacy_profiles(verification_status);

-- Enable RLS
ALTER TABLE public.pharmacy_profiles ENABLE ROW LEVEL SECURITY;

-- Pharmacy RLS Policies
CREATE POLICY "Pharmacists view own profile"
ON public.pharmacy_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view verified pharmacies"
ON public.pharmacy_profiles FOR SELECT
TO authenticated
USING (verification_status = 'verified');

CREATE POLICY "Pharmacists insert own profile"
ON public.pharmacy_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Pharmacists update own profile"
ON public.pharmacy_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Pharmacists delete own profile"
ON public.pharmacy_profiles FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 3C. DELIVERY PARTNER PROFILES TABLE (Pharmaceutical Logistics Fleet)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delivery_partner_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    vehicle_type TEXT CHECK (vehicle_type IN ('motorcycle', 'scooter', 'electric_vehicle', 'bicycle')) DEFAULT 'motorcycle',
    vehicle_registration_number TEXT NOT NULL,
    driving_license_number TEXT NOT NULL,
    city TEXT NOT NULL,
    operating_zone TEXT NOT NULL,
    verification_status verification_status_type NOT NULL DEFAULT 'pending',
    verification_notes TEXT,
    vehicle_rc_url TEXT,
    driving_license_url TEXT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Database-level check constraints
    CONSTRAINT vehicle_rc_length_check CHECK (char_length(vehicle_registration_number) >= 4),
    CONSTRAINT driving_license_length_check CHECK (char_length(driving_license_number) >= 4)
);

CREATE INDEX IF NOT EXISTS idx_delivery_partner_user_id ON public.delivery_partner_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_delivery_partner_city ON public.delivery_partner_profiles(city);
CREATE INDEX IF NOT EXISTS idx_delivery_partner_status ON public.delivery_partner_profiles(verification_status);

-- Enable RLS
ALTER TABLE public.delivery_partner_profiles ENABLE ROW LEVEL SECURITY;

-- Delivery Partner RLS Policies
CREATE POLICY "Delivery partners view own profile"
ON public.delivery_partner_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Delivery partners insert own profile"
ON public.delivery_partner_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Delivery partners update own profile"
ON public.delivery_partner_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Delivery partners delete own profile"
ON public.delivery_partner_profiles FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 4. HEALTH PROFILES TABLE (Patient Medical & Health Data)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.health_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    blood_group TEXT CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    height_cm NUMERIC(5,2) CHECK (height_cm > 30 AND height_cm < 280),
    weight_kg NUMERIC(5,2) CHECK (weight_kg > 2 AND weight_kg < 500),
    bmi NUMERIC(4,1),
    systolic_bp INTEGER CHECK (systolic_bp >= 50 AND systolic_bp <= 260),
    diastolic_bp INTEGER CHECK (diastolic_bp >= 30 AND diastolic_bp <= 180),
    is_diabetic BOOLEAN NOT NULL DEFAULT false,
    is_smoker BOOLEAN NOT NULL DEFAULT false,
    medical_conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
    allergies JSONB NOT NULL DEFAULT '[]'::jsonb,
    current_medications JSONB NOT NULL DEFAULT '[]'::jsonb,
    medical_history_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.health_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own health profile" 
ON public.health_profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Verified clinicians view health profiles for consults" 
ON public.health_profiles FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'health_professional' AND is_verified = true
    )
);

CREATE POLICY "Patients insert own health profile" 
ON public.health_profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Patients update own health profile" 
ON public.health_profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. CONSENT MANAGEMENT TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category consent_category_type NOT NULL,
    is_granted BOOLEAN NOT NULL DEFAULT true,
    version TEXT NOT NULL DEFAULT '1.0',
    ip_address TEXT,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_user_consent_category UNIQUE (user_id, category)
);

ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own consents" 
ON public.user_consents FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own consents" 
ON public.user_consents FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own consents" 
ON public.user_consents FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 6. USER SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    sms_notifications BOOLEAN NOT NULL DEFAULT true,
    email_notifications BOOLEAN NOT NULL DEFAULT true,
    whatsapp_notifications BOOLEAN NOT NULL DEFAULT false,
    theme TEXT CHECK (theme IN ('light', 'dark', 'system')) NOT NULL DEFAULT 'dark',
    language TEXT NOT NULL DEFAULT 'en',
    font_scaling TEXT CHECK (font_scaling IN ('normal', 'large')) NOT NULL DEFAULT 'normal',
    active_sessions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own settings" 
ON public.user_settings FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own settings" 
ON public.user_settings FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own settings" 
ON public.user_settings FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7. VERIFICATION CODES TABLE (OTP, 2FA, PASSWORD RESET)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.verification_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('registration', 'two_factor', 'password_recovery')),
    attempts INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_lookup ON public.verification_codes(identifier, type);

-- Restrict direct client access; accessed only via secure server endpoints / service role
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 8. HEALTH ASSESSMENTS TABLE (Health Assessment System)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.health_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    symptoms JSONB NOT NULL DEFAULT '[]'::jsonb,
    assessment_summary TEXT NOT NULL,
    possible_conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
    urgency_level TEXT CHECK (urgency_level IN ('low', 'moderate', 'high', 'emergency')) DEFAULT 'low',
    confidence_score INTEGER DEFAULT 88 CHECK (confidence_score >= 0 AND confidence_score <= 100),
    recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
    next_step_action TEXT NOT NULL,
    recommended_specialization TEXT DEFAULT 'General Medicine',
    status TEXT CHECK (status IN ('active', 'reviewed', 'archived')) DEFAULT 'active',
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.health_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own assessments" 
ON public.health_assessments FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id);

CREATE POLICY "Patients create own assessments" 
ON public.health_assessments FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own assessments" 
ON public.health_assessments FOR UPDATE 
TO authenticated 
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients delete own assessments" 
ON public.health_assessments FOR DELETE 
TO authenticated 
USING (auth.uid() = patient_id);

CREATE POLICY "Verified clinicians view assessments" 
ON public.health_assessments FOR SELECT 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'health_professional' AND is_verified = true
    )
);

-- ------------------------------------------------------------------------------
-- 9. SYMPTOM TRACKERS TABLE (Symptom Tracking Module)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.symptom_trackers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES public.health_assessments(id) ON DELETE CASCADE,
    symptom_name TEXT NOT NULL,
    severity INTEGER NOT NULL CHECK (severity >= 1 AND severity <= 10),
    status TEXT CHECK (status IN ('improving', 'stable', 'worsening', 'resolved')) DEFAULT 'stable',
    days_active INTEGER DEFAULT 1,
    timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.symptom_trackers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own symptom trackers" 
ON public.symptom_trackers FOR SELECT 
TO authenticated 
USING (auth.uid() = patient_id);

CREATE POLICY "Patients create own symptom trackers" 
ON public.symptom_trackers FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own symptom trackers" 
ON public.symptom_trackers FOR UPDATE 
TO authenticated 
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients delete own symptom trackers" 
ON public.symptom_trackers FOR DELETE 
TO authenticated 
USING (auth.uid() = patient_id);

-- ------------------------------------------------------------------------------
-- 10. AUTOMATIC UPDATED_AT TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_health_prof_updated_at ON public.health_professional_profiles;
CREATE TRIGGER set_health_prof_updated_at BEFORE UPDATE ON public.health_professional_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_health_profiles_updated_at ON public.health_profiles;
CREATE TRIGGER set_health_profiles_updated_at BEFORE UPDATE ON public.health_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_consents_updated_at ON public.user_consents;
CREATE TRIGGER set_consents_updated_at BEFORE UPDATE ON public.user_consents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_settings_updated_at ON public.user_settings;
CREATE TRIGGER set_settings_updated_at BEFORE UPDATE ON public.user_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_assessments_updated_at ON public.health_assessments;
CREATE TRIGGER set_assessments_updated_at BEFORE UPDATE ON public.health_assessments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_symptom_trackers_updated_at ON public.symptom_trackers;
CREATE TRIGGER set_symptom_trackers_updated_at BEFORE UPDATE ON public.symptom_trackers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 11. CONSULTATION APPOINTMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consultation_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('video', 'audio', 'chat', 'in_person')) DEFAULT 'video',
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled')) DEFAULT 'confirmed',
    reason TEXT,
    assessment_id UUID REFERENCES public.health_assessments(id) ON DELETE SET NULL,
    meeting_link TEXT,
    fee_amount NUMERIC(10,2) NOT NULL DEFAULT 499.00,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'paid',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_consultations_patient ON public.consultation_appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_professional ON public.consultation_appointments(professional_id);
CREATE INDEX IF NOT EXISTS idx_consultations_date ON public.consultation_appointments(appointment_date);

ALTER TABLE public.consultation_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own appointments"
ON public.consultation_appointments FOR SELECT
TO authenticated
USING (auth.uid() = patient_id);

CREATE POLICY "Health professionals view assigned appointments"
ON public.consultation_appointments FOR SELECT
TO authenticated
USING (auth.uid() = professional_id);

CREATE POLICY "Patients book appointments"
ON public.consultation_appointments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Participants update appointments"
ON public.consultation_appointments FOR UPDATE
TO authenticated
USING (auth.uid() = patient_id OR auth.uid() = professional_id)
WITH CHECK (auth.uid() = patient_id OR auth.uid() = professional_id);

-- ------------------------------------------------------------------------------
-- 12. CONSULTATION SUMMARIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consultation_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES public.consultation_appointments(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    clinical_diagnosis TEXT NOT NULL,
    doctor_notes TEXT NOT NULL,
    recommendations TEXT[] DEFAULT ARRAY[]::TEXT[],
    follow_up_date DATE,
    follow_up_instructions TEXT,
    prescription_id UUID,
    status TEXT NOT NULL CHECK (status IN ('draft', 'completed')) DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.consultation_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants view consultation summary"
ON public.consultation_summaries FOR SELECT
TO authenticated
USING (auth.uid() = patient_id OR auth.uid() = professional_id);

CREATE POLICY "Professionals manage consultation summaries"
ON public.consultation_summaries FOR ALL
TO authenticated
USING (auth.uid() = professional_id)
WITH CHECK (auth.uid() = professional_id);

-- ------------------------------------------------------------------------------
-- 13. CONSULTATION REVIEWS TABLE (Patient Feedback & Ratings)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consultation_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_id UUID NOT NULL UNIQUE REFERENCES public.consultation_appointments(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.consultation_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view reviews"
ON public.consultation_reviews FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Patients submit own reviews"
ON public.consultation_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = patient_id);

-- ------------------------------------------------------------------------------
-- 14. PRESCRIPTIONS TABLE (Prescription System)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    prescription_code TEXT NOT NULL UNIQUE,
    appointment_id UUID REFERENCES public.consultation_appointments(id) ON DELETE SET NULL,
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    diagnosis TEXT NOT NULL,
    medications JSONB NOT NULL DEFAULT '[]'::jsonb,
    general_advice TEXT,
    digital_signature TEXT NOT NULL,
    valid_until DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'dispensed', 'expired', 'revoked')) DEFAULT 'active',
    pharmacy_dispatch_status TEXT NOT NULL CHECK (pharmacy_dispatch_status IN ('not_ordered', 'cart_added', 'ordered', 'dispatched', 'delivered')) DEFAULT 'not_ordered',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON public.prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_code ON public.prescriptions(prescription_code);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own prescriptions"
ON public.prescriptions FOR SELECT
TO authenticated
USING (auth.uid() = patient_id);

CREATE POLICY "Health professionals view and manage prescriptions"
ON public.prescriptions FOR ALL
TO authenticated
USING (auth.uid() = professional_id)
WITH CHECK (auth.uid() = professional_id);

-- ------------------------------------------------------------------------------
-- 15. MEDICATIONS TABLE (Medication Catalog System)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    generic_name TEXT NOT NULL,
    brand_name TEXT,
    category TEXT NOT NULL,
    dosage_form TEXT NOT NULL,
    strength TEXT NOT NULL,
    pack_size TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    prescription_required BOOLEAN NOT NULL DEFAULT false,
    usage_instructions TEXT NOT NULL,
    safety_warnings TEXT NOT NULL,
    side_effects TEXT[] DEFAULT ARRAY[]::TEXT[],
    in_stock BOOLEAN NOT NULL DEFAULT true,
    manufacturer TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view medication catalog"
ON public.medications FOR SELECT
TO authenticated
USING (true);

-- ------------------------------------------------------------------------------
-- 16. MEDICATION CART ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.medication_cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    medication_id UUID NOT NULL REFERENCES public.medications(id) ON DELETE CASCADE,
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0) DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_patient_medication_prescription UNIQUE (patient_id, medication_id, prescription_id)
);

ALTER TABLE public.medication_cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients manage own cart items"
ON public.medication_cart_items FOR ALL
TO authenticated
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);

-- ------------------------------------------------------------------------------
-- 17. CLINICAL REVIEWS TABLE (Review System for Assessments & Orders)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.clinical_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES public.health_assessments(id) ON DELETE CASCADE,
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL,
    review_type TEXT NOT NULL CHECK (review_type IN ('assessment_review', 'medication_approval', 'prescription_endorsement')),
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'modification_recommended', 'rejected')) DEFAULT 'pending',
    clinical_notes TEXT NOT NULL,
    prescribed_actions TEXT[] DEFAULT ARRAY[]::TEXT[],
    reviewed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.clinical_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own clinical reviews"
ON public.clinical_reviews FOR SELECT
TO authenticated
USING (auth.uid() = patient_id);

CREATE POLICY "Health professionals manage clinical reviews"
ON public.clinical_reviews FOR ALL
TO authenticated
USING (auth.uid() = professional_id)
WITH CHECK (auth.uid() = professional_id);

-- ------------------------------------------------------------------------------
-- Triggers for new tables
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS set_consultations_updated_at ON public.consultation_appointments;
CREATE TRIGGER set_consultations_updated_at BEFORE UPDATE ON public.consultation_appointments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_summaries_updated_at ON public.consultation_summaries;
CREATE TRIGGER set_summaries_updated_at BEFORE UPDATE ON public.consultation_summaries FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_prescriptions_updated_at ON public.prescriptions;
CREATE TRIGGER set_prescriptions_updated_at BEFORE UPDATE ON public.prescriptions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_medications_updated_at ON public.medications;
CREATE TRIGGER set_medications_updated_at BEFORE UPDATE ON public.medications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_cart_items_updated_at ON public.medication_cart_items;
CREATE TRIGGER set_cart_items_updated_at BEFORE UPDATE ON public.medication_cart_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_clinical_reviews_updated_at ON public.clinical_reviews;
CREATE TRIGGER set_clinical_reviews_updated_at BEFORE UPDATE ON public.clinical_reviews FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 18. PHARMACY ORDERS TABLE (Order System for Medicines)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pharmacy_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code TEXT NOT NULL UNIQUE,
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prescription_id UUID REFERENCES public.prescriptions(id) ON DELETE SET NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    delivery_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    order_status TEXT NOT NULL CHECK (order_status IN ('Ordered', 'Collecting', 'Delivering', 'delivered', 'Failed', 'placed', 'pharmacist_verified', 'packed', 'dispatched', 'out_for_delivery', 'cancelled')) DEFAULT 'Ordered',
    tracking_timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
    courier_partner TEXT DEFAULT 'BlueDart Express Healthcare',
    tracking_number TEXT,
    estimated_delivery TIMESTAMPTZ,
    payment_id UUID,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'cod', 'refunded')) DEFAULT 'paid',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_orders_patient ON public.pharmacy_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_orders_code ON public.pharmacy_orders(order_code);

ALTER TABLE public.pharmacy_orders ENABLE ROW LEVEL SECURITY;

-- Patients view own pharmacy orders
CREATE POLICY "Patients view own pharmacy orders"
ON public.pharmacy_orders FOR SELECT
TO authenticated
USING (
    auth.uid() = patient_id 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('pharmacist', 'delivery_partner', 'health_professional'))
);

CREATE POLICY "Patients create pharmacy orders"
ON public.pharmacy_orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Roles update orders"
ON public.pharmacy_orders FOR UPDATE
TO authenticated
USING (
    auth.uid() = patient_id 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('pharmacist', 'delivery_partner', 'health_professional'))
)
WITH CHECK (
    auth.uid() = patient_id 
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('pharmacist', 'delivery_partner', 'health_professional'))
);

-- ------------------------------------------------------------------------------
-- 19. PAYMENT TRANSACTIONS TABLE (Payment & Transaction System)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_code TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL CHECK (service_type IN ('consultation', 'medicine_order', 'lab_test', 'subscription')),
    reference_id TEXT,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('upi', 'card', 'netbanking', 'wallet', 'cod')),
    payment_gateway_ref TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'pending', 'failed', 'refunded')) DEFAULT 'success',
    receipt_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_code ON public.payment_transactions(transaction_code);

ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own transactions"
ON public.payment_transactions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users create transactions"
ON public.payment_transactions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 20. USER NOTIFICATIONS TABLE (Notification & Tracking System)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('assessment', 'consultation', 'order', 'payment', 'prescription', 'record', 'system')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.user_notifications(user_id, is_read);

ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications"
ON public.user_notifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
ON public.user_notifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own notifications"
ON public.user_notifications FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
ON public.user_notifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 21. MEDICAL RECORDS TABLE (Records System)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    record_type TEXT NOT NULL CHECK (record_type IN ('assessment_report', 'prescription', 'lab_report', 'consultation_summary', 'vaccination', 'discharge_summary', 'uploaded_document')),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    document_url TEXT,
    file_size TEXT,
    file_type TEXT,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    doctor_or_facility TEXT,
    notes TEXT,
    is_confidential BOOLEAN NOT NULL DEFAULT false,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    linked_entity_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_records_patient ON public.medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_records_type ON public.medical_records(record_type);

ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own medical records"
ON public.medical_records FOR SELECT
TO authenticated
USING (auth.uid() = patient_id);

CREATE POLICY "Patients manage own medical records"
ON public.medical_records FOR ALL
TO authenticated
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Verified clinicians view non-confidential records"
ON public.medical_records FOR SELECT
TO authenticated
USING (
    is_confidential = false AND EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'health_professional' AND is_verified = true
    )
);

-- ------------------------------------------------------------------------------
-- 22. CARE FOLLOW-UPS TABLE (Follow-up Module in Records System)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.care_follow_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    consultation_id UUID REFERENCES public.consultation_appointments(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    due_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'missed', 'cancelled')) DEFAULT 'pending',
    follow_up_type TEXT NOT NULL CHECK (follow_up_type IN ('doctor_review', 'symptom_recheck', 'medication_refill', 'lab_test')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_follow_ups_patient ON public.care_follow_ups(patient_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_due ON public.care_follow_ups(due_date);

ALTER TABLE public.care_follow_ups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients manage own follow-ups"
ON public.care_follow_ups FOR ALL
TO authenticated
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors manage assigned follow-ups"
ON public.care_follow_ups FOR ALL
TO authenticated
USING (auth.uid() = professional_id)
WITH CHECK (auth.uid() = professional_id);

-- ------------------------------------------------------------------------------
-- Triggers for Orders, Transactions, Records & Follow-ups
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS set_orders_updated_at ON public.pharmacy_orders;
CREATE TRIGGER set_orders_updated_at BEFORE UPDATE ON public.pharmacy_orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_transactions_updated_at ON public.payment_transactions;
CREATE TRIGGER set_transactions_updated_at BEFORE UPDATE ON public.payment_transactions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_records_updated_at ON public.medical_records;
CREATE TRIGGER set_records_updated_at BEFORE UPDATE ON public.medical_records FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_follow_ups_updated_at ON public.care_follow_ups;
CREATE TRIGGER set_follow_ups_updated_at BEFORE UPDATE ON public.care_follow_ups FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 23. AUTOMATIC PROFILE & SETTINGS CREATION TRIGGER ON auth.users
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name, role, is_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient'::user_role),
    CASE WHEN (NEW.raw_user_meta_data->>'role') = 'patient' THEN true ELSE false END
  )
  ON CONFLICT (id) DO NOTHING;

  -- Automatically initialize default user settings
  INSERT INTO public.user_settings (
    user_id,
    sms_notifications,
    email_notifications,
    whatsapp_notifications,
    theme,
    font_scaling,
    language,
    two_factor_enabled
  )
  VALUES (
    NEW.id,
    true,
    true,
    false,
    'dark',
    'normal',
    'English',
    false
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Automatically initialize mandatory default consents
  INSERT INTO public.user_consents (user_id, category, granted, version)
  VALUES
    (NEW.id, 'data_processing', true, '1.0'),
    (NEW.id, 'telehealth_consultation', true, '1.0'),
    (NEW.id, 'pharmacy_sharing', true, '1.0')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 24. SEED DATA FOR MEDICATIONS
-- ------------------------------------------------------------------------------
INSERT INTO public.medications (name, generic_name, brand_name, category, dosage_form, strength, pack_size, price, prescription_required, usage_instructions, safety_warnings, side_effects, in_stock, manufacturer)
VALUES
  ('Dolo 650 (Paracetamol)', 'Paracetamol 650mg', 'Micro Labs', 'fever_pain', 'Tablet', '650 mg', 'Strip of 15 tablets', 32.50, false, 'Take 1 tablet every 6-8 hours after food as needed for fever or mild pain. Maximum 4 tablets in 24 hours.', 'Do not exceed maximum daily limit of 4000mg. Avoid alcohol consumption while on paracetamol.', ARRAY['Mild nausea', 'Rash (rare)', 'Sweating'], true, 'Micro Labs Ltd'),
  ('Combiflam', 'Ibuprofen 400mg + Paracetamol 325mg', 'Sanofi India', 'fever_pain', 'Tablet', '400mg / 325mg', 'Strip of 20 tablets', 48.00, false, 'Take 1 tablet twice daily with food or milk to prevent gastric irritation.', 'Not recommended for patients with peptic ulcer disease or severe renal impairment.', ARRAY['Heartburn', 'Stomach upset', 'Dizziness'], true, 'Sanofi Consumer Healthcare'),
  ('Ultracet', 'Tramadol Hydrochloride 37.5mg + Paracetamol 325mg', 'Johnson & Johnson', 'fever_pain', 'Tablet', '37.5mg / 325mg', 'Strip of 10 tablets', 195.00, true, 'Take 1 tablet every 8 hours as prescribed by physician for moderate to severe acute pain.', 'Schedule H prescription drug. Can cause drowsiness and physical dependence.', ARRAY['Drowsiness', 'Constipation', 'Nausea', 'Headache'], true, 'Janssen Pharmaceuticals'),
  ('Cetzine 10', 'Cetirizine Hydrochloride 10mg', 'Dr. Reddy''s', 'cold_cough', 'Tablet', '10 mg', 'Strip of 10 tablets', 42.00, false, 'Take 1 tablet once daily at bedtime for relief from allergic rhinitis and runny nose.', 'May cause mild drowsiness. Avoid driving or operating heavy machinery.', ARRAY['Dry mouth', 'Mild somnolence', 'Fatigue'], true, 'Dr. Reddy''s Laboratories'),
  ('Ascoril-D Plus Syrup', 'Dextromethorphan + Phenylephrine + Chlorpheniramine', 'Glenmark', 'cold_cough', 'Syrup', '100 ml bottle', '100 ml bottle', 135.00, false, 'Take 10ml (2 teaspoons) three times daily for dry, irritating cough.', 'Not suitable for productive cough with excessive phlegm.', ARRAY['Mild dizziness', 'Nausea', 'Restlessness'], true, 'Glenmark Pharmaceuticals'),
  ('Augmentin 625 Duo', 'Amoxicillin 500mg + Potassium Clavulanate 125mg', 'GSK', 'antibiotics', 'Tablet', '625 mg', 'Strip of 10 tablets', 223.50, true, 'Take 1 tablet twice daily with meals for complete prescribed duration (usually 5 to 7 days).', 'Schedule H1 prescription medicine. Complete full prescribed course to prevent antimicrobial resistance.', ARRAY['Diarrhea', 'Mild nausea', 'Vomiting'], true, 'GlaxoSmithKline Pharmaceuticals'),
  ('Pan 40', 'Pantoprazole Sodium 40mg', 'Alkem', 'digestion', 'Tablet', '40 mg', 'Strip of 15 tablets', 155.00, false, 'Take 1 tablet once daily in the morning, 30-45 minutes before breakfast.', 'Long-term continuous use without doctor consultation may reduce vitamin B12 absorption.', ARRAY['Headache', 'Flatulence', 'Abdominal pain'], true, 'Alkem Laboratories'),
  ('Gelusil MPS Liquid', 'Aluminium Hydroxide + Magnesium Hydroxide + Simethicone', 'Pfizer India', 'digestion', 'Syrup', '200 ml bottle', '200 ml bottle', 142.00, false, 'Take 10-20ml (2-4 teaspoons) after meals and at bedtime for acidity and heartburn.', 'Maintain a 2-hour interval between antacids and other prescription medications.', ARRAY['Chalky taste', 'Mild laxative effect'], true, 'Pfizer Consumer Healthcare')
ON CONFLICT DO NOTHING;
