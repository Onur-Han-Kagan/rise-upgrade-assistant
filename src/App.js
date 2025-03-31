import React, { useState } from "react";
import { Trash2 } from "lucide-react";

export default function App() {
  const [history, setHistory] = useState([]);
  const [view, setView] = useState("live");

  const clearHistory = () => {
    if (confirm("Günlük verilerini silmek istediğinizden emin misiniz?")) {
      setHistory([]);
    }
  };

  const exportHistory = () => {
    const headers = ["Time", "Scroll", "Level", "Result", "Suggestion"];
    const rows = history.map(h => [h.time, h.scroll, h.level, h.result, h.suggest]);
    const csvContent = [headers, ...rows]
      .map(e => e.map(val => `"${val}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "upgrade_log.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const isLuckyNow = () => {
    const recent = history.slice(0, 6);
    const successCount = recent.filter(h => h.result.includes("başarılı")).length;
    const arcanaOrEpicSuccess = recent.filter(h => h.result.includes("başarılı") && (h.scroll.includes("Arcana") || h.scroll.includes("Epic"))).length;
    const uniqueFailures = recent.filter(h => h.result.includes("başarısız") && h.scroll.includes("Unique")).length;
    return (successCount >= 3 && arcanaOrEpicSuccess >= 2 && uniqueFailures <= 2);
  };

  const isRiskyNow = () => {
    const recent = history.slice(0, 5);
    const fails = recent.filter(h => h.result.includes("başarısız")).length;
    const uniques = recent.filter(h => h.scroll.includes("Unique")).length;
    return fails >= 4 && uniques >= 3;
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => setView("live")} className={`btn ${view === "live" ? "btn-primary" : "btn-outline"}`}>🎥 Canlı Takip</button>
        <button onClick={() => setView("log")} className={`btn ${view === "log" ? "btn-primary" : "btn-outline"}`}>📘 Günlük</button>
        {view === "log" && (
          <>
            <button onClick={exportHistory} className="btn btn-secondary">⬇️ Günlüğü İndir</button>
            <button onClick={clearHistory} className="btn btn-danger"><Trash2 className="mr-2 h-4 w-4" /> Temizle</button>
          </>
        )}
      </div>

      {view === "live" && isLuckyNow() && (
        <div className="text-center text-green-600 font-bold text-lg mt-2">
          💡 AI analize göre: Şu anda geçirme şansı yüksek! Şans sende!
        </div>
      )}

      {view === "live" && isRiskyNow() && (
        <div className="text-center text-red-600 font-bold text-lg mt-2">
          ⚠️ Uyarı: Çok sayıda başarısız Unique upgrade tespit edildi. Şu an basmak riskli olabilir!
        </div>
      )}
    </div>
  );
}
