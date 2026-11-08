/**
 * APPIE HEALTHCARE SYSTEM - ACCOUNT DATA TYPES
 * Type definitions strictly adhering to the Product Hierarchy & Anatomy
 */

export type UserRole = "patient" | "health_professional" | "pharmacist" | "delivery_partner" | "admin";

export interface UserProfile {
  id: string;
  role: UserRole;
  email: string;
  username: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  avatarUrl?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HealthProfessionalDetails {
  id: string;
  userId: string;
  prefix: string; // 'Dr.' | 'Prof.'
  medicalLicenseNumber: string;
  medicalCouncilName: string;
  specialization: string;
  qualifications: string;
  yearsOfExperience: number;
  clinicAddress: string;
  verificationStatus: "unverified" | "pending" | "verified" | "rejected";
  verificationNotes?: string;
  licenseDocumentName?: string;
  idProofDocumentName?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PharmacistDetails {
  id: string;
  userId: string;
  pharmacyName: string;
  pharmacistName: string;
  pharmacyType: "retail" | "hospital" | "community" | "chain";
  gstNumber: string;
  drugLicenseNumber: string; // Form 20 / Form 21
  pharmacyCouncilRegNo: string;
  pharmacyAddress: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  verificationStatus: "unverified" | "pending" | "verified" | "rejected";
  verificationNotes?: string;
  certificateFileName?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryPartnerDetails {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  vehicleType: "motorcycle" | "scooter" | "electric_vehicle" | "bicycle";
  vehicleRegistrationNumber: string;
  drivingLicenseNumber: string;
  city: string;
  operatingZone: string;
  verificationStatus: "unverified" | "pending" | "verified" | "rejected";
  verificationNotes?: string;
  vehicleRcFileName?: string;
  drivingLicenseFileName?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthProfile {
  id: string;
  userId: string;
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  systolicBp?: number;
  diastolicBp?: number;
  isDiabetic: boolean;
  isSmoker: boolean;
  medicalConditions: string[]; // e.g. ["Hypertension", "Asthma"]
  allergies: string[];
  chronicConditions?: string[];
  emergencyMedicalNotes?: string; // e.g. ["Penicillin", "Peanuts"]
  currentMedications: string[]; // e.g. ["Amlodipine 5mg", "Cetirizine 10mg"]
  medicalHistoryNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserConsentItem {
  id: string;
  userId: string;
  category: "data_processing" | "telehealth_consultation" | "pharmacy_sharing" | "emergency_access";
  title: string;
  description: string;
  isRequired: boolean;
  isGranted: boolean;
  version: string;
  grantedAt?: string;
  revokedAt?: string;
}

export interface UserSettings {
  userId: string;
  smsNotifications: boolean;
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  orderAlerts?: boolean;
  consultationReminders?: boolean;
  theme: "light" | "dark" | "system";
  accentGlow?: boolean;
  smoothAnimations?: boolean;
  language: string;
  fontScaling: "normal" | "large" | "x-large";
  highContrast?: boolean;
  reducedMotion?: boolean;
  preferredConsultationType?: "video" | "audio" | "chat";
  defaultCity?: string;
  telehealthConsent?: boolean;
  pharmacyDataSharing?: boolean;
  healthDataConsent?: boolean;
  twoFactorEnabled: boolean;
  activeSessions: {
    id: string;
    device: string;
    browser: string;
    ipAddress: string;
    lastActive: string;
    isCurrent: boolean;
  }[];
}

export interface VerificationSession {
  identifier: string;
  code: string;
  type: "registration" | "two_factor" | "password_recovery";
  expiresAt: number;
  attempts: number;
}

// ------------------------------------------------------------------------------
// HEALTH ASSESSMENT SYSTEM TYPES
// ------------------------------------------------------------------------------

export interface SymptomItem {
  id: string;
  name: string;
  category: string;
  severity: number; // 1 to 10
  durationDays: number;
  frequency: "constant" | "intermittent" | "worsening";
  notes?: string;
}

export interface PossibleCondition {
  name: string;
  matchPercentage: number;
  description: string;
  urgency: "low" | "moderate" | "high" | "emergency";
  explanation: string;
}

export interface HealthAssessmentRecord {
  id: string;
  patientId: string;
  title: string;
  symptoms: SymptomItem[];
  assessmentSummary: string;
  possibleConditions: PossibleCondition[];
  urgencyLevel: "low" | "moderate" | "high" | "emergency";
  confidenceScore: number;
  recommendations: string[];
  nextStepAction: string;
  recommendedSpecialization: string;
  status: "active" | "reviewed" | "archived";
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SymptomProgressPoint {
  day: number;
  date: string;
  severity: number;
  notes: string;
  status: "improving" | "stable" | "worsening" | "resolved";
}

export interface SymptomTrackerRecord {
  id: string;
  patientId: string;
  assessmentId?: string;
  symptomName: string;
  severity: number;
  status: "improving" | "stable" | "worsening" | "resolved";
  daysActive: number;
  timeline: SymptomProgressPoint[];
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// CONSULTATION SYSTEM TYPES
// ------------------------------------------------------------------------------

export type AppointmentType = "video" | "audio" | "chat" | "in_person";
export type AppointmentStatus = "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "rescheduled";

export interface DoctorDiscoveryItem {
  id: string;
  userId: string;
  prefix: string;
  fullName: string;
  specialization: string;
  qualifications: string;
  yearsOfExperience: number;
  clinicAddress: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  availableDays: string[];
  availableSlots: string[];
  isVerified: boolean;
  avatarUrl?: string;
  languages: string[];
  about: string;
}

export interface ConsultationAppointment {
  id: string;
  patientId: string;
  patientName?: string;
  professionalId: string;
  doctorName?: string;
  doctorSpecialization?: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason?: string;
  assessmentId?: string;
  meetingLink?: string;
  feeAmount: number;
  paymentStatus: "pending" | "paid" | "refunded";
  notes?: string;
  summaryId?: string;
  prescriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationSummary {
  id: string;
  appointmentId: string;
  professionalId: string;
  patientId: string;
  doctorName?: string;
  patientName?: string;
  clinicalDiagnosis: string;
  doctorNotes: string;
  recommendations: string[];
  followUpDate?: string;
  followUpInstructions?: string;
  prescriptionId?: string;
  prescriptionCode?: string;
  status: "draft" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationReview {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName?: string;
  professionalId: string;
  rating: number; // 1 to 5
  reviewText?: string;
  tags: string[];
  isAnonymous: boolean;
  createdAt: string;
}

// ------------------------------------------------------------------------------
// PRESCRIPTION SYSTEM TYPES
// ------------------------------------------------------------------------------

export interface PrescribedMedicineItem {
  id: string;
  medicationId?: string;
  medicineName: string;
  dosage: string; // e.g. "500 mg" or "1 tablet"
  frequency: string; // e.g. "Twice daily after meals (1-0-1)"
  duration: string; // e.g. "5 days"
  instructions: string; // e.g. "Take with a full glass of water"
  isDispensed?: boolean;
}

export interface PrescriptionRecord {
  id: string;
  prescriptionCode: string; // e.g. "RX-2026-9281A"
  appointmentId?: string;
  patientId: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  professionalId: string;
  doctorName: string;
  doctorLicenseNumber: string;
  doctorCouncil: string;
  doctorSpecialization: string;
  diagnosis: string;
  medications: PrescribedMedicineItem[];
  generalAdvice?: string;
  digitalSignature: string; // Cryptographic verification hash
  validUntil: string;
  status: "active" | "dispensed" | "expired" | "revoked";
  pharmacyDispatchStatus: "not_ordered" | "cart_added" | "ordered" | "dispatched" | "delivered";
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// MEDICATION SYSTEM TYPES
// ------------------------------------------------------------------------------

export type MedicationCategory =
  | "fever_pain"
  | "cold_cough"
  | "digestive"
  | "allergies"
  | "skin_care"
  | "vitamins_supplements"
  | "cardiac"
  | "diabetes"
  | "antibiotics";

export interface MedicationItem {
  id: string;
  name: string;
  genericName: string;
  brandName?: string;
  category: MedicationCategory;
  dosageForm: "Tablet" | "Capsule" | "Syrup" | "Ointment" | "Drops" | "Inhaler";
  strength: string;
  packSize: string;
  price: number; // INR
  stock?: number;
  prescriptionRequired: boolean;
  usageInstructions: string;
  safetyWarnings: string;
  sideEffects: string[];
  inStock: boolean;
  manufacturer: string;
  imageUrl?: string;
}

export interface MedicationCartItem {
  id: string;
  patientId: string;
  medicationId: string;
  medication: MedicationItem;
  prescriptionId?: string;
  prescriptionCode?: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// REVIEW SYSTEM TYPES (Clinical Reviews & Professional Verification)
// ------------------------------------------------------------------------------

export type ClinicalReviewType = "assessment_review" | "medication_approval" | "prescription_endorsement";
export type ClinicalReviewStatus = "pending" | "approved" | "modification_recommended" | "rejected";

export interface ClinicalReviewRecord {
  id: string;
  professionalId: string;
  professionalName?: string;
  patientId: string;
  patientName?: string;
  assessmentId?: string;
  assessmentTitle?: string;
  prescriptionId?: string;
  reviewType: ClinicalReviewType;
  status: ClinicalReviewStatus;
  clinicalNotes: string;
  prescribedActions: string[];
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// PAYMENT & TRANSACTION SYSTEM TYPES
// ------------------------------------------------------------------------------

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cod";
export type PaymentStatus = "success" | "pending" | "failed" | "refunded";
export type ServiceType = "consultation" | "medicine_order" | "lab_test" | "subscription";

export interface PaymentTransaction {
  id: string;
  transactionCode: string; // TXN-2026-XXXXXX
  userId: string;
  userName?: string;
  serviceType: ServiceType;
  referenceId?: string; // appointment_id or order_id
  referenceTitle?: string;
  amount: number;
  taxAmount: number; // 18% or 12% GST breakdown
  discountAmount?: number;
  paymentMethod: PaymentMethod;
  paymentGatewayRef: string;
  status: PaymentStatus;
  receiptUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentBreakdown {
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
}

// ------------------------------------------------------------------------------
// ORDER SYSTEM FOR MEDICINES TYPES
// ------------------------------------------------------------------------------

export type OrderStatus =
  | "placed"
  | "pharmacist_verified"
  | "packed"
  | "dispatched"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface PharmacyOrderItem {
  medicationId: string;
  medicineName: string;
  genericName: string;
  dosageForm: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  prescriptionRequired: boolean;
}

export interface TrackingStage {
  stage: OrderStatus;
  title: string;
  description: string;
  timestamp?: string;
  location?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface PharmacyOrder {
  id: string;
  orderCode: string; // ORD-2026-XXXXX
  patientId: string;
  patientName?: string;
  prescriptionId?: string;
  prescriptionCode?: string;
  items: PharmacyOrderItem[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  deliveryAddress: DeliveryAddress;
  orderStatus: OrderStatus;
  trackingTimeline: TrackingStage[];
  courierPartner: string;
  trackingNumber: string;
  estimatedDelivery: string;
  paymentId?: string;
  paymentStatus: "pending" | "paid" | "cod" | "refunded";
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------
// NOTIFICATION & TRACKING SYSTEM TYPES
// ------------------------------------------------------------------------------

export type NotificationType =
  | "assessment"
  | "consultation"
  | "order"
  | "payment"
  | "prescription"
  | "record"
  | "system";

export type NotificationPriority = "low" | "normal" | "high" | "urgent";

export interface UserNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  isRead: boolean;
  priority: NotificationPriority;
  createdAt: string;
}

export interface LiveTrackingSummary {
  activeAppointmentsCount: number;
  activeOrdersCount: number;
  activeSymptomTrackersCount: number;
  pendingFollowUpsCount: number;
  unreadNotificationsCount: number;
  nextAppointment?: ConsultationAppointment;
  activeOrder?: PharmacyOrder;
}

// ------------------------------------------------------------------------------
// RECORDS SYSTEM TYPES (Health Records & Care Follow-ups)
// ------------------------------------------------------------------------------

export type RecordType =
  | "assessment_report"
  | "prescription"
  | "lab_report"
  | "consultation_summary"
  | "vaccination"
  | "discharge_summary"
  | "uploaded_document";

export interface MedicalRecordItem {
  id: string;
  patientId: string;
  recordType: RecordType;
  title: string;
  category: "Prescription" | "Diagnostic Report" | "Consultation Note" | "Vaccine Certificate" | "Health Assessment" | "Other";
  documentUrl?: string;
  fileSize?: string;
  fileType?: string;
  recordDate: string; // YYYY-MM-DD
  doctorOrFacility?: string;
  notes?: string;
  isConfidential: boolean;
  tags: string[];
  linkedEntityId?: string; // ID of assessment, appointment, or prescription
  createdAt: string;
  updatedAt: string;
}

export type FollowUpType = "doctor_review" | "symptom_recheck" | "medication_refill" | "lab_test";
export type FollowUpStatus = "pending" | "completed" | "missed" | "cancelled";

export interface CareFollowUpItem {
  id: string;
  patientId: string;
  professionalId?: string;
  doctorName?: string;
  consultationId?: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  status: FollowUpStatus;
  followUpType: FollowUpType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}




