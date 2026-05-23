"use client";

import { useEffect, useRef, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { Camera } from "lucide-react";
import Image from "next/image";
import { useCookies } from "react-cookie";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useProfile } from "@/hooks/use-profile";
import { base_api, base_url, howl } from "@/lib/utils";
import type { ChangePasswordBody } from "@/types/auth";
import type { ApiResponse } from "@/types/base";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [cookies] = useCookies(["auth_token"]);
  const token = cookies.auth_token as string | undefined;

  const { data } = useProfile();
  const profile = data?.data;

  // Profile state
  const [name, setName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [profilePending, setProfilePending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
    if (profile?.profile_photo_url) setPreview(profile.profile_photo_url);
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const formData = new FormData();
    formData.append("name", name);
    if (photoFile) formData.append("profile_photo", photoFile);

    setProfilePending(true);
    try {
      const res = await fetch(`${base_url}${base_api}/profile`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message ?? "Failed to update profile.");
      toast.success(json.message ?? "Profile updated.");
      setPhotoFile(null);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setProfilePending(false);
    }
  };

  // Password state
  const [pwForm, setPwForm] = useState<ChangePasswordBody>({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [pwPending, setPwPending] = useState(false);

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.new_password_confirmation) {
      toast.error("New passwords do not match.");
      return;
    }
    if (pwForm.new_password.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    setPwPending(true);
    try {
      const res = await howl<ApiResponse<null>>("/profile/password", {
        method: "PUT",
        body: pwForm,
        token,
      });
      toast.success(res.message ?? "Password updated.");
      setPwForm({ current_password: "", new_password: "", new_password_confirmation: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setPwPending(false);
    }
  };

  // Theme state
  const [darkMode, setDarkMode] = useState(false);
  const handleThemeToggle = (checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
  };

  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Profile */}
        <Card className="shadow-none">
          <CardContent className="p-6 space-y-5">
            <div>
              <h2 className="text-base font-semibold">Profile</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Update your display name and photo.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-muted overflow-hidden flex items-center justify-center border border-border">
                    {preview ? (
                      <Image
                        src={preview}
                        alt="Profile photo"
                        width={80}
                        height={80}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">
                        {initials}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow"
                  >
                    <Camera size={13} />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click the camera to change photo
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email-display">Email</Label>
                <Input
                  id="email-display"
                  value={profile?.email ?? ""}
                  readOnly
                  className="bg-muted text-muted-foreground cursor-default"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={profilePending || !name.trim()}
              >
                {profilePending ? "Saving…" : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-5">
          {/* Theme */}
          <Card className="shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">Theme</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {darkMode ? "Dark mode is on." : "Light mode is on."}
                  </p>
                </div>
                <Switch checked={darkMode} onCheckedChange={handleThemeToggle} />
              </div>
            </CardContent>
          </Card>

          {/* Password */}
          <Card className="shadow-none">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-base font-semibold">Change password</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Use a strong password at least 8 characters long.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="current_password">Current password</Label>
                  <Input
                    id="current_password"
                    name="current_password"
                    type="password"
                    placeholder="••••••••"
                    value={pwForm.current_password}
                    onChange={handlePwChange}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new_password">New password</Label>
                  <Input
                    id="new_password"
                    name="new_password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={pwForm.new_password}
                    onChange={handlePwChange}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new_password_confirmation">
                    Confirm new password
                  </Label>
                  <Input
                    id="new_password_confirmation"
                    name="new_password_confirmation"
                    type="password"
                    placeholder="Repeat new password"
                    value={pwForm.new_password_confirmation}
                    onChange={handlePwChange}
                    required
                    autoComplete="new-password"
                  />
                </div>
                <Button type="submit" disabled={pwPending}>
                  {pwPending ? "Updating…" : "Update password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
