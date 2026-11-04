import { z } from "zod";

/**
 * APPIE SECURITY & SANITIZATION ENGINE
 * Defends against XSS, SQL Injection, and LLM Prompt Injection attacks.
 * Enforces sanitization and server-side validation on every input.
 */

// Regular expressions for detecting malicious SQL patterns
const DANGEROUS_SQL_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|UNION|TRUNCATE|GRANT|REVOKE)\b)/i,
  /(--|\/\*|\*\/|;|\bOR\b\s+['"\d]+=['"\d]+|\bAND\b\s+['"\d]+=['"\d]+)/i,
  /(';|\"|'\s*OR\s*'1'='1|"\s*OR\s*"1"="1)/i,
];

// Regular expressions for detecting prompt injection in user medical inputs
const DANGEROUS_PROMPT_PATTERNS = [
  /(\[system\]|<\|im_start\|>|<\|im_end\|>)/i,
  /(\bignore\s+(previous|all)\s+instructions\b)/i,
  /(\byou\s+are\s+now\b|\bsystem\s+prompt\b)/i,
  /(\bjailbreak\b|\boverride\s+safety\b)/i,
];

/**
 * Strips HTML tags and escapes special characters to prevent Cross-Site Scripting (XSS)
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "") // strip HTML tags
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#x60;");
}

export const sanitizeInput = sanitizeHtml;


/**
 * Deep sanitization for strings: strips HTML, checks SQL & Prompt injection triggers
 */
export function sanitizeString(
  input: string,
  options: { allowSqlKeywords?: boolean; maxLen?: number } = {}
): { clean: string; isValid: boolean; flaggedReason?: string } {
  if (typeof input !== "string") {
    return { clean: "", isValid: false, flaggedReason: "Input is not a string" };
  }

  const maxLen = options.maxLen || 500;
  if (input.length > maxLen) {
    return { clean: "", isValid: false, flaggedReason: `Input exceeds maximum length of ${maxLen} characters` };
  }

  // Check Prompt Injection
  for (const pattern of DANGEROUS_PROMPT_PATTERNS) {
    if (pattern.test(input)) {
      return {
        clean: "",
        isValid: false,
        flaggedReason: "Potential malicious prompt injection pattern detected",
      };
    }
  }

  // Check SQL Injection (if not explicitly exempted)
  if (!options.allowSqlKeywords) {
    for (const pattern of DANGEROUS_SQL_PATTERNS) {
      if (pattern.test(input)) {
        return {
          clean: "",
          isValid: false,
          flaggedReason: "Potential SQL injection attack vector detected",
        };
      }
    }
  }

  const clean = sanitizeHtml(input.trim());
  return { clean, isValid: true };
}

/**
 * Sanitizes and normalizes an email address
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") return "";
  return email.trim().toLowerCase().slice(0, 100);
}

/**
 * Sanitizes and normalizes a username
 */
export function sanitizeUsername(username: string): string {
  if (typeof username !== "string") return "";
  return username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 30);
}

// ------------------------------------------------------------------------------
// ZOD VALIDATION SCHEMAS
// ------------------------------------------------------------------------------

/**
 * Password rules helper
 */
const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(128, "Password must not exceed 128 characters")
  .regex(/[a-z]/, "Password must include at least one lowercase letter")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[0-9]/, "Password must include at least one number")
  .regex(/[^a-zA-Z0-9]/, "Password must include at least one special character");

/**
 * Patient Registration Schema
 */
export const patientRegistrationSchema = z
  .object({
    role: z.literal("patient"),
    // Personal Information
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
      message: "Please select a valid gender option",
    }),
    // Contact Information
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15)
      .regex(/^[0-9+ -]+$/, "Invalid phone number format"),
    addressLine1: z.string().max(100).optional().default(""),
    city: z.string().max(50).optional().default(""),
    state: z.string().max(50).optional().default(""),
    pincode: z.string().max(10).optional().default(""),
    emergencyContactName: z.string().max(100).optional().default(""),
    emergencyContactPhone: z.string().max(15).optional().default(""),
    emergencyContactRelation: z.string().max(50).optional().default(""),
    // Account Credentials
    email: z.string().email("Invalid email address").max(100),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must not exceed 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: passwordValidation,
    confirmPassword: z.string(),
    // Terms & Consent
    termsConsent: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service & Healthcare Privacy Consent",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Health Professional Registration Schema
 */
export const professionalRegistrationSchema = z
  .object({
    role: z.literal("health_professional"),
    // Personal Information
    prefix: z.enum(["Dr.", "Prof."], { message: "Please select prefix (Dr. or Prof.)" }).default("Dr."),
    fullName: z.string().min(2, "Full legal name is required").max(100),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).default("prefer_not_to_say"),
    // Contact Information
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15)
      .regex(/^[0-9+ -]+$/, "Invalid phone number format"),
    clinicAddress: z.string().min(5, "Clinic / Hospital address is required").max(200),
    // Professional Details
    medicalLicenseNumber: z.string().min(4, "Medical council license number is required").max(50),
    medicalCouncilName: z.string().min(2, "State or National Medical Council name is required").max(100),
    specialization: z.string().min(2, "Clinical specialization is required").max(100),
    qualifications: z.string().min(2, "Qualifications (e.g., MBBS, MD) are required").max(100),
    yearsOfExperience: z.number().int().min(0).max(60),
    // Account Credentials
    email: z.string().email("Invalid email address").max(100),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must not exceed 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: passwordValidation,
    confirmPassword: z.string(),
    // Terms & Consent
    termsConsent: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Medical Practice Guidelines & Telehealth Ethics",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Pharmacist Registration Schema
 */
export const pharmacistRegistrationSchema = z
  .object({
    role: z.literal("pharmacist"),
    // Pharmacy Details
    pharmacyName: z.string().min(2, "Pharmacy name is required").max(100),
    pharmacistName: z.string().min(2, "Registered pharmacist name is required").max(100),
    pharmacyType: z.enum(["retail", "hospital", "community", "chain"]).default("retail"),
    gstNumber: z.string().min(5, "GST number is required").max(25),
    // License Details
    drugLicenseNumber: z.string().min(4, "Drug License Number (Form 20/21) is required").max(50),
    pharmacyCouncilRegNo: z.string().min(3, "State Pharmacy Council Registration is required").max(50),
    pharmacyAddress: z.string().min(5, "Physical pharmacy address is required").max(200),
    city: z.string().min(2, "City is required").max(50),
    state: z.string().min(2, "State is required").max(50),
    pincode: z.string().min(5, "Pincode is required").max(10),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15)
      .regex(/^[0-9+ -]+$/, "Invalid phone number format"),
    certificateFileName: z.string().optional(),
    // Account Credentials
    email: z.string().email("Invalid email address").max(100),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must not exceed 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: passwordValidation,
    confirmPassword: z.string(),
    // Terms & Consent
    termsConsent: z.boolean().refine((val) => val === true, {
      message: "You must accept the Good Pharmacy Practice & Medicine Dispensing Guidelines",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Delivery Partner Registration Schema
 */
export const deliveryPartnerRegistrationSchema = z
  .object({
    role: z.literal("delivery_partner"),
    // Personal Details
    fullName: z.string().min(2, "Full legal name is required").max(100),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .max(15)
      .regex(/^[0-9+ -]+$/, "Invalid phone number format"),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    city: z.string().min(2, "Operating city is required").max(50),
    operatingZone: z.string().min(2, "Preferred delivery zone is required").max(100),
    // Vehicle & License Details
    vehicleType: z.enum(["motorcycle", "scooter", "electric_vehicle", "bicycle"]).default("motorcycle"),
    vehicleRegistrationNumber: z.string().min(4, "Vehicle Registration Certificate (RC) number is required").max(30),
    drivingLicenseNumber: z.string().min(4, "Driving License number is required").max(30),
    vehicleRcFileName: z.string().optional(),
    // Account Credentials
    email: z.string().email("Invalid email address").max(100),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must not exceed 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: passwordValidation,
    confirmPassword: z.string(),
    // Terms & Consent
    termsConsent: z.boolean().refine((val) => val === true, {
      message: "You must agree to the Pharmaceutical Delivery & Safe Transit Guidelines",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Universal Registration Schema
 */
export const registerSchema = z.union([
  patientRegistrationSchema,
  professionalRegistrationSchema,
  pharmacistRegistrationSchema,
  deliveryPartnerRegistrationSchema,
]);

/**
 * User Login Schema
 */
export const loginSchema = z.object({
  role: z.enum(["patient", "health_professional", "pharmacist", "delivery_partner", "admin"]).optional(),
  identifier: z
    .string()
    .min(3, "Please enter your email or username")
    .max(100, "Identifier too long")
    .refine((val) => !DANGEROUS_SQL_PATTERNS.some((p) => p.test(val)), {
      message: "Input contains invalid or suspicious characters",
    }),
  password: z.string().min(1, "Password is required").max(128, "Password too long"),
  rememberMe: z.boolean().optional().default(false),
});

/**
 * 2FA Verification Schema
 */
export const twoFactorSchema = z.object({
  identifier: z.string().min(3).max(100),
  code: z
    .string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^[0-9]+$/, "Verification code must contain digits only"),
  method: z.enum(["sms", "email", "authenticator"]).default("email"),
});

/**
 * Verification Code Schema (Registration verification)
 */
export const verifyCodeSchema = z.object({
  identifier: z.string().min(3).max(100),
  code: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^[0-9]+$/, "Code must contain digits only"),
  type: z.enum(["registration", "two_factor", "password_recovery"]).default("registration"),
});

/**
 * Resend Code Schema
 */
export const resendCodeSchema = z.object({
  identifier: z.string().min(3).max(100),
  type: z.enum(["registration", "two_factor", "password_recovery"]).default("registration"),
});

/**
 * Password Recovery Request Schema
 */
export const forgotPasswordSchema = z.object({
  identifier: z.string().min(3, "Enter your registered email or username").max(100),
  method: z.enum(["email", "sms"]).default("email"),
});

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z
  .object({
    identifier: z.string().min(3).max(100),
    code: z.string().length(6, "Code must be 6 digits").regex(/^[0-9]+$/),
    newPassword: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Profile Update Schema
 */
export const profileUpdateSchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  firstName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  phone: z.string().max(20).optional(),
  dateOfBirth: z.string().max(20).optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  avatarUrl: z.string().max(500).optional(),
  addressLine1: z.string().max(100).optional(),
  addressLine2: z.string().max(100).optional(),
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional(),
  pincode: z.string().max(10).optional(),
  emergencyContactName: z.string().max(100).optional(),
  emergencyContactPhone: z.string().max(20).optional(),
  emergencyContactRelation: z.string().max(50).optional(),
});

/**
 * Health Profile Update Schema
 */
export const healthProfileUpdateSchema = z.object({
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  heightCm: z.number().min(30).max(280).optional(),
  weightKg: z.number().min(2).max(500).optional(),
  systolicBp: z.number().int().min(50).max(260).optional(),
  diastolicBp: z.number().int().min(30).max(180).optional(),
  isDiabetic: z.boolean().default(false),
  isSmoker: z.boolean().default(false),
  medicalConditions: z.array(z.string().max(100)).default([]),
  allergies: z.array(z.string().max(100)).default([]),
  currentMedications: z.array(z.string().max(100)).default([]),
  medicalHistoryNotes: z.string().max(2000).optional().default(""),
});

/**
 * Consents Update Schema
 */
export const consentUpdateSchema = z.object({
  consents: z.array(
    z.object({
      category: z.enum([
        "data_processing",
        "telehealth_consultation",
        "pharmacy_sharing",
        "emergency_access",
      ]),
      isGranted: z.boolean(),
    })
  ),
});

/**
 * Settings Update Schema
 */
export const settingsUpdateSchema = z.object({
  smsNotifications: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  whatsappNotifications: z.boolean().optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  language: z.string().max(10).optional(),
  fontScaling: z.enum(["normal", "large"]).optional(),
  twoFactorEnabled: z.boolean().optional(),
});

/**
 * Medical Status Verification Submission Schema
 */
export const medicalVerificationSubmissionSchema = z.object({
  medicalLicenseNumber: z.string().min(3).max(50),
  medicalCouncilName: z.string().min(2).max(100),
  specialization: z.string().min(2).max(100),
  qualifications: z.string().min(2).max(100),
  yearsOfExperience: z.number().int().min(0).max(60),
  clinicAddress: z.string().min(5).max(200),
  licenseDocumentName: z.string().min(1).max(255).optional(),
  idProofDocumentName: z.string().min(1).max(255).optional(),
});

/**
 * Health Assessment System Schemas
 */
export const symptomItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(100),
  category: z.string().max(50).default("General"),
  severity: z.number().int().min(1).max(10),
  durationDays: z.number().int().min(1).max(365),
  frequency: z.enum(["constant", "intermittent", "worsening"]).default("intermittent"),
  notes: z.string().max(500).optional().default(""),
});

export const assessmentSubmissionSchema = z.object({
  title: z.string().min(2).max(150),
  symptoms: z.array(symptomItemSchema).min(1, "At least one symptom must be selected"),
  additionalNotes: z.string().max(1000).optional().default(""),
});

export const symptomProgressUpdateSchema = z.object({
  trackerId: z.string().min(1),
  severity: z.number().int().min(1).max(10),
  status: z.enum(["improving", "stable", "worsening", "resolved"]),
  notes: z.string().max(500).optional().default(""),
});

/**
 * Consultation System Schemas
 */
export const appointmentBookingSchema = z.object({
  professionalId: z.string().min(1, "Doctor ID is required"),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  timeSlot: z.string().min(1, "Time slot is required").max(50),
  type: z.enum(["video", "audio", "chat", "in_person"]).default("video"),
  reason: z.string().min(2, "Please provide a reason for consultation").max(500),
  assessmentId: z.string().optional(),
});

export const appointmentRescheduleSchema = z.object({
  appointmentId: z.string().min(1),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  timeSlot: z.string().min(1).max(50),
});

export const consultationSummarySchema = z.object({
  appointmentId: z.string().min(1),
  clinicalDiagnosis: z.string().min(2, "Clinical diagnosis is required").max(500),
  doctorNotes: z.string().min(2, "Doctor clinical notes are required").max(2000),
  recommendations: z.array(z.string().max(300)).default([]),
  followUpDate: z.string().optional(),
  followUpInstructions: z.string().max(500).optional(),
});

export const consultationReviewSchema = z.object({
  appointmentId: z.string().min(1),
  professionalId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().max(1000).optional().default(""),
  tags: z.array(z.string().max(50)).default([]),
  isAnonymous: z.boolean().default(false),
});

/**
 * Prescription System Schemas
 */
export const prescriptionMedicineSchema = z.object({
  medicationId: z.string().optional(),
  medicineName: z.string().min(1).max(150),
  dosage: z.string().min(1).max(100),
  frequency: z.string().min(1).max(100),
  duration: z.string().min(1).max(100),
  instructions: z.string().max(300).optional().default(""),
});

export const prescriptionCreateSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),
  appointmentId: z.string().optional(),
  diagnosis: z.string().min(2).max(500),
  medications: z.array(prescriptionMedicineSchema).min(1, "At least one medication is required"),
  generalAdvice: z.string().max(1000).optional(),
  validDays: z.number().int().min(1).max(180).default(30),
});

/**
 * Medication System Schemas
 */
export const cartItemAddSchema = z.object({
  medicationId: z.string().min(1),
  quantity: z.number().int().min(1).max(50).default(1),
  prescriptionId: z.string().optional(),
});

export const cartItemUpdateSchema = z.object({
  cartItemId: z.string().min(1),
  quantity: z.number().int().min(1).max(50),
});

/**
 * Review System Schemas (Clinical Review)
 */
export const clinicalReviewSubmissionSchema = z.object({
  assessmentId: z.string().optional(),
  prescriptionId: z.string().optional(),
  patientId: z.string().min(1),
  reviewType: z.enum(["assessment_review", "medication_approval", "prescription_endorsement"]),
  status: z.enum(["approved", "modification_recommended", "rejected"]),
  clinicalNotes: z.string().min(2, "Clinical notes are required").max(2000),
  prescribedActions: z.array(z.string().max(200)).default([]),
});

/**
 * Order System Schemas
 */
export const deliveryAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
  addressLine1: z.string().min(5, "Address Line 1 is required").max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2, "City is required").max(100),
  state: z.string().min(2, "State is required").max(100),
  pincode: z.string().regex(/^\d{6}$/, "Pincode must be exactly 6 digits"),
  landmark: z.string().max(100).optional(),
});

export const orderPlacementSchema = z.object({
  deliveryAddress: deliveryAddressSchema,
  prescriptionId: z.string().optional(),
  paymentMethod: z.enum(["upi", "card", "netbanking", "wallet", "cod"]).default("upi"),
  promoCode: z.string().max(30).optional(),
  notes: z.string().max(500).optional(),
});

/**
 * Payment & Transaction System Schemas
 */
export const paymentExecutionSchema = z.object({
  serviceType: z.enum(["consultation", "medicine_order", "lab_test", "subscription"]),
  referenceId: z.string().optional(),
  referenceTitle: z.string().min(1).max(200),
  amount: z.number().min(0, "Amount must be positive"),
  paymentMethod: z.enum(["upi", "card", "netbanking", "wallet", "cod"]),
  paymentDetails: z.object({
    upiId: z.string().optional(),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvv: z.string().optional(),
    bankCode: z.string().optional(),
  }).optional(),
});

/**
 * Records System Schemas
 */
export const medicalRecordUploadSchema = z.object({
  title: z.string().min(2, "Document title is required").max(150),
  category: z.enum([
    "Prescription",
    "Diagnostic Report",
    "Consultation Note",
    "Vaccine Certificate",
    "Health Assessment",
    "Other",
  ]),
  recordDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  doctorOrFacility: z.string().max(150).optional(),
  notes: z.string().max(1000).optional(),
  isConfidential: z.boolean().default(false),
  tags: z.array(z.string().max(50)).default([]),
  linkedEntityId: z.string().optional(),
  fileSize: z.string().optional(),
  fileType: z.string().optional(),
});

export const careFollowUpUpdateSchema = z.object({
  followUpId: z.string().min(1),
  status: z.enum(["pending", "completed", "missed", "cancelled"]),
  notes: z.string().max(500).optional(),
});

export type PatientRegistrationInput = z.infer<typeof patientRegistrationSchema>;
export type ProfessionalRegistrationInput = z.infer<typeof professionalRegistrationSchema>;
export type PharmacistRegistrationInput = z.infer<typeof pharmacistRegistrationSchema>;
export type DeliveryPartnerRegistrationInput = z.infer<typeof deliveryPartnerRegistrationSchema>;
export type RegisterInput =
  | PatientRegistrationInput
  | ProfessionalRegistrationInput
  | PharmacistRegistrationInput
  | DeliveryPartnerRegistrationInput;
export type LoginInput = z.infer<typeof loginSchema>;
