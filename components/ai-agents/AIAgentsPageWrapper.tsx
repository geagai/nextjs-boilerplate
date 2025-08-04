import React from 'react';
import AIAgentsPageWrapperClient from '@/app/ai-agents/AIAgentsPageWrapper';

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

interface AIAgentsPageWrapperProps {
  adminSettings: AdminSettings;
}

export default function AIAgentsPageWrapper({ adminSettings }: AIAgentsPageWrapperProps) {
  return <AIAgentsPageWrapperClient />;
} 