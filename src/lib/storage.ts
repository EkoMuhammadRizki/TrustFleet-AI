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

export async function downloadMockPdf(filename: string, content: string) {
  if (typeof window === "undefined") return;

  try {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ format: "a4", unit: "mm" });

    // Parse lines
    const lines = content.split("\n");
    let title = "TRUSTFLEET AI REPORT";
    let subtitle = "";
    const metadata: { key: string; value: string }[] = [];
    let i = 0;

    // Skip initial empty lines
    while (i < lines.length && lines[i].trim() === "") {
      i++;
    }

    if (i < lines.length && lines[i].startsWith("===")) {
      i++; // skip first ===
      if (i < lines.length) {
        title = lines[i].trim();
        i++;
      }
      while (i < lines.length && !lines[i].startsWith("===")) {
        const line = lines[i].trim();
        if (line.includes("  :") || line.includes(" : ") || (line.includes(":") && !line.includes("://") && !line.includes("Rp"))) {
          const colonIdx = line.indexOf(":");
          const k = line.substring(0, colonIdx).trim();
          const v = line.substring(colonIdx + 1).trim();
          metadata.push({ key: k, value: v });
        } else if (line !== "") {
          subtitle = line;
        }
        i++;
      }
      if (i < lines.length && lines[i].startsWith("===")) {
        i++; // skip closing ===
      }
    }

    let brandName = "TRUSTFLEET AI";
    let reportTitle = title;
    if (title.includes(" - ")) {
      const parts = title.split(" - ");
      brandName = parts[0].trim();
      reportTitle = parts[1].trim();
    }

    // Set up Header Bar
    doc.setFillColor(11, 28, 48); // #0b1c30
    doc.rect(0, 0, 210, 40, "F");

    // Accent line
    doc.setFillColor(0, 58, 218); // #003ada
    doc.rect(0, 38, 210, 2, "F");

    // Brand Name
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(brandName.toUpperCase(), 20, 16);

    // Report Title
    doc.setFontSize(15);
    doc.text(reportTitle, 20, 26);

    // Subtitle
    if (subtitle) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(181, 192, 255); // light-blue
      doc.text(subtitle, 20, 33);
    }

    let y = 50;

    // Draw Metadata Card
    if (metadata.length > 0) {
      doc.setFillColor(248, 249, 255); // #f8f9ff
      doc.setDrawColor(196, 197, 216);
      doc.rect(20, y, 170, 6 + metadata.length * 6, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(11, 28, 48);

      metadata.forEach((item, index) => {
        const itemY = y + 5 + index * 6;
        doc.setFont("helvetica", "bold");
        doc.text(item.key, 25, itemY);
        doc.setFont("helvetica", "normal");
        doc.text(":  " + item.value, 65, itemY);
      });

      y += 12 + metadata.length * 6;
    }

    const isHeader = (line: string) => {
      const clean = line.trim();
      if (clean.endsWith(":")) return true;
      if (clean === "Statistik Utama") return true;
      if (clean === "Tindakan Rekomendasi") return true;
      if (clean === "Tanda Tangan Elektronik") return true;
      return false;
    };

    const drawText = (doc: any, text: string, x: number, startY: number, maxWidth: number, lineHeight: number = 5.5): number => {
      const splitText = doc.splitTextToSize(text, maxWidth);
      splitText.forEach((line: string) => {
        if (startY > 270) {
          doc.addPage();
          startY = 20;
        }
        doc.text(line, x, startY);
        startY += lineHeight;
      });
      return startY;
    };

    // Parse elements
    interface ParsedElement {
      type: "heading" | "bullet" | "key-value" | "paragraph" | "divider" | "table";
      text: string;
      key?: string;
      value?: string;
      headers?: string[];
      rows?: string[][];
    }

    const elements: ParsedElement[] = [];

    while (i < lines.length) {
      const line = lines[i].trim();
      if (line === "" || line.startsWith("===")) {
        i++;
        continue;
      }

      if (line.startsWith("---") || line.startsWith("___")) {
        elements.push({ type: "divider", text: "" });
        i++;
        continue;
      }

      if (isHeader(line)) {
        const headingText = line.replace(/:$/, "").trim();
        elements.push({ type: "heading", text: headingText });
        i++;

        // Custom parser for customer list table
        if (headingText === "Daftar Rincian Pelanggan") {
          const headers = ["Perusahaan", "Industri", "Wilayah", "Armada", "Skor", "Limit", "Status"];
          const rows: string[][] = [];
          let currentCust: Record<string, string> = {};

          while (i < lines.length && !lines[i].startsWith("===")) {
            const tableLine = lines[i].trim();
            if (tableLine.startsWith("---")) {
              if (Object.keys(currentCust).length > 0) {
                let scoreVal = currentCust["Skor TrustScore"] || "";
                scoreVal = scoreVal.replace("Risiko ", "");
                let fleetVal = currentCust["Ukuran Armada"] || "";
                fleetVal = fleetVal.replace(" Kendaraan", "");

                rows.push([
                  currentCust["Nama Perusahaan"] || "",
                  currentCust["Industri"] || "",
                  currentCust["Wilayah"] || "",
                  fleetVal,
                  scoreVal,
                  currentCust["Rekomendasi Limit"] || "",
                  currentCust["Status"] || ""
                ]);
                currentCust = {};
              }
            } else if (tableLine.includes(":")) {
              const colonIdx = tableLine.indexOf(":");
              const k = tableLine.substring(0, colonIdx).trim();
              const v = tableLine.substring(colonIdx + 1).trim();
              currentCust[k] = v;
            }
            i++;
          }

          if (Object.keys(currentCust).length > 0) {
            let scoreVal = currentCust["Skor TrustScore"] || "";
            scoreVal = scoreVal.replace("Risiko ", "");
            let fleetVal = currentCust["Ukuran Armada"] || "";
            fleetVal = fleetVal.replace(" Kendaraan", "");

            rows.push([
              currentCust["Nama Perusahaan"] || "",
              currentCust["Industri"] || "",
              currentCust["Wilayah"] || "",
              fleetVal,
              scoreVal,
              currentCust["Rekomendasi Limit"] || "",
              currentCust["Status"] || ""
            ]);
          }

          elements.push({ type: "table", text: "", headers, rows });
        }
        continue;
      }

      if (line.startsWith("- ") || line.startsWith("* ")) {
        const text = line.substring(2).trim();
        if (text.includes(" : ") || text.includes(" :")) {
          const colonIdx = text.indexOf(":");
          const k = text.substring(0, colonIdx).trim();
          const v = text.substring(colonIdx + 1).trim();
          elements.push({ type: "bullet", text, key: k, value: v });
        } else if (text.includes("  ") && text.includes(":")) {
          const colonIdx = text.indexOf(":");
          const k = text.substring(0, colonIdx).trim();
          const v = text.substring(colonIdx + 1).trim();
          elements.push({ type: "bullet", text, key: k, value: v });
        } else {
          elements.push({ type: "bullet", text });
        }
        i++;
        continue;
      }

      if (line.includes("  :") || line.includes(" : ") || (line.includes(":") && !line.includes("://") && !line.includes("Rp"))) {
        const colonIdx = line.indexOf(":");
        if (colonIdx > 0 && colonIdx < line.length - 1) {
          const k = line.substring(0, colonIdx).trim();
          const v = line.substring(colonIdx + 1).trim();
          elements.push({ type: "key-value", text: line, key: k, value: v });
          i++;
          continue;
        }
      }

      elements.push({ type: "paragraph", text: line });
      i++;
    }

    // Render elements
    elements.forEach((element) => {
      // Ensure space for heading
      if (element.type === "heading") {
        if (y + 15 > 270) {
          doc.addPage();
          y = 20;
        } else {
          y += 4;
        }
        doc.setFillColor(0, 58, 218); // Accent blue
        doc.rect(20, y - 3.5, 3, 5, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(11, 28, 48); // Navy
        doc.text(element.text, 25, y);
        y += 8;
      } else if (element.type === "key-value") {
        if (y + 8 > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(68, 70, 85); // Grey
        doc.text(element.key || "", 20, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(11, 28, 48); // Navy
        y = drawText(doc, ":  " + (element.value || ""), 65, y, 125, 5.5);
      } else if (element.type === "bullet") {
        if (y + 8 > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFillColor(0, 58, 218); // Accent blue circle
        doc.circle(22.5, y - 1.5, 0.8, "F");

        if (element.key && element.value) {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9.5);
          doc.setTextColor(11, 28, 48);
          doc.text(element.key + ": ", 25, y);

          const keyWidth = doc.getTextWidth(element.key + ": ");
          doc.setFont("helvetica", "normal");
          doc.setTextColor(68, 70, 85);
          y = drawText(doc, element.value, 25 + keyWidth, y, 165 - keyWidth, 5.5);
        } else {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9.5);
          doc.setTextColor(11, 28, 48);
          y = drawText(doc, element.text, 25, y, 165, 5.5);
        }
      } else if (element.type === "paragraph") {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(68, 70, 85);
        y = drawText(doc, element.text, 20, y, 170, 5.5) + 1;
      } else if (element.type === "divider") {
        if (y + 6 > 270) {
          doc.addPage();
          y = 20;
        } else {
          doc.setDrawColor(196, 197, 216);
          doc.line(20, y - 2, 190, y - 2);
          y += 4;
        }
      } else if (element.type === "table" && element.headers && element.rows) {
        const headers = element.headers;
        const rows = element.rows;
        const colWidths = [38, 32, 20, 12, 26, 26, 16];
        const colAlign = ["left", "left", "left", "center", "center", "right", "center"];

        if (y + 12 > 270) {
          doc.addPage();
          y = 20;
        }

        // Draw Table Header
        doc.setFillColor(239, 244, 255); // #eff4ff
        doc.rect(20, y, 170, 7, "F");

        doc.setDrawColor(196, 197, 216);
        doc.line(20, y, 190, y);
        doc.line(20, y + 7, 190, y + 7);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(0, 41, 161); // #0029a1

        let currentX = 20;
        headers.forEach((h, idx) => {
          const w = colWidths[idx];
          const align = colAlign[idx];
          let textX = currentX;
          if (align === "right") {
            textX = currentX + w - 2;
            doc.text(h, textX, y + 4.8, { align: "right" });
          } else if (align === "center") {
            textX = currentX + w / 2;
            doc.text(h, textX, y + 4.8, { align: "center" });
          } else {
            textX = currentX + 2;
            doc.text(h, textX, y + 4.8);
          }
          currentX += w;
        });

        y += 7;

        // Draw Table Rows
        rows.forEach((row, rowIdx) => {
          if (y + 7 > 270) {
            doc.addPage();
            y = 20;

            // Repeat Table Header
            doc.setFillColor(239, 244, 255);
            doc.rect(20, y, 170, 7, "F");

            doc.setDrawColor(196, 197, 216);
            doc.line(20, y, 190, y);
            doc.line(20, y + 7, 190, y + 7);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(0, 41, 161);

            let headerX = 20;
            headers.forEach((h, idx) => {
              const w = colWidths[idx];
              const align = colAlign[idx];
              let textX = headerX;
              if (align === "right") {
                textX = headerX + w - 2;
                doc.text(h, textX, y + 4.8, { align: "right" });
              } else if (align === "center") {
                textX = headerX + w / 2;
                doc.text(h, textX, y + 4.8, { align: "center" });
              } else {
                textX = headerX + 2;
                doc.text(h, textX, y + 4.8);
              }
              headerX += w;
            });
            y += 7;
          }

          if (rowIdx % 2 === 1) {
            doc.setFillColor(248, 249, 255);
            doc.rect(20, y, 170, 7, "F");
          }

          doc.setDrawColor(196, 197, 216, 0.3 * 255);
          doc.line(20, y + 7, 190, y + 7);

          let rowX = 20;
          row.forEach((val, idx) => {
            const w = colWidths[idx];
            const align = colAlign[idx];
            let textX = rowX;

            doc.setFontSize(8);
            if (idx === 4) { // Score
              doc.setFont("helvetica", "bold");
              const scoreNum = parseInt(val);
              if (scoreNum >= 700) doc.setTextColor(31, 164, 99);
              else if (scoreNum >= 500) doc.setTextColor(242, 169, 60);
              else doc.setTextColor(223, 39, 33);
            } else if (idx === 6) { // Status
              doc.setFont("helvetica", "bold");
              const statusLower = val.toLowerCase();
              if (statusLower.includes("app") || statusLower.includes("setu")) doc.setTextColor(31, 164, 99);
              else if (statusLower.includes("rev") || statusLower.includes("tinj")) doc.setTextColor(242, 169, 60);
              else doc.setTextColor(223, 39, 33);
            } else {
              doc.setFont("helvetica", "normal");
              doc.setTextColor(11, 28, 48);
            }

            if (align === "right") {
              textX = rowX + w - 2;
              doc.text(val, textX, y + 4.8, { align: "right" });
            } else if (align === "center") {
              textX = rowX + w / 2;
              doc.text(val, textX, y + 4.8, { align: "center" });
            } else {
              textX = rowX + 2;
              doc.text(val, textX, y + 4.8);
            }
            rowX += w;
          });
          y += 7;
        });
        y += 8; // Spacing after table ends
      }
    });

    // Add Page Footer (Page X of Y)
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(116, 118, 135);
      doc.text(`Halaman ${p} dari ${pageCount}`, 190, 287, { align: "right" });
      doc.text("TRUSTFLEET AI - DOKUMEN LAPORAN RESMI (CONFIDENTIAL)", 20, 287);
      doc.setDrawColor(196, 197, 216, 0.3 * 255);
      doc.line(20, 282, 190, 282);
    }

    // Trigger PDF download
    doc.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  } catch (error) {
    console.error("Failed to generate PDF, falling back to text file:", error);
    // Fallback: download as text
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
}

export interface IntegrationItem {
  name: string;
  desc: string;
  icon: string;
  connected: boolean;
}

const defaultIntegrations: IntegrationItem[] = [
  { name: "Geotab", desc: "Koneksi data sensor armada komprehensif.", icon: "local_shipping", connected: false },
  { name: "Samsara", desc: "Data GPS dan keselamatan berkendara real-time.", icon: "navigation", connected: false },
  { name: "Webfleet", desc: "Riwayat pemeliharaan dan konsumsi bahan bakar.", icon: "build", connected: false }
];

export function getStoredIntegrations(): IntegrationItem[] {
  if (typeof window === "undefined") return defaultIntegrations;
  const stored = localStorage.getItem("tf_integrations");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultIntegrations;
    }
  }
  localStorage.setItem("tf_integrations", JSON.stringify(defaultIntegrations));
  return defaultIntegrations;
}

export function saveStoredIntegrations(list: IntegrationItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("tf_integrations", JSON.stringify(list));
  }
}

