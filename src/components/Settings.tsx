import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useToast } from "../hooks/use-toast";
import { User, Settings as SettingsIcon, Shield, AlertCircle } from "lucide-react";
import SettingsHeader from "./settings/SettingsHeader";
import ProfileTab from "./settings/ProfileTab";
import PreferencesTab from "./settings/PreferencesTab";
import SecurityTab from "./settings/SecurityTab";

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

export default function Settings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || ''
  });
  
  // Preferences state
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'light',
    currency: 'USD',
    notifications: {
      email: true,
      push: true,
      reminders: true
    },
    language: 'en',
    dateFormat: 'DD/MM/YYYY'
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem(`userPreferences_${user?.id}`);
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, [user?.id]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update mock user data
      const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const userIndex = mockUsers.findIndex((u: any) => u.id === user?.id);
      
      if (userIndex >= 0) {
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          fullName: profileForm.fullName,
          email: profileForm.email
        };
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
        
        // Update stored user data
        const updatedUserData = {
          id: user!.id,
          fullName: profileForm.fullName,
          email: profileForm.email
        };
        
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Force re-authentication to update user context
        window.location.reload();
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesUpdate = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Save preferences to localStorage
      localStorage.setItem(`userPreferences_${user?.id}`, JSON.stringify(preferences));

      toast({
        title: "Preferences Saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your preferences.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // Remove user from mock database
        const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const updatedUsers = mockUsers.filter((u: any) => u.id !== user?.id);
        localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));

        // Clean up user data
        localStorage.removeItem(`userPreferences_${user?.id}`);

        // Logout user
        logout();

        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted.",
        });
      } catch (error) {
        toast({
          title: "Delete Failed",
          description: "There was an error deleting your account.",
          variant: "destructive"
        });
      }
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Not authenticated</h3>
          <p className="mt-1 text-sm text-gray-500">Please log in to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      <SettingsHeader />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <SettingsIcon className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            handleProfileUpdate={handleProfileUpdate}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab
            preferences={preferences}
            setPreferences={setPreferences}
            handlePreferencesUpdate={handlePreferencesUpdate}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab
            handleDeleteAccount={handleDeleteAccount}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}