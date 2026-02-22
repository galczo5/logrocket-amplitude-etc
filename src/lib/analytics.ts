/**
 * Unified Analytics Interface
 * Provides a unified API for tracking events across Amplitude, LogRocket, and Hotjar
 * Internally routes events to appropriate services
 */

import * as amplitudeLib from './amplitude';
import * as logRocketLib from './logrocket';

/**
 * Track a custom event across all analytics services
 */
export const trackEvent = (name: string, properties?: Record<string, unknown>) => {
  amplitudeLib.trackEvent(name, properties);
  logRocketLib.trackEvent(name, properties);
  // Hotjar is auto-tracking, no manual tracking needed for standard events
};

/**
 * Set user ID across all analytics services for identification
 */
export const setUserId = (userId: string) => {
  amplitudeLib.setUserId(userId);
  logRocketLib.identify(userId);
};

/**
 * Set user properties/attributes across all analytics services
 */
export const setUserProperties = (properties: Record<string, unknown>) => {
  amplitudeLib.setUserProperties(properties);
  logRocketLib.setUserContext(properties);
};

/**
 * Set fingerprint visitor ID as anonymous identifier across all analytics services.
 * Called once at app startup for anonymous tracking before user login.
 */
export const setFingerprintId = (visitorId: string, confidence: number) => {
  amplitudeLib.setUserProperties({
    fingerprintVisitorId: visitorId,
    fingerprintConfidence: confidence,
  });
  logRocketLib.setUserContext({
    fingerprintVisitorId: visitorId,
    fingerprintConfidence: confidence,
  });
  // Hotjar identify API for visitor tagging
  if (typeof window !== 'undefined' && (window as { hj?: Function }).hj) {
    (window as { hj?: Function }).hj!('identify', null, {
      fingerprint_visitor_id: visitorId,
      fingerprint_confidence: confidence,
    });
  }
};

/**
 * Capture an error across all analytics services
 */
export const captureError = (error: Error, context?: Record<string, unknown>) => {
  logRocketLib.captureException(error, context);
};

/**
 * Track page view (supplements Amplitude's autocapture)
 */
export const trackPageView = (pageName: string) => {
  amplitudeLib.trackPageView(pageName);
  logRocketLib.trackEvent('Page Viewed', {
    page: pageName,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track add to cart event
 */
export const trackAddToCart = (productId: string, productName: string, price: number) => {
  amplitudeLib.trackAddToCart(productId, productName, price);
  logRocketLib.trackEvent('Add to Cart', { productId, productName, price });
};

/**
 * Track remove from cart event
 */
export const trackRemoveFromCart = (productId: string, productName: string, price: number) => {
  amplitudeLib.trackRemoveFromCart(productId, productName, price);
  logRocketLib.trackEvent('Remove from Cart', { productId, productName, price });
};

/**
 * Track product selection/view
 */
export const trackProductSelected = (
  productId: string,
  productName: string,
  category: string
) => {
  amplitudeLib.trackProductSelected(productId, productName, category);
  logRocketLib.trackEvent('Product Selected', { productId, productName, category });
};

/**
 * Track checkout initiation
 */
export const trackCheckoutStarted = (cartValue: number, itemCount: number) => {
  amplitudeLib.trackCheckoutStarted(cartValue, itemCount);
  logRocketLib.trackEvent('Checkout Started', { cartValue, itemCount });
};

/**
 * Track order completion
 */
export const trackOrderPlaced = (orderId: string, orderValue: number, itemCount: number) => {
  amplitudeLib.trackOrderPlaced(orderId, orderValue, itemCount);
  logRocketLib.trackEvent('Order Placed', { orderId, orderValue, itemCount });
};

/**
 * Track user login
 */
export const trackUserLogin = (userId: string, email: string) => {
  amplitudeLib.trackUserLogin(userId, email);
  logRocketLib.trackEvent('User Login', { userId, email });
};

/**
 * Track search/filter action
 */
export const trackSearch = (query: string, filters?: Record<string, unknown>) => {
  amplitudeLib.trackSearch(query, filters);
  logRocketLib.trackEvent('Search', { query, filters });
};

// Re-export service-specific utilities for advanced use cases
export * as amplitude from './amplitude';
export * as logRocket from './logrocket';
