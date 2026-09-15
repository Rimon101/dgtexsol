"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/auth";
import { redirect } from "next/navigation";

export interface AuthActionResult {
  success?: boolean;
  error?: string;
}

/**
 * Server action to log in an admin using email and password.
 * Sets the Supabase auth session cookies via @supabase/ssr.
 */
export async function loginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email");
  const password = formData.get("password");

  const validated = loginSchema.safeParse({ email, password });
  if (!validated.success) {
    const firstIssue = validated.error.issues[0];
    return { error: firstIssue?.message ?? "Invalid input" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

/**
 * Server action to sign out the currently authenticated admin.
 * Clears the session cookie and redirects to /admin/login.
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/**
 * Server helper to get the currently authenticated user.
 */
export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

