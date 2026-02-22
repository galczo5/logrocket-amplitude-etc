/**
 * Centralized configuration for third-party analytics services
 * All keys are read from environment variables
 * See .env.example and ENV_SETUP.md for setup instructions
 */

export const KEYS = {
  AMPLITUDE_API_KEY: import.meta.env.VITE_AMPLITUDE_API_KEY || '',
  LOGROCKET_APP_ID: import.meta.env.VITE_LOGROCKET_APP_ID || '',
  HOTJAR_SITE_ID: import.meta.env.VITE_HOTJAR_SITE_ID || '',
};
