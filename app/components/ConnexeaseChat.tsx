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
    __miHotelConnexeaseReady?: boolean;
  }
}

export function ConnexeaseChat() {
  const pathname = usePathname();
  const locale = normalizeLocale(pathname?.split("/").filter(Boolean)[0]);
  const messages = getMessages(locale);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const loadChatRef = useRef<(() => void) | null>(null);
  const pendingOpenRef = useRef(false);

  useEffect(() => {
    let active = true;
    let eventsBound = false;
    let injectedScript: HTMLScriptElement | null = null;
    let existingScript: HTMLScriptElement | null = null;
    let apiCheckInterval: number | null = null;
    let readyTimeout: number | null = null;
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

      window.__miHotelConnexeaseReady = true;
      const open = window.Connexease?.isOpened?.() ?? false;
      setIsReady(true);
      setIsLoading(false);
      if (readyTimeout !== null) window.clearTimeout(readyTimeout);
      setIsOpen(open);
      setChatState(open);

      if (!open && pendingOpenRef.current && window.Connexease?.open) {
        try {
          window.Connexease.open();
          pendingOpenRef.current = false;
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
      if (window.__miHotelConnexeaseReady) handleReady();
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

    const stopWaiting = () => {
      if (!active) return;
      setIsLoading(false);
      if (apiCheckInterval !== null) window.clearInterval(apiCheckInterval);
      if (readyTimeout !== null) window.clearTimeout(readyTimeout);
      apiCheckInterval = null;
      readyTimeout = null;
    };
    const handleScriptError = () => {
      stopWaiting();
      // A failed embed download is retryable; a slow provider Init is not.
      loadStarted = false;
      (injectedScript ?? existingScript)?.remove();
      injectedScript = null;
      existingScript = null;
    };

    const loadChat = () => {
      if (!active) return;
      if (loadStarted) {
        bindChatEvents();
        return;
      }
      loadStarted = true;
      setIsLoading(true);

      apiCheckInterval = window.setInterval(bindChatEvents, 100);
      // An unavailable chat provider must not keep polling indefinitely.
      readyTimeout = window.setTimeout(stopWaiting, 20000);
      existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

      if (existingScript) {
        initializeChat();
        existingScript.addEventListener("load", initializeChat, { once: true });
        existingScript.addEventListener("error", handleScriptError, { once: true });
        return;
      }

      injectedScript = document.createElement("script");
      injectedScript.id = SCRIPT_ID;
      injectedScript.src = SCRIPT_URL;
      injectedScript.async = true;
      injectedScript.addEventListener("load", initializeChat, { once: true });
      injectedScript.addEventListener("error", handleScriptError, { once: true });
      document.body.appendChild(injectedScript);
    };

    loadChatRef.current = loadChat;
    // Keep chat available across navigation, but don't download it on first paint.
    bindChatEvents();

    return () => {
      active = false;
      if (apiCheckInterval !== null) window.clearInterval(apiCheckInterval);
      if (readyTimeout !== null) window.clearTimeout(readyTimeout);
      if (loadChatRef.current === loadChat) loadChatRef.current = null;
      existingScript?.removeEventListener("load", initializeChat);
      existingScript?.removeEventListener("error", handleScriptError);
      injectedScript?.removeEventListener("load", initializeChat);
      injectedScript?.removeEventListener("error", handleScriptError);

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
      aria-busy={isLoading}
      hidden={isOpen}
      onPointerEnter={() => { if (!isReady) loadChatRef.current?.(); }}
      onFocus={() => { if (!isReady) loadChatRef.current?.(); }}
      onClick={openChat}
    >
      <MessageCircleMore aria-hidden="true" size={28} strokeWidth={1.8} />
    </button>
  );
}
