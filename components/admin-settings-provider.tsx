"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useTheme } from 'next-themes';
import { adminSettingsCache, AdminSettingsCache } from '@/lib/admin-settings-cache';

interface AdminSettings {
  button_color: string | null;
  button_hover_color: string | null;
  button_text_color: string | null;
  dark_button_color: string | null;
  dark_button_hover_color: string | null;
  dark_button_text_color: string | null;
}

interface ButtonStyles {
  backgroundColor?: string;
  color?: string;
  borderColor?: string;
}

interface AdminSettingsContextType {
  adminSettings: AdminSettings | null;
  loading: boolean;
  getButtonStyles: (variant?: string) => ButtonStyles;
  getButtonHoverStyles: (variant?: string) => ButtonStyles;
  refreshSettings: () => Promise<void>;
  clearCacheAndRefresh: () => Promise<void>;
}

const AdminSettingsContext = createContext<AdminSettingsContextType | undefined>(undefined);

export function AdminSettingsProvider({ children }: { children: React.ReactNode }) {
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const supabase = createClient();

  const fetchAdminSettings = async () => {
    try {
      setLoading(true);
      const cachedSettings = await adminSettingsCache.getThemeColors();
      
      if (cachedSettings) {
        setAdminSettings(cachedSettings);
      }
    } catch (error) {
      console.error('Failed to fetch admin settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCacheAndRefresh = async () => {
    try {
      setLoading(true);
      const freshSettings = await adminSettingsCache.clearCacheAndRefresh();
      
      if (freshSettings) {
        // Extract theme colors from the full settings
        setAdminSettings({
          button_color: freshSettings.button_color,
          button_hover_color: freshSettings.button_hover_color,
          button_text_color: freshSettings.button_text_color,
          dark_button_color: freshSettings.dark_button_color,
          dark_button_hover_color: freshSettings.dark_button_hover_color,
          dark_button_text_color: freshSettings.dark_button_text_color,
        });
      }
    } catch (error) {
      console.error('Failed to clear cache and refresh:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminSettings();
  }, [supabase]);

  const getButtonStyles = (variant = 'default'): ButtonStyles => {
    if (!adminSettings) return {};
    
    const isDark = theme === 'dark';
    const styles: ButtonStyles = {};
    
    // Apply custom colors for primary/default buttons
    if (variant === 'default' || variant === 'primary') {
      const buttonColor = isDark 
        ? adminSettings.dark_button_color || adminSettings.button_color 
        : adminSettings.button_color;
      const buttonTextColor = isDark 
        ? adminSettings.dark_button_text_color || adminSettings.button_text_color 
        : adminSettings.button_text_color;
      
      if (buttonColor) {
        styles.backgroundColor = buttonColor;
        styles.borderColor = buttonColor;
      }
      if (buttonTextColor) {
        styles.color = buttonTextColor;
      }
    }
    
    // For outline buttons, use custom colors for border and text
    if (variant === 'outline') {
      const buttonColor = isDark 
        ? adminSettings.dark_button_color || adminSettings.button_color 
        : adminSettings.button_color;
      
      if (buttonColor) {
        styles.borderColor = buttonColor;
        styles.color = buttonColor;
      }
    }
    
    return styles;
  };

  const getButtonHoverStyles = (variant = 'default'): ButtonStyles => {
    if (!adminSettings) return {};
    
    const isDark = theme === 'dark';
    const hoverColor = isDark 
      ? adminSettings.dark_button_hover_color || adminSettings.button_hover_color 
      : adminSettings.button_hover_color;
    
    if (!hoverColor) return {};
    
    const styles: ButtonStyles = {};
    
    // Apply hover colors based on variant
    if (variant === 'default' || variant === 'primary') {
      styles.backgroundColor = hoverColor;
      styles.borderColor = hoverColor;
    } else if (variant === 'outline') {
      styles.backgroundColor = hoverColor;
      // Keep text color from normal state for outline on hover
      const buttonTextColor = isDark 
        ? adminSettings.dark_button_text_color || adminSettings.button_text_color 
        : adminSettings.button_text_color;
      if (buttonTextColor) {
        styles.color = buttonTextColor;
      }
    }
    
    return styles;
  };

  return (
    <AdminSettingsContext.Provider value={{
      adminSettings,
      loading,
      getButtonStyles,
      getButtonHoverStyles,
      refreshSettings: fetchAdminSettings,
      clearCacheAndRefresh
    }}>
      {children}
    </AdminSettingsContext.Provider>
  );
}

export function useAdminSettings() {
  const context = useContext(AdminSettingsContext);
  if (context === undefined) {
    // Graceful degradation when context is not available
          return {
        adminSettings: null,
        loading: false,
        getButtonStyles: () => ({}),
        getButtonHoverStyles: () => ({}),
        refreshSettings: async () => {},
        clearCacheAndRefresh: async () => {}
      };
  }
  return context;
} 