import { Customer, customers as initialCustomers, Report, reports as initialReports } from "./data";

export function getStoredCustomers(): Customer[] {
  if (typeof window === "undefined") return initialCustomers;
  const stored = localStorage.getItem("tf_customers");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialCustomers;
    }
  }
  localStorage.setItem("tf_customers", JSON.stringify(initialCustomers));
  return initialCustomers;
}

export function saveStoredCustomers(list: Customer[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("tf_customers", JSON.stringify(list));
  }
}

export function getStoredReports(): Report[] {
  if (typeof window === "undefined") return initialReports;
  const stored = localStorage.getItem("tf_reports");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return initialReports;
    }
  }
  localStorage.setItem("tf_reports", JSON.stringify(initialReports));
  return initialReports;
}

export function saveStoredReports(list: Report[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("tf_reports", JSON.stringify(list));
  }
}

export function getStoredSettings() {
  const defaultSettings = {
    email: "m.sterling@trustfleet.ai",
    phone: "+1 (555) 902-1244",
    lang: "Bahasa Inggris (Amerika Serikat)",
    twoFA: true,
    themeMode: "light",
    team: [
      { name: "Marcus Sterling", role: "Petugas Risiko", initials: "MS", email: "m.sterling@trustfleet.ai" },
      { name: "Emily Watson", role: "Underwriter", initials: "EW", email: "e.watson@trustfleet.ai" },
      { name: "David Chen", role: "Analis Risiko", initials: "DC", email: "d.chen@trustfleet.ai" }
    ],
    notifs: {
      email: true,
      inapp: true,
      weekly: false
    },
    apiKeys: ["tf_live_8F3K9x1A7d2Y"]
  };
  if (typeof window === "undefined") return defaultSettings;
  const stored = localStorage.getItem("tf_settings");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultSettings;
    }
  }
  localStorage.setItem("tf_settings", JSON.stringify(defaultSettings));
  return defaultSettings;
}

export function saveStoredSettings(settings: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem("tf_settings", JSON.stringify(settings));
  }
}

export function downloadMockPdf(filename: string, content: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
