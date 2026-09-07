"use client";

import { MessageCircleMore } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getMessages, normalizeLocale } from "../lib/i18n";

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
  const pathname = usePathname();
  const locale = normalizeLocale(pathname?.split("/").filter(Boolean)[0]);
  const messages = getMessages(locale);
  const [isReady, setIsReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const loadChatRef = useRef<(() => void) | null>(null);
  const pendingOpenRef = useRef(false);

  useEffect(() => {
    let active = true;
    let eventsBound = false;
    let injectedScript: HTMLScriptElement | null = null;
    let existingScript: HTMLScriptElement | null = null;
    let apiCheckInterval: number | null = null;
    let fallbackTimer: number | null = null;
    let loadStarted = false;

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

      if (!open && pendingOpenRef.current && window.Connexease?.open) {
        pendingOpenRef.current = false;
        try {
          window.Connexease.open();
        } catch {
          setIsOpen(false);
          setChatState(false);
        }
      }
    };

    const bindChatEvents = () => {
      const chat = window.Connexease;

      if (!chat?.on || eventsBound) return;

      chat.on("ready", handleReady);
      chat.on("widget:opened", handleOpened);
      chat.on("widget:closed", handleClosed);
      eventsBound = true;
      if (apiCheckInterval !== null) {
        window.clearInterval(apiCheckInterval);
        apiCheckInterval = null;
      }

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

    const loadChat = () => {
      if (!active || loadStarted) return;
      loadStarted = true;

      apiCheckInterval = window.setInterval(bindChatEvents, 100);
      existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

      if (existingScript) {
        initializeChat();
        existingScript.addEventListener("load", initializeChat, { once: true });
        return;
      }

      injectedScript = document.createElement("script");
      injectedScript.id = SCRIPT_ID;
      injectedScript.src = SCRIPT_URL;
      injectedScript.async = true;
      injectedScript.addEventListener("load", initializeChat, { once: true });
      document.body.appendChild(injectedScript);
    };

    loadChatRef.current = loadChat;
    fallbackTimer = window.setTimeout(loadChat, 2500);

    return () => {
      active = false;
      if (apiCheckInterval !== null) window.clearInterval(apiCheckInterval);
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
      if (loadChatRef.current === loadChat) loadChatRef.current = null;
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

    if (!isReady || !chat?.open) {
      pendingOpenRef.current = true;
      loadChatRef.current?.();
      return;
    }

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
      lang={locale}
      aria-label={messages.a11y.chatOpen}
      title={messages.a11y.liveSupport}
      aria-busy={!isReady}
      hidden={isOpen}
      onClick={openChat}
    >
      <MessageCircleMore aria-hidden="true" size={28} strokeWidth={1.8} />
    </button>
  );
}
