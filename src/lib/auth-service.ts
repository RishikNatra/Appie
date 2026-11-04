import { cookies } from "next/headers";
import { RegisterInput, LoginInput, sanitizeEmail, sanitizeUsername } from "./security";
import { createServerSupabaseClient } from "./supabase/server";
import {
  generateVerificationCode,
  verifyCode,
  updateUserProfile,
  updateHealthProfessionalDetails,
  getUserProfile,
} from "./account-service";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: "patient" | "health_professional";
  fullName?: string;
  isVerified?: boolean;
}

// In-memory registered user repository for fallback demo/local development
export const demoUsers: Map<string, { user: AuthUser; passwordHash: string }> = new Map([
  [
    "patient@appie.health",
    {
      user: {
        id: "demo-patient-001",
        email: "patient@appie.health",
        username: "demo_patient",
        role: "patient",
        fullName: "Rahul Verma",
        isVerified: true,
      },
      passwordHash: "Password123!",
    },
  ],
  [
    "doctor@appie.health",
    {
      user: {
        id: "demo-doctor-001",
        email: "doctor@appie.health",
        username: "dr_sharma",
        role: "health_professional",
        fullName: "Dr. Ananya Sharma",
        isVerified: true,
      },
      passwordHash: "Password123!",
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

/**
 * Server-side User Registration with complete role validation
 */
export async function registerUser(input: RegisterInput): Promise<{
  success: boolean;
  user?: AuthUser;
  error?: string;
  requiresVerification?: boolean;
}> {
  const cleanEmail = sanitizeEmail(input.email);
  const cleanUsername = sanitizeUsername(input.username);

  // If live Supabase is configured, use official Supabase Auth
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const fullName =
        input.role === "patient"
          ? `${input.firstName} ${input.lastName}`.trim()
          : input.fullName;

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: input.password,
        options: {
          data: {
            username: cleanUsername,
            role: input.role,
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const authUser: AuthUser = {
          id: data.user.id,
          email: cleanEmail,
          username: cleanUsername,
          role: input.role,
          fullName,
          isVerified: input.role === "patient",
        };
        await setSessionCookie(authUser);
        return { success: true, user: authUser };
      }
    } catch (err: unknown) {
      console.error("Supabase registration error:", err);
    }
  }

  // Fallback demo/local registration store
  if (demoUsers.has(cleanEmail)) {
    return { success: false, error: "An account with this email address already exists" };
  }

  // Check username uniqueness
  for (const entry of demoUsers.values()) {
    if (entry.user.username.toLowerCase() === cleanUsername.toLowerCase()) {
      return { success: false, error: "This username is already taken" };
    }
  }

  const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const fullName =
    input.role === "patient"
      ? `${input.firstName} ${input.lastName}`.trim()
      : input.fullName;

  const newUser: AuthUser = {
    id: userId,
    email: cleanEmail,
    username: cleanUsername,
    role: input.role,
    fullName,
    isVerified: input.role === "patient",
  };

  demoUsers.set(cleanEmail, {
    user: newUser,
    passwordHash: input.password,
  });

  // Populate detailed user profile
  if (input.role === "patient") {
    await updateUserProfile(userId, {
      id: userId,
      role: "patient",
      email: cleanEmail,
      username: cleanUsername,
      fullName,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      dateOfBirth: input.dateOfBirth,
      gender: input.gender,
      addressLine1: input.addressLine1 || "",
      city: input.city || "",
      state: input.state || "",
      pincode: input.pincode || "",
      emergencyContactName: input.emergencyContactName || "",
      emergencyContactPhone: input.emergencyContactPhone || "",
      emergencyContactRelation: input.emergencyContactRelation || "",
      isVerified: true,
      twoFactorEnabled: false,
    });
  } else {
    await updateUserProfile(userId, {
      id: userId,
      role: "health_professional",
      email: cleanEmail,
      username: cleanUsername,
      fullName: `${input.prefix} ${input.fullName}`,
      phone: input.phone,
      dateOfBirth: input.dateOfBirth,
      gender: input.gender,
      addressLine1: input.clinicAddress,
      isVerified: false,
      twoFactorEnabled: false,
    });

    await updateHealthProfessionalDetails(userId, {
      userId,
      prefix: input.prefix,
      medicalLicenseNumber: input.medicalLicenseNumber,
      medicalCouncilName: input.medicalCouncilName,
      specialization: input.specialization,
      qualifications: input.qualifications,
      yearsOfExperience: input.yearsOfExperience,
      clinicAddress: input.clinicAddress,
      verificationStatus: "pending",
    });
  }

  // Generate initial registration verification code
  generateVerificationCode(cleanEmail, "registration");

  await setSessionCookie(newUser);
  return { success: true, user: newUser, requiresVerification: true };
}

/**
 * Server-side User Login with role enforcement & 2FA check
 */
export async function loginUser(input: LoginInput): Promise<{
  success: boolean;
  user?: AuthUser;
  error?: string;
  requiresTwoFactor?: boolean;
}> {
  const identifier = input.identifier.trim().toLowerCase();

  // If live Supabase is configured
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier,
        password: input.password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profile && profile.role !== input.role) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: `This account is registered as a ${
              profile.role === "patient" ? "Patient" : "Health Professional"
            }. Please log in through the corresponding portal.`,
          };
        }

        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || identifier,
          username:
            profile?.username || data.user.user_metadata?.username || identifier.split("@")[0],
          role: (profile?.role as "patient" | "health_professional") || input.role,
          fullName: profile?.full_name,
          isVerified: profile?.is_verified,
        };

        if (profile?.two_factor_enabled) {
          generateVerificationCode(authUser.email, "two_factor");
          return { success: true, user: authUser, requiresTwoFactor: true };
        }

        await setSessionCookie(authUser);
        return { success: true, user: authUser };
      }
    } catch (err: unknown) {
      console.error("Supabase login error:", err);
    }
  }

  // Fallback demo/local verification
  let matchedEntry: { user: AuthUser; passwordHash: string } | undefined;

  for (const [email, entry] of demoUsers.entries()) {
    if (
      email.toLowerCase() === identifier ||
      entry.user.username.toLowerCase() === identifier
    ) {
      matchedEntry = entry;
      break;
    }
  }

  if (!matchedEntry) {
    return {
      success: false,
      error: "Invalid credentials. Please verify your email/username and password.",
    };
  }

  if (matchedEntry.passwordHash !== input.password) {
    return {
      success: false,
      error: "Invalid credentials. Please verify your email/username and password.",
    };
  }

  // Enforce role consistency
  if (matchedEntry.user.role !== input.role) {
    return {
      success: false,
      error: `This account is registered as a ${
        matchedEntry.user.role === "patient" ? "Patient" : "Health Professional"
      }. Please switch to the ${
        matchedEntry.user.role === "patient" ? "Patient" : "Health Professional"
      } portal.`,
    };
  }

  // Check 2FA preference from profile
  const profile = await getUserProfile(matchedEntry.user.id);
  if (profile?.twoFactorEnabled) {
    generateVerificationCode(matchedEntry.user.email, "two_factor");
    return {
      success: true,
      user: matchedEntry.user,
      requiresTwoFactor: true,
    };
  }

  await setSessionCookie(matchedEntry.user);
  return { success: true, user: matchedEntry.user };
}

/**
 * Validates 2FA code and establishes authenticated session
 */
export async function completeTwoFactorLogin(
  identifier: string,
  code: string
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const isValid = verifyCode(identifier, "two_factor", code);
  if (!isValid) {
    return { success: false, error: "Invalid or expired 2FA code. Please check and retry." };
  }

  for (const [email, entry] of demoUsers.entries()) {
    if (
      email.toLowerCase() === identifier.toLowerCase() ||
      entry.user.username.toLowerCase() === identifier.toLowerCase()
    ) {
      await setSessionCookie(entry.user);
      return { success: true, user: entry.user };
    }
  }

  return { success: false, error: "User account session expired. Please sign in again." };
}

/**
 * Initiates password recovery
 */
export async function initiatePasswordRecovery(
  identifier: string,
  method: "email" | "sms"
): Promise<{ success: boolean; message: string; maskedTarget: string }> {
  const cleanId = identifier.trim().toLowerCase();
  let targetEmail = cleanId;

  for (const [email, entry] of demoUsers.entries()) {
    if (email.toLowerCase() === cleanId || entry.user.username.toLowerCase() === cleanId) {
      targetEmail = email;
      break;
    }
  }

  generateVerificationCode(targetEmail, "password_recovery");

  const masked =
    method === "email"
      ? targetEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3")
      : "+91 ••••• •••10";

  return {
    success: true,
    message: `A 6-digit recovery code has been sent via ${method.toUpperCase()} to ${masked}.`,
    maskedTarget: masked,
  };
}

/**
 * Resets user password
 */
export async function resetPasswordWithCode(
  identifier: string,
  code: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const cleanId = identifier.trim().toLowerCase();
  let matchedEmail = cleanId;
  let matchedEntry: { user: AuthUser; passwordHash: string } | undefined;

  for (const [email, entry] of demoUsers.entries()) {
    if (email.toLowerCase() === cleanId || entry.user.username.toLowerCase() === cleanId) {
      matchedEmail = email;
      matchedEntry = entry;
      break;
    }
  }

  const isCodeValid = verifyCode(matchedEmail, "password_recovery", code);
  if (!isCodeValid) {
    return { success: false, error: "Invalid or expired recovery code." };
  }

  if (matchedEntry) {
    matchedEntry.passwordHash = newPassword;
  }

  return { success: true };
}

/**
 * Sets secure HTTP-only session cookie
 */
export async function setSessionCookie(user: AuthUser) {
  const cookieStore = await cookies();
  const sessionPayload = JSON.stringify(user);

  cookieStore.set("appie_session", sessionPayload, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Retrieves the currently authenticated user from session or Supabase
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("appie_session");

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const user = JSON.parse(sessionCookie.value) as AuthUser;
    return user;
  } catch {
    return null;
  }
}

/**
 * Clears authentication session cookie
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("appie_session");
}
