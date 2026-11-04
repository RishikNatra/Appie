import { MedicationItem, MedicationCategory } from "./types";

export const MEDICATIONS_CATALOG: MedicationItem[] = [
  // FEVER & PAIN (OTC & Rx)
  {
    id: "med-paracetamol-650",
    name: "Dolo 650 (Paracetamol)",
    genericName: "Paracetamol 650mg",
    brandName: "Micro Labs",
    category: "fever_pain",
    dosageForm: "Tablet",
    strength: "650 mg",
    packSize: "Strip of 15 tablets",
    price: 32.5,
    prescriptionRequired: false,
    usageInstructions: "Take 1 tablet every 6-8 hours after food as needed for fever or mild pain. Maximum 4 tablets in 24 hours.",
    safetyWarnings: "Do not exceed maximum daily limit of 4000mg. Avoid alcohol consumption while on paracetamol to avoid hepatotoxicity.",
    sideEffects: ["Mild nausea", "Rash (rare)", "Sweating"],
    inStock: true,
    manufacturer: "Micro Labs Ltd",
  },
  {
    id: "med-ibuprofen-paracetamol",
    name: "Combiflam",
    genericName: "Ibuprofen 400mg + Paracetamol 325mg",
    brandName: "Sanofi India",
    category: "fever_pain",
    dosageForm: "Tablet",
    strength: "400mg / 325mg",
    packSize: "Strip of 20 tablets",
    price: 48.0,
    prescriptionRequired: false,
    usageInstructions: "Take 1 tablet twice daily with food or milk to prevent gastric irritation.",
    safetyWarnings: "Not recommended for patients with peptic ulcer disease, severe renal impairment, or third trimester of pregnancy.",
    sideEffects: ["Heartburn", "Stomach upset", "Dizziness"],
    inStock: true,
    manufacturer: "Sanofi Consumer Healthcare",
  },
  {
    id: "med-tramadol-paracetamol",
    name: "Ultracet",
    genericName: "Tramadol Hydrochloride 37.5mg + Paracetamol 325mg",
    brandName: "Johnson & Johnson",
    category: "fever_pain",
    dosageForm: "Tablet",
    strength: "37.5mg / 325mg",
    packSize: "Strip of 10 tablets",
    price: 195.0,
    prescriptionRequired: true,
    usageInstructions: "Take 1 tablet every 8 hours as prescribed by physician for moderate to severe acute pain.",
    safetyWarnings: "Schedule H prescription drug. Can cause drowsiness and physical dependence. Do not drive or operate machinery.",
    sideEffects: ["Drowsiness", "Constipation", "Nausea", "Headache"],
    inStock: true,
    manufacturer: "Janssen Pharmaceuticals",
  },

  // COLD & COUGH
  {
    id: "med-cetirizine-10",
    name: "Cetzine 10",
    genericName: "Cetirizine Hydrochloride 10mg",
    brandName: "Dr. Reddy's",
    category: "cold_cough",
    dosageForm: "Tablet",
    strength: "10 mg",
    packSize: "Strip of 10 tablets",
    price: 21.0,
    prescriptionRequired: false,
    usageInstructions: "Take 1 tablet once daily, preferably at bedtime.",
    safetyWarnings: "May cause mild sedation. Avoid alcohol during treatment.",
    sideEffects: ["Dry mouth", "Mild drowsiness", "Fatigue"],
    inStock: true,
    manufacturer: "Dr. Reddy's Laboratories",
  },
  {
    id: "med-levocetirizine-montelukast",
    name: "Montair LC",
    genericName: "Levocetirizine 5mg + Montelukast 10mg",
    brandName: "Cipla",
    category: "cold_cough",
    dosageForm: "Tablet",
    strength: "5mg / 10mg",
    packSize: "Strip of 10 tablets",
    price: 185.0,
    prescriptionRequired: true,
    usageInstructions: "Take 1 tablet at night for allergic rhinitis and chronic bronchial allergies.",
    safetyWarnings: "Monitor for neuropsychiatric changes. Inform doctor if mood alterations occur.",
    sideEffects: ["Headache", "Somnolence", "Upper respiratory tract infection symptoms"],
    inStock: true,
    manufacturer: "Cipla Healthcare",
  },
  {
    id: "med-benadryl-syrup",
    name: "Benadryl Cough Formula",
    genericName: "Diphenhydramine HCl 14mg + Ammonium Chloride 138mg / 5ml",
    brandName: "Johnson & Johnson",
    category: "cold_cough",
    dosageForm: "Syrup",
    strength: "100 ml bottle",
    packSize: "Bottle of 100 ml",
    price: 112.0,
    prescriptionRequired: false,
    usageInstructions: "Adults: 5-10 ml (1-2 teaspoons) every 4 hours. Do not exceed 6 doses in 24 hours.",
    safetyWarnings: "Causes marked drowsiness. Do not drive or handle heavy machines.",
    sideEffects: ["Drowsiness", "Dryness in mouth and throat"],
    inStock: true,
    manufacturer: "Janssen India",
  },

  // DIGESTIVE HEALTH
  {
    id: "med-pantoprazole-40",
    name: "Pan 40",
    genericName: "Pantoprazole Sodium 40mg",
    brandName: "Alkem",
    category: "digestive",
    dosageForm: "Tablet",
    strength: "40 mg",
    packSize: "Strip of 15 tablets",
    price: 155.0,
    prescriptionRequired: false,
    usageInstructions: "Take 1 tablet in the morning 30 minutes before breakfast with water.",
    safetyWarnings: "Swallow whole; do not chew or crush. Long-term use (>1 year) may decrease magnesium absorption.",
    sideEffects: ["Headache", "Diarrhea", "Flatulence"],
    inStock: true,
    manufacturer: "Alkem Laboratories",
  },
  {
    id: "med-domperidone-rabeprazole",
    name: "Razo-D",
    genericName: "Rabeprazole 20mg + Domperidone 30mg SR",
    brandName: "Dr. Reddy's",
    category: "digestive",
    dosageForm: "Capsule",
    strength: "20mg / 30mg",
    packSize: "Strip of 10 capsules",
    price: 215.0,
    prescriptionRequired: true,
    usageInstructions: "Take 1 capsule once daily before breakfast for GERD with nausea or acid reflux.",
    safetyWarnings: "Contraindicated in patients with prolactinoma or severe cardiac rhythm disorders.",
    sideEffects: ["Dry mouth", "Transient headache", "Abdominal pain"],
    inStock: true,
    manufacturer: "Dr. Reddy's Laboratories",
  },
  {
    id: "med-ors-electral",
    name: "Electral Oral Rehydration Salts",
    genericName: "WHO Recommended ORS Formulation",
    brandName: "FDC Ltd",
    category: "digestive",
    dosageForm: "Syrup", // Powder solution
    strength: "21.8 g sachet",
    packSize: "Pack of 5 sachets",
    price: 45.0,
    prescriptionRequired: false,
    usageInstructions: "Dissolve entire contents of one sachet in 1 liter of clean drinking water. Consume within 24 hours.",
    safetyWarnings: "Do not boil after reconstitution. Use cautiously in patients with renal failure or diabetes.",
    sideEffects: ["Hypernatremia if prepared too concentrated"],
    inStock: true,
    manufacturer: "FDC Limited",
  },

  // ALLERGIES
  {
    id: "med-allegra-120",
    name: "Allegra 120",
    genericName: "Fexofenadine Hydrochloride 120mg",
    brandName: "Sanofi India",
    category: "allergies",
    dosageForm: "Tablet",
    strength: "120 mg",
    packSize: "Strip of 10 tablets",
    price: 198.0,
    prescriptionRequired: false,
    usageInstructions: "Take 1 tablet once daily before meals with water. Non-drowsy formulation.",
    safetyWarnings: "Avoid drinking fruit juices (apple, orange, grapefruit) within 4 hours of dosing as it reduces absorption.",
    sideEffects: ["Nausea", "Headache", "Dizziness (rare)"],
    inStock: true,
    manufacturer: "Sanofi India Ltd",
  },

  // SKIN CARE
  {
    id: "med-calamine-lotion",
    name: "Lacto Calamine Skin Balance Daily",
    genericName: "Zinc Oxide + Kaolin + Castor Oil",
    brandName: "Piramal Healthcare",
    category: "skin_care",
    dosageForm: "Ointment",
    strength: "120 ml",
    packSize: "Bottle of 120 ml",
    price: 180.0,
    prescriptionRequired: false,
    usageInstructions: "Shake bottle well. Apply a thin layer to clean skin 1-2 times daily.",
    safetyWarnings: "For external topical use only. Avoid contact with eyes and mucous membranes.",
    sideEffects: ["Mild dryness if overused"],
    inStock: true,
    manufacturer: "Piramal Enterprises",
  },
  {
    id: "med-clotrimazole-cream",
    name: "Candid Cream",
    genericName: "Clotrimazole 1% w/w",
    brandName: "Glenmark",
    category: "skin_care",
    dosageForm: "Ointment",
    strength: "1% w/w 30g",
    packSize: "Tube of 30g",
    price: 110.0,
    prescriptionRequired: false,
    usageInstructions: "Apply gently to the affected area 2 to 3 times daily for 2 to 4 weeks.",
    safetyWarnings: "Wash hands thoroughly before and after application. Discontinue if severe irritation develops.",
    sideEffects: ["Local burning", "Mild erythema", "Stinging sensation"],
    inStock: true,
    manufacturer: "Glenmark Pharmaceuticals",
  },

  // VITAMINS & SUPPLEMENTS
  {
    id: "med-vitamin-c-zinc",
    name: "Limcee Plus (Vitamin C + Zinc)",
    genericName: "Ascorbic Acid 500mg + Zinc 5mg",
    brandName: "Abbott",
    category: "vitamins_supplements",
    dosageForm: "Tablet",
    strength: "500mg + 5mg",
    packSize: "Strip of 15 chewable tablets",
    price: 42.0,
    prescriptionRequired: false,
    usageInstructions: "Chew 1 tablet daily after food.",
    safetyWarnings: "Do not swallow whole. Chew thoroughly. Do not exceed suggested daily dose.",
    sideEffects: ["Mild stomach upset if taken on an empty stomach"],
    inStock: true,
    manufacturer: "Abbott Healthcare",
  },
  {
    id: "med-calcium-vitamin-d3",
    name: "Shelcal 500",
    genericName: "Calcium 500mg + Vitamin D3 250 IU",
    brandName: "Torrent",
    category: "vitamins_supplements",
    dosageForm: "Tablet",
    strength: "500mg / 250 IU",
    packSize: "Strip of 15 tablets",
    price: 132.0,
    prescriptionRequired: false,
    usageInstructions: "Take 1 tablet daily after lunch or dinner with water.",
    safetyWarnings: "Contraindicated in hypercalcemia or severe kidney stones.",
    sideEffects: ["Mild constipation", "Bloating"],
    inStock: true,
    manufacturer: "Torrent Pharmaceuticals",
  },

  // ANTIBIOTICS (Strictly Prescription Required)
  {
    id: "med-azithromycin-500",
    name: "Azithral 500",
    genericName: "Azithromycin 500mg",
    brandName: "Alembic",
    category: "antibiotics",
    dosageForm: "Tablet",
    strength: "500 mg",
    packSize: "Strip of 5 tablets",
    price: 125.0,
    prescriptionRequired: true,
    usageInstructions: "Take 1 tablet once daily for 3 to 5 days, preferably 1 hour before or 2 hours after meals.",
    safetyWarnings: "SCHEDULE H1 PRESCRIPTION DRUG. Complete full course even if feeling better to avoid antibiotic resistance. Caution with QT prolongation.",
    sideEffects: ["Abdominal cramps", "Loose stools", "Nausea"],
    inStock: true,
    manufacturer: "Alembic Pharmaceuticals",
  },
  {
    id: "med-amoxicillin-clavulanate",
    name: "Augmentin 625 Duo",
    genericName: "Amoxicillin 500mg + Clavulanic Acid 125mg",
    brandName: "GSK India",
    category: "antibiotics",
    dosageForm: "Tablet",
    strength: "625 mg",
    packSize: "Strip of 10 tablets",
    price: 204.0,
    prescriptionRequired: true,
    usageInstructions: "Take 1 tablet twice daily with meals for 5 to 7 days as prescribed by clinician.",
    safetyWarnings: "SCHEDULE H1 DRUG. Check for penicillin allergies before ingestion. Report severe diarrhea promptly.",
    sideEffects: ["Diarrhea", "Vomiting", "Skin rash (allergic reaction)"],
    inStock: true,
    manufacturer: "GlaxoSmithKline Pharmaceuticals",
  },

  // CARDIAC & HYPERTENSION (Prescription Required)
  {
    id: "med-amlodipine-5",
    name: "Amlong 5",
    genericName: "Amlodipine Besylate 5mg",
    brandName: "Micro Labs",
    category: "cardiac",
    dosageForm: "Tablet",
    strength: "5 mg",
    packSize: "Strip of 15 tablets",
    price: 49.0,
    prescriptionRequired: true,
    usageInstructions: "Take 1 tablet once daily at the same time every day.",
    safetyWarnings: "Do not stop abruptly without consulting your cardiologist. Monitor blood pressure periodically.",
    sideEffects: ["Peripheral ankle swelling", "Flushing", "Dizziness"],
    inStock: true,
    manufacturer: "Micro Labs Ltd",
  },
  {
    id: "med-telmisartan-40",
    name: "Telma 40",
    genericName: "Telmisartan 40mg",
    brandName: "Glenmark",
    category: "cardiac",
    dosageForm: "Tablet",
    strength: "40 mg",
    packSize: "Strip of 30 tablets",
    price: 245.0,
    prescriptionRequired: true,
    usageInstructions: "Take 1 tablet once daily morning or evening with water.",
    safetyWarnings: "Contraindicated in pregnancy. Monitor serum potassium and creatinine regularly.",
    sideEffects: ["Dizziness", "Fatigue", "Back pain"],
    inStock: true,
    manufacturer: "Glenmark Pharmaceuticals",
  },

  // DIABETES (Prescription Required)
  {
    id: "med-metformin-500",
    name: "Glycomet 500 SR",
    genericName: "Metformin Hydrochloride Sustained Release 500mg",
    brandName: "USV India",
    category: "diabetes",
    dosageForm: "Tablet",
    strength: "500 mg",
    packSize: "Strip of 20 tablets",
    price: 52.0,
    prescriptionRequired: true,
    usageInstructions: "Take 1 tablet twice daily with or immediately after meals.",
    safetyWarnings: "Swallow sustained release tablet whole; do not break. Discontinue prior to iodinated radiocontrast procedures.",
    sideEffects: ["Metallic taste", "Flatulence", "Mild stomach discomfort"],
    inStock: true,
    manufacturer: "USV Private Limited",
  },
];

export const MEDICATION_CATEGORIES: { id: MedicationCategory; label: string; count?: number }[] = [
  { id: "fever_pain", label: "Fever & Pain Relief" },
  { id: "cold_cough", label: "Cold, Cough & Flu" },
  { id: "digestive", label: "Digestive & Acidity" },
  { id: "allergies", label: "Allergies & Antihistamines" },
  { id: "skin_care", label: "Dermatology & Skin" },
  { id: "vitamins_supplements", label: "Vitamins & Immunity" },
  { id: "antibiotics", label: "Antibiotics (Rx Only)" },
  { id: "cardiac", label: "Cardiac & BP (Rx Only)" },
  { id: "diabetes", label: "Diabetes Care (Rx Only)" },
];

export function getAllMedications(): MedicationItem[] {
  return MEDICATIONS_CATALOG;
}

export function getMedicationById(id: string): MedicationItem | undefined {
  return MEDICATIONS_CATALOG.find((m) => m.id === id);
}

export function filterMedications(params: {
  query?: string;
  category?: MedicationCategory | "all";
  prescriptionOnly?: boolean;
  otcOnly?: boolean;
}): MedicationItem[] {
  let results = [...MEDICATIONS_CATALOG];

  if (params.category && params.category !== "all") {
    results = results.filter((m) => m.category === params.category);
  }

  if (params.prescriptionOnly) {
    results = results.filter((m) => m.prescriptionRequired === true);
  } else if (params.otcOnly) {
    results = results.filter((m) => m.prescriptionRequired === false);
  }

  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    results = results.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.genericName.toLowerCase().includes(q) ||
        (m.brandName && m.brandName.toLowerCase().includes(q)) ||
        m.usageInstructions.toLowerCase().includes(q)
    );
  }

  return results;
}

