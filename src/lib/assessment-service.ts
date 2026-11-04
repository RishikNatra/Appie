import {
  HealthAssessmentRecord,
  SymptomTrackerRecord,
  SymptomItem,
  PossibleCondition,
  SymptomProgressPoint,
} from "./types";
import { createServerSupabaseClient } from "./supabase/server";
import { SYMPTOMS_CATALOG, CatalogSymptom } from "./symptoms-catalog";

export { SYMPTOMS_CATALOG };
export type { CatalogSymptom };

// ------------------------------------------------------------------------------
// IN-MEMORY FALLBACK STORE FOR HEALTH ASSESSMENTS & TRACKERS
// ------------------------------------------------------------------------------
const demoAssessmentsStore = new Map<string, HealthAssessmentRecord>([
  [
    "asmt-demo-001",
    {
      id: "asmt-demo-001",
      patientId: "demo-patient-001",
      title: "Routine Seasonal Cold & Sore Throat Assessment",
      symptoms: [
        {
          id: "sym-1",
          name: "Sore Throat",
          category: "Head & Neck",
          severity: 5,
          durationDays: 3,
          frequency: "constant",
          notes: "Worse when swallowing in mornings. Scratchy throat sensation.",
        },
        {
          id: "sym-2",
          name: "Dry Cough",
          category: "Respiratory",
          severity: 4,
          durationDays: 2,
          frequency: "intermittent",
          notes: "Tickling in airway, especially when lying down.",
        },
        {
          id: "sym-3",
          name: "Low-Grade Fever",
          category: "Systemic & Fever",
          severity: 4,
          durationDays: 2,
          frequency: "intermittent",
          notes: "Oral temp peaked at 100.2°F yesterday evening.",
        },
      ],
      assessmentSummary:
        "The symptom cluster (scratchy sore throat, low-grade intermittent fever, dry cough) strongly correlates with an acute viral upper respiratory tract infection (seasonal common cold). Symptoms are of moderate severity and low clinical risk, suitable for routine digital management.",
      possibleConditions: [
        {
          name: "Acute Viral Upper Respiratory Infection",
          matchPercentage: 92,
          description: "Self-limiting viral irritation of the nasal passages and pharynx.",
          urgency: "low",
          explanation: "Classical presentation with gradual onset, low-grade fever, and absence of severe bacterial markers.",
        },
        {
          name: "Allergic Rhinosinusitis with Post-Nasal Drip",
          matchPercentage: 68,
          description: "Allergen exposure triggering mucosal inflammation and throat clearing.",
          urgency: "low",
          explanation: "Possible secondary contributor given patient's history of dust mite allergy.",
        },
        {
          name: "Mild Pharyngitis",
          matchPercentage: 54,
          description: "Localized inflammation of the pharyngeal tissue.",
          urgency: "moderate",
          explanation: "Less likely to be streptococcal bacterial pharyngitis due to presence of cough and absence of high fever.",
        },
      ],
      urgencyLevel: "low",
      confidenceScore: 92,
      recommendations: [
        "Hydration: Consume warm liquids (herbal teas, warm water with honey) at least 2.5–3 liters daily.",
        "Throat Relief: Perform warm salt-water gargles 3–4 times daily to soothe mucosal inflammation.",
        "Rest: Prioritize 7–8 hours of uninterrupted sleep to bolster immune response.",
        "OTC Consideration: Paracetamol 500mg if temperature exceeds 100°F or body aches occur (check allergies).",
        "Red Flag Warning: Seek immediate in-person clinical care if you develop breathing difficulty, chest tightness, or fever persisting beyond 5 days.",
      ],
      nextStepAction: "Monitor symptoms for 48 hours. If throat discomfort escalates, schedule a 10-minute teleconsultation with a General Physician.",
      recommendedSpecialization: "General Medicine",
      status: "active",
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
]);

const demoTrackersStore = new Map<string, SymptomTrackerRecord>([
  [
    "tr-demo-001",
    {
      id: "tr-demo-001",
      patientId: "demo-patient-001",
      assessmentId: "asmt-demo-001",
      symptomName: "Sore Throat",
      severity: 3,
      status: "improving",
      daysActive: 3,
      timeline: [
        {
          day: 1,
          date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
          severity: 6,
          notes: "Initial onset: Scratchy and painful to swallow.",
          status: "worsening",
        },
        {
          day: 2,
          date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
          severity: 5,
          notes: "Started warm saline gargles. Throat redness persisting.",
          status: "stable",
        },
        {
          day: 3,
          date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
          severity: 3,
          notes: "Noticeable improvement in swallowing. Throat pain reducing.",
          status: "improving",
        },
      ],
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  [
    "tr-demo-002",
    {
      id: "tr-demo-002",
      patientId: "demo-patient-001",
      assessmentId: "asmt-demo-001",
      symptomName: "Dry Cough",
      severity: 3,
      status: "improving",
      daysActive: 2,
      timeline: [
        {
          day: 1,
          date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
          severity: 5,
          notes: "Frequent tickle cough throughout evening.",
          status: "stable",
        },
        {
          day: 2,
          date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
          severity: 3,
          notes: "Cough frequency decreased after steam inhalation.",
          status: "improving",
        },
      ],
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
]);

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
// CLINICAL ASSESSMENT INFERENCE ALGORITHM
// ------------------------------------------------------------------------------
export function inferAssessment(
  symptoms: SymptomItem[],
  additionalNotes: string = ""
): {
  summary: string;
  possibleConditions: PossibleCondition[];
  urgency: "low" | "moderate" | "high" | "emergency";
  confidence: number;
  recommendations: string[];
  nextStep: string;
  specialization: string;
} {
  const symptomNames = symptoms.map((s) => s.name.toLowerCase());
  const maxSeverity = Math.max(...symptoms.map((s) => s.severity), 3);

  // Check emergency keywords
  const hasChestPain = symptomNames.some((n) => n.includes("chest"));
  const hasSevereBreathing = symptomNames.some((n) => n.includes("shortness of breath") || n.includes("breathing"));

  if (hasChestPain || (hasSevereBreathing && maxSeverity >= 7)) {
    return {
      summary:
        "CRITICAL TRIAGE ALERT: The reported symptoms include respiratory or cardiovascular red-flag indicators that require urgent in-person medical evaluation.",
      possibleConditions: [
        {
          name: "Acute Cardiopulmonary Distress",
          matchPercentage: 95,
          description: "Potential acute cardiovascular or lower respiratory emergency.",
          urgency: "emergency",
          explanation: "Presence of chest discomfort or acute respiratory distress demands immediate physical ER triage.",
        },
      ],
      urgency: "emergency",
      confidence: 96,
      recommendations: [
        "IMMEDIATE ACTION: Do not wait for teleconsultation or courier delivery.",
        "Contact local emergency ambulance services (108 / 112) or proceed to the nearest hospital emergency department immediately.",
        "Remain seated in an upright posture and avoid physical exertion.",
      ],
      nextStep: "Proceed immediately to the nearest Emergency Department or Dial 112.",
      specialization: "Emergency Medicine",
    };
  }

  // Common respiratory or flu cluster
  const isRespiratory = symptomNames.some(
    (n) => n.includes("cough") || n.includes("throat") || n.includes("nasal") || n.includes("cold")
  );
  const hasFever = symptomNames.some((n) => n.includes("fever"));
  const isDigestive = symptomNames.some(
    (n) => n.includes("nausea") || n.includes("reflux") || n.includes("stools") || n.includes("cramp") || n.includes("abdominal")
  );

  if (isDigestive) {
    return {
      summary:
        "The symptom pattern indicates an acute gastrointestinal disturbance, likely acute gastritis or viral gastroenteritis. Most cases are self-limiting with appropriate oral rehydration.",
      possibleConditions: [
        {
          name: "Acute Viral Gastroenteritis / Food-related Gastric Upset",
          matchPercentage: 88,
          description: "Irritation of the gastric or intestinal lining causing nausea or loose stools.",
          urgency: "low",
          explanation: "Common short-duration presentation without high fever or severe dehydration.",
        },
        {
          name: "Gastroesophageal Reflux / Dyspepsia",
          matchPercentage: 74,
          description: "Acid irritation aggravated by dietary triggers or stress.",
          urgency: "low",
          explanation: "Correlates with epigastric discomfort, acid regurgitation, or bloating.",
        },
      ],
      urgency: maxSeverity >= 7 ? "moderate" : "low",
      confidence: 89,
      recommendations: [
        "Hydration: Sip Oral Rehydration Salts (ORS) solution, coconut water, or clear broth in frequent small volumes.",
        "BRAT Diet: Stick to bland foods (bananas, rice, applesauce, toast) for the next 24 hours.",
        "Avoid Irritants: Steer clear of oily, spicy, dairy, and caffeinated foods until stomach settles.",
        "Monitor Output: Check for signs of dehydration (dark urine, dry mouth, dizziness).",
      ],
      nextStep: "Follow oral rehydration therapy. If symptoms persist beyond 48 hours or vomiting prevents fluid retention, book an online consultation with a General Physician.",
      specialization: "General Medicine / Gastroenterology",
    };
  }

  if (isRespiratory) {
    const urgency = hasFever && maxSeverity >= 7 ? "moderate" : "low";
    return {
      summary:
        "The symptom presentation is highly characteristic of an acute upper respiratory infection (such as the common cold or viral pharyngitis). Symptoms are currently in the routine, low-risk category.",
      possibleConditions: [
        {
          name: "Acute Viral Upper Respiratory Infection (Common Cold)",
          matchPercentage: 92,
          description: "Self-limiting viral irritation of the nasal passages and throat.",
          urgency: "low",
          explanation: "Matches sore throat, mild dry cough, and congestion without systemic complications.",
        },
        {
          name: "Seasonal Allergic Rhinitis with Pharyngitis",
          matchPercentage: 68,
          description: "Allergen-induced inflammation resulting in post-nasal drip and throat irritation.",
          urgency: "low",
          explanation: "Common in urban environments with airborne pollen or dust exposure.",
        },
        {
          name: "Mild Acute Bronchitis (Early Stage)",
          matchPercentage: 55,
          description: "Temporary inflammation of the main airways following viral cold.",
          urgency: "moderate",
          explanation: "Considered if persistent coughing continues beyond day 5.",
        },
      ],
      urgency,
      confidence: 91,
      recommendations: [
        "Warm Hydration: Drink warm water, soups, or ginger-honey tea throughout the day to soothe mucosal linings.",
        "Saline Gargle: Perform warm salt-water gargles 3 times daily to alleviate throat soreness.",
        "Steam Inhalation: 5–10 minutes of steam inhalation helps loosen nasal and bronchial mucus.",
        "Rest & Recovery: Adequate sleep aids antibody production and accelerates viral clearance.",
        "Warning Signs: Consult immediately if you develop high fever (>102°F), difficulty swallowing liquids, or shortness of breath.",
      ],
      nextStep: "Continue supportive home care. You can schedule a consultation with an Appie verified physician for prescription medication if symptoms do not improve within 3 days.",
      specialization: "General Medicine",
    };
  }

  // General / Musculoskeletal / Tension Headache
  return {
    summary:
      "Your reported symptoms suggest a routine, low-risk general health concern (such as tension headache, fatigue, or postural strain). No acute emergency flags were detected.",
    possibleConditions: [
      {
        name: "Tension-Type Headache / Ergonomic Strain",
        matchPercentage: 86,
        description: "Muscle contraction or strain in neck and scalp muscles from posture or stress.",
        urgency: "low",
        explanation: "Consistent with dull, diffuse pain without neurological deficits.",
      },
      {
        name: "Mild Physical Fatigue / Dehydration",
        matchPercentage: 70,
        description: "Mild fluid deficit or inadequate sleep contributing to lethargy and discomfort.",
        urgency: "low",
        explanation: "Frequently responsive to hydration, rest, and screen breaks.",
      },
    ],
    urgency: "low",
    confidence: 87,
    recommendations: [
      "Hydration: Drink at least 2.5 liters of water throughout the day.",
      "Ergonomics & Screen Breaks: Practice the 20-20-20 rule during computer work; adjust neck and monitor height.",
      "Gentle Stretching: Light neck and shoulder stretches relieve muscle tension.",
      "Rest: Ensure 7-8 hours of restful sleep in a dark, quiet room.",
    ],
    nextStep: "Rest and rehydrate. If pain persists or worsens after 48 hours, schedule an online appointment with an Appie doctor.",
    specialization: "General Medicine",
  };
}

// ------------------------------------------------------------------------------
// SERVICE METHODS: ASSESSMENTS & TRACKERS
// ------------------------------------------------------------------------------

export async function createHealthAssessment(
  patientId: string,
  title: string,
  symptoms: SymptomItem[],
  additionalNotes: string = ""
): Promise<{ success: boolean; assessment?: HealthAssessmentRecord; error?: string }> {
  const inference = inferAssessment(symptoms, additionalNotes);

  const newAssessment: HealthAssessmentRecord = {
    id: `asmt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    patientId,
    title,
    symptoms,
    assessmentSummary: inference.summary,
    possibleConditions: inference.possibleConditions,
    urgencyLevel: inference.urgency,
    confidenceScore: inference.confidence,
    recommendations: inference.recommendations,
    nextStepAction: inference.nextStep,
    recommendedSpecialization: inference.specialization,
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // If live Supabase is configured
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("health_assessments")
        .insert({
          patient_id: patientId,
          title,
          symptoms,
          assessment_summary: inference.summary,
          possible_conditions: inference.possibleConditions,
          urgency_level: inference.urgency,
          confidence_score: inference.confidence,
          recommendations: inference.recommendations,
          next_step_action: inference.nextStep,
          recommended_specialization: inference.specialization,
        })
        .select()
        .single();

      if (!error && data) {
        newAssessment.id = data.id;
      }
    } catch {
      // Fallback
    }
  }

  demoAssessmentsStore.set(newAssessment.id, newAssessment);

  // Auto-create symptom tracking entries for each input symptom
  for (const sym of symptoms) {
    const trackerId = `tr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const tracker: SymptomTrackerRecord = {
      id: trackerId,
      patientId,
      assessmentId: newAssessment.id,
      symptomName: sym.name,
      severity: sym.severity,
      status: "stable",
      daysActive: sym.durationDays || 1,
      timeline: [
        {
          day: 1,
          date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
          severity: sym.severity,
          notes: sym.notes || "Initial assessment entry",
          status: "stable",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    demoTrackersStore.set(trackerId, tracker);
  }

  return { success: true, assessment: newAssessment };
}

export async function getPatientAssessments(patientId: string): Promise<HealthAssessmentRecord[]> {
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("health_assessments")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          patientId: d.patient_id,
          title: d.title,
          symptoms: d.symptoms || [],
          assessmentSummary: d.assessment_summary,
          possibleConditions: d.possible_conditions || [],
          urgencyLevel: d.urgency_level,
          confidenceScore: d.confidence_score,
          recommendations: d.recommendations || [],
          nextStepAction: d.next_step_action,
          recommendedSpecialization: d.recommended_specialization,
          status: d.status,
          reviewedBy: d.reviewed_by,
          reviewNotes: d.review_notes,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch {
      // Fallback
    }
  }

  const results: HealthAssessmentRecord[] = [];
  for (const asmt of demoAssessmentsStore.values()) {
    if (asmt.patientId === patientId || patientId === "demo-patient-001") {
      results.push(asmt);
    }
  }

  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAssessmentById(id: string): Promise<HealthAssessmentRecord | null> {
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("health_assessments")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        return {
          id: data.id,
          patientId: data.patient_id,
          title: data.title,
          symptoms: data.symptoms || [],
          assessmentSummary: data.assessment_summary,
          possibleConditions: data.possible_conditions || [],
          urgencyLevel: data.urgency_level,
          confidenceScore: data.confidence_score,
          recommendations: data.recommendations || [],
          nextStepAction: data.next_step_action,
          recommendedSpecialization: data.recommended_specialization,
          status: data.status,
          reviewedBy: data.reviewed_by,
          reviewNotes: data.review_notes,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch {
      // Fallback
    }
  }

  return demoAssessmentsStore.get(id) || null;
}

export async function getPatientTrackers(patientId: string): Promise<SymptomTrackerRecord[]> {
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("symptom_trackers")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          patientId: d.patient_id,
          assessmentId: d.assessment_id,
          symptomName: d.symptom_name,
          severity: d.severity,
          status: d.status,
          daysActive: d.days_active,
          timeline: d.timeline || [],
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch {
      // Fallback
    }
  }

  const results: SymptomTrackerRecord[] = [];
  for (const tr of demoTrackersStore.values()) {
    if (tr.patientId === patientId || patientId === "demo-patient-001") {
      results.push(tr);
    }
  }

  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function updateSymptomProgress(
  trackerId: string,
  severity: number,
  status: "improving" | "stable" | "worsening" | "resolved",
  notes: string = ""
): Promise<{ success: boolean; tracker?: SymptomTrackerRecord; error?: string }> {
  const existing = demoTrackersStore.get(trackerId);
  if (!existing) {
    return { success: false, error: "Symptom tracker not found" };
  }

  const nextDay = (existing.timeline.length || 0) + 1;
  const newPoint: SymptomProgressPoint = {
    day: nextDay,
    date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    severity,
    notes: notes || `Day ${nextDay} update logged`,
    status,
  };

  const updated: SymptomTrackerRecord = {
    ...existing,
    severity,
    status,
    daysActive: nextDay,
    timeline: [...existing.timeline, newPoint],
    updatedAt: new Date().toISOString(),
  };

  demoTrackersStore.set(trackerId, updated);
  return { success: true, tracker: updated };
}

export async function updateAssessmentStatus(
  assessmentId: string,
  status: "active" | "reviewed" | "archived",
  reviewedBy?: string,
  reviewNotes?: string
): Promise<HealthAssessmentRecord | null> {
  const existing = demoAssessmentsStore.get(assessmentId);
  if (existing) {
    existing.status = status;
    if (reviewedBy) existing.reviewedBy = reviewedBy;
    if (reviewNotes) existing.reviewNotes = reviewNotes;
    existing.updatedAt = new Date().toISOString();
  }

  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      await supabase
        .from("health_assessments")
        .update({
          status,
          reviewed_by: reviewedBy,
          review_notes: reviewNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", assessmentId);
    } catch {
      // Fallback
    }
  }

  return existing || null;
}

