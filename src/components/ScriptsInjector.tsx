import { useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';

export default function ScriptsInjector() {
  const location = useLocation();

  useEffect(() => {
    let unmounted = false;

    const fetchAndInjectScripts = async () => {
      try {
        const docRef = doc(db, 'settings', 'global');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && !unmounted) {
          const data = docSnap.data();
          const integrations = data.integrations || {};

          // 1. Inect Google Analytics
          if (integrations.gaId && integrations.gaId.trim() !== '') {
            const gaId = integrations.gaId.trim();
            
            if (!document.getElementById('ga-script')) {
              const script1 = document.createElement('script');
              script1.async = true;
              script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
              script1.id = 'ga-script';
              document.head.appendChild(script1);

              const script2 = document.createElement('script');
              script2.id = 'ga-inline-script';
              script2.innerHTML = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { page_path: window.location.pathname });
                window.gaId = '${gaId}'; // store for later
              `;
              document.head.appendChild(script2);
            }
          }
          
          // 2. Inject Custom Head Code
          if (integrations.customHead && integrations.customHead.trim() !== '') {
            if (!document.getElementById('custom-head-script')) {
              const wrapper = document.createElement('div');
              wrapper.id = 'custom-head-script';
              // Note: using Range lets the browser execute script tags if they are in the string
              const fragment = document.createRange().createContextualFragment(integrations.customHead);
              document.head.appendChild(fragment);
            }
          }
           
           // 3. Inject Custom Body Code
           if (integrations.customBody && integrations.customBody.trim() !== '') {
            if (!document.getElementById('custom-body-script')) {
              const fragment = document.createRange().createContextualFragment(integrations.customBody);
              document.body.appendChild(fragment);
            }
          }

        }
      } catch (error) {
        console.error("Failed to load global scripts:", error);
      }
    };
    
    fetchAndInjectScripts();

    return () => {
      unmounted = true;
    };
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (typeof window !== 'undefined' && 'gtag' in window && 'gaId' in window) {
      // @ts-ignore
      window.gtag('config', window.gaId, { page_path: location.pathname });
    }
  }, [location]);

  return null;
}
