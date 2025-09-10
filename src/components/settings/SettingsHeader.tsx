import React from "react";
import { Settings as SettingsIcon } from "@mui/icons-material";

export default function SettingsHeader() {
  return (
    <div className="flex items-center space-x-4">
      <SettingsIcon className="h-8 w-8 text-blue-600" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account and preferences</p>
      </div>
    </div>
  );
}