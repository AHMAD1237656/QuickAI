"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Mail, Zap, Crown, CalendarDays, KeyRound } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import Loading from "@/components/Loading";
import { getProfile, updateProfile, changePassword, ApiError } from "@/lib/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ first_name: "", last_name: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [pwForm, setPwForm] = useState({ old_password: "", new_password: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setForm({ first_name: data.first_name || "", last_name: data.last_name || "" });
      })
      .catch(() => setError("Could not load your profile."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const updated = await updateProfile(form);
      setProfile(updated);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (pwForm.new_password !== pwForm.confirm) {
      setPwError("New password and confirmation do not match.");
      return;
    }

    setPwSaving(true);
    try {
      await changePassword({
        old_password: pwForm.old_password,
        new_password: pwForm.new_password,
      });
      setPwSuccess("Password updated successfully.");
      setPwForm({ old_password: "", new_password: "", confirm: "" });
    } catch (err) {
      setPwError(err instanceof ApiError ? err.message : "Could not update your password.");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <DashboardShell title="Profile">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-ink-950">Your Profile</h2>
        <p className="mt-1 text-sm text-ink-600">
          View your account details and update your basic information.
        </p>
      </div>

      {loading ? (
        <Loading text="Loading your profile..." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Account overview */}
          <div className="rounded-2xl border border-paper-200 bg-white p-6 shadow-card lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink-950 text-2xl font-semibold text-signal-400">
                {profile?.username?.[0]?.toUpperCase()}
              </div>
              <p className="mt-3 text-base font-semibold text-ink-950">{profile?.username}</p>
              <p className="text-sm text-ink-600">{profile?.email}</p>
            </div>

            <div className="mt-6 space-y-3 border-t border-paper-100 pt-5">
              <InfoRow icon={Mail} label="Email" value={profile?.email} />
              <InfoRow icon={Zap} label="Credits" value={profile?.credits} />
              <InfoRow icon={Crown} label="Plan" value={capitalize(profile?.plan)} />
              <InfoRow
                icon={CalendarDays}
                label="Member since"
                value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "-"}
              />
            </div>
          </div>

          {/* Edit form */}
          <div className="rounded-2xl border border-paper-200 bg-white p-6 shadow-card lg:col-span-2">
            <h3 className="mb-4 text-base font-semibold text-ink-950">Edit basic information</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-800">
                    First name
                  </label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="w-full rounded-xl border border-paper-200 bg-paper-50/60 px-3.5 py-2.5 text-sm text-ink-950 outline-none transition focus:border-signal-400 focus:bg-white focus:ring-4 focus:ring-signal-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-800">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="w-full rounded-xl border border-paper-200 bg-paper-50/60 px-3.5 py-2.5 text-sm text-ink-950 outline-none transition focus:border-signal-400 focus:bg-white focus:ring-4 focus:ring-signal-100"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-start gap-2 rounded-xl border border-signal-200 bg-signal-50 px-3.5 py-2.5 text-sm text-signal-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white tracking-tight transition-all duration-150 hover:bg-ink-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>

          {/* Change password */}
          <div className="rounded-2xl border border-paper-200 bg-white p-6 shadow-card lg:col-span-3">
            <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-ink-950">
              <KeyRound className="h-4 w-4 text-ink-600" />
              Change password
            </h3>
            <form onSubmit={handlePasswordChange} className="max-w-xl space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink-800">
                  Current password
                </label>
                <input
                  type="password"
                  required
                  value={pwForm.old_password}
                  onChange={(e) => setPwForm({ ...pwForm, old_password: e.target.value })}
                  className="w-full rounded-xl border border-paper-200 bg-paper-50/60 px-3.5 py-2.5 text-sm text-ink-950 outline-none transition focus:border-signal-400 focus:bg-white focus:ring-4 focus:ring-signal-100"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-800">
                    New password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={pwForm.new_password}
                    onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
                    className="w-full rounded-xl border border-paper-200 bg-paper-50/60 px-3.5 py-2.5 text-sm text-ink-950 outline-none transition focus:border-signal-400 focus:bg-white focus:ring-4 focus:ring-signal-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-800">
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                    className="w-full rounded-xl border border-paper-200 bg-paper-50/60 px-3.5 py-2.5 text-sm text-ink-950 outline-none transition focus:border-signal-400 focus:bg-white focus:ring-4 focus:ring-signal-100"
                  />
                </div>
              </div>

              {pwError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {pwError}
                </div>
              )}
              {pwSuccess && (
                <div className="flex items-start gap-2 rounded-xl border border-signal-200 bg-signal-50 px-3.5 py-2.5 text-sm text-signal-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                  {pwSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={pwSaving}
                className="rounded-xl border border-paper-200 px-5 py-2.5 text-sm font-semibold text-ink-800 transition hover:bg-paper-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pwSaving ? "Updating..." : "Update password"}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2 text-ink-600">
        <Icon className="h-4 w-4" strokeWidth={2} />
        {label}
      </span>
      <span className="font-medium text-ink-950">{value ?? "-"}</span>
    </div>
  );
}

function capitalize(str) {
  if (!str) return "-";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
