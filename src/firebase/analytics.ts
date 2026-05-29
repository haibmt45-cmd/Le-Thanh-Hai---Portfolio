import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export const trackPageView = async (path: string) => {
  try {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('sessionId', sessionId);
    }
    
    await addDoc(collection(db, 'page_views'), {
      path,
      sessionId,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Failed to track view:', error);
  }
};
