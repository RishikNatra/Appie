import { DoctorDiscoveryItem } from "./types";

export const DOCTORS_CATALOG: DoctorDiscoveryItem[] = [
  {
    id: "doc-priya-sharma",
    userId: "user-doc-priya",
    prefix: "Dr.",
    fullName: "Priya Sharma",
    specialization: "General Physician",
    qualifications: "MBBS, MD (Internal Medicine) - AIIMS New Delhi",
    yearsOfExperience: 11,
    clinicAddress: "Apollo Clinic, Indiranagar, Bengaluru, Karnataka 560038",
    consultationFee: 499,
    rating: 4.9,
    reviewCount: 142,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableSlots: ["09:00 AM", "10:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"],
    isVerified: true,
    languages: ["English", "Hindi", "Kannada"],
    about: "Dr. Priya Sharma specializes in routine acute illness assessment, preventive care, fever diagnostics, lifestyle disorders, and telemedicine consultation following national clinical protocols.",
  },
  {
    id: "doc-rajesh-kumar",
    userId: "user-doc-rajesh",
    prefix: "Dr.",
    fullName: "Rajesh Kumar",
    specialization: "Pulmonology & Respiratory Care",
    qualifications: "MBBS, DTCD, DNB (Respiratory Diseases) - CMC Vellore",
    yearsOfExperience: 15,
    clinicAddress: "Metro Chest & Allergy Center, Saket, New Delhi 110017",
    consultationFee: 650,
    rating: 4.8,
    reviewCount: 98,
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"],
    availableSlots: ["10:00 AM", "11:30 AM", "03:00 PM", "05:00 PM"],
    isVerified: true,
    languages: ["English", "Hindi", "Punjabi"],
    about: "Senior Pulmonologist with over 15 years experience in managing seasonal allergic bronchitis, post-viral cough, asthma, chest congestion, and digital respiratory triage.",
  },
  {
    id: "doc-ananya-iyer",
    userId: "user-doc-ananya",
    prefix: "Dr.",
    fullName: "Ananya Iyer",
    specialization: "Dermatology & Cosmetology",
    qualifications: "MBBS, MD (Dermatology, Venereology & Leprosy) - Madras Medical College",
    yearsOfExperience: 8,
    clinicAddress: "DermaCare Clinic, T. Nagar, Chennai, Tamil Nadu 600017",
    consultationFee: 550,
    rating: 4.9,
    reviewCount: 176,
    availableDays: ["Tuesday", "Thursday", "Friday", "Sunday"],
    availableSlots: ["11:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"],
    isVerified: true,
    languages: ["English", "Tamil", "Hindi"],
    about: "Expert in treating eczema, contact dermatitis, acute urticaria, fungal infections, acne management, and telehealth visual skin evaluation.",
  },
  {
    id: "doc-arjun-mehta",
    userId: "user-doc-arjun",
    prefix: "Dr.",
    fullName: "Arjun Mehta",
    specialization: "Gastroenterology & Hepatology",
    qualifications: "MBBS, MD, DM (Gastroenterology) - KEM Hospital Mumbai",
    yearsOfExperience: 14,
    clinicAddress: "Digestive Health Clinic, Bandra West, Mumbai, Maharashtra 400050",
    consultationFee: 750,
    rating: 4.7,
    reviewCount: 84,
    availableDays: ["Monday", "Tuesday", "Thursday", "Saturday"],
    availableSlots: ["09:30 AM", "12:00 PM", "03:30 PM", "06:30 PM"],
    isVerified: true,
    languages: ["English", "Hindi", "Gujarati", "Marathi"],
    about: "Leading consultant for acute gastrointestinal disturbances, acidity/GERD, irritable bowel syndrome, gastritis, and digestive health monitoring.",
  },
  {
    id: "doc-sneha-patel",
    userId: "user-doc-sneha",
    prefix: "Dr.",
    fullName: "Sneha Patel",
    specialization: "Pediatrics & Family Medicine",
    qualifications: "MBBS, DCH (Pediatrics) - BJ Medical College Ahmedabad",
    yearsOfExperience: 10,
    clinicAddress: "Child & Family Clinic, Satellite, Ahmedabad, Gujarat 380015",
    consultationFee: 450,
    rating: 4.9,
    reviewCount: 129,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    availableSlots: ["10:00 AM", "11:30 AM", "02:30 PM", "05:00 PM"],
    isVerified: true,
    languages: ["English", "Hindi", "Gujarati"],
    about: "Dedicated family practitioner and pediatrician guiding parents on child nutrition, seasonal infections, fever protocols, vaccinations, and home remedies.",
  },
  {
    id: "doc-vikram-singh",
    userId: "user-doc-vikram",
    prefix: "Dr.",
    fullName: "Vikram Singh",
    specialization: "Cardiology & Vascular Medicine",
    qualifications: "MBBS, MD, DM (Cardiology) - PGI Chandigarh",
    yearsOfExperience: 18,
    clinicAddress: "Heart Care Institute, Sector 34, Chandigarh 160022",
    consultationFee: 799,
    rating: 4.9,
    reviewCount: 215,
    availableDays: ["Tuesday", "Wednesday", "Thursday", "Saturday"],
    availableSlots: ["10:00 AM", "12:30 PM", "04:00 PM", "06:00 PM"],
    isVerified: true,
    languages: ["English", "Hindi", "Punjabi"],
    about: "Senior Cardiologist specializing in hypertension management, cardiac risk reduction, palpitations, lifestyle guidance, and regular digital cardiovascular follow-ups.",
  },
];

export const SPECIALIZATION_LIST = [
  "All Specializations",
  "General Physician",
  "Pulmonology & Respiratory Care",
  "Dermatology & Cosmetology",
  "Gastroenterology & Hepatology",
  "Pediatrics & Family Medicine",
  "Cardiology & Vascular Medicine",
];

export function getAllDoctors(): DoctorDiscoveryItem[] {
  return DOCTORS_CATALOG;
}

export function getDoctorById(id: string): DoctorDiscoveryItem | undefined {
  return DOCTORS_CATALOG.find((d) => d.id === id || d.userId === id);
}

export function filterDoctors(params: {
  query?: string;
  specialization?: string;
  maxFee?: number;
}): DoctorDiscoveryItem[] {
  let list = [...DOCTORS_CATALOG];

  if (params.specialization && params.specialization !== "All Specializations") {
    list = list.filter((d) => d.specialization.toLowerCase().includes(params.specialization!.toLowerCase()));
  }

  if (params.maxFee && params.maxFee > 0) {
    list = list.filter((d) => d.consultationFee <= params.maxFee!);
  }

  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    list = list.filter(
      (d) =>
        d.fullName.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.qualifications.toLowerCase().includes(q) ||
        d.clinicAddress.toLowerCase().includes(q)
    );
  }

  return list;
}

