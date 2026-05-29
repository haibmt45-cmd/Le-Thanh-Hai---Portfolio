import { collection, addDoc } from 'firebase/firestore';
import { db } from './config';

export const trackPageView = async (path: string) => {
  try {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('sessionId', sessionId);
    }
    
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem('deviceId', deviceId);
    }

    let ip = '';
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      ip = data.ip;
    } catch (e) {
      console.warn('Could not fetch IP address');
    }
    
    await addDoc(collection(db, 'page_views'), {
      path,
      sessionId,
      deviceId,
      ip,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Failed to track view:', error);
  }
};
