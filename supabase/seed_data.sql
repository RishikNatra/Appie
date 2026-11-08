-- ==============================================================================
-- APPIE HEALTHCARE PLATFORM - COMPREHENSIVE SEED DATA & TRIGGER REPAIR SCRIPT
-- ==============================================================================
-- Run this script directly in the Supabase SQL Editor.
-- It performs the following:
--   1. Enables required extensions ('uuid-ossp', 'pgcrypto').
--   2. Repairs the 'handle_new_user()' trigger function to eliminate registration errors.
--   3. Seeds 6 working logins in 'auth.users' & 'auth.identities' (Password: Password123!).
--   4. Populates matching profiles for Patient, 3 Doctors, Pharmacist & Delivery Partner.
--   5. Seeds 20 comprehensive healthcare medications in 'public.medications'.
--   6. Populates 20 cart items in 'public.medication_cart_items' for the dummy patient.
--   7. Seeds 1 complete example for EVERY remaining table in the Appie database.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. REPAIR AUTOMATIC PROFILE & CONSENT TRIGGER (Fixes "Database error saving new user")
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  clean_username TEXT;
BEGIN
  -- Generate a clean fallback username that satisfies username_format_check ^[a-zA-Z0-9_]+$ and length 3-30
  clean_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    regexp_replace(split_part(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '_', 'g')
  );
  IF char_length(clean_username) < 3 THEN
    clean_username := clean_username || '_user';
  END IF;
  clean_username := substring(clean_username from 1 for 30);

  INSERT INTO public.profiles (
    id, 
    email, 
    username, 
    full_name, 
    first_name,
    last_name,
    phone,
    date_of_birth,
    gender,
    address_line1,
    city,
    state,
    pincode,
    role, 
    is_verified,
    two_factor_enabled
  )
  VALUES (
    NEW.id,
    NEW.email,
    clean_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    CASE 
      WHEN NEW.raw_user_meta_data->>'date_of_birth' IS NOT NULL AND NEW.raw_user_meta_data->>'date_of_birth' != '' 
      THEN (NEW.raw_user_meta_data->>'date_of_birth')::date 
      ELSE NULL 
    END,
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'address_line1',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'state',
    NEW.raw_user_meta_data->>'pincode',
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'patient'::user_role),
    CASE WHEN (NEW.raw_user_meta_data->>'role') = 'patient' THEN true ELSE false END,
    CASE WHEN (NEW.raw_user_meta_data->>'role') = 'health_professional' THEN true ELSE false END
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
    updated_at = timezone('utc'::text, now());

  -- Automatically initialize default user settings (without non-existent columns)
  INSERT INTO public.user_settings (
    user_id,
    sms_notifications,
    email_notifications,
    whatsapp_notifications,
    theme,
    font_scaling,
    language
  )
  VALUES (
    NEW.id,
    true,
    true,
    false,
    'dark',
    'normal',
    'en'
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Automatically initialize mandatory default consents with correct column 'is_granted'
  INSERT INTO public.user_consents (user_id, category, is_granted, version)
  VALUES
    (NEW.id, 'data_processing', true, '1.0'),
    (NEW.id, 'telehealth_consultation', true, '1.0'),
    (NEW.id, 'pharmacy_sharing', true, '1.0')
  ON CONFLICT (user_id, category) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-attach trigger safely
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================================
-- 3. SEED AUTHENTICATED USERS & IDENTITIES IN auth.users
-- ==============================================================================
-- Password for all accounts: Password123!
-- Deterministic IDs:
--   Patient:           a1111111-1111-1111-1111-111111111111
--   Doctor 1:          b2222222-2222-2222-2222-222222222222 (Dr. Ananya Sharma)
--   Doctor 2:          b3333333-3333-3333-3333-333333333333 (Dr. Rajesh Patel)
--   Doctor 3:          b4444444-4444-4444-4444-444444444444 (Dr. Priya Nair)
--   Pharmacist:        c5555555-5555-5555-5555-555555555555 (Vikrant Joshi)
--   Delivery Partner:  d6666666-6666-6666-6666-666666666666 (Arun Kumar)

INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
)
VALUES
(
    '00000000-0000-0000-0000-000000000000',
    'a1111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'patient@appie.health',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"patient","username":"demo_patient","full_name":"Rahul Verma","first_name":"Rahul","last_name":"Verma"}'::jsonb,
    now(), now(), '', '', '', ''
),
(
    '00000000-0000-0000-0000-000000000000',
    'b2222222-2222-2222-2222-222222222222',
    'authenticated',
    'authenticated',
    'doctor@appie.health',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"health_professional","username":"dr_sharma","full_name":"Dr. Ananya Sharma","prefix":"Dr."}'::jsonb,
    now(), now(), '', '', '', ''
),
(
    '00000000-0000-0000-0000-000000000000',
    'b3333333-3333-3333-3333-333333333333',
    'authenticated',
    'authenticated',
    'dr.rajesh@appie.health',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"health_professional","username":"dr_rajesh_patel","full_name":"Dr. Rajesh Patel","prefix":"Dr."}'::jsonb,
    now(), now(), '', '', '', ''
),
(
    '00000000-0000-0000-0000-000000000000',
    'b4444444-4444-4444-4444-444444444444',
    'authenticated',
    'authenticated',
    'dr.priya@appie.health',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"health_professional","username":"dr_priya_nair","full_name":"Dr. Priya Nair","prefix":"Dr."}'::jsonb,
    now(), now(), '', '', '', ''
),
(
    '00000000-0000-0000-0000-000000000000',
    'c5555555-5555-5555-5555-555555555555',
    'authenticated',
    'authenticated',
    'pharmacist@appie.health',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"pharmacist","username":"medplus_pharma","full_name":"Vikrant Joshi (MedPlus Pharmacy)"}'::jsonb,
    now(), now(), '', '', '', ''
),
(
    '00000000-0000-0000-0000-000000000000',
    'd6666666-6666-6666-6666-666666666666',
    'authenticated',
    'authenticated',
    'delivery@appie.health',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"role":"delivery_partner","username":"swift_delivery","full_name":"Arun Kumar"}'::jsonb,
    now(), now(), '', '', '', ''
)
ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data,
    email_confirmed_at = now();

-- Ensure matching auth identities exist for Supabase password signin
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
)
VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    format('{"sub":"%s","email":"%s"}', 'a1111111-1111-1111-1111-111111111111', 'patient@appie.health')::jsonb,
    'email',
    'patient@appie.health',
    now(), now(), now()
),
(
    'b2222222-2222-2222-2222-222222222222',
    'b2222222-2222-2222-2222-222222222222',
    format('{"sub":"%s","email":"%s"}', 'b2222222-2222-2222-2222-222222222222', 'doctor@appie.health')::jsonb,
    'email',
    'doctor@appie.health',
    now(), now(), now()
),
(
    'b3333333-3333-3333-3333-333333333333',
    'b3333333-3333-3333-3333-333333333333',
    format('{"sub":"%s","email":"%s"}', 'b3333333-3333-3333-3333-333333333333', 'dr.rajesh@appie.health')::jsonb,
    'email',
    'dr.rajesh@appie.health',
    now(), now(), now()
),
(
    'b4444444-4444-4444-4444-444444444444',
    'b4444444-4444-4444-4444-444444444444',
    format('{"sub":"%s","email":"%s"}', 'b4444444-4444-4444-4444-444444444444', 'dr.priya@appie.health')::jsonb,
    'email',
    'dr.priya@appie.health',
    now(), now(), now()
),
(
    'c5555555-5555-5555-5555-555555555555',
    'c5555555-5555-5555-5555-555555555555',
    format('{"sub":"%s","email":"%s"}', 'c5555555-5555-5555-5555-555555555555', 'pharmacist@appie.health')::jsonb,
    'email',
    'pharmacist@appie.health',
    now(), now(), now()
),
(
    'd6666666-6666-6666-6666-666666666666',
    'd6666666-6666-6666-6666-666666666666',
    format('{"sub":"%s","email":"%s"}', 'd6666666-6666-6666-6666-666666666666', 'delivery@appie.health')::jsonb,
    'email',
    'delivery@appie.health',
    now(), now(), now()
)
ON CONFLICT (provider, provider_id) DO NOTHING;


-- ==============================================================================
-- 4. SEED PUBLIC PROFILES
-- ==============================================================================
INSERT INTO public.profiles (
    id, role, email, username, full_name, first_name, last_name, phone, date_of_birth, gender,
    address_line1, address_line2, city, state, pincode,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
    is_verified, two_factor_enabled
)
VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'patient',
    'patient@appie.health',
    'demo_patient',
    'Rahul Verma',
    'Rahul',
    'Verma',
    '+91 98220 12345',
    '1992-05-14',
    'male',
    'Flat 402, Green Glen Layout',
    'Bellandur Outer Ring Road',
    'Bengaluru',
    'Karnataka',
    '560103',
    'Pooja Verma',
    '+91 98220 12346',
    'Spouse',
    true,
    false
),
(
    'b2222222-2222-2222-2222-222222222222',
    'health_professional',
    'doctor@appie.health',
    'dr_sharma',
    'Dr. Ananya Sharma',
    'Ananya',
    'Sharma',
    '+91 98450 11223',
    '1987-04-20',
    'female',
    'Apollo Medical Enclave, Suite 3B',
    'Koramangala 4th Block',
    'Bengaluru',
    'Karnataka',
    '560034',
    'Dr. K. Sharma',
    '+91 98450 11224',
    'Spouse',
    true,
    true
),
(
    'b3333333-3333-3333-3333-333333333333',
    'health_professional',
    'dr.rajesh@appie.health',
    'dr_rajesh_patel',
    'Dr. Rajesh Patel',
    'Rajesh',
    'Patel',
    '+91 98450 33445',
    '1981-09-12',
    'male',
    'Manipal Hospital, HAL Old Airport Road',
    'Kodihalli',
    'Bengaluru',
    'Karnataka',
    '560017',
    'Meera Patel',
    '+91 98450 33446',
    'Spouse',
    true,
    true
),
(
    'b4444444-4444-4444-4444-444444444444',
    'health_professional',
    'dr.priya@appie.health',
    'dr_priya_nair',
    'Dr. Priya Nair',
    'Priya',
    'Nair',
    '+91 98450 55667',
    '1990-11-28',
    'female',
    'Fortis Hospital, Bannerghatta Road',
    'Opposite IIMB',
    'Bengaluru',
    'Karnataka',
    '560076',
    'Suresh Nair',
    '+91 98450 55668',
    'Brother',
    true,
    true
),
(
    'c5555555-5555-5555-5555-555555555555',
    'pharmacist',
    'pharmacist@appie.health',
    'medplus_pharma',
    'Vikrant Joshi (MedPlus Pharmacy)',
    'Vikrant',
    'Joshi',
    '+91 98450 77112',
    '1985-11-12',
    'male',
    'MedPlus Pharmacy, Ground Floor, #12 CMH Road',
    'Indiranagar',
    'Bengaluru',
    'Karnataka',
    '560038',
    NULL, NULL, NULL,
    true,
    true
),
(
    'd6666666-6666-6666-6666-666666666666',
    'delivery_partner',
    'delivery@appie.health',
    'swift_delivery',
    'Arun Kumar',
    'Arun',
    'Kumar',
    '+91 97410 99882',
    '1996-03-24',
    'male',
    'BTM 2nd Stage, Outer Ring Road',
    'Near Udupi Garden',
    'Bengaluru',
    'Karnataka',
    '560076',
    NULL, NULL, NULL,
    true,
    true
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    is_verified = true,
    updated_at = now();


-- ==============================================================================
-- 5. SEED THREE DOCTOR PROFILES (health_professional_profiles)
-- ==============================================================================
INSERT INTO public.health_professional_profiles (
    user_id,
    prefix,
    medical_license_number,
    medical_council_name,
    specialization,
    qualifications,
    years_of_experience,
    clinic_address,
    verification_status,
    verification_notes,
    verified_at
)
VALUES
(
    'b2222222-2222-2222-2222-222222222222',
    'Dr.',
    'KMC-2015-84912',
    'Karnataka Medical Council / National Medical Commission',
    'General Medicine & Diabetology',
    'MBBS, MD (General Medicine), Fellowship in Diabetology',
    9,
    'Apollo Medical Enclave, Koramangala 4th Block, Bengaluru',
    'verified',
    'NMC registration verified. Primary telehealth consultant for acute symptoms & routine care.',
    now()
),
(
    'b3333333-3333-3333-3333-333333333333',
    'Dr.',
    'MMC-2012-45210',
    'Maharashtra Medical Council / National Medical Commission',
    'Family Medicine & Chronic Care',
    'MBBS, DNB (Family Medicine), MRCGP (Intl)',
    12,
    'Manipal Hospital Outpatient Care, HAL Old Airport Road, Bengaluru',
    'verified',
    'Medical council active status confirmed. Senior consultant in preventive medicine.',
    now()
),
(
    'b4444444-4444-4444-4444-444444444444',
    'Dr.',
    'TCMC-2018-91244',
    'Travancore-Cochin Medical Council / NMC',
    'Pediatrics & Child Wellness',
    'MBBS, MD (Pediatrics), DCH',
    6,
    'Fortis Healthcare, Bannerghatta Road, Bengaluru',
    'verified',
    'Pediatric specialty verified. Consultant for adolescent and child routine infections.',
    now()
)
ON CONFLICT (user_id) DO UPDATE SET
    verification_status = 'verified',
    specialization = EXCLUDED.specialization,
    qualifications = EXCLUDED.qualifications,
    years_of_experience = EXCLUDED.years_of_experience,
    updated_at = now();


-- ==============================================================================
-- 6. SEED PHARMACY PROFILE (pharmacy_profiles)
-- ==============================================================================
INSERT INTO public.pharmacy_profiles (
    user_id,
    pharmacy_name,
    pharmacist_name,
    pharmacy_type,
    gst_number,
    drug_license_number,
    pharmacy_council_reg_no,
    pharmacy_address,
    city,
    state,
    pincode,
    phone,
    verification_status,
    verification_notes,
    verified_at
)
VALUES (
    'c5555555-5555-5555-5555-555555555555',
    'MedPlus Pharmacy & Wellness',
    'Vikrant Joshi',
    'retail',
    '29AABCM1234F1Z5',
    '20B/KA-BNG-12891 / 21B/KA-BNG-12892',
    'KSPC/19842',
    '#12, Ground Floor, CMH Road, Indiranagar',
    'Bengaluru',
    'Karnataka',
    '560038',
    '+91 98450 77112',
    'verified',
    'Licensed retail dispensing pharmacy under Drugs & Cosmetics Rules 1945.',
    now()
)
ON CONFLICT (user_id) DO UPDATE SET
    verification_status = 'verified',
    updated_at = now();


-- ==============================================================================
-- 7. SEED DELIVERY PARTNER PROFILE (delivery_partner_profiles)
-- ==============================================================================
INSERT INTO public.delivery_partner_profiles (
    user_id,
    full_name,
    phone,
    date_of_birth,
    gender,
    vehicle_type,
    vehicle_registration_number,
    driving_license_number,
    city,
    operating_zone,
    verification_status,
    verification_notes,
    verified_at
)
VALUES (
    'd6666666-6666-6666-6666-666666666666',
    'Arun Kumar',
    '+91 97410 99882',
    '1996-03-24',
    'male',
    'motorcycle',
    'KA-01-EQ-9842',
    'KA-0120170049281',
    'Bengaluru',
    'Indiranagar & Koramangala Hubs',
    'verified',
    'Transport DL & Vehicle RC verified for temperature-controlled pharma dispatch.',
    now()
)
ON CONFLICT (user_id) DO UPDATE SET
    verification_status = 'verified',
    updated_at = now();


-- ==============================================================================
-- 8. SEED 20 MEDICATIONS (public.medications)
-- ==============================================================================
-- Deterministic IDs: e0000000-0000-0000-0000-000000000001 through 000000000020
INSERT INTO public.medications (
    id, name, generic_name, brand_name, category, dosage_form, strength, pack_size, price,
    prescription_required, usage_instructions, safety_warnings, side_effects, in_stock, manufacturer
)
VALUES
(
    'e0000000-0000-0000-0000-000000000001',
    'Dolo 650 (Paracetamol)',
    'Paracetamol 650mg',
    'Micro Labs',
    'fever_pain',
    'Tablet',
    '650 mg',
    'Strip of 15 tablets',
    32.50,
    false,
    'Take 1 tablet every 6-8 hours after food as needed for fever or mild pain. Maximum 4 tablets in 24 hours.',
    'Do not exceed maximum daily limit of 4000mg. Avoid alcohol consumption while on paracetamol.',
    ARRAY['Mild nausea', 'Rash (rare)', 'Sweating'],
    true,
    'Micro Labs Ltd'
),
(
    'e0000000-0000-0000-0000-000000000002',
    'Combiflam',
    'Ibuprofen 400mg + Paracetamol 325mg',
    'Sanofi India',
    'fever_pain',
    'Tablet',
    '400mg / 325mg',
    'Strip of 20 tablets',
    48.00,
    false,
    'Take 1 tablet twice daily with food or milk to prevent gastric irritation.',
    'Not recommended for patients with peptic ulcer disease or severe renal impairment.',
    ARRAY['Heartburn', 'Stomach upset', 'Dizziness'],
    true,
    'Sanofi Consumer Healthcare'
),
(
    'e0000000-0000-0000-0000-000000000003',
    'Ultracet',
    'Tramadol Hydrochloride 37.5mg + Paracetamol 325mg',
    'Johnson & Johnson',
    'fever_pain',
    'Tablet',
    '37.5mg / 325mg',
    'Strip of 10 tablets',
    195.00,
    true,
    'Take 1 tablet every 8 hours as prescribed by physician for moderate to severe acute pain.',
    'Schedule H prescription drug. Can cause drowsiness and physical dependence.',
    ARRAY['Drowsiness', 'Constipation', 'Nausea', 'Headache'],
    true,
    'Janssen Pharmaceuticals'
),
(
    'e0000000-0000-0000-0000-000000000004',
    'Cetzine 10',
    'Cetirizine Hydrochloride 10mg',
    'Dr. Reddy''s',
    'cold_cough',
    'Tablet',
    '10 mg',
    'Strip of 10 tablets',
    42.00,
    false,
    'Take 1 tablet once daily at bedtime for relief from allergic rhinitis and runny nose.',
    'May cause mild drowsiness. Avoid driving or operating heavy machinery.',
    ARRAY['Dry mouth', 'Mild somnolence', 'Fatigue'],
    true,
    'Dr. Reddy''s Laboratories'
),
(
    'e0000000-0000-0000-0000-000000000005',
    'Ascoril-D Plus Syrup',
    'Dextromethorphan + Phenylephrine + Chlorpheniramine',
    'Glenmark',
    'cold_cough',
    'Syrup',
    '100 ml bottle',
    '100 ml bottle',
    135.00,
    false,
    'Take 10ml (2 teaspoons) three times daily for dry, irritating cough.',
    'Not suitable for productive cough with excessive phlegm.',
    ARRAY['Mild dizziness', 'Nausea', 'Restlessness'],
    true,
    'Glenmark Pharmaceuticals'
),
(
    'e0000000-0000-0000-0000-000000000006',
    'Augmentin 625 Duo',
    'Amoxicillin 500mg + Potassium Clavulanate 125mg',
    'GSK',
    'antibiotics',
    'Tablet',
    '625 mg',
    'Strip of 10 tablets',
    223.50,
    true,
    'Take 1 tablet twice daily with meals for complete prescribed duration (usually 5 to 7 days).',
    'Schedule H1 prescription medicine. Complete full prescribed course to prevent antimicrobial resistance.',
    ARRAY['Diarrhea', 'Mild nausea', 'Vomiting'],
    true,
    'GlaxoSmithKline Pharmaceuticals'
),
(
    'e0000000-0000-0000-0000-000000000007',
    'Pan 40',
    'Pantoprazole Sodium 40mg',
    'Alkem',
    'digestion',
    'Tablet',
    '40 mg',
    'Strip of 15 tablets',
    155.00,
    false,
    'Take 1 tablet once daily in the morning, 30-45 minutes before breakfast.',
    'Long-term continuous use without doctor consultation may reduce vitamin B12 absorption.',
    ARRAY['Headache', 'Flatulence', 'Abdominal pain'],
    true,
    'Alkem Laboratories'
),
(
    'e0000000-0000-0000-0000-000000000008',
    'Gelusil MPS Liquid',
    'Aluminium Hydroxide + Magnesium Hydroxide + Simethicone',
    'Pfizer India',
    'digestion',
    'Syrup',
    '200 ml bottle',
    '200 ml bottle',
    142.00,
    false,
    'Take 10-20ml (2-4 teaspoons) after meals and at bedtime for acidity and heartburn.',
    'Maintain a 2-hour interval between antacids and other prescription medications.',
    ARRAY['Chalky taste', 'Mild laxative effect'],
    true,
    'Pfizer Consumer Healthcare'
),
(
    'e0000000-0000-0000-0000-000000000009',
    'Azithral 500',
    'Azithromycin 500mg',
    'Alembic',
    'antibiotics',
    'Tablet',
    '500 mg',
    'Strip of 5 tablets',
    119.50,
    true,
    'Take 1 tablet once daily 1 hour before or 2 hours after meals for 3 to 5 days as prescribed.',
    'Schedule H1 antibiotic. Do not stop midway even if symptoms resolve.',
    ARRAY['Abdominal cramps', 'Diarrhea', 'Nausea'],
    true,
    'Alembic Pharmaceuticals'
),
(
    'e0000000-0000-0000-0000-000000000010',
    'Allegra 120',
    'Fexofenadine Hydrochloride 120mg',
    'Sanofi',
    'cold_cough',
    'Tablet',
    '120 mg',
    'Strip of 10 tablets',
    215.00,
    false,
    'Take 1 tablet once daily with water. Non-sedating antihistamine for allergies.',
    'Avoid drinking fruit juices (apple, orange, grapefruit) within 4 hours of dosage.',
    ARRAY['Headache', 'Drowsiness (rare)', 'Nausea'],
    true,
    'Sanofi India'
),
(
    'e0000000-0000-0000-0000-000000000011',
    'Telma 40',
    'Telmisartan 40mg',
    'Glenmark',
    'chronic_care',
    'Tablet',
    '40 mg',
    'Strip of 30 tablets',
    240.00,
    true,
    'Take 1 tablet once daily at the same time each day for essential hypertension.',
    'Monitor blood pressure regularly. Do not take during pregnancy.',
    ARRAY['Dizziness', 'Back pain', 'Sinus infection'],
    true,
    'Glenmark Pharmaceuticals'
),
(
    'e0000000-0000-0000-0000-000000000012',
    'Glycomet-GP 1',
    'Metformin 500mg + Glimepiride 1mg',
    'USV',
    'chronic_care',
    'Tablet',
    '500mg / 1mg',
    'Strip of 15 tablets',
    98.00,
    true,
    'Take 1 tablet once daily immediately before breakfast or main meal.',
    'Watch for signs of hypoglycemia (shakiness, sweat, palpitations).',
    ARRAY['Hypoglycemia', 'Metallic taste', 'Nausea'],
    true,
    'USV Private Limited'
),
(
    'e0000000-0000-0000-0000-000000000013',
    'Neurobion Forte',
    'Vitamin B-Complex + Vitamin B12',
    'Procter & Gamble',
    'vitamins',
    'Tablet',
    'Standard Complex',
    'Strip of 30 tablets',
    42.50,
    false,
    'Take 1 tablet daily after lunch for nerve health and dietary supplementation.',
    'Harmless yellow discoloration of urine may occur due to riboflavin.',
    ARRAY['Mild gastric upset'],
    true,
    'P&G Health Ltd'
),
(
    'e0000000-0000-0000-0000-000000000014',
    'Shelcal 500',
    'Calcium 500mg + Vitamin D3 250 IU',
    'Torrent Pharma',
    'vitamins',
    'Tablet',
    '500 mg',
    'Strip of 15 tablets',
    131.00,
    false,
    'Take 1 tablet daily after food with a full glass of water for bone density support.',
    'Contraindicated in patients with hypercalcemia or severe kidney stones.',
    ARRAY['Constipation', 'Flatulence'],
    true,
    'Torrent Pharmaceuticals'
),
(
    'e0000000-0000-0000-0000-000000000015',
    'Becosules Capsules',
    'Vitamin B-Complex with Vitamin C',
    'Pfizer',
    'vitamins',
    'Capsule',
    'High Potency',
    'Strip of 20 capsules',
    52.00,
    false,
    'Take 1 capsule daily after a meal for canker sores, fatigue, and immunity.',
    'Do not crush or chew capsules; swallow whole with water.',
    ARRAY['Mild stomach upset'],
    true,
    'Pfizer India'
),
(
    'e0000000-0000-0000-0000-000000000016',
    'Otrivin Oxy Fast Relief',
    'Oxymetazoline Hydrochloride 0.05%',
    'GSK Consumer',
    'cold_cough',
    'Nasal Spray',
    '0.05%',
    '10 ml spray bottle',
    115.00,
    false,
    'Administer 1-2 sprays into each nostril up to twice daily for blocked nose.',
    'Do not use continuously for more than 7 consecutive days (rebound congestion risk).',
    ARRAY['Local nasal burning', 'Dryness', 'Sneezing'],
    true,
    'Haleon / GlaxoSmithKline'
),
(
    'e0000000-0000-0000-0000-000000000017',
    'Volini Pain Relief Gel',
    'Diclofenac Diethylamine + Linseed Oil + Menthol',
    'Sun Pharma',
    'fever_pain',
    'Gel',
    'Topical Gel',
    '50 g tube',
    155.00,
    false,
    'Apply 3-4 times daily with gentle massage on the affected muscular/joint area.',
    'For external use only. Do not apply on open cuts, wounds, or eyes.',
    ARRAY['Skin redness', 'Mild burning sensation'],
    true,
    'Sun Pharmaceutical Industries'
),
(
    'e0000000-0000-0000-0000-000000000018',
    'Digene Gel Orange',
    'Magnesium Hydroxide + Simethicone + Sodium Carboxymethylcellulose',
    'Abbott',
    'digestion',
    'Syrup',
    'Antacid Gel',
    '200 ml bottle',
    145.00,
    false,
    'Shake well before use. Take 2 teaspoons (10ml) after meals for quick relief from acidity.',
    'Sugar-free formulation suitable for diabetic patients.',
    ARRAY['Mild laxative effect', 'Chalky taste'],
    true,
    'Abbott India Ltd'
),
(
    'e0000000-0000-0000-0000-000000000019',
    'Sinarest Tablet',
    'Paracetamol + Phenylephrine + Chlorpheniramine Maleate',
    'Centaur',
    'cold_cough',
    'Tablet',
    'Composite formula',
    'Strip of 10 tablets',
    72.00,
    false,
    'Take 1 tablet every 8 hours after food for relief from head cold, fever, and sinus congestion.',
    'Avoid concurrent consumption with other paracetamol products or sedatives.',
    ARRAY['Drowsiness', 'Dry mouth'],
    true,
    'Centaur Pharmaceuticals'
),
(
    'e0000000-0000-0000-0000-000000000020',
    'Montair-LC',
    'Montelukast 10mg + Levocetirizine 5mg',
    'Cipla',
    'cold_cough',
    'Tablet',
    '10mg / 5mg',
    'Strip of 10 tablets',
    188.00,
    true,
    'Take 1 tablet once daily in the evening for allergic asthma and chronic allergic rhinitis.',
    'Schedule H prescription medicine. May cause psychiatric changes (rare); monitor mood.',
    ARRAY['Drowsiness', 'Headache', 'Dry mouth'],
    true,
    'Cipla Limited'
)
ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    in_stock = true,
    updated_at = now();


-- ==============================================================================
-- 9. SEED 20 MEDICATION CART ITEMS FOR DUMMY PATIENT
-- ==============================================================================
-- Patient ID: a1111111-1111-1111-1111-111111111111
DELETE FROM public.medication_cart_items WHERE patient_id = 'a1111111-1111-1111-1111-111111111111';

INSERT INTO public.medication_cart_items (patient_id, medication_id, quantity)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000001', 2), -- Dolo 650
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000002', 1), -- Combiflam
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000003', 1), -- Ultracet
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000004', 2), -- Cetzine 10
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000005', 1), -- Ascoril-D
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000006', 1), -- Augmentin 625
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000007', 2), -- Pan 40
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000008', 1), -- Gelusil
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000009', 1), -- Azithral 500
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000010', 1), -- Allegra 120
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000011', 1), -- Telma 40
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000012', 1), -- Glycomet-GP 1
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000013', 3), -- Neurobion Forte
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000014', 2), -- Shelcal 500
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000015', 2), -- Becosules
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000016', 1), -- Otrivin
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000017', 1), -- Volini
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000018', 1), -- Digene Orange
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000019', 2), -- Sinarest
    ('a1111111-1111-1111-1111-111111111111', 'e0000000-0000-0000-0000-000000000020', 1); -- Montair-LC


-- ==============================================================================
-- 10. SEED EXAMPLES FOR ALL REMAINING TABLES
-- ==============================================================================

-- 10A. Health Profile (health_profiles)
INSERT INTO public.health_profiles (
    user_id, blood_group, height_cm, weight_kg, bmi, systolic_bp, diastolic_bp,
    is_diabetic, is_smoker, medical_conditions, allergies, current_medications, medical_history_notes
)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'O+',
    176.0,
    72.5,
    23.4,
    120,
    80,
    false,
    false,
    '["Seasonal Allergic Rhinitis", "Mild Migraine"]'::jsonb,
    '["Penicillin", "Dust Mites"]'::jsonb,
    '["Cetirizine 10mg (as needed)"]'::jsonb,
    'No prior surgeries. Childhood appendectomy in 2011. Regular exercise 3 days a week.'
)
ON CONFLICT (user_id) DO UPDATE SET
    blood_group = EXCLUDED.blood_group,
    updated_at = now();

-- 10B. User Consents (user_consents)
INSERT INTO public.user_consents (user_id, category, is_granted, version, granted_at)
VALUES
    ('a1111111-1111-1111-1111-111111111111', 'data_processing', true, '1.0', now() - INTERVAL '30 days'),
    ('a1111111-1111-1111-1111-111111111111', 'telehealth_consultation', true, '1.0', now() - INTERVAL '30 days'),
    ('a1111111-1111-1111-1111-111111111111', 'pharmacy_sharing', true, '1.0', now() - INTERVAL '30 days')
ON CONFLICT (user_id, category) DO NOTHING;

-- 10C. User Settings (user_settings)
INSERT INTO public.user_settings (user_id, sms_notifications, email_notifications, whatsapp_notifications, theme, font_scaling, language)
VALUES
    ('a1111111-1111-1111-1111-111111111111', true, true, false, 'dark', 'normal', 'en')
ON CONFLICT (user_id) DO NOTHING;

-- 10D. Verification Codes (verification_codes)
INSERT INTO public.verification_codes (identifier, code_hash, type, attempts, expires_at)
VALUES (
    'patient@appie.health',
    'e9b0487771217f0ec689a7f3dfbb7bc0463cc1d563d763acff1be473c52e6467',
    'registration',
    0,
    now() + INTERVAL '1 hour'
);

-- 10E. Health Assessments (health_assessments)
-- Assessment ID: f1111111-1111-1111-1111-111111111111
INSERT INTO public.health_assessments (
    id,
    patient_id,
    title,
    symptoms,
    assessment_summary,
    possible_conditions,
    urgency_level,
    confidence_score,
    recommendations,
    next_step_action,
    recommended_specialization,
    status,
    reviewed_by,
    review_notes
)
VALUES (
    'f1111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    'Acute Viral Pharyngitis & Mild Upper Respiratory Infection',
    '["Sore throat (moderate)", "Dry hacking cough", "Low-grade fever (100.2 F)", "Nasal congestion"]'::jsonb,
    'Clinical assessment indicates acute viral upper respiratory tract infection with secondary pharyngeal irritation. No red-flag signs of streptococcal pharyngitis (Centor score 2).',
    '[{"condition":"Viral Pharyngitis","likelihood":"High (88%)"},{"condition":"Allergic Rhinitis with Post-Nasal Drip","likelihood":"Moderate (65%)"},{"condition":"Bacterial Tonsillitis","likelihood":"Low (18%)"}]'::jsonb,
    'low',
    88,
    '["Warm saline gargles 3-4 times daily","Stay well hydrated with warm fluids","Take Paracetamol 650mg for fever or pain","Steam inhalation twice daily"]'::jsonb,
    'Schedule a video consultation with a General Physician if fever persists beyond 72 hours.',
    'General Medicine',
    'reviewed',
    'b2222222-2222-2222-2222-222222222222',
    'Assessment reviewed by Dr. Ananya Sharma. Symptomatic supportive management confirmed.'
)
ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 10F. Symptom Trackers (symptom_trackers)
INSERT INTO public.symptom_trackers (
    patient_id,
    assessment_id,
    symptom_name,
    severity,
    status,
    days_active,
    timeline
)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'f1111111-1111-1111-1111-111111111111',
    'Sore Throat & Pharyngeal Irritation',
    4,
    'improving',
    3,
    '[{"day":1,"severity":7,"note":"Severe scratchiness and painful swallowing."},{"day":2,"severity":5,"note":"Pain reduced after warm saline gargles."},{"day":3,"severity":4,"note":"Swallowing much easier, mild irritation remains."}]'::jsonb
);

-- 10G. Consultation Appointments (consultation_appointments)
-- Appointment ID: f2222222-2222-2222-2222-222222222222
INSERT INTO public.consultation_appointments (
    id,
    patient_id,
    professional_id,
    appointment_date,
    time_slot,
    type,
    status,
    reason,
    assessment_id,
    meeting_link,
    fee_amount,
    payment_status,
    notes
)
VALUES (
    'f2222222-2222-2222-2222-222222222222',
    'a1111111-1111-1111-1111-111111111111',
    'b2222222-2222-2222-2222-222222222222',
    CURRENT_DATE,
    '15:30 - 15:50',
    'video',
    'confirmed',
    'Persistent dry cough and sore throat for 3 days following viral infection.',
    'f1111111-1111-1111-1111-111111111111',
    'https://telehealth.appie.health/room/appie-consult-84912',
    499.00,
    'paid',
    'Patient has verified vitals logged. Temperature stable at 98.8 F.'
)
ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 10H. Consultation Summaries (consultation_summaries)
INSERT INTO public.consultation_summaries (
    appointment_id,
    professional_id,
    patient_id,
    clinical_diagnosis,
    doctor_notes,
    recommendations,
    follow_up_date,
    follow_up_instructions,
    status
)
VALUES (
    'f2222222-2222-2222-2222-222222222222',
    'b2222222-2222-2222-2222-222222222222',
    'a1111111-1111-1111-1111-111111111111',
    'Subacute Viral Rhinopharyngitis with resolving dry cough',
    'Patient examined over high-definition video. Pharynx shows mild erythematous flush without exudates or tonsillar swelling. Chest sounds clear bilaterally. Recommended oral antihistamine and paracetamol SOS.',
    ARRAY['Continue warm saltwater gargles twice daily','Avoid cold drinks and ice for 5 days','Maintain room humidity with steam inhalation'],
    CURRENT_DATE + INTERVAL '7 days',
    'Schedule check-in if cough worsens or fever spikes above 101 F.',
    'completed'
)
ON CONFLICT (appointment_id) DO UPDATE SET updated_at = now();

-- 10I. Consultation Reviews (consultation_reviews)
INSERT INTO public.consultation_reviews (
    appointment_id,
    patient_id,
    professional_id,
    rating,
    review_text,
    tags,
    is_anonymous
)
VALUES (
    'f2222222-2222-2222-2222-222222222222',
    'a1111111-1111-1111-1111-111111111111',
    'b2222222-2222-2222-2222-222222222222',
    5,
    'Dr. Ananya Sharma was extremely attentive and calm. She explained the viral cause clearly and did not overprescribe unnecessary antibiotics. Very reassuring experience on Appie!',
    ARRAY['Attentive Listener', 'Clear Advice', 'Quick Response', 'Accurate Assessment'],
    false
)
ON CONFLICT (appointment_id) DO NOTHING;

-- 10J. Prescriptions (prescriptions)
-- Prescription ID: f3333333-3333-3333-3333-333333333333
INSERT INTO public.prescriptions (
    id,
    prescription_code,
    appointment_id,
    patient_id,
    professional_id,
    diagnosis,
    medications,
    general_advice,
    digital_signature,
    valid_until,
    status,
    pharmacy_dispatch_status
)
VALUES (
    'f3333333-3333-3333-3333-333333333333',
    'RX-APPIE-2026-9041',
    'f2222222-2222-2222-2222-222222222222',
    'a1111111-1111-1111-1111-111111111111',
    'b2222222-2222-2222-2222-222222222222',
    'Subacute Viral Rhinopharyngitis with Dry Cough',
    '[
        {"name":"Dolo 650 (Paracetamol)","dosage":"1 tablet","frequency":"TDS (Three times daily)","duration":"3 days","timing":"After food SOS for fever/headache"},
        {"name":"Cetzine 10 (Cetirizine 10mg)","dosage":"1 tablet","frequency":"Once daily","duration":"5 days","timing":"At bedtime"},
        {"name":"Ascoril-D Plus Cough Syrup","dosage":"10 ml (2 tsp)","frequency":"TDS","duration":"5 days","timing":"After meals"}
    ]'::jsonb,
    'Rest adequately. Consume warm liquids (soup, herbal tea). Do not consume cold or refrigerated items.',
    'Digitally signed by Dr. Ananya Sharma, MD | KMC Reg: KMC-2015-84912 | SHA-256 Verified',
    CURRENT_DATE + INTERVAL '30 days',
    'active',
    'ordered'
)
ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 10K. Clinical Reviews (clinical_reviews)
INSERT INTO public.clinical_reviews (
    professional_id,
    patient_id,
    assessment_id,
    prescription_id,
    review_type,
    status,
    clinical_notes,
    prescribed_actions
)
VALUES (
    'b2222222-2222-2222-2222-222222222222',
    'a1111111-1111-1111-1111-111111111111',
    'f1111111-1111-1111-1111-111111111111',
    'f3333333-3333-3333-3333-333333333333',
    'assessment_review',
    'approved',
    'Algorithm recommendation endorsed. Symptomatic cold treatment prescribed without antibiotics.',
    ARRAY['Issued digital prescription RX-APPIE-2026-9041', 'Enabled direct doorstep pharmacy fulfillment']
);

-- 10L. Pharmacy Orders (pharmacy_orders)
-- Order ID: f4444444-4444-4444-4444-444444444444
INSERT INTO public.pharmacy_orders (
    id,
    order_code,
    patient_id,
    prescription_id,
    items,
    subtotal,
    delivery_fee,
    discount_amount,
    total_amount,
    delivery_address,
    order_status,
    tracking_timeline,
    courier_partner,
    tracking_number,
    estimated_delivery,
    payment_status,
    notes
)
VALUES (
    'f4444444-4444-4444-4444-444444444444',
    'ORD-APPIE-88214',
    'a1111111-1111-1111-1111-111111111111',
    'f3333333-3333-3333-3333-333333333333',
    '[
        {"medicationId":"e0000000-0000-0000-0000-000000000001","name":"Dolo 650 (Paracetamol)","price":32.50,"quantity":2,"packSize":"Strip of 15 tablets"},
        {"medicationId":"e0000000-0000-0000-0000-000000000004","name":"Cetzine 10","price":42.00,"quantity":1,"packSize":"Strip of 10 tablets"},
        {"medicationId":"e0000000-0000-0000-0000-000000000005","name":"Ascoril-D Plus Syrup","price":135.00,"quantity":1,"packSize":"100 ml bottle"}
    ]'::jsonb,
    242.00,
    0.00,
    50.00,
    192.00,
    '{"fullName":"Rahul Verma","phone":"+91 98220 12345","addressLine1":"Flat 402, Green Glen Layout, Bellandur","city":"Bengaluru","state":"Karnataka","pincode":"560103"}'::jsonb,
    'dispatched',
    '[
        {"stage":"Placed","title":"Order Received","description":"Order successfully verified against e-prescription RX-APPIE-2026-9041.","timestamp":"2026-11-09T08:00:00Z","completed":true},
        {"stage":"Pharmacist Verified","title":"Verified by MedPlus","description":"Registered Pharmacist Vikrant Joshi verified dosages & expiry batches.","timestamp":"2026-11-09T08:30:00Z","completed":true},
        {"stage":"Packed","title":"Sealed in Tamper-Proof Pack","description":"Packed in temperature-neutral pharmaceutical packaging.","timestamp":"2026-11-09T09:15:00Z","completed":true},
        {"stage":"Dispatched","title":"Handed to BlueDart Express","description":"Consignment picked up for express priority dispatch.","timestamp":"2026-11-09T10:00:00Z","completed":true},
        {"stage":"Out for Delivery","title":"Out with Courier Executive","description":"Rider Arun Kumar is en route with your package.","completed":false},
        {"stage":"Delivered","title":"Doorstep Handover","description":"Secure delivery with OTP confirmation.","completed":false}
    ]'::jsonb,
    'BlueDart Express Healthcare',
    'BD-APPIE-994821',
    now() + INTERVAL '4 hours',
    'paid',
    'Leave with apartment security desk if contact number unavailable.'
)
ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 10M. Payment Transactions (payment_transactions)
-- Transaction ID: f5555555-5555-5555-5555-555555555555
INSERT INTO public.payment_transactions (
    id,
    transaction_code,
    user_id,
    service_type,
    reference_id,
    amount,
    tax_amount,
    payment_method,
    payment_gateway_ref,
    status,
    metadata
)
VALUES (
    'f5555555-5555-5555-5555-555555555555',
    'TXN-APPIE-77291',
    'a1111111-1111-1111-1111-111111111111',
    'medicine_order',
    'ORD-APPIE-88214',
    192.00,
    20.57,
    'upi',
    'upi_rzp_live_99481729018',
    'success',
    '{"upiVpa":"rahul.verma@okhdfcbank","gstNumber":"29AABCM1234F1Z5","sacCode":"999331","taxBreakdown":{"cgst":10.28,"sgst":10.28}}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET updated_at = now();

-- 10N. User Notifications (user_notifications)
INSERT INTO public.user_notifications (user_id, type, title, message, link_url, is_read, priority)
VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    'order',
    'Order Dispatched: BlueDart Express',
    'Your medicine parcel ORD-APPIE-88214 has been dispatched from MedPlus Pharmacy. Tracking number: BD-APPIE-994821.',
    '/orders',
    false,
    'high'
),
(
    'a1111111-1111-1111-1111-111111111111',
    'consultation',
    'Upcoming Video Consultation Today',
    'Your video appointment with Dr. Ananya Sharma is scheduled for today at 3:30 PM.',
    '/consultations',
    false,
    'high'
),
(
    'a1111111-1111-1111-1111-111111111111',
    'prescription',
    'E-Prescription Issued by Dr. Ananya Sharma',
    'Certified e-prescription RX-APPIE-2026-9041 is now available in your Health Records Vault.',
    '/prescriptions',
    true,
    'normal'
),
(
    'a1111111-1111-1111-1111-111111111111',
    'payment',
    'Payment Received (₹192.00)',
    'Payment of ₹192.00 for medicine order ORD-APPIE-88214 was successful via UPI. Formal GST invoice receipt is ready.',
    '/payments',
    true,
    'normal'
);

-- 10O. Medical Records (medical_records)
INSERT INTO public.medical_records (
    patient_id,
    record_type,
    title,
    category,
    document_url,
    file_size,
    file_type,
    record_date,
    doctor_or_facility,
    notes,
    tags,
    linked_entity_id
)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'lab_report',
    'Complete Blood Count (CBC) & Serum IgE Panel',
    'Hematology & Allergy Diagnostics',
    'https://storage.appie.health/records/patient-001/CBC_IgE_Report_Nov2026.pdf',
    '1.8 MB',
    'application/pdf',
    CURRENT_DATE - INTERVAL '2 days',
    'Anand Diagnostic Laboratory, Bengaluru',
    'Hemoglobin: 14.8 g/dL (Normal). Total WBC: 7,200/mcL (Normal). Eosinophils mildly elevated at 6% consistent with allergic rhinitis history.',
    ARRAY['CBC', 'Blood Count', 'Allergy', 'Diagnostic'],
    'f1111111-1111-1111-1111-111111111111'
);

-- 10P. Care Follow-Ups (care_follow_ups)
INSERT INTO public.care_follow_ups (
    patient_id,
    professional_id,
    consultation_id,
    title,
    description,
    due_date,
    status,
    follow_up_type,
    notes
)
VALUES (
    'a1111111-1111-1111-1111-111111111111',
    'b2222222-2222-2222-2222-222222222222',
    'f2222222-2222-2222-2222-222222222222',
    '7-Day Clinical Recheck for Viral Cough',
    'Follow up with Dr. Ananya Sharma to evaluate cough resolution and ensure complete recovery without post-viral bronchospasm.',
    CURRENT_DATE + INTERVAL '7 days',
    'pending',
    'doctor_review',
    'Check if cough syrup course finished and nasal congestion relieved.'
);

-- ==============================================================================
-- COMPLETED SEED SCRIPT
-- ==============================================================================

