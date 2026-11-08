/**
 * APPIE HEALTHCARE - GENERALISED SYMPTOMS CATALOG
 * Universal catalog of generalised medical symptoms with tags and 1-5 severity scales.
 * No severity-specific duplicates (e.g. single "Cough" with tags, not "Mild Cough" and "Severe Cough").
 */

export interface CatalogSymptom {
  id: string;
  name: string;
  category: "Head & Neck" | "Respiratory" | "Digestive" | "Systemic & Fever" | "Skin & Musculoskeletal";
  description: string;
  tags: string[];
  defaultSeverity: number; // 1 to 5
  commonSeverity?: number;
}

export const SYMPTOMS_CATALOG: CatalogSymptom[] = [
  {
    id: "sym-cough",
    name: "Cough",
    category: "Respiratory",
    description: "Reflex action to clear airway irritation, ranging from mild tickle to frequent spasms.",
    tags: ["Dry Cough", "Productive Cough", "Night Cough", "Barking Cough"],
    defaultSeverity: 2,
  },
  {
    id: "sym-headache",
    name: "Headache",
    category: "Head & Neck",
    description: "Aching, tension, or pulsating discomfort in frontal, temporal, or occipital regions.",
    tags: ["Frontal Pain", "Throbbing", "Tension", "Migraine-like"],
    defaultSeverity: 3,
  },
  {
    id: "sym-fever",
    name: "Fever",
    category: "Systemic & Fever",
    description: "Elevated core body temperature above 98.6°F (37°C) accompanied by chills or sweats.",
    tags: ["Chills", "Sweating", "Intermittent", "Low-Grade", "High Fever"],
    defaultSeverity: 3,
  },
  {
    id: "sym-sore-throat",
    name: "Sore Throat",
    category: "Head & Neck",
    description: "Scratchy, raw, or painful sensation in the pharynx, aggravated by swallowing.",
    tags: ["Dry Throat", "Pain on Swallowing", "Scratchy", "Hoarseness"],
    defaultSeverity: 2,
  },
  {
    id: "sym-nasal-congestion",
    name: "Nasal Congestion",
    category: "Head & Neck",
    description: "Blocked or stuffy nasal passages with mucosal swelling and clear or thick discharge.",
    tags: ["Stuffy Nose", "Runny Nose", "Sinus Pressure", "Sneezing"],
    defaultSeverity: 2,
  },
  {
    id: "sym-shortness-of-breath",
    name: "Shortness of Breath",
    category: "Respiratory",
    description: "Feeling unable to take a complete breath, exertional dyspnea, or chest constriction.",
    tags: ["Exertional", "Chest Tightness", "Wheezing", "Rapid Breathing"],
    defaultSeverity: 3,
  },
  {
    id: "sym-abdominal-pain",
    name: "Abdominal Pain",
    category: "Digestive",
    description: "Discomfort, cramping, or fullness in epigastric, umbilical, or pelvic regions.",
    tags: ["Cramping", "Bloating", "Upper Abdomen", "Post-Meal Ache"],
    defaultSeverity: 2,
  },
  {
    id: "sym-nausea",
    name: "Nausea & Vomiting",
    category: "Digestive",
    description: "Gastric queasiness, stomach unease, or involuntary retching and vomiting.",
    tags: ["Queasiness", "Motion Sickness", "Loss of Appetite", "Vomiting"],
    defaultSeverity: 2,
  },
  {
    id: "sym-diarrhea",
    name: "Diarrhea",
    category: "Digestive",
    description: "Loose, watery stools occurring more frequently than normal baseline.",
    tags: ["Watery Stools", "Frequent Trips", "Abdominal Spasms", "Dehydration Risk"],
    defaultSeverity: 3,
  },
  {
    id: "sym-acid-reflux",
    name: "Acid Reflux / Heartburn",
    category: "Digestive",
    description: "Burning sensation rising from the mid-chest into the throat after meals or reclining.",
    tags: ["Chest Burning", "Acid Regurgitation", "Sour Taste", "Indigestion"],
    defaultSeverity: 2,
  },
  {
    id: "sym-body-aches",
    name: "Body Aches / Myalgia",
    category: "Systemic & Fever",
    description: "Diffuse muscle and joint discomfort associated with immune activation or viral illness.",
    tags: ["Muscle Soreness", "Joint Stiffness", "Backache", "Viral Malaise"],
    defaultSeverity: 2,
  },
  {
    id: "sym-fatigue",
    name: "Fatigue & Malaise",
    category: "Systemic & Fever",
    description: "Persistent mental or physical exhaustion not relieved by sleep or routine rest.",
    tags: ["Low Energy", "Heavy Limbs", "Daytime Drowsiness", "Brain Fog"],
    defaultSeverity: 2,
  },
  {
    id: "sym-skin-rash",
    name: "Skin Rash & Itching",
    category: "Skin & Musculoskeletal",
    description: "Erythematous eruptions, hives, localized wheals, or pruritic dry dermal patches.",
    tags: ["Pruritus / Itching", "Red Bumps", "Urticaria / Hives", "Dry Scaly"],
    defaultSeverity: 2,
  },
];
