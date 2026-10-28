import { z } from "zod";

/**
 * APPIE SECURITY & SANITIZATION ENGINE
 * Defends against XSS, SQL Injection, and LLM Prompt Injection attacks.
 */

// Regular expressions for detecting malicious payloads
const DANGEROUS_SQL_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|EXEC|UNION|TRUNCATE)\b)/i,
  /(--|\/\*|\*\/|;|\bOR\b\s+['"\d]+=['"\d]+|\bAND\b\s+['"\d]+=['"\d]+)/i,
  /(';|\"|'\s*OR\s*'1'='1|"\s*OR\s*"1"="1)/i,
];

const DANGEROUS_PROMPT_PATTERNS = [
  /(\[system\]|<\|im_start\|>|<\|im_end\|>)/i,
  /(\bignore\s+(previous|all)\s+instructions\b)/i,
  /(\byou\s+are\s+now\b|\bsystem\s+prompt\b)/i,
  /(\bjailbreak\b|\boverride\s+safety\b)/i,
];

/**
 * Strips HTML tags and escapes special characters to prevent Cross-Site Scripting (XSS)
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "") // strip html tags
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#x60;");
}

/**
 * Deep sanitization for strings: strips HTML, checks SQL & Prompt injection triggers
 */
export function sanitizeString(
  input: string,
  options: { allowSqlKeywords?: boolean; maxLen?: number } = {}
): { clean: string; isValid: boolean; flaggedReason?: string } {
  if (typeof input !== "string") {
    return { clean: "", isValid: false, flaggedReason: "Input is not a string" };
  }

  const maxLen = options.maxLen || 500;
  if (input.length > maxLen) {
    return { clean: "", isValid: false, flaggedReason: `Input exceeds max length of ${maxLen}` };
  }

  // Check Prompt Injection
  for (const pattern of DANGEROUS_PROMPT_PATTERNS) {
    if (pattern.test(input)) {
      return {
        clean: "",
        isValid: false,
        flaggedReason: "Potential malicious prompt injection pattern detected",
      };
    }
  }

  // Check SQL Injection (if not specifically exempted)
  if (!options.allowSqlKeywords) {
    for (const pattern of DANGEROUS_SQL_PATTERNS) {
      if (pattern.test(input)) {
        return {
          clean: "",
          isValid: false,
          flaggedReason: "Potential SQL injection attack vector detected",
        };
      }
    }
  }

  const clean = sanitizeHtml(input.trim());
  return { clean, isValid: true };
}

/**
 * Sanitizes and normalizes an email address
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") return "";
  return email.trim().toLowerCase().slice(0, 100);
}

/**
 * Sanitizes and normalizes a username
 */
export function sanitizeUsername(username: string): string {
  if (typeof username !== "string") return "";
  return username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 30);
}

/**
 * Zod Schema for User Registration
 */
export const registerSchema = z
  .object({
    role: z.enum(["patient", "health_professional"], {
      message: "Role must be either Patient or Health Professional",
    }),
    email: z
      .string()
      .min(5, "Email is too short")
      .max(100, "Email must not exceed 100 characters")
      .email("Please provide a valid email address")
      .refine((val) => !DANGEROUS_SQL_PATTERNS.some((p) => p.test(val)), {
        message: "Email contains disallowed characters",
      }),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must not exceed 30 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
      .refine((val) => !DANGEROUS_SQL_PATTERNS.some((p) => p.test(val)), {
        message: "Username contains illegal characters",
      }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password must not exceed 128 characters")
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[0-9]/, "Password must include at least one number")
      .regex(/[^a-zA-Z0-9]/, "Password must include at least one special character"),
    confirmPassword: z.string(),
    termsConsent: z.boolean().refine((val) => val === true, {
      message: "You must accept the Terms of Service & Privacy Consent",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Zod Schema for User Login
 */
export const loginSchema = z.object({
  role: z.enum(["patient", "health_professional"], {
    message: "Role must be either Patient or Health Professional",
  }),
  identifier: z
    .string()
    .min(3, "Please enter your email or username")
    .max(100, "Identifier too long")
    .refine((val) => !DANGEROUS_SQL_PATTERNS.some((p) => p.test(val)), {
      message: "Input contains invalid or suspicious characters",
    }),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password too long"),
  rememberMe: z.boolean().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
