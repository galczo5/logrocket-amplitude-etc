/**
 * Amplitude analytics integration
 * Handles event tracking and user identification for Amplitude
 */

import * as amplitude from '@amplitude/analytics-browser';
import { KEYS } from '../keys';

/**
 * Track a custom event in Amplitude
 */
export const trackEvent = (name: string, properties?: Record<string, unknown>) => {
  if (KEYS.AMPLITUDE_API_KEY) {
    amplitude.track(name, properties);
  }
};

/**
 * Set user ID in Amplitude for identification
 */
export const setUserId = (userId: string) => {
  if (KEYS.AMPLITUDE_API_KEY) {
    amplitude.setUserId(userId);
  }
};

/**
 * Set user properties/attributes in Amplitude
 */
export const setUserProperties = (properties: Record<string, unknown>) => {
  if (KEYS.AMPLITUDE_API_KEY) {
    const identify = new amplitude.Identify();
    for (const [key, value] of Object.entries(properties)) {
      identify.set(key, value as string | number | boolean);
    }
    amplitude.identify(identify);
  }
};

/**
 * Track page view in Amplitude (supplements autocapture)
 */
export const trackPageView = (pageName: string, route: string) => {
  trackEvent('Page Viewed', {
    page: pageName,
    route,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track add to cart event
 */
export const trackAddToCart = (productId: string, productName: string, price: number) => {
  trackEvent('Add to Cart', {
    productId,
    productName,
    price,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track remove from cart event
 */
export const trackRemoveFromCart = (productId: string, productName: string, price: number) => {
  trackEvent('Remove from Cart', {
    productId,
    productName,
    price,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track product selection/view
 */
export const trackProductSelected = (productId: string, productName: string, category: string) => {
  trackEvent('Product Selected', {
    productId,
    productName,
    category,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track checkout initiation
 */
export const trackCheckoutStarted = (cartValue: number, itemCount: number) => {
  trackEvent('Checkout Started', {
    cartValue,
    itemCount,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track order completion
 */
export const trackOrderPlaced = (orderId: string, orderValue: number, itemCount: number) => {
  trackEvent('Order Placed', {
    orderId,
    orderValue,
    itemCount,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track user login
 */
export const trackUserLogin = (userId: string, email: string) => {
  trackEvent('User Login', {
    userId,
    email,
    timestamp: new Date().toISOString()
  });
};

/**
 * Track search/filter action
 */
export const trackSearch = (query: string, filters?: Record<string, unknown>) => {
  trackEvent('Search', {
    query,
    filters,
    timestamp: new Date().toISOString()
  });
};

/**
 * Reset Amplitude user identity — clears userId and generates a new anonymous device ID.
 * Call on logout so the next login starts with a clean identity.
 */
export const reset = () => {
  if (KEYS.AMPLITUDE_API_KEY) {
    amplitude.reset();
  }
};
