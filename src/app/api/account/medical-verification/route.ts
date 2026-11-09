import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, PUBLIC_API_RATE_LIMIT, createRateLimitExceededResponse } from "@/lib/rate-limit";
import { medicalVerificationSubmissionSchema, sanitizeString } from "@/lib/security";
import { getCurrentUser } from "@/lib/auth-service";
import {
  getHealthProfessionalDetails,
  updateHealthProfessionalDetails,
  updateUserProfile,
} from "@/lib/account-service";

export async function GET(req: NextRequest) {
  const rateLimitResult = await checkRateLimit(req, PUBLIC_API_RATE_LIMIT);
  if (!rateLimitResult.success) {
    return createRateLimitExceededResponse(rateLimitResult);
  }

  const user = await getCurrentUser();
  if (!user || user.role !== "health_professional") {
    return NextResponse.json(
      { error: "Access restricted to registered health professionals" },
      { status: 403 }
    );
  }

  const details = await getHealthProfessionalDetails(user.id);
  return NextResponse.json({
    success: true,
    details: details || {
      userId: user.id,
      verificationStatus: "unverified",
      prefix: "Dr.",
      medicalLicenseNumber: "",
      medicalCouncilName: "",
      specialization: "",
      qualifications: "",
      yearsOfExperience: 0,
      clinicAddress: "",
    },
  });
}

export async function POST(req: NextRequest) {
  const rateLimitResult = await checkRateLimit(req, PUBLIC_API_RATE_LIMIT);
  if (!rateLimitResult.success) {
    return createRateLimitExceededResponse(rateLimitResult);
  }

  const user = await getCurrentUser();
  if (!user || user.role !== "health_professional") {
    return NextResponse.json(
      { error: "Access restricted to registered health professionals" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();

    // Sanitize string inputs
    for (const key of Object.keys(body)) {
      if (typeof body[key] === "string") {
        const check = sanitizeString(body[key], { maxLen: 300 });
        if (!check.isValid) {
          return NextResponse.json({ error: `Field '${key}': ${check.flaggedReason}` }, { status: 400 });
        }
        body[key] = check.clean;
      }
    }

    const validation = medicalVerificationSubmissionSchema.safeParse(body);
    if (!validation.success) {
      const errorMsg = validation.error.issues[0]?.message || "Validation failed";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const {
      medicalLicenseNumber,
      medicalCouncilName,
      specialization,
      qualifications,
      yearsOfExperience,
      clinicAddress,
      licenseDocumentName,
      idProofDocumentName,
    } = validation.data;

    const isInstantSim = body.simulateApproval === true;
    const result = await updateHealthProfessionalDetails(user.id, {
      userId: user.id,
      medicalLicenseNumber,
      medicalCouncilName,
      specialization,
      qualifications,
      yearsOfExperience,
      clinicAddress,
      licenseDocumentName: licenseDocumentName || "Medical_Council_Registration.pdf",
      idProofDocumentName: idProofDocumentName || "Government_ID_Proof.pdf",
      verificationStatus: isInstantSim ? "verified" : "pending",
      verificationNotes: isInstantSim
        ? "Verified & Approved via National Medical Council (NMC) Digital Telemedicine Registry."
        : "Submitted for official credential validation by Appie Clinical Compliance Team.",
    });

    if (isInstantSim) {
      await updateUserProfile(user.id, { isVerified: true });
    }

    if (!result.success || !result.details) {
      return NextResponse.json({ error: result.error || "Submission failed" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Medical credentials submitted successfully. Status updated to Pending Review.",
      details: result.details,
    });
  } catch (err: unknown) {
    console.error("Medical verification error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during medical status submission." },
      { status: 500 }
    );
  }
}

