"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [username, setUsername] = useState("Admin");
  const [savedUsername, setSavedUsername] = useState("Admin");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  const handleSaveProfile = () => {
    if (!username.trim()) return;
    setSavedUsername(username.trim());
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);
    if (!currentPassword) {
      setPasswordError("Enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleThemeToggle = (checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
      {/* Profile */}
      <Card className="shadow-none">
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold">Profile</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage your admin display name.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email-display">Email</Label>
            <Input
              id="email-display"
              value="admin@gmail.com"
              readOnly
              className="bg-muted text-muted-foreground cursor-default"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Display name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <Button
            onClick={handleSaveProfile}
            disabled={!username.trim() || username.trim() === savedUsername}
          >
            Save changes
          </Button>
        </CardContent>
      </Card>

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
            <Switch
              checked={darkMode}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="shadow-none">
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold">Update password</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Use a strong password at least 8 characters long.
            </p>
          </div>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Min. 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            {passwordError && (
              <p className="text-xs text-destructive">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-xs text-[oklch(0.52_0.165_145)]">
                Password updated successfully.
              </p>
            )}
            <Button type="submit">Update password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
