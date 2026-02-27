/**
 * kayedni Tracking Logger
 * Branded console logging for tracking system
 * Never throws - only logs to console for debugging
 */

const KAYEDNI_BANNER = `
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║          📍 Kayedni Tracking System              ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
`;

const COMPACT_BANNER = "🔷 Kayedni Tracking";

interface LogEntry {
  level: "info" | "warn" | "error";
  message: string;
  data?: any;
  timestamp: string;
}

class TrackingLogger {
  private initialized = false;
  private logHistory: LogEntry[] = [];
  private bannerShown = false;

  /**
   * Initialize logger - show banner once on first call
   */
  init() {
    if (!this.initialized && typeof window !== "undefined") {
      this.initialized = true;
      this.bannerShown = true;
      console.log("%c" + KAYEDNI_BANNER, "color: #10b981; font-weight: bold");
      console.log(
        "%c✓ Tracking System Ready",
        "color: #10b981; font-weight: bold; font-size: 12px"
      );
    }
  }

  /**
   * Info level logging
   */
  info(message: string, data?: any) {
    if (typeof window === "undefined") return;

    const entry: LogEntry = {
      level: "info",
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    this.logHistory.push(entry);

    console.log(
      `%c${COMPACT_BANNER} [INFO]%c ${message}`,
      "color: #3b82f6; font-weight: bold; font-size: 11px",
      "color: #64748b; font-size: 11px"
    );

    if (data !== undefined) {
      console.log("%cData:", "color: #94a3b8; font-size: 10px", data);
    }
  }

  /**
   * Warning level logging - for non-critical issues
   */
  warn(message: string, data?: any) {
    if (typeof window === "undefined") return;

    const entry: LogEntry = {
      level: "warn",
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    this.logHistory.push(entry);

    console.warn(
      `%c${COMPACT_BANNER} [WARN]%c ${message}`,
      "color: #f59e0b; font-weight: bold; font-size: 11px",
      "color: #d97706; font-size: 11px"
    );

    if (data !== undefined) {
      console.log("%cDetails:", "color: #d97706; font-size: 10px", data);
    }
  }

  /**
   * Error level logging - for tracking failures
   * IMPORTANT: This never throws - it only logs
   */
  error(message: string, data?: any, recoveryTip?: string) {
    if (typeof window === "undefined") return;

    const entry: LogEntry = {
      level: "error",
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    this.logHistory.push(entry);

    console.error(
      `%c${COMPACT_BANNER} [ERROR]%c ${message}`,
      "color: #ef4444; font-weight: bold; font-size: 11px",
      "color: #dc2626; font-size: 11px"
    );

    if (data !== undefined) {
      console.error(
        "%cError Details:",
        "color: #dc2626; font-size: 10px; font-weight: bold",
        data
      );
    }

    if (recoveryTip) {
      console.log(
        "%c💡 Recovery Tip: " + recoveryTip,
        "color: #8b5cf6; font-style: italic; font-size: 10px"
      );
    }
  }

  /**
   * Get log history for debugging
   */
  getHistory(level?: "info" | "warn" | "error") {
    if (level) {
      return this.logHistory.filter((entry) => entry.level === level);
    }
    return this.logHistory;
  }

  /**
   * Clear log history
   */
  clearHistory() {
    this.logHistory = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs() {
    return JSON.stringify(this.logHistory, null, 2);
  }
}

// Export singleton instance
export const trackingLogger = new TrackingLogger();

export default trackingLogger;
