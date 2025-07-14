import { createClient } from '@/lib/supabase';

export interface AdminSettingsCache {
  id?: string;
  stripe_publishable_key: string | null;
  stripe_secret: string | null;
  stripe_webhook_secret: string | null;
  show_header: boolean | null;
  sticky_header: boolean | null;
  email: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  background_color: string | null;
  headline_text_color: string | null;
  paragraph_text_color: string | null;
  button_color: string | null;
  button_hover_color: string | null;
  button_text_color: string | null;
  link_color: string | null;
  link_hover_color: string | null;
  header_background_color: string | null;
  dark_primary_color: string | null;
  dark_secondary_color: string | null;
  dark_background_color: string | null;
  dark_headline_text_color: string | null;
  dark_paragraph_text_color: string | null;
  dark_button_color: string | null;
  dark_button_hover_color: string | null;
  dark_button_text_color: string | null;
  dark_link_color: string | null;
  dark_link_hover_color: string | null;
  dark_header_background_color: string | null;
  dev_mode: boolean | null;
  pricing_page_headline: string | null;
  pricing_page_description: string | null;
  pricing_page_faq: { question: string; answer: string }[] | null;
  footer_background_color: string | null;
  dark_footer_background_color: string | null;
  footer_text_color: string | null;
  dark_footer_text_color: string | null;
  footer_link_color: string | null;
  dark_footer_link_color: string | null;
  site_name: string | null;
  footer_html_one: string | null;
  footer_html_two: string | null;
  repo: string | null;
}

interface CacheEntry {
  data: AdminSettingsCache;
  timestamp: number;
  version: string;
}

const CACHE_KEY = 'admin_settings_cache';
const CACHE_VERSION = '1.0';
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

class AdminSettingsCacheManager {
  private static instance: AdminSettingsCacheManager;
  private memoryCache: AdminSettingsCache | null = null;
  private lastFetch: number = 0;

  static getInstance(): AdminSettingsCacheManager {
    if (!AdminSettingsCacheManager.instance) {
      AdminSettingsCacheManager.instance = new AdminSettingsCacheManager();
    }
    return AdminSettingsCacheManager.instance;
  }

  /**
   * Get admin settings from cache (localStorage -> memory -> database)
   */
  async getSettings(): Promise<AdminSettingsCache | null> {
    try {
      // Check memory cache first (fastest)
      if (this.memoryCache && (Date.now() - this.lastFetch) < CACHE_EXPIRY_MS) {
        console.log('✅ Cache Hit: Using memory cache for admin settings');
        return this.memoryCache;
      }

      // Check localStorage cache
      if (typeof window !== 'undefined') {
        const cachedData = this.getFromLocalStorage();
        if (cachedData) {
          console.log('✅ Cache Hit: Using localStorage cache for admin settings');
          this.memoryCache = cachedData;
          this.lastFetch = Date.now();
          return cachedData;
        }
      }

      // Fetch from database and cache
      console.log('⚠️ Cache Miss: Fetching admin settings from database');
      return await this.fetchAndCache();
    } catch (error) {
      console.error('Error getting admin settings from cache:', error);
      return null;
    }
  }

  /**
   * Fetch fresh data from database and update all caches
   */
  async fetchAndCache(): Promise<AdminSettingsCache | null> {
    try {
      console.log('Admin Settings Requested: true');
      const supabase = createClient();
      if (!supabase) {
        throw new Error('Supabase client is not initialized');
      }
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Database fetch error:', error);
        console.log('Admin Settings Requested: false (error occurred)');
        return null;
      }

      const settings = data as AdminSettingsCache;
      
      // Update all caches
      this.memoryCache = settings;
      this.lastFetch = Date.now();
      
      if (typeof window !== 'undefined') {
        this.saveToLocalStorage(settings);
        console.log('💾 Cache Updated: Saved admin settings to localStorage and memory cache');
      }

      return settings;
    } catch (error) {
      console.error('Error fetching admin settings:', error);
      console.log('Admin Settings Requested: false (exception occurred)');
      return null;
    }
  }

  /**
   * Clear all caches and fetch fresh data
   */
  async clearCacheAndRefresh(): Promise<AdminSettingsCache | null> {
    try {
      // Clear memory cache
      this.memoryCache = null;
      this.lastFetch = 0;

      // Clear localStorage cache
      if (typeof window !== 'undefined') {
        localStorage.removeItem(CACHE_KEY);
      }

      // Fetch fresh data
      return await this.fetchAndCache();
    } catch (error) {
      console.error('Error clearing cache and refreshing:', error);
      return null;
    }
  }

  /**
   * Update cache when settings are saved
   */
  async updateCache(newSettings: AdminSettingsCache): Promise<void> {
    try {
      this.memoryCache = newSettings;
      this.lastFetch = Date.now();
      
      if (typeof window !== 'undefined') {
        this.saveToLocalStorage(newSettings);
      }
    } catch (error) {
      console.error('Error updating cache:', error);
    }
  }

  /**
   * Get theme colors specifically (optimized for performance)
   */
  async getThemeColors(): Promise<{
    button_color: string | null;
    button_hover_color: string | null;
    button_text_color: string | null;
    dark_button_color: string | null;
    dark_button_hover_color: string | null;
    dark_button_text_color: string | null;
    primary_color: string | null;
    secondary_color: string | null;
    background_color: string | null;
    dark_primary_color: string | null;
    dark_secondary_color: string | null;
    dark_background_color: string | null;
  } | null> {
    const settings = await this.getSettings();
    if (!settings) return null;

    return {
      button_color: settings.button_color,
      button_hover_color: settings.button_hover_color,
      button_text_color: settings.button_text_color,
      dark_button_color: settings.dark_button_color,
      dark_button_hover_color: settings.dark_button_hover_color,
      dark_button_text_color: settings.dark_button_text_color,
      primary_color: settings.primary_color,
      secondary_color: settings.secondary_color,
      background_color: settings.background_color,
      dark_primary_color: settings.dark_primary_color,
      dark_secondary_color: settings.dark_secondary_color,
      dark_background_color: settings.dark_background_color,
    };
  }

  /**
   * Check if cache exists and is valid
   */
  isCacheValid(): boolean {
    if (this.memoryCache && (Date.now() - this.lastFetch) < CACHE_EXPIRY_MS) {
      return true;
    }

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const entry: CacheEntry = JSON.parse(cached);
          return (
            entry.version === CACHE_VERSION &&
            (Date.now() - entry.timestamp) < CACHE_EXPIRY_MS
          );
        } catch {
          return false;
        }
      }
    }

    return false;
  }

  private getFromLocalStorage(): AdminSettingsCache | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const entry: CacheEntry = JSON.parse(cached);
      
      // Check version and expiry
      if (
        entry.version !== CACHE_VERSION ||
        (Date.now() - entry.timestamp) > CACHE_EXPIRY_MS
      ) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }

  private saveToLocalStorage(data: AdminSettingsCache): void {
    try {
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
        version: CACHE_VERSION,
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
}

// Export singleton instance
export const adminSettingsCache = AdminSettingsCacheManager.getInstance(); 