"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSupabaseReady } from '@/hooks/use-supabase-ready';
import { createClient } from '@/lib/supabase';
import { useTheme } from 'next-themes';
import { adminSettingsCache } from '@/lib/admin-settings-cache';

interface AdminSettings {
  button_color: string | null;
  button_hover_color: string | null;
  button_text_color: string | null;
  dark_button_color: string | null;
  dark_button_hover_color: string | null;
  dark_button_text_color: string | null;
  header_background_color?: string | null;
  dark_header_background_color?: string | null;
  repo: string | null;
  paragraph_text_color?: string | null;
  dark_paragraph_text_color?: string | null;
  background_color?: string | null;
  dark_background_color?: string | null;
  link_color?: string | null;
  link_hover_color?: string | null;
  dark_link_color?: string | null;
  dark_link_hover_color?: string | null;
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
  const supaReady = useSupabaseReady();

  const fetchAdminSettings = async () => {
    try {
      setLoading(true);
      const cachedSettings = await adminSettingsCache.getSettings();
      
      if (cachedSettings) {
        setAdminSettings({
          button_color: (cachedSettings as AdminSettings).button_color,
          button_hover_color: (cachedSettings as AdminSettings).button_hover_color,
          button_text_color: (cachedSettings as AdminSettings).button_text_color,
          dark_button_color: (cachedSettings as AdminSettings).dark_button_color,
          dark_button_hover_color: (cachedSettings as AdminSettings).dark_button_hover_color,
          dark_button_text_color: (cachedSettings as AdminSettings).dark_button_text_color,
          header_background_color: (cachedSettings as AdminSettings).header_background_color ?? null,
          dark_header_background_color: (cachedSettings as AdminSettings).dark_header_background_color ?? null,
          repo: (cachedSettings as AdminSettings).repo ?? null,
          paragraph_text_color: (cachedSettings as AdminSettings).paragraph_text_color ?? null,
          dark_paragraph_text_color: (cachedSettings as AdminSettings).dark_paragraph_text_color ?? null,
          background_color: (cachedSettings as AdminSettings).background_color ?? null,
          dark_background_color: (cachedSettings as AdminSettings).dark_background_color ?? null,
          link_color: (cachedSettings as AdminSettings).link_color ?? null,
          link_hover_color: (cachedSettings as AdminSettings).link_hover_color ?? null,
          dark_link_color: (cachedSettings as AdminSettings).dark_link_color ?? null,
          dark_link_hover_color: (cachedSettings as AdminSettings).dark_link_hover_color ?? null,
        });
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
          button_color: (freshSettings as AdminSettings).button_color,
          button_hover_color: (freshSettings as AdminSettings).button_hover_color,
          button_text_color: (freshSettings as AdminSettings).button_text_color,
          dark_button_color: (freshSettings as AdminSettings).dark_button_color,
          dark_button_hover_color: (freshSettings as AdminSettings).dark_button_hover_color,
          dark_button_text_color: (freshSettings as AdminSettings).dark_button_text_color,
          header_background_color: (freshSettings as AdminSettings).header_background_color ?? null,
          dark_header_background_color: (freshSettings as AdminSettings).dark_header_background_color ?? null,
          repo: (freshSettings as AdminSettings).repo ?? null,
          paragraph_text_color: (freshSettings as AdminSettings).paragraph_text_color ?? null,
          dark_paragraph_text_color: (freshSettings as AdminSettings).dark_paragraph_text_color ?? null,
          background_color: (freshSettings as AdminSettings).background_color ?? null,
          dark_background_color: (freshSettings as AdminSettings).dark_background_color ?? null,
          link_color: (freshSettings as AdminSettings).link_color ?? null,
          link_hover_color: (freshSettings as AdminSettings).link_hover_color ?? null,
          dark_link_color: (freshSettings as AdminSettings).dark_link_color ?? null,
          dark_link_hover_color: (freshSettings as AdminSettings).dark_link_hover_color ?? null,
        });
      }
    } catch (error) {
      console.error('Failed to clear cache and refresh:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supaReady) return;
    fetchAdminSettings();
  }, [supabase, supaReady]);

  const getButtonStyles = (variant = 'default'): ButtonStyles => {
    const isDark = theme === 'dark';
    const styles: ButtonStyles = {};
    // Defaults
    const defaultButtonTextColor = isDark ? '#FFFFFF' : '#ffffff';
    // Apply custom colors for primary/default buttons
    if (variant === 'default' || variant === 'primary') {
      const buttonColor = isDark 
        ? adminSettings?.dark_button_color || adminSettings?.button_color 
        : adminSettings?.button_color;
      const buttonTextColor = isDark 
        ? adminSettings?.dark_button_text_color || adminSettings?.button_text_color || defaultButtonTextColor
        : adminSettings?.button_text_color || defaultButtonTextColor;
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
        ? adminSettings?.dark_button_color || adminSettings?.button_color 
        : adminSettings?.button_color;
      styles.backgroundColor = 'transparent'; // Always reset background for outline
      if (buttonColor) {
        styles.borderColor = buttonColor;
        styles.color = buttonColor;
      }
    }
    return styles;
  };

  const getButtonHoverStyles = (variant = 'default'): ButtonStyles => {
    const isDark = theme === 'dark';
    // Defaults
    const defaultButtonHoverColor = isDark ? '#D6D6D6' : '#B6B6B6';
    const defaultButtonTextColor = isDark ? '#FFFFFF' : '#ffffff';
    const hoverColor = isDark 
      ? adminSettings?.dark_button_hover_color || adminSettings?.button_hover_color || defaultButtonHoverColor
      : adminSettings?.button_hover_color || defaultButtonHoverColor;
    const styles: ButtonStyles = {};
    // Apply hover colors based on variant
    if (variant === 'default' || variant === 'primary') {
      styles.backgroundColor = hoverColor;
      styles.borderColor = hoverColor;
    } else if (variant === 'outline') {
      styles.backgroundColor = hoverColor;
      // Keep text color from normal state for outline on hover
      const buttonTextColor = isDark 
        ? adminSettings?.dark_button_text_color || adminSettings?.button_text_color || defaultButtonTextColor
        : adminSettings?.button_text_color || defaultButtonTextColor;
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