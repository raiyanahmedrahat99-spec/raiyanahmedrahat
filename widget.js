/**
 * ======================================================================
 * NEXA: C-SUITE EXECUTIVE AI AGENT & EMBEDDABLE FLOATING CHAT WIDGET
 * Enterprise Architecture: Desktop Floating & 100% Full-Width Mobile Viewport
 * ======================================================================
 */

(function () {
  'use strict';

  if (window.__NEXA_WIDGET_LOADED__) return;
  window.__NEXA_WIDGET_LOADED__ = true;

  function initWidget() {
    // Resolve API Base URL automatically
    const currentScript = document.currentScript || (function () {
      const scripts = document.getElementsByTagName('script');
      for (let i = scripts.length - 1; i >= 0; i--) {
        if (scripts[i].src && scripts[i].src.includes('widget.js')) {
          return scripts[i];
        }
      }
      return scripts[scripts.length - 1];
    })();

    let apiBase = window.NEXA_API_URL || '';
    if (!apiBase && currentScript && currentScript.src) {
      try {
        const parsedUrl = new URL(currentScript.src);
        apiBase = parsedUrl.origin;
      } catch (e) {
        apiBase = 'https://nexa-nine-tau.vercel.app';
      }
    }
    if (!apiBase) {
      apiBase = 'https://nexa-nine-tau.vercel.app';
    }

    const STORAGE_KEY = 'nexa_chat_history';

    // State Variables
    let isOpen = false;
    let isSending = false;
    let history = [];
    let teaserDismissed = false;
    let teaserTimer = null;
    let teaserDismissTimer = null;
    let previousBodyOverflow = '';
    let previousHtmlOverflow = '';

    // Crystalline Dual-Tone Web Audio Chime
    function playExecutiveChime() {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const t = ctx.currentTime;
        const tones = [
          { freq: 1046.5, start: 0.0, dur: 0.45, gain: 0.07 },
          { freq: 1567.98, start: 0.07, dur: 0.65, gain: 0.08 }
        ];
        tones.forEach(({ freq, start, dur, gain }) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + start);
          gainNode.gain.setValueAtTime(0.0001, t + start);
          gainNode.gain.exponentialRampToValueAtTime(gain, t + start + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, t + start + dur);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start(t + start);
          osc.stop(t + start + dur + 0.05);
        });
      } catch (e) {}
    }

    // Monogram Executive SVG Logo
    const NEXA_SVG_LOGO = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="nexa-svg-icon">
        <defs>
          <linearGradient id="nexaGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="60%" stop-color="#0ea5e9"/>
            <stop offset="100%" stop-color="#0284c7"/>
          </linearGradient>
        </defs>
        <path d="M12 2.2L20 5.6V11.8C20 16.6 16.5 20.7 12 21.8C7.5 20.7 4 16.6 4 11.8V5.6L12 2.2Z" stroke="url(#nexaGrad)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="rgba(14, 165, 233, 0.1)"/>
        <path d="M8.5 15.2V8.8L15.5 15.2V8.8" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="8.5" cy="8.8" r="1.5" fill="#38bdf8"/>
        <circle cx="15.5" cy="15.2" r="1.5" fill="#38bdf8"/>
        <circle cx="12" cy="12" r="1.2" fill="#38bdf8"/>
      </svg>
    `;

    // Real-time Schedule Evaluation
    function evaluateSchedule(date) {
      const d = date || new Date();
      const day = d.toLocaleDateString('en-US', { weekday: 'long' });
      const h = d.getHours();
      const m = d.getMinutes();
      const totalMinutes = h * 60 + m;
      const isWeekend = day === 'Friday' || day === 'Saturday';

      if (!isWeekend) {
        if (totalMinutes >= 7 * 60 + 30 && totalMinutes < 9 * 60 + 30) {
          return { label: 'Strategic Research', status: 'BUSY', color: '#f59e0b', ringColor: 'rgba(245, 158, 11, 0.65)' };
        } else if (totalMinutes >= 9 * 60 + 30 && totalMinutes < 10 * 60) {
          return { label: 'Operations Prep', status: 'AVAILABLE', color: '#06b6d4', ringColor: 'rgba(6, 182, 212, 0.65)' };
        } else if (totalMinutes >= 10 * 60 && totalMinutes < 13 * 60) {
          return { label: 'Agency Leadership', status: 'BUSY', color: '#f59e0b', ringColor: 'rgba(245, 158, 11, 0.65)' };
        } else if (totalMinutes >= 13 * 60 && totalMinutes < 16 * 60) {
          return { label: 'Cybersecurity Audit', status: 'BUSY', color: '#ef4444', ringColor: 'rgba(239, 68, 68, 0.65)' };
        } else if (totalMinutes >= 16 * 60 && totalMinutes < 21 * 60) {
          return { label: 'Client Consultations', status: 'AVAILABLE', color: '#06b6d4', ringColor: 'rgba(6, 182, 212, 0.65)' };
        } else if (totalMinutes >= 21 * 60 && totalMinutes < 22 * 60 + 30) {
          return { label: 'Global Accounts Sync', status: 'RESTRICTED', color: '#f59e0b', ringColor: 'rgba(245, 158, 11, 0.65)' };
        } else {
          return { label: 'Off-Hours', status: 'OFFLINE', color: '#64748b', ringColor: 'rgba(100, 116, 139, 0.4)' };
        }
      } else {
        if (totalMinutes >= 18 * 60 && totalMinutes < 22 * 60) {
          return { label: 'Weekend Consultations', status: 'AVAILABLE', color: '#06b6d4', ringColor: 'rgba(6, 182, 212, 0.65)' };
        } else {
          return { label: 'Weekend Off-Duty', status: 'OFFLINE', color: '#64748b', ringColor: 'rgba(100, 116, 139, 0.4)' };
        }
      }
    }

    // Time & Date Helpers
    function formatTimestamp(dateObj) {
      const d = dateObj ? new Date(dateObj) : new Date();
      return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }

    function formatDateGroup(dateObj) {
      const d = dateObj ? new Date(dateObj) : new Date();
      const now = new Date();

      const isToday = d.toDateString() === now.toDateString();
      if (isToday) return 'Today';

      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }

    function getFormattedCurrentTime() {
      const now = new Date();
      const day = now.toLocaleDateString('en-US', { weekday: 'long' });
      const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      return `${day}, ${time}`;
    }

    function escapeHtml(text) {
      if (!text) return '';
      return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Inject Stylesheet
    const styleId = 'nexa-widget-stylesheet';
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

      /* Isolated Namespace */
      .nexa-floating-root,
      .nexa-floating-root * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        -webkit-font-smoothing: antialiased;
      }

      /* Root container is static so fixed children are positioned relative to viewport */
      .nexa-floating-root {
        position: static !important;
        z-index: 9999999;
        pointer-events: none;
      }

      /* 1. FLOATING BADGE BUTTON */
      @keyframes nexa-badge-slide-in {
        0% {
          opacity: 0;
          transform: translateY(24px) scale(0.7);
        }
        70% {
          opacity: 1;
          transform: translateY(-4px) scale(1.05);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      .nexa-badge-btn {
        position: fixed !important;
        bottom: 24px !important;
        right: 24px !important;
        width: 60px !important;
        height: 60px !important;
        border-radius: 50% !important;
        background: #0f121d !important;
        border: 1px solid rgba(56, 189, 248, 0.35) !important;
        box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65), 0 0 24px rgba(14, 165, 233, 0.25) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        pointer-events: auto !important;
        opacity: 0;
        animation: nexa-badge-slide-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        animation-delay: 0.15s;
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
        z-index: 9999999 !important;
        touch-action: manipulation !important;
      }

      .nexa-badge-btn:hover {
        transform: translateY(-3px) scale(1.06);
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), 0 0 32px rgba(14, 165, 233, 0.45) !important;
      }

      .nexa-pulse-ring {
        position: absolute;
        top: -6px;
        left: -6px;
        width: 72px;
        height: 72px;
        border-radius: 50%;
        border: 1.5px solid rgba(6, 182, 212, 0.6);
        animation: nexa-pulse-animation 2.6s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
        pointer-events: none;
      }

      @keyframes nexa-pulse-animation {
        0% { transform: scale(0.92); opacity: 0.85; }
        70% { transform: scale(1.35); opacity: 0; }
        100% { transform: scale(1.35); opacity: 0; }
      }

      .nexa-badge-icon-box {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nexa-badge-status-dot {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2.5px solid #0f121d;
        background-color: #06b6d4;
        box-shadow: 0 0 10px currentColor;
      }

      /* PREVIEW TOOLTIP / TEASER PILL */
      .nexa-teaser-pill {
        position: fixed !important;
        bottom: 96px !important;
        right: 24px !important;
        max-width: 320px !important;
        background: rgba(15, 18, 29, 0.95) !important;
        backdrop-filter: blur(20px) !important;
        -webkit-backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(56, 189, 248, 0.35) !important;
        border-radius: 9999px !important;
        padding: 10px 16px !important;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.7) !important;
        display: flex !important;
        align-items: center !important;
        gap: 10px !important;
        cursor: pointer !important;
        pointer-events: auto !important;
        opacity: 0;
        transform: translateX(20px) scale(0.95);
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
        z-index: 9999998 !important;
      }

      .nexa-teaser-pill.visible {
        opacity: 1;
        transform: translateX(0) scale(1);
      }

      .nexa-teaser-text {
        font-size: 12.5px;
        font-weight: 500;
        color: #f1f5f9;
        line-height: 1.35;
      }

      .nexa-teaser-text strong {
        color: #38bdf8;
      }

      .nexa-teaser-close {
        background: transparent;
        border: none;
        color: #94a3b8;
        min-width: 28px;
        min-height: 28px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
        touch-action: manipulation;
      }

      .nexa-teaser-close:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.15);
      }

      /* 2. DESKTOP CHAT MODAL (Screens > 768px) */
      @media (min-width: 769px) {
        .nexa-modal,
        .nexa-chat-modal {
          position: fixed !important;
          bottom: 96px !important;
          right: 24px !important;
          left: auto !important;
          top: auto !important;
          width: 390px !important;
          max-width: calc(100vw - 32px) !important;
          height: 600px !important;
          max-height: calc(100vh - 120px) !important;
          background: #0d0f18 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 20px !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(14, 165, 233, 0.15) !important;
          display: flex !important;
          flex-direction: column !important;
          overflow: hidden !important;
          opacity: 0;
          transform: scale(0.9) translateY(16px);
          transform-origin: bottom right;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          z-index: 9999999 !important;
        }

        .nexa-modal.open,
        .nexa-chat-modal.open {
          opacity: 1 !important;
          transform: scale(1) translateY(0) !important;
          pointer-events: auto !important;
        }
      }

      /* 3. STRICT FULL-WIDTH & FULL-SCREEN MOBILE ARCHITECTURE (Screens <= 768px) */
      @media (max-width: 768px) {
        .nexa-badge-btn {
          bottom: 16px !important;
          right: 16px !important;
        }

        .nexa-teaser-pill {
          bottom: 86px !important;
          right: 16px !important;
          left: 16px !important;
          max-width: calc(100vw - 32px) !important;
        }

        .nexa-modal,
        .nexa-chat-modal {
          display: none !important;
          pointer-events: none !important;
        }

        .nexa-modal.open,
        .nexa-chat-modal.open {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100% !important;
          min-width: 100% !important;
          max-width: 100% !important;
          height: 100dvh !important;
          min-height: 100dvh !important;
          max-height: 100dvh !important;
          max-height: -webkit-fill-available !important;
          margin: 0 !important;
          padding: 0 !important;
          border-radius: 0 !important;
          border: none !important;
          box-shadow: none !important;
          z-index: 99999999 !important;
          display: flex !important;
          flex-direction: column !important;
          background: #090a0f !important;
          opacity: 1 !important;
          transform: none !important;
          pointer-events: auto !important;
          overflow: hidden !important;
        }

        .nexa-footer,
        .nexa-input-container {
          padding-bottom: max(12px, env(safe-area-inset-bottom, 12px)) !important;
        }
      }

      /* 4. HEADER CONTAINER: flex-shrink: 0; height: 60px; */
      .nexa-header {
        flex-shrink: 0 !important;
        height: 60px !important;
        min-height: 60px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 0 16px !important;
        background: #10121c !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        z-index: 100 !important;
        width: 100% !important;
      }

      .nexa-header-left {
        display: flex;
        align-items: center;
        gap: 11px;
      }

      .nexa-avatar-wrapper {
        position: relative;
        width: 36px;
        height: 36px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .nexa-avatar-dot {
        position: absolute;
        bottom: -2px;
        right: -2px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 2px solid #10121c;
        background: #06b6d4;
      }

      .nexa-header-titles {
        display: flex;
        flex-direction: column;
      }

      .nexa-title-row {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .nexa-title {
        font-size: 14.5px;
        font-weight: 700;
        color: #f8fafc;
        letter-spacing: 0.3px;
      }

      .nexa-verified-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 14px;
        height: 14px;
        background: #0ea5e9;
        border-radius: 50%;
        color: #ffffff;
        font-size: 8.5px;
        font-weight: 700;
      }

      .nexa-status-text {
        font-size: 11px;
        color: #94a3b8;
        font-weight: 500;
        margin-top: 1px;
      }

      .nexa-header-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .nexa-header-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #94a3b8;
        border-radius: 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        touch-action: manipulation;
        padding: 0;
      }

      .nexa-clear-btn {
        min-width: 44px !important;
        min-height: 44px !important;
        width: 44px !important;
        height: 44px !important;
      }

      .nexa-clear-btn:hover {
        background: rgba(255, 255, 255, 0.12);
        color: #f8fafc;
      }

      /* ACCESSIBLE CLOSE (X) BUTTON: MIN 44x44px */
      .nexa-close-btn,
      #nexa-close-modal {
        min-width: 44px !important;
        min-height: 44px !important;
        width: 44px !important;
        height: 44px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 10px;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #cbd5e1;
        transition: all 0.2s;
        touch-action: manipulation;
        padding: 0;
      }

      .nexa-close-btn:hover,
      #nexa-close-modal:hover {
        background: rgba(255, 255, 255, 0.18);
        color: #ffffff;
      }

      /* 5. MESSAGES STREAM CONTAINER: flex: 1 1 auto; overflow-y: auto; */
      .nexa-feed {
        flex: 1 1 auto !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch !important;
        padding: 16px !important;
        display: flex;
        flex-direction: column;
        gap: 12px;
        scroll-behavior: smooth;
        width: 100% !important;
      }

      .nexa-feed::-webkit-scrollbar {
        width: 5px;
      }

      .nexa-feed::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.16);
        border-radius: 5px;
      }

      .nexa-date-divider {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 8px 0;
        position: relative;
      }

      .nexa-date-divider::before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 1px;
        background: rgba(255, 255, 255, 0.08);
      }

      .nexa-date-divider span {
        position: relative;
        background: #111422;
        border: 1px solid rgba(255, 255, 255, 0.08);
        padding: 3px 12px;
        border-radius: 12px;
        font-size: 10.5px;
        font-weight: 600;
        color: #94a3b8;
      }

      .nexa-msg {
        display: flex;
        flex-direction: column;
        max-width: 88%;
        animation: nexa-msg-appear 0.22s ease-out;
      }

      @keyframes nexa-msg-appear {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .nexa-msg.assistant {
        align-self: flex-start;
      }

      .nexa-msg.user {
        align-self: flex-end;
      }

      .nexa-bubble {
        padding: 11px 15px;
        border-radius: 16px;
        font-size: 13.5px;
        line-height: 1.5;
        color: #f1f5f9;
        word-break: break-word;
      }

      .nexa-msg.assistant .nexa-bubble {
        background: #161928;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-top-left-radius: 4px;
      }

      .nexa-msg.user .nexa-bubble {
        background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
        border-top-right-radius: 4px;
        color: #ffffff;
      }

      .nexa-msg-timestamp {
        display: inline-block;
        font-size: 9.5px;
        color: #64748b;
        margin-top: 3px;
        padding: 0 4px;
      }

      .nexa-msg.user .nexa-msg-timestamp {
        align-self: flex-end;
      }

      .nexa-msg.assistant .nexa-msg-timestamp {
        align-self: flex-start;
      }

      /* Quick Action Chips */
      .nexa-quick-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 6px;
      }

      .nexa-chip-btn {
        background: rgba(56, 189, 248, 0.09);
        border: 1px solid rgba(56, 189, 248, 0.28);
        border-radius: 9999px;
        padding: 6px 12px;
        font-size: 11.5px;
        font-weight: 500;
        color: #38bdf8;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 4px;
        touch-action: manipulation;
        transition: all 0.2s;
      }

      .nexa-chip-btn:hover {
        background: rgba(56, 189, 248, 0.2);
        color: #ffffff;
      }

      /* Typing Indicator */
      .nexa-typing {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 10px 16px;
        background: #161928;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        border-top-left-radius: 4px;
        align-self: flex-start;
      }

      .nexa-typing-dot {
        width: 6.5px;
        height: 6.5px;
        background: #38bdf8;
        border-radius: 50%;
        animation: nexa-typing-bounce 1.3s infinite ease-in-out;
      }

      .nexa-typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .nexa-typing-dot:nth-child(3) { animation-delay: 0.4s; }

      @keyframes nexa-typing-bounce {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.35; }
        40% { transform: scale(1); opacity: 1; }
      }

      /* Dynamic Lead Form */
      .nexa-lead-form {
        margin-top: 10px;
        padding: 16px;
        background: #121524;
        border: 1px solid rgba(14, 165, 233, 0.3);
        border-radius: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
      }

      .nexa-form-header {
        font-size: 11px;
        font-weight: 700;
        color: #38bdf8;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        padding-bottom: 6px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .nexa-input-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .nexa-label {
        font-size: 11px;
        font-weight: 600;
        color: #94a3b8;
      }

      .nexa-field {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        padding: 9px 12px;
        font-size: 16px !important; /* Strict 16px to prevent iOS Safari auto-zoom */
        color: #f8fafc;
        outline: none;
        width: 100%;
        box-sizing: border-box;
      }

      .nexa-field:focus {
        border-color: #38bdf8;
      }

      .nexa-field-select {
        cursor: pointer;
      }

      .nexa-field-select option {
        background: #121524;
        color: #f8fafc;
      }

      .nexa-field-textarea {
        resize: vertical;
        min-height: 54px;
      }

      .nexa-submit-btn {
        background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
        border: none;
        color: #ffffff;
        font-size: 13px;
        font-weight: 700;
        min-height: 44px;
        padding: 10px 14px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 4px;
        touch-action: manipulation;
        width: 100%;
      }

      .nexa-submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .nexa-spinner {
        width: 14px;
        height: 14px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #ffffff;
        border-radius: 50%;
        animation: nexa-spin 0.8s linear infinite;
      }

      @keyframes nexa-spin {
        to { transform: rotate(360deg); }
      }

      .nexa-lead-success {
        margin-top: 8px;
        padding: 14px;
        background: rgba(16, 185, 129, 0.14);
        border: 1px solid rgba(16, 185, 129, 0.4);
        border-radius: 12px;
        font-size: 12.5px;
        color: #e2e8f0;
      }

      .nexa-lead-success-badge {
        font-weight: 700;
        color: #34d399;
        margin-bottom: 4px;
        font-size: 11.5px;
      }

      /* 6. INPUT BAR CONTAINER - PINNED STICKY TO BOTTOM */
      .nexa-footer,
      .nexa-input-container {
        flex-shrink: 0 !important;
        position: sticky !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        background: #12131c !important;
        padding: 12px 16px !important;
        border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
        z-index: 9999 !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 6px !important;
        box-sizing: border-box !important;
      }

      .nexa-input-row {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
      }

      /* Strict 16px font-size to prevent iOS Safari auto-zoom */
      .nexa-chat-input {
        flex: 1;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 20px;
        padding: 10px 16px;
        font-size: 16px !important;
        line-height: 1.35;
        color: #f8fafc;
        outline: none;
        box-sizing: border-box;
        touch-action: manipulation;
        -webkit-appearance: none;
        appearance: none;
      }

      .nexa-chat-input::placeholder {
        color: #64748b;
        font-size: 14px;
      }

      .nexa-chat-input:focus {
        border-color: #0ea5e9;
        background: rgba(255, 255, 255, 0.09);
      }

      .nexa-send-icon-btn {
        min-width: 44px !important;
        min-height: 44px !important;
        width: 44px !important;
        height: 44px !important;
        border-radius: 50%;
        background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
        border: none;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        flex-shrink: 0;
        touch-action: manipulation;
      }

      .nexa-send-icon-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .nexa-micro-branding {
        font-size: 9.5px;
        text-align: center;
        color: #64748b;
        letter-spacing: 0.4px;
      }
    `;

    // Host Container Element
    let host = document.getElementById('nexa-floating-root');
    if (!host) {
      host = document.createElement('div');
      host.id = 'nexa-floating-root';
      host.className = 'nexa-floating-root';
      document.body.appendChild(host);
    }

    const scheduleInfo = evaluateSchedule(new Date());

    host.innerHTML = `
      <!-- Floating Glassmorphic Preview Pill / Tooltip -->
      <div class="nexa-teaser-pill" id="nexa-teaser-pill" role="status" aria-live="polite">
        <div class="nexa-teaser-text">
          Have questions about Raiyan's availability? <strong>Consult NEXA AI</strong>
        </div>
        <button class="nexa-teaser-close" id="nexa-teaser-close" aria-label="Dismiss Teaser">&times;</button>
      </div>

      <!-- Floating Badge Button -->
      <div class="nexa-badge-btn" id="nexa-badge-trigger" role="button" aria-label="Open NEXA AI Executive Assistant">
        <div class="nexa-pulse-ring" id="nexa-pulse-ring" style="border-color: ${scheduleInfo.ringColor}"></div>
        <div class="nexa-badge-icon-box">
          ${NEXA_SVG_LOGO}
        </div>
        <div class="nexa-badge-status-dot" id="nexa-badge-dot" style="background-color: ${scheduleInfo.color}"></div>
      </div>

      <!-- Dedicated Chat Modal -->
      <div class="nexa-modal nexa-chat-modal" id="nexa-chat-modal" role="dialog" aria-modal="true" aria-label="NEXA Executive Assistant">
        <!-- Header Container: flex-shrink: 0; height: 60px; -->
        <div class="nexa-header">
          <div class="nexa-header-left">
            <div class="nexa-avatar-wrapper">
              ${NEXA_SVG_LOGO}
              <div class="nexa-avatar-dot" id="nexa-avatar-dot" style="background-color: ${scheduleInfo.color}"></div>
            </div>
            <div class="nexa-header-titles">
              <div class="nexa-title-row">
                <span class="nexa-title">NEXA</span>
                <span class="nexa-verified-badge" title="Verified C-Suite Executive Aide">&#10003;</span>
              </div>
              <div class="nexa-status-text" id="nexa-status-desc">${scheduleInfo.label} (${scheduleInfo.status})</div>
            </div>
          </div>
          <div class="nexa-header-actions">
            <button class="nexa-header-btn nexa-clear-btn" id="nexa-clear-chat" title="Clear conversation" aria-label="Clear Chat">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <button class="nexa-header-btn nexa-close-btn" id="nexa-close-modal" aria-label="Close Chat" title="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages Stream: flex: 1 1 auto; overflow-y: auto; -->
        <div class="nexa-feed" id="nexa-feed"></div>

        <!-- Input Bar Container: PINNED TO BOTTOM -->
        <div class="nexa-footer nexa-input-container" id="nexa-input-container">
          <div class="nexa-input-row">
            <input type="text" class="nexa-chat-input" id="nexa-chat-input" placeholder="Message Raiyan's executive office..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="send" />
            <button class="nexa-send-icon-btn" id="nexa-send-icon-btn" aria-label="Send Message">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <div class="nexa-micro-branding">Powered by NEXA • C-Suite Executive Aide</div>
        </div>
      </div>
    `;

    // DOM Element References
    const badgeTrigger = document.getElementById('nexa-badge-trigger');
    const chatModal = document.getElementById('nexa-chat-modal');
    const closeModal = document.getElementById('nexa-close-modal');
    const clearChatBtn = document.getElementById('nexa-clear-chat');
    const feed = document.getElementById('nexa-feed');
    const chatInput = document.getElementById('nexa-chat-input');
    const sendBtn = document.getElementById('nexa-send-icon-btn');
    const statusDesc = document.getElementById('nexa-status-desc');
    const badgeDot = document.getElementById('nexa-badge-dot');
    const avatarDot = document.getElementById('nexa-avatar-dot');
    const pulseRing = document.getElementById('nexa-pulse-ring');
    const teaserPill = document.getElementById('nexa-teaser-pill');
    const teaserCloseBtn = document.getElementById('nexa-teaser-close');

    function scrollToBottom() {
      if (feed) {
        feed.scrollTop = feed.scrollHeight;
      }
    }

    // REAL-TIME VIRTUAL VIEWPORT KEYBOARD FIX
    const handleResize = () => {
      const modal = document.getElementById('nexa-chat-modal');
      if (modal && window.innerWidth <= 768) {
        if (window.visualViewport) {
          const vh = window.visualViewport.height;
          const vt = window.visualViewport.offsetTop || 0;
          modal.style.setProperty('height', `${vh}px`, 'important');
          modal.style.setProperty('max-height', `${vh}px`, 'important');
          modal.style.setProperty('top', `${vt}px`, 'important');
          modal.style.setProperty('bottom', 'auto', 'important');
          modal.style.setProperty('left', '0px', 'important');
          modal.style.setProperty('right', '0px', 'important');
          modal.style.setProperty('width', '100%', 'important');
          modal.style.setProperty('min-width', '100%', 'important');
          modal.style.setProperty('max-width', '100%', 'important');
        } else {
          modal.style.setProperty('height', '100dvh', 'important');
          modal.style.setProperty('width', '100%', 'important');
          modal.style.setProperty('left', '0px', 'important');
          modal.style.setProperty('right', '0px', 'important');
        }
        window.scrollTo(0, 0);
        scrollToBottom();
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    }
    window.addEventListener('resize', handleResize);

    // Keep input visible when focused on soft keyboards
    chatInput.addEventListener('focus', () => {
      if (window.innerWidth <= 768) {
        setTimeout(handleResize, 50);
        setTimeout(handleResize, 150);
        setTimeout(handleResize, 300);
        setTimeout(handleResize, 500);
      }
    });

    chatInput.addEventListener('blur', () => {
      if (window.innerWidth <= 768) {
        setTimeout(handleResize, 100);
      }
    });

    // Teaser Tooltip Logic
    function showTeaser() {
      if (teaserDismissed || isOpen) return;
      if (teaserPill) {
        teaserPill.classList.add('visible');
        teaserDismissTimer = setTimeout(hideTeaser, 8000);
      }
    }

    function hideTeaser() {
      teaserDismissed = true;
      if (teaserTimer) clearTimeout(teaserTimer);
      if (teaserDismissTimer) clearTimeout(teaserDismissTimer);
      if (teaserPill) {
        teaserPill.classList.remove('visible');
        setTimeout(() => {
          if (teaserPill && !teaserPill.classList.contains('visible')) {
            teaserPill.style.display = 'none';
          }
        }, 350);
      }
    }

    teaserTimer = setTimeout(showTeaser, 2500);

    if (teaserCloseBtn) {
      teaserCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        hideTeaser();
      });
    }

    if (teaserPill) {
      teaserPill.addEventListener('click', () => {
        hideTeaser();
        toggleModal(true);
      });
    }

    // Modal Toggle & Background Scroll Locking
    function toggleModal(state) {
      const nextState = typeof state === 'boolean' ? state : !isOpen;
      if (nextState === isOpen) return;

      isOpen = nextState;
      if (isOpen) {
        previousBodyOverflow = document.body.style.overflow;
        previousHtmlOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        if (window.innerWidth <= 768) {
          document.documentElement.style.overflow = 'hidden';
        }

        hideTeaser();
        chatModal.classList.add('open');
        playExecutiveChime();

        if (window.innerWidth <= 768) {
          handleResize();
        }

        setTimeout(() => {
          chatInput.focus();
          scrollToBottom();
        }, 150);
      } else {
        document.body.style.overflow = previousBodyOverflow || '';
        document.documentElement.style.overflow = previousHtmlOverflow || '';
        chatModal.classList.remove('open');
        chatModal.style.removeProperty('height');
        chatModal.style.removeProperty('max-height');
        chatModal.style.removeProperty('top');
        chatModal.style.removeProperty('bottom');
        chatModal.style.removeProperty('left');
        chatModal.style.removeProperty('right');
        chatModal.style.removeProperty('width');
        chatModal.style.removeProperty('min-width');
        chatModal.style.removeProperty('max-width');
      }
    }

    if (badgeTrigger) badgeTrigger.addEventListener('click', () => toggleModal());
    if (closeModal) closeModal.addEventListener('click', () => toggleModal(false));

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        toggleModal(false);
      }
    });

    if (clearChatBtn) {
      clearChatBtn.addEventListener('click', () => {
        if (confirm('Clear current executive conversation history?')) {
          try {
            localStorage.removeItem(STORAGE_KEY);
          } catch (e) {}
          history = [];
          initHistory();
        }
      });
    }

    // Conversation History Management
    function initHistory() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          history = JSON.parse(stored);
        }
      } catch (e) {
        history = [];
      }

      if (!Array.isArray(history) || history.length === 0) {
        const welcome = {
          role: 'assistant',
          content: `Greetings. I am NEXA, executive aide to Raiyan Ahmed Rahat (Founder & CEO of NexusCraft and LearnEra, Product Architect, Cybersecurity Consultant). How may his office facilitate your agenda today?`,
          isoTime: new Date().toISOString(),
          showForm: false,
          showChips: true
        };
        history = [welcome];
        saveHistory();
      }

      renderFullFeed();
    }

    function saveHistory() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (e) {}
    }

    function renderFullFeed() {
      feed.innerHTML = '';
      let lastRenderedDate = '';

      history.forEach((msg, idx) => {
        const msgDate = formatDateGroup(msg.isoTime);

        if (msgDate !== lastRenderedDate) {
          lastRenderedDate = msgDate;
          const divider = document.createElement('div');
          divider.className = 'nexa-date-divider';
          divider.innerHTML = `<span>${escapeHtml(msgDate)}</span>`;
          feed.appendChild(divider);
        }

        renderMessage(msg, idx);
      });

      scrollToBottom();
    }

    function renderMessage(msg, index) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `nexa-msg ${msg.role}`;

      const bubble = document.createElement('div');
      bubble.className = 'nexa-bubble';
      bubble.innerHTML = escapeHtml(msg.content).replace(/\n/g, '<br/>');
      msgDiv.appendChild(bubble);

      if (msg.showChips && index === history.length - 1) {
        const chipsContainer = document.createElement('div');
        chipsContainer.className = 'nexa-quick-chips';
        const suggestions = [
          '📅 Raiyan\'s Availability',
          '🛡️ Cybersecurity Audit',
          '💻 Custom Web Development',
          '⚡ Schedule Consultation'
        ];
        suggestions.forEach(label => {
          const chip = document.createElement('button');
          chip.className = 'nexa-chip-btn';
          chip.textContent = label;
          chip.addEventListener('click', () => {
            chatInput.value = label.replace(/^[^\w\s]+\s*/, '');
            sendMessage();
          });
          chipsContainer.appendChild(chip);
        });
        msgDiv.appendChild(chipsContainer);
      }

      if (msg.showForm && !msg.formSubmitted) {
        const form = createLeadForm(msg);
        msgDiv.appendChild(form);
      } else if (msg.formSubmitted) {
        const success = createSuccessNotice(msg.confirmationText);
        msgDiv.appendChild(success);
      }

      const timeSpan = document.createElement('span');
      timeSpan.className = 'nexa-msg-timestamp';
      timeSpan.textContent = formatTimestamp(msg.isoTime);
      msgDiv.appendChild(timeSpan);

      feed.appendChild(msgDiv);
      scrollToBottom();
    }

    function showTyping() {
      removeTyping();
      const typing = document.createElement('div');
      typing.id = 'nexa-typing-box';
      typing.className = 'nexa-typing';
      typing.innerHTML = `
        <span class="nexa-typing-dot"></span>
        <span class="nexa-typing-dot"></span>
        <span class="nexa-typing-dot"></span>
      `;
      feed.appendChild(typing);
      scrollToBottom();
    }

    function removeTyping() {
      const el = document.getElementById('nexa-typing-box');
      if (el) el.remove();
    }

    async function sendMessage() {
      const text = (chatInput.value || '').trim();
      if (!text || isSending) return;

      isSending = true;
      chatInput.value = '';
      sendBtn.disabled = true;

      const now = new Date();
      const userMsg = {
        role: 'user',
        content: text,
        isoTime: now.toISOString()
      };
      history.push(userMsg);
      saveHistory();

      const msgDate = formatDateGroup(now);
      const existingDividers = feed.querySelectorAll('.nexa-date-divider');
      const lastDivider = existingDividers.length > 0 ? existingDividers[existingDividers.length - 1].textContent.trim() : '';
      if (msgDate !== lastDivider) {
        const divider = document.createElement('div');
        divider.className = 'nexa-date-divider';
        divider.innerHTML = `<span>${escapeHtml(msgDate)}</span>`;
        feed.appendChild(divider);
      }

      renderMessage(userMsg, history.length - 1);
      showTyping();

      const currentTime = getFormattedCurrentTime();
      const currentDate = now.toISOString().split('T')[0];

      const payload = {
        message: text,
        currentTime: currentTime,
        currentDate: currentDate,
        history: history.map(m => ({ role: m.role, content: m.content }))
      };

      try {
        const res = await fetch(`${apiBase}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        removeTyping();

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const assistantMsg = {
          role: 'assistant',
          content: data.reply || "Thank you. Raiyan's office will review your inquiry.",
          isoTime: new Date().toISOString(),
          showForm: Boolean(data.showForm)
        };

        history.push(assistantMsg);
        saveHistory();
        renderMessage(assistantMsg, history.length - 1);
        playExecutiveChime();

        if (data.schedule && statusDesc) {
          statusDesc.textContent = `${data.schedule.activity} (${data.schedule.status})`;
        }
      } catch (err) {
        removeTyping();
        const fallback = {
          role: 'assistant',
          content: "I apologize for the connectivity interruption. Raiyan's office is reachable directly at raiyanahmedrahat99@gmail.com or +8801623697899.",
          isoTime: new Date().toISOString(),
          showForm: false
        };
        history.push(fallback);
        saveHistory();
        renderMessage(fallback, history.length - 1);
        playExecutiveChime();
      } finally {
        isSending = false;
        sendBtn.disabled = false;
        chatInput.focus();
      }
    }

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // In-Chat Lead Briefing Form
    function createLeadForm(msgRef) {
      const form = document.createElement('form');
      form.className = 'nexa-lead-form';

      form.innerHTML = `
        <div class="nexa-form-header">
          Priority Executive Briefing
        </div>

        <div class="nexa-input-group">
          <label class="nexa-label">Full Name *</label>
          <input type="text" class="nexa-field" name="fullName" placeholder="Your Full Name" required />
        </div>

        <div class="nexa-input-group">
          <label class="nexa-label">Phone / WhatsApp Number *</label>
          <input type="tel" class="nexa-field" name="phone" placeholder="+880... or International" required />
        </div>

        <div class="nexa-input-group">
          <label class="nexa-label">Service Needed *</label>
          <select class="nexa-field nexa-field-select" name="service" required>
            <option value="Custom Web Development">Custom Web Development</option>
            <option value="Cybersecurity Audit">Cybersecurity Audit</option>
            <option value="Penetration Testing">Penetration Testing</option>
            <option value="Strategic Consultation">Strategic Consultation</option>
          </select>
        </div>

        <div class="nexa-input-group">
          <label class="nexa-label">Message / Project Scope</label>
          <textarea class="nexa-field nexa-field-textarea" name="message" placeholder="Brief outline of objectives..."></textarea>
        </div>

        <button type="submit" class="nexa-submit-btn">
          <span>Dispatch Briefing to Raiyan</span>
        </button>
      `;

      form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('focus', () => {
          if (window.innerWidth <= 768) {
            setTimeout(handleResize, 150);
          }
        });
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('.nexa-submit-btn');
        const fullName = (form.elements['fullName'].value || '').trim();
        const phone = (form.elements['phone'].value || '').trim();
        const service = form.elements['service'].value;
        const message = (form.elements['message'].value || '').trim();

        if (!fullName || !phone) return;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="nexa-spinner"></span>
          <span>Transmitting to Raiyan's Office...</span>
        `;

        try {
          const response = await fetch(`${apiBase}/api/submit-lead`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ fullName, phone, service, message })
          });

          const data = await response.json();
          const confirmText = data.confirmation || "Thank you. Your message has been received by Raiyan's executive office. He will connect with you during operational hours.";

          msgRef.formSubmitted = true;
          msgRef.confirmationText = confirmText;
          saveHistory();

          const successNotice = createSuccessNotice(confirmText);
          form.replaceWith(successNotice);
          scrollToBottom();
          playExecutiveChime();

        } catch (err) {
          const fallbackNotice = "Thank you. Your briefing has been logged. Raiyan's office will reach out to you shortly.";
          msgRef.formSubmitted = true;
          msgRef.confirmationText = fallbackNotice;
          saveHistory();

          const successNotice = createSuccessNotice(fallbackNotice);
          form.replaceWith(successNotice);
          scrollToBottom();
          playExecutiveChime();
        }
      });

      return form;
    }

    function createSuccessNotice(text) {
      const div = document.createElement('div');
      div.className = 'nexa-lead-success';
      div.innerHTML = `
        <div class="nexa-lead-success-badge">
          Executive Transmission Logged
        </div>
        <div>${escapeHtml(text)}</div>
      `;
      return div;
    }

    // Schedule Refresh
    setInterval(() => {
      const current = evaluateSchedule(new Date());
      if (statusDesc) statusDesc.textContent = `${current.label} (${current.status})`;
      if (badgeDot) badgeDot.style.backgroundColor = current.color;
      if (avatarDot) avatarDot.style.backgroundColor = current.color;
      if (pulseRing) pulseRing.style.borderColor = current.ringColor;
    }, 60000);

    initHistory();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
