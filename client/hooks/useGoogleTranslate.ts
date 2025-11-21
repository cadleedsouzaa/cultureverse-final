import { useEffect, useState } from "react";

export const useGoogleTranslate = () => {
  const [currentLang, setCurrentLang] = useState("en");

  // Initialize cookie check
  useEffect(() => {
    const getCookie = (name: string) => {
      const v = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
      return v ? v[2] : null;
    };
    
    // Google stores language in 'googtrans' cookie like '/en/hi'
    const cookie = getCookie("googtrans");
    if (cookie) {
      const langCode = cookie.split("/")[2];
      setCurrentLang(langCode || "en");
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    // Google Translate works by reading a cookie named 'googtrans'
    // Format: /sourceLang/targetLang (e.g., /en/hi)
    
    // 1. Set the cookie
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/${langCode}; path=/;`; // Fallback for localhost

    // 2. Store locally for UI state
    setCurrentLang(langCode);

    // 3. Reload page to apply translation (Google Translate requirement for clean switch)
    window.location.reload();
  };

  return { currentLang, changeLanguage };
};