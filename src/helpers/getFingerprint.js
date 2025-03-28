export default function getFingerprint() {
    const fingerprint = {
        userAgent: navigator.userAgent, // browser + OS info
        language: navigator.language,   // browser language
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // user's timezone
        device: {
          memory: navigator.deviceMemory || "unknown", // RAM
          cpuCores: navigator.hardwareConcurrency || "unknown", // CPU cores
        }
      };
    return fingerprint
}