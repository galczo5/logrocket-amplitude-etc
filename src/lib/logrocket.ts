/**
 * LogRocket integration
 * Handles event tracking and user identification for LogRocket
 */

import LogRocket from 'logrocket';
import { KEYS } from '../keys';

/**
 * Capture a message/event in LogRocket
 */
export const captureMessage = (
  name: string,
  level: 'info' | 'warning' | 'error' = 'info',
  properties?: Record<string, unknown>
) => {
  if (KEYS.LOGROCKET_APP_ID) {
    LogRocket.captureMessage(name, level, properties);
  }
};

/**
 * Capture an exception/error in LogRocket
 */
export const captureException = (error: Error, context?: Record<string, unknown>) => {
  if (KEYS.LOGROCKET_APP_ID) {
    LogRocket.captureException(error, {
      contexts: context,
    });
  }
};

/**
 * Identify a user in LogRocket
 */
export const identify = (userId: string, traits?: Record<string, unknown>) => {
  if (KEYS.LOGROCKET_APP_ID) {
    LogRocket.identify(userId, traits);
  }
};

/**
 * Set user context/properties in LogRocket
 */
export const setUserContext = (properties: Record<string, unknown>) => {
  if (KEYS.LOGROCKET_APP_ID) {
    LogRocket.setUserContext(properties);
  }
};

/**
 * Log a message to LogRocket console
 */
export const log = (message: string, data?: unknown) => {
  if (KEYS.LOGROCKET_APP_ID) {
    LogRocket.log(message);
    if (data) {
      LogRocket.log(JSON.stringify(data));
    }
  }
};

/**
 * Track a custom event by logging to LogRocket
 */
export const trackEvent = (name: string, properties?: Record<string, unknown>) => {
  captureMessage(name, 'info', properties);
};
