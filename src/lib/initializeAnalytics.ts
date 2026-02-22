/**
 * Initialize all analytics services
 * This should be called once at app startup in main.tsx before rendering
 */

import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import * as amplitude from '@amplitude/analytics-browser';
import { initialize as initializeHotjar } from 'react-hotjar';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { KEYS } from '../keys';
import { setFingerprintId } from './analytics';

export function initializeAnalytics() {
  // Initialize LogRocket first (before Amplitude for better error tracking)
  if (KEYS.LOGROCKET_APP_ID) {
    try {
      LogRocket.init(KEYS.LOGROCKET_APP_ID);
      setupLogRocketReact(LogRocket);
      console.log('[Analytics] LogRocket initialized');
    } catch (error) {
      console.error('[Analytics] Failed to initialize LogRocket:', error);
    }
  }

  // Initialize Amplitude with autocapture enabled
  if (KEYS.AMPLITUDE_API_KEY) {
    try {
      amplitude.init(KEYS.AMPLITUDE_API_KEY, {
        autocapture: {
          pageViews: true,
          formInteractions: true,
          fileDownloads: true,
          pageLeaves: true
        }
      });
      console.log('[Analytics] Amplitude initialized with autocapture');
    } catch (error) {
      console.error('[Analytics] Failed to initialize Amplitude:', error);
    }
  }

  // Initialize Hotjar for heatmaps and recordings
  if (KEYS.HOTJAR_SITE_ID) {
    try {
      initializeHotjar({
        id: parseInt(KEYS.HOTJAR_SITE_ID),
        sv: 6,
        debug: import.meta.env.DEV
      });
      console.log('[Analytics] Hotjar initialized');
    } catch (error) {
      console.error('[Analytics] Failed to initialize Hotjar:', error);
    }
  }

  if (!KEYS.LOGROCKET_APP_ID && !KEYS.AMPLITUDE_API_KEY && !KEYS.HOTJAR_SITE_ID) {
    console.info('[Analytics] No analytics services configured. Set environment variables to enable.');
  }

  // Initialize Fingerprint for anonymous visitor tracking (free, client-side)
  FingerprintJS.load()
    .then((fp) => fp.get())
    .then((result) => {
      setFingerprintId(result.visitorId, result.confidence.score);
      console.log('[Analytics] Fingerprint initialized:', result.visitorId);
    })
    .catch((error) => {
      console.error('[Analytics] Failed to initialize Fingerprint:', error);
    });
}
