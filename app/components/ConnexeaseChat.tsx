"use client";

import { useEffect } from "react";

const SCRIPT_ID = "connexease-livechat-embed";
const SCRIPT_URL = "https://cdn.livechat.connexease.com/embed.js";
const INTEGRATION_ID = "9ab70e3a-f5a8-40d1-a354-184a1084a7be";

declare global {
  interface Window {
    ConnexeaseWebMessenger?: {
      Init: (integrationId: string) => void;
    };
    __miHotelConnexeaseInitialized?: boolean;
  }
}

export function ConnexeaseChat() {
  useEffect(() => {
    let active = true;

    const initializeChat = () => {
      if (
        !active ||
        window.__miHotelConnexeaseInitialized ||
        !window.ConnexeaseWebMessenger
      ) {
        return;
      }

      window.ConnexeaseWebMessenger.Init(INTEGRATION_ID);
      window.__miHotelConnexeaseInitialized = true;
    };

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      initializeChat();
      existingScript.addEventListener("load", initializeChat, { once: true });

      return () => {
        active = false;
        existingScript.removeEventListener("load", initializeChat);
      };
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_URL;
    script.async = true;
    script.addEventListener("load", initializeChat, { once: true });
    document.body.appendChild(script);

    return () => {
      active = false;
      script.removeEventListener("load", initializeChat);
    };
  }, []);

  return null;
}
