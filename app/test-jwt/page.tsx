
"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function TestJWTPage() {
  const [status, setStatus] = useState("Not tested yet");
  const [loading, setLoading] = useState(false);

  async function testJWT() {
    try {
      setLoading(true);
      setStatus("Generating JWT token...");

      // Step 1: Generate JWT
      const result = await authClient.token();

      if (result.error || !result.data?.token) {
        setStatus(
          `JWT Error: ${result.error?.message || "Token generation failed"}`
        );
        return;
      }

      const token = result.data.token;

      setStatus("Token generated. Verifying protected API...");

      // Step 2: Send JWT to protected API
      const response = await fetch(
        `${API_URL}/api/jwt-test/protected`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json().catch(() => null);

      // Step 3: Show verification result
      if (!response.ok) {
        setStatus(
          `JWT Verification Failed: ${
            data?.message || "Access denied"
          }`
        );
        return;
      }

      setStatus(
        `SUCCESS: ${data?.message || "JWT verified successfully"}\nUser: ${
          data?.user?.name || "Unknown"
        }\nEmail: ${data?.user?.email || "Unknown"}`
      );
    } catch (error) {
      console.error("JWT test error:", error);

      setStatus(
        error instanceof Error
          ? `ERROR: ${error.message}`
          : "ERROR: Check the browser console and server terminal."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          JWT Authentication Test
        </h1>

        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Generate a JWT token and verify access to a protected API.
        </p>

        <button
          type="button"
          onClick={testJWT}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test JWT Authentication"}
        </button>

        <div className="mt-5 rounded-lg bg-slate-100 p-4 dark:bg-slate-800">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Test Result:
          </p>

          <p
            className="mt-2 whitespace-pre-line break-words text-sm text-slate-600 dark:text-slate-300"
            role="status"
            aria-live="polite"
          >
            {status}
          </p>
        </div>
      </div>
    </main>
  );
}
