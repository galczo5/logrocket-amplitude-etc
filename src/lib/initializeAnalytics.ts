/**
 * Initialize all analytics services
 * This should be called once at app startup in main.tsx before rendering
 */

import LogRocket from 'logrocket';
import * as amplitude from '@amplitude/analytics-browser';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { KEYS } from '../keys';
import { setFingerprintId } from './analytics';

export function initializeAnalytics() {
  // Initialize LogRocket first (before Amplitude for better error tracking)
  if (KEYS.LOGROCKET_APP_ID) {
    try {
      LogRocket.init(KEYS.LOGROCKET_APP_ID);
      console.log('[Analytics] LogRocket initialized');
    } catch (error) {
      console.error('[Analytics] Failed to initialize LogRocket:', error);
    }
  } else {
    console.warn('[Analytics] LogRocket not initialized: VITE_LOGROCKET_APP_ID is not set');
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
  } else {
    console.warn('[Analytics] Amplitude not initialized: VITE_AMPLITUDE_API_KEY is not set');
  }

  // Initialize Hotjar/Contentsquare via script tag
  if (KEYS.HOTJAR_SITE_ID) {
    try {
      const script = document.createElement('script');
      script.src = `https://t.contentsquare.net/uxa/${KEYS.HOTJAR_SITE_ID}.js`;
      script.async = true;
      document.head.appendChild(script);
      console.log('[Analytics] Hotjar initialized');
    } catch (error) {
      console.error('[Analytics] Failed to initialize Hotjar:', error);
    }
  } else {
    console.warn('[Analytics] Hotjar not initialized: VITE_HOTJAR_SITE_ID is not set');
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
