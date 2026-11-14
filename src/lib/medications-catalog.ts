import { MedicationItem, MedicationCategory } from "./types";

export const MEDICATION_UUID_MAP: Record<string, string> = {
  "e0000000-0000-0000-0000-000000000001": "med-paracetamol-650",
  "e0000000-0000-0000-0000-000000000002": "med-ibuprofen-paracetamol",
  "e0000000-0000-0000-0000-000000000003": "med-tramadol-paracetamol",
  "e0000000-0000-0000-0000-000000000004": "med-cetirizine-10",
  "e0000000-0000-0000-0000-000000000005": "med-ascoril-d-syrup",
  "e0000000-0000-0000-0000-000000000006": "med-amoxicillin-clavulanate",
  "e0000000-0000-0000-0000-000000000007": "med-pantoprazole-40",
  "e0000000-0000-0000-0000-000000000008": "med-gelusil-liquid",
  "e0000000-0000-0000-0000-000000000009": "med-azithromycin-500",
  "e0000000-0000-0000-0000-000000000010": "med-allegra-120",
  "e0000000-0000-0000-0000-000000000011": "med-telmisartan-40",
  "e0000000-0000-0000-0000-000000000012": "med-metformin-500",
  "e0000000-0000-0000-0000-000000000013": "med-neurobion-forte",
  "e0000000-0000-0000-0000-000000000014": "med-calcium-vitamin-d3",
  "e0000000-0000-0000-0000-000000000015": "med-becosules-capsules",
  "e0000000-0000-0000-0000-000000000016": "med-otrivin-spray",
  "e0000000-0000-0000-0000-000000000017": "med-volini-gel",
  "e0000000-0000-0000-0000-000000000018": "med-digene-gel",
  "e0000000-0000-0000-0000-000000000019": "med-sinarest-tab",
  "e0000000-0000-0000-0000-000000000020": "med-levocetirizine-montelukast",
};

export const MEDICATION_SLUG_TO_UUID: Record<string, string> = {
  "med-paracetamol-650": "e0000000-0000-0000-0000-000000000001",
  "med-ibuprofen-paracetamol": "e0000000-0000-0000-0000-000000000002",
  "med-tramadol-paracetamol": "e0000000-0000-0000-0000-000000000003",
  "med-cetirizine-10": "e0000000-0000-0000-0000-000000000004",
  "med-ascoril-d-syrup": "e0000000-0000-0000-0000-000000000005",
  "med-amoxicillin-clavulanate": "e0000000-0000-0000-0000-000000000006",
  "med-pantoprazole-40": "e0000000-0000-0000-0000-000000000007",
  "med-gelusil-liquid": "e0000000-0000-0000-0000-000000000008",
  "med-azithromycin-500": "e0000000-0000-0000-0000-000000000009",
  "med-allegra-120": "e0000000-0000-0000-0000-000000000010",
  "med-telmisartan-40": "e0000000-0000-0000-0000-000000000011",
  "med-metformin-500": "e0000000-0000-0000-0000-000000000012",
  "med-neurobion-forte": "e0000000-0000-0000-0000-000000000013",
  "med-calcium-vitamin-d3": "e0000000-0000-0000-0000-000000000014",
  "med-becosules-capsules": "e0000000-0000-0000-0000-000000000015",
  "med-otrivin-spray": "e0000000-0000-0000-0000-000000000016",
  "med-volini-gel": "e0000000-0000-0000-0000-000000000017",
  "med-digene-gel": "e0000000-0000-0000-0000-000000000018",
  "med-sinarest-tab": "e0000000-0000-0000-0000-000000000019",
  "med-levocetirizine-montelukast": "e0000000-0000-0000-0000-000000000020",
  "med-benadryl-syrup": "e0000000-0000-0000-0000-000000000016",
  "med-vitamin-c-zinc": "e0000000-0000-0000-0000-000000000015",
};

export function resolveMedicationUuid(id: string): string {
  if (!id) return "e0000000-0000-0000-0000-000000000001";
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(id)) return id;
  return MEDICATION_SLUG_TO_UUID[id] || "e0000000-0000-0000-0000-000000000001";
}

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
  {
    id: "med-volini-gel",
    name: "Volini Pain Relief Gel",
    genericName: "Diclofenac Diethylamine + Linseed Oil + Menthol",
    brandName: "Sun Pharma",
    category: "fever_pain",
    dosageForm: "Gel",
    strength: "Topical Gel",
    packSize: "50 g tube",
    price: 155.0,
    prescriptionRequired: false,
    usageInstructions: "Apply 3-4 times daily with gentle massage on the affected muscular or joint area.",
    safetyWarnings: "For external use only. Do not apply on open cuts, wounds, or eyes.",
    sideEffects: ["Skin redness", "Mild burning sensation"],
    inStock: true,
    manufacturer: "Sun Pharmaceutical Industries",
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
    price: 42.0,
    prescriptionRequired: false,
    usageInstructions: "Take 1 tablet once daily, preferably at bedtime.",
    safetyWarnings: "May cause mild sedation. Avoid alcohol during treatment.",
    sideEffects: ["Dry mouth", "Mild drowsiness", "Fatigue"],
    inStock: true,
    manufacturer: "Dr. Reddy's Laboratories",
  },
  {
    id: "med-ascoril-d-syrup",
    name: "Ascoril-D Plus Syrup",
    genericName: "Dextromethorphan + Phenylephrine + Chlorpheniramine",
    brandName: "Glenmark",
    category: "cold_cough",
    dosageForm: "Syrup",
    strength: "100 ml bottle",
    packSize: "100 ml bottle",
    price: 135.0,
    prescriptionRequired: false,
    usageInstructions: "Take 10ml (2 teaspoons) three times daily for dry, irritating cough.",
    safetyWarnings: "Not suitable for productive cough with excessive phlegm.",
    sideEffects: ["Mild dizziness", "Nausea", "Restlessness"],
    inStock: true,
    manufacturer: "Glenmark Pharmaceuticals",
  },
  {
    id: "med-sinarest-tab",
    name: "Sinarest Tablet",
    genericName: "Paracetamol + Phenylephrine + Chlorpheniramine Maleate",
    brandName: "Centaur",
    category: "cold_cough",
    dosageForm: "Tablet",
    strength: "Composite formula",
    packSize: "Strip of 10 tablets",
    price: 72.0,
    prescriptionRequired: false,
    usageInstructions: "Take 1 tablet every 8 hours after food for relief from head cold, fever, and sinus congestion.",
    safetyWarnings: "Avoid concurrent consumption with other paracetamol products or sedatives.",
    sideEffects: ["Drowsiness", "Dry mouth"],
    inStock: true,
    manufacturer: "Centaur Pharmaceuticals",
  },
  {
    id: "med-otrivin-spray",
    name: "Otrivin Oxy Fast Relief",
    genericName: "Oxymetazoline Hydrochloride 0.05%",
    brandName: "GSK Consumer",
    category: "cold_cough",
    dosageForm: "Nasal Spray",
    strength: "0.05%",
    packSize: "10 ml spray bottle",
    price: 115.0,
    prescriptionRequired: false,
    usageInstructions: "Administer 1-2 sprays into each nostril up to twice daily for blocked nose.",
    safetyWarnings: "Do not use continuously for more than 7 consecutive days (rebound congestion risk).",
    sideEffects: ["Local nasal burning", "Dryness", "Sneezing"],
    inStock: true,
    manufacturer: "Haleon / GlaxoSmithKline",
  },
  {
    id: "med-levocetirizine-montelukast",
    name: "Montair-LC",
    genericName: "Montelukast 10mg + Levocetirizine 5mg",
    brandName: "Cipla",
    category: "cold_cough",
    dosageForm: "Tablet",
    strength: "10mg / 5mg",
    packSize: "Strip of 10 tablets",
    price: 188.0,
    prescriptionRequired: true,
    usageInstructions: "Take 1 tablet once daily in the evening for allergic rhinitis and chronic asthma prevention.",
    safetyWarnings: "Schedule H prescription medicine. Monitor mood and neuropsychiatric changes.",
    sideEffects: ["Headache", "Somnolence", "Dry mouth"],
    inStock: true,
    manufacturer: "Cipla Limited",
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
    id: "med-gelusil-liquid",
    name: "Gelusil MPS Liquid",
    genericName: "Aluminium Hydroxide + Magnesium Hydroxide + Simethicone",
    brandName: "Pfizer India",
    category: "digestive",
    dosageForm: "Syrup",
    strength: "200 ml bottle",
    packSize: "200 ml bottle",
    price: 142.0,
    prescriptionRequired: false,
    usageInstructions: "Take 10-20ml (2-4 teaspoons) after meals and at bedtime for acidity and heartburn.",
    safetyWarnings: "Maintain a 2-hour interval between antacids and other prescription medications.",
    sideEffects: ["Chalky taste", "Mild laxative effect"],
    inStock: true,
    manufacturer: "Pfizer Consumer Healthcare",
  },
  {
    id: "med-digene-gel",
    name: "Digene Gel Orange",
    genericName: "Magnesium Hydroxide + Simethicone + Sodium Carboxymethylcellulose",
    brandName: "Abbott",
    category: "digestive",
    dosageForm: "Syrup",
    strength: "Antacid Gel",
    packSize: "200 ml bottle",
    price: 145.0,
    prescriptionRequired: false,
    usageInstructions: "Shake well before use. Take 2 teaspoons (10ml) after meals for quick relief from acidity.",
    safetyWarnings: "Sugar-free formulation suitable for diabetic patients.",
    sideEffects: ["Mild laxative effect", "Chalky taste"],
    inStock: true,
    manufacturer: "Abbott India Ltd",
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
    dosageForm: "Syrup",
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
    price: 215.0,
    prescriptionRequired: false,
    usageInstructions: "Take 1 tablet once daily before meals with water. Non-drowsy formulation.",
    safetyWarnings: "Avoid drinking fruit juices within 4 hours of dosing as it reduces absorption.",
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
    id: "med-neurobion-forte",
    name: "Neurobion Forte",
    genericName: "Vitamin B-Complex + Vitamin B12",
    brandName: "Procter & Gamble",
    category: "vitamins_supplements",
    dosageForm: "Tablet",
    strength: "Standard Complex",
    packSize: "Strip of 30 tablets",
    price: 42.5,
    prescriptionRequired: false,
    usageInstructions: "Take 1 tablet daily after lunch for nerve health and dietary supplementation.",
    safetyWarnings: "Harmless yellow discoloration of urine may occur due to riboflavin.",
    sideEffects: ["Mild gastric upset"],
    inStock: true,
    manufacturer: "P&G Health Ltd",
  },
  {
    id: "med-calcium-vitamin-d3",
    name: "Shelcal 500",
    genericName: "Calcium 500mg + Vitamin D3 250 IU",
    brandName: "Torrent Pharma",
    category: "vitamins_supplements",
    dosageForm: "Tablet",
    strength: "500 mg",
    packSize: "Strip of 15 tablets",
    price: 131.0,
    prescriptionRequired: false,
    usageInstructions: "Take 1 tablet daily after food with a full glass of water for bone density support.",
    safetyWarnings: "Contraindicated in patients with hypercalcemia or severe kidney stones.",
    sideEffects: ["Constipation", "Flatulence"],
    inStock: true,
    manufacturer: "Torrent Pharmaceuticals",
  },
  {
    id: "med-becosules-capsules",
    name: "Becosules Capsules",
    genericName: "Vitamin B-Complex with Vitamin C",
    brandName: "Pfizer",
    category: "vitamins_supplements",
    dosageForm: "Capsule",
    strength: "High Potency",
    packSize: "Strip of 20 capsules",
    price: 52.0,
    prescriptionRequired: false,
    usageInstructions: "Take 1 capsule daily after a meal for canker sores, fatigue, and immunity.",
    safetyWarnings: "Do not crush or chew capsules; swallow whole with water.",
    sideEffects: ["Mild stomach upset"],
    inStock: true,
    manufacturer: "Pfizer India",
  },
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
    price: 119.5,
    prescriptionRequired: true,
    usageInstructions: "Take 1 tablet once daily 1 hour before or 2 hours after meals for 3 to 5 days as prescribed.",
    safetyWarnings: "Schedule H1 antibiotic. Do not stop midway even if symptoms resolve.",
    sideEffects: ["Abdominal cramps", "Diarrhea", "Nausea"],
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
    price: 223.5,
    prescriptionRequired: true,
    usageInstructions: "Take 1 tablet twice daily with meals for complete prescribed duration (usually 5 to 7 days).",
    safetyWarnings: "Schedule H1 prescription medicine. Complete full prescribed course to prevent antimicrobial resistance.",
    sideEffects: ["Diarrhea", "Mild nausea", "Vomiting"],
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
    price: 240.0,
    prescriptionRequired: true,
    usageInstructions: "Take 1 tablet once daily at the same time each day for essential hypertension.",
    safetyWarnings: "Monitor blood pressure regularly. Do not take during pregnancy.",
    sideEffects: ["Dizziness", "Back pain", "Sinus infection"],
    inStock: true,
    manufacturer: "Glenmark Pharmaceuticals",
  },

  // DIABETES (Prescription Required)
  {
    id: "med-metformin-500",
    name: "Glycomet-GP 1",
    genericName: "Metformin 500mg + Glimepiride 1mg",
    brandName: "USV",
    category: "diabetes",
    dosageForm: "Tablet",
    strength: "500mg / 1mg",
    packSize: "Strip of 15 tablets",
    price: 98.0,
    prescriptionRequired: true,
    usageInstructions: "Take 1 tablet once daily immediately before breakfast or main meal.",
    safetyWarnings: "Watch for signs of hypoglycemia (shakiness, sweat, palpitations).",
    sideEffects: ["Hypoglycemia", "Metallic taste", "Nausea"],
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
  if (!id) return undefined;

  // Direct match by slug
  const direct = MEDICATIONS_CATALOG.find((m) => m.id === id);
  if (direct) return direct;

  // Lookup by UUID map
  const mappedSlug = MEDICATION_UUID_MAP[id];
  if (mappedSlug) {
    const foundByMap = MEDICATIONS_CATALOG.find((m) => m.id === mappedSlug);
    if (foundByMap) return foundByMap;
  }

  // Lookup if passed ID is slug mapped in reverse
  const mappedUuid = MEDICATION_SLUG_TO_UUID[id];
  if (mappedUuid) {
    const foundByUuid = MEDICATIONS_CATALOG.find((m) => m.id === mappedUuid);
    if (foundByUuid) return foundByUuid;
  }

  // Fallback case-insensitive match
  return MEDICATIONS_CATALOG.find((m) => m.id.toLowerCase() === id.toLowerCase());
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
