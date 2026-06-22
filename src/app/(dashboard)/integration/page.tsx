"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredSettings, saveStoredSettings, getStoredIntegrations, saveStoredIntegrations, IntegrationItem } from "@/lib/storage";
import Swal from "sweetalert2";

function TelematicsIntegrationCard({ 
  integ, 
  onStatusChange,
  onConnect
}: { 
  integ: IntegrationItem; 
  onStatusChange: (name: string, isConnected: boolean) => void;
  onConnect: (vendorName: string) => void;
}) {
  const router = useRouter();
  const handleConnect = () => {
    if (integ.connected) {
      Swal.fire({
        title: `Putuskan Hubungan ${integ.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DF2721",
        confirmButtonText: "Ya, Putuskan",
        cancelButtonText: "Batal",
        customClass: {
          popup: "rounded-[24px] font-[var(--font-inter)]",
        }
      }).then((res) => {
        if (res.isConfirmed) {
          onStatusChange(integ.name, false);
          Swal.fire({ 
            text: `Berhasil memutuskan ${integ.name}`, 
            icon: "success", 
            confirmButtonColor: "#003ada",
            customClass: {
              popup: "rounded-[24px] font-[var(--font-inter)]",
            }
          });
        }
      });
    } else {
      Swal.fire({
        title: `Hubungkan ke ${integ.name}`,
        html: `
          <div class="space-y-4 text-left font-[var(--font-inter)]">
            <p class="text-xs text-slate-500">Masukkan kredensial integrasi telematika:</p>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1">API Key / Token</label>
              <div class="flex gap-2">
                <input id="swal-integ-token" type="password" class="swal2-input !mx-0 !w-full !mt-0" placeholder="token integrasi...">
                <button id="swal-btn-autofill" type="button" class="bg-[#eff4ff] text-[#003ada] px-4 py-2 rounded-xl text-xs font-bold border border-[#dee1ff] cursor-pointer hover:bg-[#dee1ff] transition-colors whitespace-nowrap">Auto Fill</button>
              </div>
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: "#003ada",
        confirmButtonText: "Hubungkan",
        cancelButtonText: "Batal",
        customClass: {
          popup: "rounded-[24px] font-[var(--font-inter)]",
        },
        didOpen: () => {
          const autofillBtn = document.getElementById("swal-btn-autofill");
          if (autofillBtn) {
            autofillBtn.addEventListener("click", () => {
              const input = document.getElementById("swal-integ-token") as HTMLInputElement;
              if (input) {
                const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                let token = `tf_token_${integ.name.toLowerCase()}_`;
                for (let i = 0; i < 16; i++) {
                  token += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
                }
                input.value = token;
              }
            });
          }
        },
        preConfirm: () => {
          const val = (document.getElementById("swal-integ-token") as HTMLInputElement).value;
          if (!val) {
            Swal.showValidationMessage("Kunci token harus diisi!");
            return false;
          }
          return val;
        }
      }).then((res) => {
        if (res.isConfirmed) {
          let progress = 0;
          Swal.fire({
            title: `Menyinkronkan ${integ.name}...`,
            html: `
              <div class="w-full bg-[#003ada]/10 h-3 rounded-full overflow-hidden mt-4">
                <div id="integ-progress-bar" class="bg-[#003ada] h-full rounded-full transition-all duration-200" style="width: 0%"></div>
              </div>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            customClass: {
              popup: "rounded-[24px] font-[var(--font-inter)]",
            },
            didOpen: () => {
              const bar = document.getElementById("integ-progress-bar");
              const interval = setInterval(() => {
                progress += 25;
                if (bar) bar.style.width = `${progress}%`;
                if (progress >= 100) {
                  clearInterval(interval);
                  onStatusChange(integ.name, true);
                  onConnect(integ.name); // Automatically create the API Key for this vendor
                  Swal.fire({
                    icon: "success",
                    title: `Koneksi ${integ.name} Berhasil!`,
                    text: `Data telematika armada disinkronkan secara otomatis. Kunci API baru untuk ${integ.name} telah dibuat.`,
                    confirmButtonColor: "#003ada",
                    confirmButtonText: "Mulai Penilaian Risiko",
                    customClass: {
                      popup: "rounded-[24px] font-[var(--font-inter)]",
                    }
                  }).then(() => {
                    router.push("/dashboard?newAssessment=true");
                  });
                }
              }, 250);
            }
          });
        }
      });
    }
  };

  return (
    <div className="p-6 bg-[#FAFAFC] border border-[#c4c5d8]/30 rounded-[24px] flex flex-col justify-between items-start gap-4 w-full shadow-sm hover:shadow-md transition-shadow">
      <div className="w-full">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[#003ada] bg-[#eff4ff] p-2.5 rounded-xl">{integ.icon}</span>
          <span className="font-bold text-base text-[#0b1c30]">{integ.name}</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">{integ.desc}</p>
      </div>
      <button 
        onClick={handleConnect}
        className={`w-full py-3 text-xs rounded-full font-bold transition-all cursor-pointer ${
          integ.connected 
            ? "bg-[#1FA463]/10 text-[#1FA463] border border-[#1FA463]/20 hover:bg-[#1FA463]/20" 
            : "bg-[#003ada] text-white hover:opacity-90 hover:shadow-md hover:shadow-[#003ada]/10"
        }`}
      >
        {integ.connected ? "Terhubung" : "Hubungkan"}
      </button>
    </div>
  );
}

export default function IntegrationPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([]);

  useEffect(() => {
    setSettings(getStoredSettings());
    setIntegrations(getStoredIntegrations());
  }, []);

  const handleSaveSettings = (updated: any) => {
    setSettings(updated);
    saveStoredSettings(updated);
  };

  const generateApiKeyForVendor = (vendorName: string) => {
    if (!settings) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let keySuffix = "";
    for (let i = 0; i < 12; i++) {
      keySuffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newKeyObj = {
      key: `tf_live_${vendorName.replace(/\s+/g, "")}_${keySuffix}`,
      vendor: vendorName
    };
    const updatedKeys = [...(settings.apiKeys || []), newKeyObj];
    const updated = {
      ...settings,
      apiKeys: updatedKeys
    };
    handleSaveSettings(updated);
  };

  const handleGenerateApiKey = () => {
    Swal.fire({
      title: "Buat Kunci API Baru",
      html: `
        <div class="space-y-4 text-left font-[var(--font-inter)]">
          <label class="block text-xs font-bold text-slate-500 uppercase mb-2">Pilih Vendor / Peruntukan Kunci</label>
          <select id="swal-api-vendor" class="swal2-input !mx-0 !w-full !p-3">
            <option value="System">Sistem Internal (Default)</option>
            <option value="Geotab">Geotab Integration</option>
            <option value="Samsara">Samsara Integration</option>
            <option value="Webfleet">Webfleet Integration</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#003ada",
      cancelButtonColor: "#747687",
      confirmButtonText: "Buat Kunci",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-[24px] font-[var(--font-inter)]",
      },
      preConfirm: () => {
        return (document.getElementById("swal-api-vendor") as HTMLSelectElement).value;
      }
    }).then((res) => {
      if (res.isConfirmed) {
        generateApiKeyForVendor(res.value);
        Swal.fire({
          icon: "success",
          title: "Kunci API Dibuat!",
          text: `Kunci API baru untuk ${res.value} berhasil dibuat.`,
          confirmButtonColor: "#003ada",
          confirmButtonText: "Mulai Penilaian Risiko",
          customClass: {
            popup: "rounded-[24px] font-[var(--font-inter)]",
          }
        }).then(() => {
          router.push("/dashboard?newAssessment=true");
        });
      }
    });
  };

  const handleRevokeApiKey = (keyString: string) => {
    Swal.fire({
      title: "Revoke API Key?",
      text: "Semua sistem yang menggunakan API Key ini akan langsung terputus dari TrustFleet AI.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DF2721",
      cancelButtonColor: "#747687",
      confirmButtonText: "Revoke",
      cancelButtonText: "Batal",
      customClass: {
        popup: "rounded-[24px] font-[var(--font-inter)]",
      }
    }).then((res) => {
      if (res.isConfirmed) {
        // Find the key to see what vendor it corresponds to
        const keyItem = (settings.apiKeys || []).find((k: any) => {
          const kStr = typeof k === "string" ? k : k.key;
          return kStr === keyString;
        });

        // Filter out the key
        const updatedKeys = (settings.apiKeys || []).filter((k: any) => {
          const kStr = typeof k === "string" ? k : k.key;
          return kStr !== keyString;
        });

        const updated = {
          ...settings,
          apiKeys: updatedKeys
        };
        handleSaveSettings(updated);

        // If the revoked key was associated with a telematics vendor, disconnect that vendor card!
        if (keyItem && typeof keyItem !== "string" && keyItem.vendor) {
          const vendorName = keyItem.vendor;
          const updatedIntegrations = integrations.map((i) => {
            if (i.name === vendorName) {
              return { ...i, connected: false };
            }
            return i;
          });
          setIntegrations(updatedIntegrations);
          saveStoredIntegrations(updatedIntegrations);
        }

        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "API Key berhasil dinonaktifkan",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleStatusChange = (name: string, isConnected: boolean) => {
    const updated = integrations.map((i) => {
      if (i.name === name) {
        return { ...i, connected: isConnected };
      }
      return i;
    });
    setIntegrations(updated);
    saveStoredIntegrations(updated);

    // If it is disconnected (isConnected === false), remove the API Keys associated with this vendor
    if (!isConnected && settings) {
      const updatedKeys = (settings.apiKeys || []).filter((k: any) => {
        if (typeof k === "string") return true; // Keep system/default keys
        return k.vendor !== name; // Remove keys belonging to this vendor
      });
      const updatedSettings = {
        ...settings,
        apiKeys: updatedKeys
      };
      handleSaveSettings(updatedSettings);
    }
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003ada]"></div>
      </div>
    );
  }

  // Safe parsing of apiKeys list to always contain key & vendor properties
  const keysList = (settings.apiKeys || []).map((k: any) => {
    if (typeof k === "string") {
      return { key: k, vendor: "System" };
    }
    return k;
  });

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-[var(--font-jakarta)] text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[#0b1c30]">Integrasi Sistem</h2>
        <p className="font-[var(--font-inter)] text-[16px] text-[#444655] mt-1">Kelola kunci API dan sambungkan layanan telematika pihak ketiga ke mesin TrustScore AI.</p>
      </div>

      <div className="space-y-8 max-w-5xl">
        {/* Telematics Integrations */}
        <section className="bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-[#c4c5d8]/30 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-[#003ada]/10 rounded-xl text-[#003ada]">
              <span className="material-symbols-outlined text-2xl">devices_other</span>
            </div>
            <div>
              <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Integrasi Telematika Alternatif</h3>
              <p className="text-xs text-slate-500 mt-0.5">Sambungkan penyedia telematika untuk menarik data kesehatan armada secara otomatis.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {integrations.map((integ) => (
              <TelematicsIntegrationCard 
                key={integ.name} 
                integ={integ} 
                onStatusChange={handleStatusChange} 
                onConnect={generateApiKeyForVendor}
              />
            ))}
          </div>
        </section>

        {/* API Keys */}
        <section className="bg-white p-6 sm:p-8 rounded-[24px] shadow-sm border border-[#c4c5d8]/30 space-y-6">
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#003ada]/10 rounded-xl text-[#003ada]">
                <span className="material-symbols-outlined text-2xl">api</span>
              </div>
              <div>
                <h3 className="font-[var(--font-jakarta)] text-[20px] font-bold text-[#0b1c30]">Kunci API (API Keys)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Gunakan API Key untuk mengintegrasikan sistem internal UD Trucks dengan data scoring.</p>
              </div>
            </div>
            <button 
              onClick={handleGenerateApiKey}
              className="bg-[#003ada] text-white text-xs font-semibold py-3 px-5 rounded-full flex items-center gap-1.5 hover:opacity-90 transition-all shadow-md hover:shadow-[#003ada]/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">vpn_key</span>
              Buat Kunci Baru
            </button>
          </div>

          <div className="space-y-3">
            {keysList && keysList.length > 0 ? (
              keysList.map((item: any) => (
                <div key={item.key} className="flex justify-between items-center bg-[#FAFAFC] p-4 rounded-2xl text-sm font-mono border border-[#c4c5d8]/20 shadow-inner">
                  <div className="flex flex-col gap-1">
                    <span className="text-[#0b1c30] font-bold">{item.key}</span>
                    <span className="text-[10px] text-[#747687] font-sans">Vendor: <strong className="text-[#003ada]">{item.vendor}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 font-sans">
                    <span className="text-[10px] bg-[#1FA463]/10 text-[#1FA463] px-2.5 py-1 rounded-full font-bold uppercase border border-[#1FA463]/20">Live</span>
                    <button 
                      onClick={() => handleRevokeApiKey(item.key)}
                      className="text-[#DF2721] hover:underline text-xs font-semibold cursor-pointer"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 italic text-center py-6 border border-dashed border-[#c4c5d8]/20 rounded-2xl">Belum ada API Key aktif.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
