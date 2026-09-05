"use client";

import { MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";

const SCRIPT_ID = "connexease-livechat-embed";
const SCRIPT_URL = "https://cdn.livechat.connexease.com/embed.js";
const INTEGRATION_ID = "9ab70e3a-f5a8-40d1-a354-184a1084a7be";
const CHAT_STATE_ATTRIBUTE = "data-mi-hotel-chat";

type ConnexeaseEvent = "ready" | "widget:opened" | "widget:closed";

interface ConnexeaseApi {
  on: (event: ConnexeaseEvent, listener: () => void) => void;
  off?: (event: ConnexeaseEvent, listener: () => void) => void;
  open?: () => void;
  isOpened?: () => boolean;
}

declare global {
  interface Window {
    ConnexeaseWebMessenger?: {
      Init: (integrationId: string) => void;
    };
    Connexease?: ConnexeaseApi;
    __miHotelConnexeaseInitialized?: boolean;
  }
}

export function ConnexeaseChat() {
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let active = true;
    let eventsBound = false;
    let injectedScript: HTMLScriptElement | null = null;

    const setChatState = (open: boolean) => {
      document.documentElement.setAttribute(
        CHAT_STATE_ATTRIBUTE,
        open ? "open" : "closed",
      );
    };

    const handleOpened = () => {
      if (!active) return;
      setIsOpen(true);
      setChatState(true);
    };

    const handleClosed = () => {
      if (!active) return;
      setIsOpen(false);
      setChatState(false);
    };

    const handleReady = () => {
      if (!active) return;

      const open = window.Connexease?.isOpened?.() ?? false;
      setIsReady(true);
      setIsOpen(open);
      setChatState(open);
    };

    const bindChatEvents = () => {
      const chat = window.Connexease;

      if (!chat?.on || eventsBound) return;

      chat.on("ready", handleReady);
      chat.on("widget:opened", handleOpened);
      chat.on("widget:closed", handleClosed);
      eventsBound = true;
      window.clearInterval(apiCheckInterval);

      // The API may already be ready after a hot reload or client navigation.
      if (chat.open && chat.isOpened) handleReady();
    };

    setChatState(false);

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

    const apiCheckInterval = window.setInterval(bindChatEvents, 100);

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      initializeChat();
      existingScript.addEventListener("load", initializeChat, { once: true });
    } else {
      injectedScript = document.createElement("script");
      injectedScript.id = SCRIPT_ID;
      injectedScript.src = SCRIPT_URL;
      injectedScript.async = true;
      injectedScript.addEventListener("load", initializeChat, { once: true });
      document.body.appendChild(injectedScript);
    }

    return () => {
      active = false;
      window.clearInterval(apiCheckInterval);
      existingScript?.removeEventListener("load", initializeChat);
      injectedScript?.removeEventListener("load", initializeChat);

      if (eventsBound) {
        const chat = window.Connexease;
        chat?.off?.("ready", handleReady);
        chat?.off?.("widget:opened", handleOpened);
        chat?.off?.("widget:closed", handleClosed);
      }
    };
  }, []);

  const openChat = () => {
    const chat = window.Connexease;

    if (!chat?.open) return;

    setIsOpen(true);
    document.documentElement.setAttribute(CHAT_STATE_ATTRIBUTE, "open");

    try {
      chat.open();
    } catch {
      setIsOpen(false);
      document.documentElement.setAttribute(CHAT_STATE_ATTRIBUTE, "closed");
    }
  };

  return (
    <button
      type="button"
      className={`floating-chat${isReady ? " floating-chat--ready" : ""}`}
      aria-label="Mİ Hotel canlı destek sohbetini aç"
      title="Canlı destek"
      disabled={!isReady}
      hidden={isOpen}
      onClick={openChat}
    >
      <MessageCircleMore aria-hidden="true" size={28} strokeWidth={1.8} />
    </button>
  );
}
