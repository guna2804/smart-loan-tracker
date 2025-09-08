import React from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Save, Sun, Moon, Smartphone, Globe, Mail, Bell } from "lucide-react";

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  language: string;
  dateFormat: string;
}

interface PreferencesTabProps {
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  handlePreferencesUpdate: () => Promise<void>;
  isLoading: boolean;
}

export default function PreferencesTab({
  preferences,
  setPreferences,
  handlePreferencesUpdate,
  isLoading
}: PreferencesTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Preferences</CardTitle>
          <CardDescription>
            Customize your MoneyBoard experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme Selection */}
          <div className="space-y-3">
            <Label>Theme</Label>
            <Select
              value={preferences.theme}
              onValueChange={(value: 'light' | 'dark' | 'system') =>
                setPreferences(prev => ({ ...prev, theme: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center">
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center">
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center">
                    <Smartphone className="mr-2 h-4 w-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Currency Selection */}
          <div className="space-y-3">
            <Label>Default Currency</Label>
            <Select
              value={preferences.currency}
              onValueChange={(value) =>
                setPreferences(prev => ({ ...prev, currency: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="JPY">JPY (¥)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <Label>Language</Label>
            <Select
              value={preferences.language}
              onValueChange={(value) =>
                setPreferences(prev => ({ ...prev, language: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <div className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    English
                  </div>
                </SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Format */}
          <div className="space-y-3">
            <Label>Date Format</Label>
            <Select
              value={preferences.dateFormat}
              onValueChange={(value) =>
                setPreferences(prev => ({ ...prev, dateFormat: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Configure how you receive notifications and reminders.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                <Label>Email Notifications</Label>
              </div>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <Switch
              checked={preferences.notifications.email}
              onCheckedChange={(checked) =>
                setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, email: checked }
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                <Label>Push Notifications</Label>
              </div>
              <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
            </div>
            <Switch
              checked={preferences.notifications.push}
              onCheckedChange={(checked) =>
                setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, push: checked }
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                <Label>Payment Reminders</Label>
              </div>
              <p className="text-sm text-gray-500">Get reminded about upcoming payments</p>
            </div>
            <Switch
              checked={preferences.notifications.reminders}
              onCheckedChange={(checked) =>
                setPreferences(prev => ({
                  ...prev,
                  notifications: { ...prev.notifications, reminders: checked }
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handlePreferencesUpdate} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}