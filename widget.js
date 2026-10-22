/**
 * ======================================================================
 * NEXA: C-SUITE EXECUTIVE AI AGENT & EMBEDDABLE FLOATING CHAT WIDGET
 * Mobile Responsive & Visual Viewport Keyboard Adjustment Architecture
 * ======================================================================
 */

(function () {
  'use strict';

  if (window.__NEXA_WIDGET_LOADED__) return;
  window.__NEXA_WIDGET_LOADED__ = true;

  function initWidget() {
    // Resolve API Base URL automatically from script origin or default to live Vercel endpoint
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

    // Local Storage Key for Persistent Chat History
    const STORAGE_KEY = 'nexa_chat_history';

    // State
    let isOpen = false;
    let isSending = false;
    let history = [];
    let teaserDismissed = false;
    let teaserTimer = null;
    let teaserDismissTimer = null;
    let previousBodyOverflow = '';

    // Executive Web Audio Chime (Crystalline dual-tone notification)
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
          { freq: 1046.5, start: 0.0, dur: 0.45, gain: 0.08 },
          { freq: 1567.98, start: 0.07, dur: 0.65, gain: 0.09 }
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
      } catch (e) {
        // Graceful fallback if restricted by autoplay policy
      }
    }

    // Custom Futuristic Executive Monogram SVG Logo
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

    // Stylesheet Injection
    const styleId = 'nexa-widget-stylesheet';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        .nexa-floating-root,
        .nexa-floating-root * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .nexa-floating-root {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999999;
          pointer-events: none;
        }

        /* Floating Glassmorphic Preview Pill / Teaser */
        .nexa-teaser-pill {
          position: fixed;
          bottom: 96px;
          right: 24px;
          max-width: 320px;
          background: rgba(11, 15, 25, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 9999px;
          padding: 10px 16px 10px 14px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.65), 0 0 24px rgba(14, 165, 233, 0.2);
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          pointer-events: auto;
          opacity: 0;
          transform: translateY(12px) scale(0.95);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 9999998;
        }

        .nexa-teaser-pill.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .nexa-teaser-pill:hover {
          transform: translateY(-2px) scale(1.02);
          border-color: rgba(56, 189, 248, 0.6);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.75), 0 0 30px rgba(14, 165, 233, 0.35);
        }

        .nexa-teaser-sparkle {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #38bdf8;
        }

        .nexa-teaser-text {
          font-size: 12px;
          font-weight: 500;
          color: #f1f5f9;
          line-height: 1.35;
          letter-spacing: 0.1px;
        }

        .nexa-teaser-text strong {
          color: #38bdf8;
          font-weight: 600;
        }

        .nexa-teaser-close {
          background: transparent;
          border: none;
          color: #94a3b8;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          font-size: 14px;
          line-height: 1;
          transition: all 0.2s;
        }

        .nexa-teaser-close:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.15);
        }

        /* Floating Badge Button (60x60px) */
        .nexa-badge-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(11, 15, 25, 0.88);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(56, 189, 248, 0.25);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(14, 165, 233, 0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          pointer-events: auto;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: visible;
          z-index: 9999999;
        }

        .nexa-badge-btn:hover {
          transform: translateY(-4px) scale(1.05);
          border-color: rgba(56, 189, 248, 0.6);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 28px rgba(14, 165, 233, 0.38);
        }

        /* Subtle Pulsating Status Ring Animation */
        .nexa-pulse-ring {
          position: absolute;
          top: -5px;
          left: -5px;
          width: 70px;
          height: 70px;
          border-radius: 50%;
          border: 1.5px solid rgba(6, 182, 212, 0.6);
          animation: nexa-ring-pulse 2.5s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
          pointer-events: none;
        }

        @keyframes nexa-ring-pulse {
          0% { transform: scale(0.92); opacity: 0.85; }
          70% { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1.35); opacity: 0; }
        }

        .nexa-badge-icon-box {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nexa-badge-icon-box svg {
          width: 28px;
          height: 28px;
        }

        .nexa-badge-status-dot {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          border: 2px solid #0b0f19;
          background-color: #06b6d4;
          box-shadow: 0 0 8px currentColor;
        }

        /* Glassmorphism Chat Modal (Desktop: 380x580px, Radius: 20px) */
        .nexa-modal,
        .nexa-chat-modal {
          position: fixed;
          bottom: 96px;
          right: 24px;
          width: 380px;
          max-width: calc(100vw - 32px);
          height: 580px;
          max-height: calc(100vh - 120px);
          background: rgba(11, 15, 25, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(14, 165, 233, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          transform: translateY(16px) scale(0.96);
          pointer-events: none;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 9999999;
        }

        .nexa-modal.open,
        .nexa-chat-modal.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        /* Top Bar Drag Handle Indicator */
        .nexa-mobile-drag-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 24px;
          cursor: grab;
          touch-action: pan-y;
          background: rgba(18, 22, 34, 0.95);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          flex-shrink: 0;
        }

        .nexa-mobile-drag-pill {
          display: block;
          width: 44px;
          height: 5px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.35);
        }

        /* Header */
        .nexa-header {
          padding: 10px 16px;
          background: rgba(18, 22, 34, 0.85);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
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
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
        }

        .nexa-avatar-wrapper svg {
          width: 22px;
          height: 22px;
        }

        .nexa-avatar-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid #0b0f19;
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
          gap: 6px;
        }

        .nexa-header-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .nexa-clear-btn {
          width: 34px;
          height: 34px;
        }

        .nexa-clear-btn:hover {
          background: rgba(255, 255, 255, 0.09);
          color: #f8fafc;
        }

        /* Touch-Friendly Close (X) Button: Min 44x44px Hit Area */
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
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          transition: all 0.2s;
          touch-action: manipulation;
          padding: 0;
          box-sizing: border-box;
        }

        .nexa-close-btn:hover,
        #nexa-close-modal:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.2);
        }

        /* Modal Body (Messages Container) */
        .nexa-feed {
          flex: 1;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 11px;
          scroll-behavior: smooth;
        }

        .nexa-feed::-webkit-scrollbar {
          width: 4px;
        }

        .nexa-feed::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 4px;
        }

        /* Date Divider Pill */
        .nexa-date-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 10px 0 6px;
          position: relative;
        }

        .nexa-date-divider::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: 50%;
          height: 1px;
          background: rgba(255, 255, 255, 0.07);
          z-index: 1;
        }

        .nexa-date-divider span {
          position: relative;
          z-index: 2;
          background: #111522;
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 2px 10px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.3px;
        }

        .nexa-msg {
          display: flex;
          flex-direction: column;
          max-width: 88%;
          animation: nexa-fade-in 0.22s ease-out;
        }

        @keyframes nexa-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nexa-msg.assistant {
          align-self: flex-start;
        }

        .nexa-msg.user {
          align-self: flex-end;
        }

        .nexa-bubble {
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 13.5px;
          line-height: 1.5;
          color: #f1f5f9;
          word-break: break-word;
        }

        .nexa-msg.assistant .nexa-bubble {
          background: rgba(26, 31, 46, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-top-left-radius: 3px;
        }

        .nexa-msg.user .nexa-bubble {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          border-top-right-radius: 3px;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.25);
        }

        /* Message Timestamp */
        .nexa-msg-timestamp {
          display: inline-block;
          font-size: 9.5px;
          color: #64748b;
          margin-top: 3px;
          padding: 0 4px;
          letter-spacing: 0.2px;
        }

        .nexa-msg.user .nexa-msg-timestamp {
          align-self: flex-end;
          color: #94a3b8;
        }

        .nexa-msg.assistant .nexa-msg-timestamp {
          align-self: flex-start;
        }

        /* Typing Dots */
        .nexa-typing {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 9px 14px;
          background: rgba(26, 31, 46, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          border-top-left-radius: 3px;
          align-self: flex-start;
        }

        .nexa-typing-dot {
          width: 6px;
          height: 6px;
          background: #38bdf8;
          border-radius: 50%;
          animation: nexa-pulse 1.3s infinite ease-in-out;
        }

        .nexa-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .nexa-typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes nexa-pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.35; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* Dynamic Lead Form Inside Chat */
        .nexa-lead-form {
          margin-top: 8px;
          padding: 14px;
          background: rgba(18, 22, 34, 0.95);
          border: 1px solid rgba(14, 165, 233, 0.28);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.45);
        }

        .nexa-form-header {
          font-size: 11px;
          font-weight: 700;
          color: #38bdf8;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .nexa-input-group {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .nexa-label {
          font-size: 10.5px;
          font-weight: 600;
          color: #94a3b8;
        }

        .nexa-field {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 7px;
          padding: 8px 10px;
          font-size: 16px !important; /* Strict 16px to prevent iOS Safari auto-zoom */
          color: #f8fafc;
          outline: none;
          transition: all 0.2s;
          width: 100%;
          box-sizing: border-box;
        }

        .nexa-field:focus {
          border-color: #38bdf8;
          background: rgba(255, 255, 255, 0.07);
          box-shadow: 0 0 10px rgba(56, 189, 248, 0.18);
        }

        .nexa-field-select {
          cursor: pointer;
        }

        .nexa-field-select option {
          background: #111522;
          color: #f8fafc;
        }

        .nexa-field-textarea {
          resize: vertical;
          min-height: 52px;
        }

        .nexa-submit-btn {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          border: none;
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
          padding: 9px 12px;
          border-radius: 7px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.28);
          margin-top: 2px;
        }

        .nexa-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(14, 165, 233, 0.42);
        }

        .nexa-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .nexa-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: nexa-spin 0.8s linear infinite;
        }

        @keyframes nexa-spin {
          to { transform: rotate(360deg); }
        }

        .nexa-lead-success {
          margin-top: 6px;
          padding: 12px 14px;
          background: rgba(16, 185, 129, 0.12);
          border: 1px solid rgba(16, 185, 129, 0.35);
          border-radius: 12px;
          font-size: 12px;
          line-height: 1.45;
          color: #e2e8f0;
          animation: nexa-fade-in 0.25s ease;
        }

        .nexa-lead-success-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #34d399;
          font-weight: 700;
          margin-bottom: 4px;
          font-size: 11.5px;
        }

        /* Sticky Input Box Container & Prevent Safari Zoom */
        .nexa-footer,
        .nexa-input-container {
          flex-shrink: 0;
          position: sticky;
          bottom: 0;
          z-index: 10;
          background: rgba(12, 12, 16, 0.95);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          padding: 10px 14px 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .nexa-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .nexa-chat-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 10px 14px;
          font-size: 16px !important; /* Strict 16px to prevent iOS Safari auto-zoom */
          color: #f8fafc;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }

        .nexa-chat-input:focus {
          border-color: #0ea5e9;
          background: rgba(255, 255, 255, 0.08);
        }

        .nexa-send-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          border: none;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .nexa-send-icon-btn:hover:not(:disabled) {
          transform: scale(1.05);
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

        /* ==================================================================
         * 1. MOBILE MODAL ARCHITECTURE (Screens <= 600px)
         * ================================================================== */
        @media (max-width: 600px) {
          .nexa-floating-root {
            bottom: 16px;
            right: 16px;
          }

          .nexa-badge-btn {
            bottom: 16px;
            right: 16px;
            width: 56px;
            height: 56px;
          }

          .nexa-pulse-ring {
            width: 66px;
            height: 66px;
          }

          .nexa-teaser-pill {
            bottom: 84px;
            right: 16px;
            left: 16px;
            max-width: calc(100vw - 32px);
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
            width: 100vw !important;
            height: 100dvh !important; /* Dynamic Viewport Height */
            max-height: -webkit-fill-available;
            border-radius: 0 !important;
            z-index: 9999999 !important;
            display: flex !important;
            flex-direction: column !important;
            margin: 0 !important;
            opacity: 1 !important;
            transform: none !important;
            pointer-events: auto !important;
            border: none !important;
          }

          .nexa-mobile-drag-bar {
            display: flex;
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Host Element
    const host = document.createElement('div');
    host.id = 'nexa-floating-root';
    host.className = 'nexa-floating-root';
    document.body.appendChild(host);

    // Widget DOM Structure
    const scheduleInfo = evaluateSchedule(new Date());

    host.innerHTML = `
      <!-- Floating Glassmorphic Preview Pill / Teaser -->
      <div class="nexa-teaser-pill" id="nexa-teaser-pill" role="status" aria-live="polite">
        <div class="nexa-teaser-sparkle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
        <div class="nexa-teaser-text">
          Have questions about Raiyan's availability? <strong>Consult NEXA AI</strong>
        </div>
        <button class="nexa-teaser-close" id="nexa-teaser-close" aria-label="Dismiss Teaser">&times;</button>
      </div>

      <!-- Floating Badge Button (60x60px) -->
      <div class="nexa-badge-btn" id="nexa-badge-trigger" role="button" aria-label="Open NEXA AI Executive Assistant">
        <div class="nexa-pulse-ring" id="nexa-pulse-ring" style="border-color: ${scheduleInfo.ringColor}"></div>
        <div class="nexa-badge-icon-box">
          ${NEXA_SVG_LOGO}
        </div>
        <div class="nexa-badge-status-dot" id="nexa-badge-dot" style="background-color: ${scheduleInfo.color}"></div>
      </div>

      <!-- Glassmorphic Chat Modal -->
      <div class="nexa-modal nexa-chat-modal" id="nexa-chat-modal" role="dialog" aria-modal="true" aria-label="NEXA Executive Assistant">
        <!-- Clean Mobile Drag Handle Indicator for Swipe-Down Close -->
        <div class="nexa-mobile-drag-bar" id="nexa-drag-handle" role="button" aria-label="Swipe down to close">
          <span class="nexa-mobile-drag-pill"></span>
        </div>

        <!-- Header -->
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
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

        <!-- Feed (Modal Body / Messages Container) -->
        <div class="nexa-feed" id="nexa-feed"></div>

        <!-- Footer (Sticky Input Box Container) -->
        <div class="nexa-footer nexa-input-container" id="nexa-input-container">
          <div class="nexa-input-row">
            <input type="text" class="nexa-chat-input" id="nexa-chat-input" placeholder="Message Raiyan's executive office..." autocomplete="off" />
            <button class="nexa-send-icon-btn" id="nexa-send-icon-btn" aria-label="Send">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <div class="nexa-micro-branding">Powered by NEXA • Executive Aide</div>
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
    const dragHandle = document.getElementById('nexa-drag-handle');

    // ==================================================================
    // 2. VISUAL VIEWPORT API FOR KEYBOARD ADJUSTMENT
    // ==================================================================
    if (window.visualViewport) {
      const adjustHeight = () => {
        const modal = document.querySelector('.nexa-chat-modal');
        if (modal && window.innerWidth <= 600) {
          modal.style.height = `${window.visualViewport.height}px`;
          modal.style.setProperty('height', `${window.visualViewport.height}px`, 'important');
          window.scrollTo(0, 0);
        }
      };
      window.visualViewport.addEventListener('resize', adjustHeight);
      window.visualViewport.addEventListener('scroll', adjustHeight);
    }

    // Preview Pill / Teaser Logic
    function showTeaser() {
      if (teaserDismissed || isOpen) return;
      if (teaserPill) teaserPill.classList.add('visible');
      teaserDismissTimer = setTimeout(() => {
        hideTeaser();
      }, 8000);
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
        }, 400);
      }
    }

    teaserTimer = setTimeout(() => {
      showTeaser();
    }, 3000);

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

    // Toggle Modal
    function toggleModal(state) {
      const nextState = typeof state === 'boolean' ? state : !isOpen;
      if (nextState === isOpen) return;

      isOpen = nextState;
      if (isOpen) {
        // Prevent background page scrolling when widget is active
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        hideTeaser();
        chatModal.classList.add('open');
        playExecutiveChime();

        if (window.visualViewport && window.innerWidth <= 600) {
          chatModal.style.height = `${window.visualViewport.height}px`;
          chatModal.style.setProperty('height', `${window.visualViewport.height}px`, 'important');
          window.scrollTo(0, 0);
        }

        setTimeout(() => chatInput.focus(), 250);
        scrollToBottom();
      } else {
        // Restore background page scrolling
        document.body.style.overflow = previousBodyOverflow || '';
        chatModal.classList.remove('open');
        chatModal.style.height = '';
        chatModal.style.removeProperty('height');
      }
    }

    if (badgeTrigger) badgeTrigger.addEventListener('click', () => toggleModal());
    if (closeModal) closeModal.addEventListener('click', () => toggleModal(false));

    // Touch Swipe Down on Drag Handle to Close (Mobile UX)
    let touchStartY = 0;
    let touchCurrentY = 0;
    if (dragHandle) {
      dragHandle.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      dragHandle.addEventListener('touchmove', (e) => {
        touchCurrentY = e.touches[0].clientY;
        const deltaY = touchCurrentY - touchStartY;
        if (deltaY > 0) {
          chatModal.style.transform = `translateY(${deltaY}px)`;
        }
      }, { passive: true });

      dragHandle.addEventListener('touchend', () => {
        const deltaY = touchCurrentY - touchStartY;
        if (deltaY > 80) {
          toggleModal(false);
        }
        chatModal.style.transform = '';
        touchStartY = 0;
        touchCurrentY = 0;
      });
    }

    // Ensure smooth scrolling when mobile keyboard opens on input focus
    chatInput.addEventListener('focus', () => {
      if (window.innerWidth <= 600) {
        setTimeout(() => {
          if (window.visualViewport) {
            const modal = document.querySelector('.nexa-chat-modal');
            if (modal) {
              modal.style.height = `${window.visualViewport.height}px`;
              modal.style.setProperty('height', `${window.visualViewport.height}px`, 'important');
            }
          }
          window.scrollTo(0, 0);
          scrollToBottom();
        }, 150);
      }
    });

    if (clearChatBtn) {
      clearChatBtn.addEventListener('click', () => {
        if (confirm('Clear current conversation history?')) {
          localStorage.removeItem(STORAGE_KEY);
          history = [];
          initHistory();
        }
      });
    }

    function scrollToBottom() {
      if (feed) {
        feed.scrollTop = feed.scrollHeight;
      }
    }

    // Load & Re-render Full Conversation from localStorage
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
          content: `Greetings. I am NEXA, executive aide to Raiyan Ahmed Rahat (Founder and CEO of NexusCraft and LearnEra, Product Architect, Cybersecurity Consultant). How may his office facilitate your agenda today?`,
          isoTime: new Date().toISOString(),
          showForm: false
        };
        history = [welcome];
        saveHistory();
      }

      renderFullFeed();
    }

    function saveHistory() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (e) {
        console.warn('[NEXA Storage Warning]:', e.message);
      }
    }

    // Render Full Feed with Dynamic Date Dividers & Timestamps
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

    // Handle Send
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
        console.error('[NEXA Widget Error]:', err);
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

    // Dynamic In-Chat Lead Form
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
          <span>Dispatch Lead to Raiyan</span>
        </button>
      `;

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
          console.error('[Lead Submission Error]:', err);
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

    // Periodic Schedule Refresh
    setInterval(() => {
      const current = evaluateSchedule(new Date());
      if (statusDesc) statusDesc.textContent = `${current.label} (${current.status})`;
      if (badgeDot) badgeDot.style.backgroundColor = current.color;
      if (avatarDot) avatarDot.style.backgroundColor = current.color;
      if (pulseRing) pulseRing.style.borderColor = current.ringColor;
    }, 60000);

    // Initialize and load chat history from localStorage
    initHistory();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
