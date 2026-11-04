/**
 * APPIE HEALTHCARE - SYMPTOMS CATALOG
 * Universal catalog of common routine medical complaints
 */

export interface CatalogSymptom {
  name: string;
  category: "Head & Neck" | "Respiratory" | "Digestive" | "Systemic & Fever" | "Skin & Musculoskeletal";
  commonSeverity: number;
  description: string;
}

export const SYMPTOMS_CATALOG: CatalogSymptom[] = [
  { name: "Sore Throat", category: "Head & Neck", commonSeverity: 4, description: "Scratchy, irritated, or painful throat while swallowing" },
  { name: "Mild Headache", category: "Head & Neck", commonSeverity: 5, description: "Dull, aching pain across frontal or temporal regions" },
  { name: "Nasal Congestion", category: "Head & Neck", commonSeverity: 3, description: "Stuffy or blocked nasal passages with clear discharge" },
  { name: "Dry Cough", category: "Respiratory", commonSeverity: 4, description: "Tickling, non-productive cough without phlegm" },
  { name: "Productive Cough", category: "Respiratory", commonSeverity: 5, description: "Coughing up clear, white, or yellowish mucus" },
  { name: "Mild Shortness of Breath", category: "Respiratory", commonSeverity: 6, description: "Slight breathlessness upon light exertion" },
  { name: "Low-Grade Fever", category: "Systemic & Fever", commonSeverity: 4, description: "Body temperature between 99.5°F and 101°F with chills" },
  { name: "High Fever", category: "Systemic & Fever", commonSeverity: 8, description: "Body temperature exceeding 101.5°F requiring prompt attention" },
  { name: "Fatigue & Malaise", category: "Systemic & Fever", commonSeverity: 5, description: "Generalized tiredness and weakness during routine tasks" },
  { name: "Body Aches / Myalgia", category: "Systemic & Fever", commonSeverity: 5, description: "Generalized muscular soreness and joint stiffness" },
  { name: "Acid Reflux / Heartburn", category: "Digestive", commonSeverity: 4, description: "Burning sensation in upper chest/epigastric area after meals" },
  { name: "Nausea", category: "Digestive", commonSeverity: 4, description: "Queasy feeling with urge to vomit" },
  { name: "Abdominal Cramping", category: "Digestive", commonSeverity: 5, description: "Intermittent spasms or mild bloating in lower abdomen" },
  { name: "Loose Stools / Diarrhea", category: "Digestive", commonSeverity: 6, description: "Frequent watery bowel movements for 1-2 days" },
  { name: "Skin Itching & Rash", category: "Skin & Musculoskeletal", commonSeverity: 4, description: "Localized red bumps, hives, or pruritic patches" },
  { name: "Lower Back Stiffness", category: "Skin & Musculoskeletal", commonSeverity: 5, description: "Muscle strain or stiffness after prolonged sitting" },
];

