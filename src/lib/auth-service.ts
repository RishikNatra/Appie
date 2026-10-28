import { cookies } from "next/headers";
import { RegisterInput, LoginInput, sanitizeEmail, sanitizeUsername } from "./security";
import { createServerSupabaseClient } from "./supabase/server";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: "patient" | "health_professional";
  fullName?: string;
  isVerified?: boolean;
}

// In-memory registered user repository for fallback demo/local development
// when Supabase cloud is not yet connected with live credentials.
const demoUsers: Map<string, { user: AuthUser; passwordHash: string }> = new Map([
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
        fullName: "Dr. Ananya Sharma, MD",
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
}> {
  const cleanEmail = sanitizeEmail(input.email);
  const cleanUsername = sanitizeUsername(input.username);

  // If live Supabase is configured, use official Supabase Auth
  if (isLiveSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: input.password,
        options: {
          data: {
            username: cleanUsername,
            role: input.role,
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
        };
        await setSessionCookie(authUser);
        return { success: true, user: authUser };
      }
    } catch (err: unknown) {
      console.error("Supabase registration error:", err);
      // Fall through to resilient local handler if Supabase fails
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

  const newUser: AuthUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: cleanEmail,
    username: cleanUsername,
    role: input.role,
    fullName: cleanUsername,
    isVerified: input.role === "patient",
  };

  demoUsers.set(cleanEmail, {
    user: newUser,
    passwordHash: input.password,
  });

  await setSessionCookie(newUser);
  return { success: true, user: newUser };
}

/**
 * Server-side User Login with role enforcement
 */
export async function loginUser(input: LoginInput): Promise<{
  success: boolean;
  user?: AuthUser;
  error?: string;
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
        // Query profile to enforce role
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (profile && profile.role !== input.role) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: `This account is registered as a ${profile.role === "patient" ? "Patient" : "Health Professional"}. Please log in through the corresponding portal.`,
          };
        }

        const authUser: AuthUser = {
          id: data.user.id,
          email: data.user.email || identifier,
          username: profile?.username || data.user.user_metadata?.username || identifier.split("@")[0],
          role: (profile?.role as "patient" | "health_professional") || input.role,
          fullName: profile?.full_name,
          isVerified: profile?.is_verified,
        };

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
    return { success: false, error: "Invalid credentials. Please verify your email/username and password." };
  }

  if (matchedEntry.passwordHash !== input.password) {
    return { success: false, error: "Invalid credentials. Please verify your email/username and password." };
  }

  // Enforce role consistency
  if (matchedEntry.user.role !== input.role) {
    return {
      success: false,
      error: `This account is registered as a ${matchedEntry.user.role === "patient" ? "Patient" : "Health Professional"}. Please switch to the ${matchedEntry.user.role === "patient" ? "Patient" : "Health Professional"} portal.`,
    };
  }

  await setSessionCookie(matchedEntry.user);
  return { success: true, user: matchedEntry.user };
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
