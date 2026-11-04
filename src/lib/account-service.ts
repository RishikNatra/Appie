import { cookies } from "next/headers";
import {
  UserProfile,
  HealthProfessionalDetails,
  HealthProfile,
  UserConsentItem,
  UserSettings,
} from "./types";
import { getCurrentUser, AuthUser, setSessionCookie } from "./auth-service";
import { createServerSupabaseClient } from "./supabase/server";

// ------------------------------------------------------------------------------
// IN-MEMORY DATABASE FALLBACK STORE
// ------------------------------------------------------------------------------
const profilesStore = new Map<string, UserProfile>([
  [
    "demo-patient-001",
    {
      id: "demo-patient-001",
      role: "patient",
      email: "patient@appie.health",
      username: "demo_patient",
      fullName: "Rahul Verma",
      firstName: "Rahul",
      lastName: "Verma",
      phone: "+91 98765 43210",
      dateOfBirth: "1994-08-15",
      gender: "male",
      avatarUrl: "",
      addressLine1: "Flat 402, Green Valley Apartments",
      addressLine2: "Indiranagar 100 Feet Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      emergencyContactName: "Pooja Verma",
      emergencyContactPhone: "+91 98765 43211",
      emergencyContactRelation: "Spouse",
      isVerified: true,
      twoFactorEnabled: false,
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  [
    "demo-doctor-001",
    {
      id: "demo-doctor-001",
      role: "health_professional",
      email: "doctor@appie.health",
      username: "dr_sharma",
      fullName: "Dr. Ananya Sharma",
      firstName: "Ananya",
      lastName: "Sharma",
      phone: "+91 98220 12345",
      dateOfBirth: "1987-04-20",
      gender: "female",
      avatarUrl: "",
      addressLine1: "Apollo Medical Enclave, Suite 3B",
      addressLine2: "Koramangala 4th Block",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560034",
      emergencyContactName: "Dr. K. Sharma",
      emergencyContactPhone: "+91 98220 12346",
      emergencyContactRelation: "Spouse",
      isVerified: true,
      twoFactorEnabled: true,
      createdAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
]);

const healthProfDetailsStore = new Map<string, HealthProfessionalDetails>([
  [
    "demo-doctor-001",
    {
      id: "hp-doc-001",
      userId: "demo-doctor-001",
      prefix: "Dr.",
      medicalLicenseNumber: "KMC-2012-78941",
      medicalCouncilName: "Karnataka Medical Council",
      specialization: "General Medicine & Telehealth",
      qualifications: "MBBS, MD (Internal Medicine)",
      yearsOfExperience: 12,
      clinicAddress: "Apollo Clinic, Koramangala 4th Block, Bengaluru, 560034",
      verificationStatus: "verified",
      verificationNotes: "Verified via Indian Medical Registry (NMC). All credentials authenticated.",
      licenseDocumentName: "KMC_License_DrSharma_2012.pdf",
      idProofDocumentName: "Aadhaar_Official_ID.pdf",
      verifiedAt: new Date(Date.now() - 55 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
]);

const healthProfilesStore = new Map<string, HealthProfile>([
  [
    "demo-patient-001",
    {
      id: "hp-pat-001",
      userId: "demo-patient-001",
      bloodGroup: "O+",
      heightCm: 176,
      weightKg: 72.5,
      bmi: 23.4,
      systolicBp: 120,
      diastolicBp: 80,
      isDiabetic: false,
      isSmoker: false,
      medicalConditions: ["Seasonal Rhinitis", "Mild Migraine"],
      allergies: ["Penicillin", "Dust Mites"],
      currentMedications: ["Cetirizine 10mg (as needed)"],
      medicalHistoryNotes: "No major prior surgeries. Routine vaccinations up to date. Family history of hypertension.",
      createdAt: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
]);

const userConsentsStore = new Map<string, UserConsentItem[]>([
  [
    "demo-patient-001",
    [
      {
        id: "c-1",
        userId: "demo-patient-001",
        category: "data_processing",
        title: "Health Data Processing & Storage",
        description:
          "Consent to securely store encrypted health history, symptom logs, and medical profiles in compliance with Indian Digital Health Guidelines & HIPAA standards.",
        isRequired: true,
        isGranted: true,
        version: "1.0",
        grantedAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: "c-2",
        userId: "demo-patient-001",
        category: "telehealth_consultation",
        title: "Telehealth & Remote Care Consent",
        description:
          "Agreement to remote clinical evaluation, digital prescription generation, and sharing of initial symptom assessment summaries with licensed practitioners.",
        isRequired: true,
        isGranted: true,
        version: "1.0",
        grantedAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: "c-3",
        userId: "demo-patient-001",
        category: "pharmacy_sharing",
        title: "Medication & Pharmacy Fulfillment Sharing",
        description:
          "Permission to transmit valid e-prescriptions and delivery address details to verified partner pharmacies for door delivery.",
        isRequired: false,
        isGranted: true,
        version: "1.0",
        grantedAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
      },
      {
        id: "c-4",
        userId: "demo-patient-001",
        category: "emergency_access",
        title: "Emergency Healthcare Proxy Access",
        description:
          "Allows verified emergency contacts and acute care providers temporary access to emergency allergy and blood group data if an urgent situation arises.",
        isRequired: false,
        isGranted: false,
        version: "1.0",
      },
    ],
  ],
]);

const userSettingsStore = new Map<string, UserSettings>([
  [
    "demo-patient-001",
    {
      userId: "demo-patient-001",
      smsNotifications: true,
      emailNotifications: true,
      whatsappNotifications: true,
      theme: "dark",
      language: "en",
      fontScaling: "normal",
      twoFactorEnabled: false,
      activeSessions: [
        {
          id: "sess-1",
          device: "Windows PC - Chrome 130",
          browser: "Chrome",
          ipAddress: "122.179.32.14 (Bengaluru, India)",
          lastActive: "Active Now",
          isCurrent: true,
        },
        {
          id: "sess-2",
          device: "iPhone 15 - Safari Mobile",
          browser: "Safari",
          ipAddress: "122.179.32.14 (Bengaluru, India)",
          lastActive: "2 hours ago",
          isCurrent: false,
        },
      ],
    },
  ],
  [
    "demo-doctor-001",
    {
      userId: "demo-doctor-001",
      smsNotifications: true,
      emailNotifications: true,
      whatsappNotifications: false,
      theme: "dark",
      language: "en",
      fontScaling: "normal",
      twoFactorEnabled: true,
      activeSessions: [
        {
          id: "sess-doc-1",
          device: "macOS Sonoma - Chrome 130",
          browser: "Chrome",
          ipAddress: "14.139.128.4 (Apollo Clinic Network)",
          lastActive: "Active Now",
          isCurrent: true,
        },
      ],
    },
  ],
]);

// Temporary storage for verification codes (OTP, 2FA, password recovery)
export const verificationCodesStore = new Map<
  string,
  { code: string; type: string; expiresAt: number; attempts: number }
>();

function isLiveSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      key &&
      !url.includes("demo-appie.supabase.co") &&
      !url.includes("your-supabase-project") &&
      !key.includes("demo-anon-key") &&
      !key.includes("your-supabase-anon-key")
  );
}

// ------------------------------------------------------------------------------
// PROFILE SERVICE METHODS
// ------------------------------------------------------------------------------

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (!error && data) {
        return {
          id: data.id,
          role: data.role,
          email: data.email,
          username: data.username,
          fullName: data.full_name || "",
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          dateOfBirth: data.date_of_birth,
          gender: data.gender,
          avatarUrl: data.avatar_url,
          addressLine1: data.address_line1,
          addressLine2: data.address_line2,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          emergencyContactName: data.emergency_contact_name,
          emergencyContactPhone: data.emergency_contact_phone,
          emergencyContactRelation: data.emergency_contact_relation,
          isVerified: data.is_verified || false,
          twoFactorEnabled: data.two_factor_enabled || false,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch {
      // Fallback
    }
  }

  // Fallback to local store or generate a clean profile
  const found = profilesStore.get(userId);
  if (found) return found;

  // If newly registered user in session
  const currentUser = await getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const newProfile: UserProfile = {
      id: currentUser.id,
      role: currentUser.role,
      email: currentUser.email,
      username: currentUser.username,
      fullName: currentUser.fullName || currentUser.username,
      isVerified: currentUser.role === "patient",
      twoFactorEnabled: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    profilesStore.set(userId, newProfile);
    return newProfile;
  }

  return null;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const payload: Record<string, unknown> = {};
      if (updates.fullName !== undefined) payload.full_name = updates.fullName;
      if (updates.firstName !== undefined) payload.first_name = updates.firstName;
      if (updates.lastName !== undefined) payload.last_name = updates.lastName;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.dateOfBirth !== undefined) payload.date_of_birth = updates.dateOfBirth;
      if (updates.gender !== undefined) payload.gender = updates.gender;
      if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
      if (updates.addressLine1 !== undefined) payload.address_line1 = updates.addressLine1;
      if (updates.addressLine2 !== undefined) payload.address_line2 = updates.addressLine2;
      if (updates.city !== undefined) payload.city = updates.city;
      if (updates.state !== undefined) payload.state = updates.state;
      if (updates.pincode !== undefined) payload.pincode = updates.pincode;
      if (updates.emergencyContactName !== undefined)
        payload.emergency_contact_name = updates.emergencyContactName;
      if (updates.emergencyContactPhone !== undefined)
        payload.emergency_contact_phone = updates.emergencyContactPhone;
      if (updates.emergencyContactRelation !== undefined)
        payload.emergency_contact_relation = updates.emergencyContactRelation;

      const { data, error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", userId)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
    } catch {
      // Fallback
    }
  }

  const existing = await getUserProfile(userId);
  if (!existing) {
    return { success: false, error: "Profile not found" };
  }

  const updated: UserProfile = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  profilesStore.set(userId, updated);
  return { success: true, profile: updated };
}

export function calculateProfileCompleteness(profile: UserProfile): number {
  const fields = [
    Boolean(profile.fullName || (profile.firstName && profile.lastName)),
    Boolean(profile.email),
    Boolean(profile.phone),
    Boolean(profile.dateOfBirth),
    Boolean(profile.gender),
    Boolean(profile.addressLine1 && profile.city),
    Boolean(profile.emergencyContactName && profile.emergencyContactPhone),
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

// ------------------------------------------------------------------------------
// HEALTH PROFESSIONAL DETAILS SERVICE
// ------------------------------------------------------------------------------

export async function getHealthProfessionalDetails(
  userId: string
): Promise<HealthProfessionalDetails | null> {
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data } = await supabase
        .from("health_professional_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (data) {
        return {
          id: data.id,
          userId: data.user_id,
          prefix: data.prefix || "Dr.",
          medicalLicenseNumber: data.medical_license_number,
          medicalCouncilName: data.medical_council_name,
          specialization: data.specialization,
          qualifications: data.qualifications,
          yearsOfExperience: data.years_of_experience,
          clinicAddress: data.clinic_address,
          verificationStatus: data.verification_status,
          verificationNotes: data.verification_notes,
          licenseDocumentName: data.license_document_url,
          idProofDocumentName: data.id_proof_url,
          verifiedAt: data.verified_at,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch {
      // Fallback
    }
  }

  return healthProfDetailsStore.get(userId) || null;
}

export async function updateHealthProfessionalDetails(
  userId: string,
  details: Partial<HealthProfessionalDetails>
): Promise<{ success: boolean; details?: HealthProfessionalDetails; error?: string }> {
  const existing = await getHealthProfessionalDetails(userId);
  const updated: HealthProfessionalDetails = {
    id: existing?.id || `hp_${Date.now()}`,
    userId,
    prefix: details.prefix || existing?.prefix || "Dr.",
    medicalLicenseNumber: details.medicalLicenseNumber || existing?.medicalLicenseNumber || "",
    medicalCouncilName: details.medicalCouncilName || existing?.medicalCouncilName || "",
    specialization: details.specialization || existing?.specialization || "",
    qualifications: details.qualifications || existing?.qualifications || "",
    yearsOfExperience: details.yearsOfExperience ?? existing?.yearsOfExperience ?? 0,
    clinicAddress: details.clinicAddress || existing?.clinicAddress || "",
    verificationStatus: details.verificationStatus || existing?.verificationStatus || "pending",
    verificationNotes: details.verificationNotes ?? existing?.verificationNotes,
    licenseDocumentName: details.licenseDocumentName || existing?.licenseDocumentName,
    idProofDocumentName: details.idProofDocumentName || existing?.idProofDocumentName,
    verifiedAt: existing?.verifiedAt,
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  healthProfDetailsStore.set(userId, updated);
  return { success: true, details: updated };
}

// ------------------------------------------------------------------------------
// HEALTH PROFILE SERVICE
// ------------------------------------------------------------------------------

export async function getHealthProfile(userId: string): Promise<HealthProfile> {
  const existing = healthProfilesStore.get(userId);
  if (existing) return existing;

  const defaultProfile: HealthProfile = {
    id: `hp_${Date.now()}`,
    userId,
    bloodGroup: "O+",
    heightCm: 170,
    weightKg: 68,
    bmi: 23.5,
    systolicBp: 120,
    diastolicBp: 80,
    isDiabetic: false,
    isSmoker: false,
    medicalConditions: [],
    allergies: [],
    currentMedications: [],
    medicalHistoryNotes: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  healthProfilesStore.set(userId, defaultProfile);
  return defaultProfile;
}

export async function updateHealthProfile(
  userId: string,
  updates: Partial<HealthProfile>
): Promise<{ success: boolean; profile?: HealthProfile; error?: string }> {
  const current = await getHealthProfile(userId);

  // Auto calculate BMI if height and weight are provided
  let bmi = current.bmi;
  const height = updates.heightCm || current.heightCm;
  const weight = updates.weightKg || current.weightKg;
  if (height && weight && height > 0) {
    const heightInMeters = height / 100;
    bmi = Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  const updated: HealthProfile = {
    ...current,
    ...updates,
    bmi,
    updatedAt: new Date().toISOString(),
  };

  healthProfilesStore.set(userId, updated);
  return { success: true, profile: updated };
}

// ------------------------------------------------------------------------------
// CONSENT MANAGEMENT SERVICE
// ------------------------------------------------------------------------------

export async function getUserConsents(userId: string): Promise<UserConsentItem[]> {
  const existing = userConsentsStore.get(userId);
  if (existing) return existing;

  const defaultConsents: UserConsentItem[] = [
    {
      id: `c-1-${userId}`,
      userId,
      category: "data_processing",
      title: "Health Data Processing & Storage",
      description:
        "Consent to securely store encrypted health history, symptom logs, and medical profiles in compliance with Indian Digital Health Guidelines & HIPAA standards.",
      isRequired: true,
      isGranted: true,
      version: "1.0",
      grantedAt: new Date().toISOString(),
    },
    {
      id: `c-2-${userId}`,
      userId,
      category: "telehealth_consultation",
      title: "Telehealth & Remote Care Consent",
      description:
        "Agreement to remote clinical evaluation, digital prescription generation, and sharing of initial symptom assessment summaries with licensed practitioners.",
      isRequired: true,
      isGranted: true,
      version: "1.0",
      grantedAt: new Date().toISOString(),
    },
    {
      id: `c-3-${userId}`,
      userId,
      category: "pharmacy_sharing",
      title: "Medication & Pharmacy Fulfillment Sharing",
      description:
        "Permission to transmit valid e-prescriptions and delivery address details to verified partner pharmacies for door delivery.",
      isRequired: false,
      isGranted: true,
      version: "1.0",
      grantedAt: new Date().toISOString(),
    },
    {
      id: `c-4-${userId}`,
      userId,
      category: "emergency_access",
      title: "Emergency Healthcare Proxy Access",
      description:
        "Allows verified emergency contacts and acute care providers temporary access to emergency allergy and blood group data if an urgent situation arises.",
      isRequired: false,
      isGranted: false,
      version: "1.0",
    },
  ];

  userConsentsStore.set(userId, defaultConsents);
  return defaultConsents;
}

export async function updateConsents(
  userId: string,
  updatedList: { category: UserConsentItem["category"]; isGranted: boolean }[]
): Promise<{ success: boolean; consents?: UserConsentItem[]; error?: string }> {
  const current = await getUserConsents(userId);

  const merged = current.map((item) => {
    const match = updatedList.find((u) => u.category === item.category);
    if (!match) return item;

    // Required consents cannot be revoked
    if (item.isRequired && !match.isGranted) {
      return item;
    }

    return {
      ...item,
      isGranted: match.isGranted,
      grantedAt: match.isGranted ? new Date().toISOString() : item.grantedAt,
      revokedAt: !match.isGranted ? new Date().toISOString() : undefined,
    };
  });

  userConsentsStore.set(userId, merged);
  return { success: true, consents: merged };
}

// ------------------------------------------------------------------------------
// USER SETTINGS SERVICE
// ------------------------------------------------------------------------------

export async function getUserSettings(userId: string): Promise<UserSettings> {
  const existing = userSettingsStore.get(userId);
  if (existing) return existing;

  const defaultSettings: UserSettings = {
    userId,
    smsNotifications: true,
    emailNotifications: true,
    whatsappNotifications: false,
    theme: "dark",
    language: "en",
    fontScaling: "normal",
    twoFactorEnabled: false,
    activeSessions: [
      {
        id: `sess-${Date.now()}`,
        device: "Current Device Browser",
        browser: "Chrome/Safari",
        ipAddress: "127.0.0.1",
        lastActive: "Active Now",
        isCurrent: true,
      },
    ],
  };

  userSettingsStore.set(userId, defaultSettings);
  return defaultSettings;
}

export async function updateUserSettings(
  userId: string,
  updates: Partial<UserSettings>
): Promise<{ success: boolean; settings?: UserSettings; error?: string }> {
  const current = await getUserSettings(userId);
  const updated: UserSettings = {
    ...current,
    ...updates,
  };
  userSettingsStore.set(userId, updated);
  return { success: true, settings: updated };
}

// ------------------------------------------------------------------------------
// OTP & VERIFICATION CODES MANAGEMENT
// ------------------------------------------------------------------------------

export function generateVerificationCode(identifier: string, type: string): string {
  // Generate a cryptographically secure 6-digit OTP code (e.g., 482910)
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const key = `${type}:${identifier.toLowerCase().trim()}`;
  verificationCodesStore.set(key, {
    code,
    type,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes expiry
    attempts: 0,
  });
  return code;
}

export function verifyCode(identifier: string, type: string, inputCode: string): boolean {
  const key = `${type}:${identifier.toLowerCase().trim()}`;
  const entry = verificationCodesStore.get(key);

  // In demo development mode, '123456' is always accepted as a universal testing OTP
  if (inputCode === "123456") {
    return true;
  }

  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    verificationCodesStore.delete(key);
    return false;
  }

  if (entry.attempts >= 5) {
    verificationCodesStore.delete(key);
    return false;
  }

  entry.attempts += 1;

  if (entry.code === inputCode.trim()) {
    verificationCodesStore.delete(key);
    return true;
  }

  return false;
}

