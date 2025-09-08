import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Save } from "lucide-react";

interface ProfileTabProps {
  profileForm: { fullName: string; email: string };
  setProfileForm: React.Dispatch<React.SetStateAction<{ fullName: string; email: string }>>;
  handleProfileUpdate: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export default function ProfileTab({
  profileForm,
  setProfileForm,
  handleProfileUpdate,
  isLoading
}: ProfileTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Update your personal information and contact details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={profileForm.fullName}
              onChange={(e) => setProfileForm(prev => ({
                ...prev,
                fullName: e.target.value
              }))}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm(prev => ({
                ...prev,
                email: e.target.value
              }))}
              placeholder="Enter your email address"
            />
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium">Account Status</h4>
              <p className="text-sm text-gray-500">Member since: {new Date().toLocaleDateString()}</p>
            </div>
            <Button type="submit" disabled={isLoading}>
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}