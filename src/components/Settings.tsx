import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { useToast } from "../hooks/use-toast";
import { Person, Settings as SettingsIcon, Security, ErrorOutline } from "@mui/icons-material";
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
  const [activeTab, setActiveTab] = useState("profile");
  
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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  if (!user) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <Box textAlign="center">
          <ErrorOutline sx={{ fontSize: 48, color: 'text.secondary', mx: 'auto' }} />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 600 }}>
            Not authenticated
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Please log in to access settings.
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1024, mx: 'auto', p: 3, spaceY: 3 }}>
      <SettingsHeader />

      <Box sx={{ width: '100%' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            minHeight: 40,
            '& .MuiTabs-indicator': {
              height: 2,
            },
          }}
        >
          <Tab
            value="profile"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1, fontSize: 16 }} />
                Profile
              </Box>
            }
            sx={{
              minHeight: 32,
              borderRadius: 0.5,
              px: 3,
              py: 1.5,
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'none',
              '&.Mui-selected': {
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              },
            }}
          />
          <Tab
            value="preferences"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SettingsIcon sx={{ mr: 1, fontSize: 16 }} />
                Preferences
              </Box>
            }
            sx={{
              minHeight: 32,
              borderRadius: 0.5,
              px: 3,
              py: 1.5,
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'none',
              '&.Mui-selected': {
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              },
            }}
          />
          <Tab
            value="security"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Security sx={{ mr: 1, fontSize: 16 }} />
                Security
              </Box>
            }
            sx={{
              minHeight: 32,
              borderRadius: 0.5,
              px: 3,
              py: 1.5,
              fontSize: '0.875rem',
              fontWeight: 500,
              textTransform: 'none',
              '&.Mui-selected': {
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
              },
            }}
          />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {activeTab === "profile" && (
            <ProfileTab
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              handleProfileUpdate={handleProfileUpdate}
              isLoading={isLoading}
            />
          )}
          {activeTab === "preferences" && (
            <PreferencesTab
              preferences={preferences}
              setPreferences={setPreferences}
              handlePreferencesUpdate={handlePreferencesUpdate}
              isLoading={isLoading}
            />
          )}
          {activeTab === "security" && (
            <SecurityTab
              handleDeleteAccount={handleDeleteAccount}
              isLoading={isLoading}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}