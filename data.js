// data.js — IT-Dashboard Datendatei
// Wird von einem Monitoring-Script erzeugt und per <script src="data.js"> geladen.
// Funktioniert auch bei file:// (kein fetch() nötig).
// Format-Version: 1.1
//
// Minimal-Beispiel für ein Generator-Script (Python):
//   data = {"generated_at": datetime.now().isoformat(timespec='seconds'), "services": [...], ...}
//   with open("data.js", "w") as f:
//       f.write("var DASH_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n")
//
// Alle Felder sind optional — fehlendes Feld = Sektion wird ausgeblendet.

var DASH_DATA = {
  "generated_at": "2026-06-13T14:30:00",

  // Service-Status — Ampel-Matrix
  // status: "ok" | "warn" | "crit" | "unknown"
  // uptime_pct: float (optional) — Uptime in % im Beobachtungszeitraum
  // latency_history: number[] | null (optional) — Latenzen in ms, ältester zuerst (10 Werte)
  "services": [
    { "id": "web",    "name": "Webserver",   "group": "Frontend",      "status": "ok",      "message": "HTTP 200 · 42 ms",            "uptime_pct": 99.98, "latency_history": [38,41,40,39,42,40,43,41,38,42],  "checked_at": "2026-06-13T14:29:00" },
    { "id": "cdn",    "name": "CDN",          "group": "Frontend",      "status": "ok",      "message": "Cache-Hit 94 %",              "uptime_pct": 100.0, "latency_history": [12,14,11,13,12,15,11,13,12,14],  "checked_at": "2026-06-13T14:29:00" },
    { "id": "api",    "name": "API Gateway",  "group": "Backend",       "status": "warn",    "message": "P95 > 800 ms",                "uptime_pct": 99.20, "latency_history": [320,450,580,700,820,842,830,810,842,842], "checked_at": "2026-06-13T14:28:00" },
    { "id": "db",     "name": "PostgreSQL",   "group": "Backend",       "status": "ok",      "message": "Verbindungen 23/100",          "uptime_pct": 99.99, "latency_history": [4,5,4,4,6,5,4,5,4,5],          "checked_at": "2026-06-13T14:29:00" },
    { "id": "cache",  "name": "Redis",        "group": "Backend",       "status": "crit",    "message": "Connection refused",           "uptime_pct": 98.10, "latency_history": [1,2,1,1,2,80,null,null,null,null], "checked_at": "2026-06-13T14:27:00" },
    { "id": "queue",  "name": "RabbitMQ",     "group": "Backend",       "status": "ok",      "message": "Queues: 3, Nachrichten: 12",  "uptime_pct": 99.95, "latency_history": [8,9,8,10,9,8,9,10,9,8],        "checked_at": "2026-06-13T14:29:00" },
    { "id": "nfs",    "name": "NFS",          "group": "Infrastruktur", "status": "ok",      "message": "Mount OK",                    "uptime_pct": 100.0, "latency_history": null,                             "checked_at": "2026-06-13T14:29:00" },
    { "id": "backup", "name": "Backup",       "group": "Infrastruktur", "status": "warn",    "message": "Letztes Backup vor 26 h",     "uptime_pct": 97.50, "latency_history": null,                             "checked_at": "2026-06-13T14:29:00" },
    { "id": "dns",    "name": "DNS",          "group": "Infrastruktur", "status": "ok",      "message": "Auflösung < 1 ms",            "uptime_pct": 100.0, "latency_history": [0.8,0.9,0.7,0.8,0.9,0.8,0.7,0.9,0.8,0.8], "checked_at": "2026-06-13T14:28:00" }
  ],

  // Metriken — mit Verlaufsdaten für Sparklines (30 Werte, ältester zuerst)
  // value = aktueller Wert; warn/crit = Schwellwerte in derselben Einheit wie value
  // max = Skalierungsmaximum (optional, erzeugt Fortschrittsbalken)
  "metrics": [
    { "id": "cpu",  "name": "CPU",      "unit": "%",    "value": 73,   "warn": 80,   "crit": 90,   "history": [45,52,48,61,55,73,68,72,70,73,65,71,73,69,74,73,70,68,72,73,71,75,73,72,74,73,71,69,72,73] },
    { "id": "ram",  "name": "RAM",      "unit": "GB",   "value": 14.2, "max": 32,    "warn": 25.6, "crit": 28.8, "history": [12,12.5,13,13.2,13.8,14,13.5,14.1,14.2,14.3,13.9,14,14.2,14.1,14.3,14.2,14,14.1,14.2,14.1,13.9,14,14.2,14.1,14.3,14.2,14,14.1,14.2,14.2] },
    { "id": "disk", "name": "Disk /",  "unit": "%",    "value": 62,   "warn": 80,   "crit": 90,   "history": [55,56,57,57,58,58,59,59,60,60,60,61,61,61,62,62,62,62,62,62,62,62,62,62,62,62,62,62,62,62] },
    { "id": "net",  "name": "Netzwerk","unit": "MB/s", "value": 142,  "warn": 800,  "crit": 950,  "history": [80,120,95,140,110,142,130,145,138,142,135,140,142,138,145,142,140,138,142,142,139,141,142,143,140,142,141,142,143,142] }
  ],

  // Log-Einträge — neueste zuerst
  // level: "CRIT" | "ERROR" | "WARN" | "INFO" | "DEBUG"
  "logs": [
    { "ts": "2026-06-13T14:27:00", "level": "CRIT", "source": "redis",  "message": "Connection refused: max retries exceeded" },
    { "ts": "2026-06-13T14:25:00", "level": "WARN", "source": "api",    "message": "P95 latency threshold exceeded: 842 ms" },
    { "ts": "2026-06-13T14:20:00", "level": "INFO", "source": "backup", "message": "Backup-Job gestartet" },
    { "ts": "2026-06-13T13:55:00", "level": "WARN", "source": "backup", "message": "Backup-Job verzögert — Storage antwortet langsam" },
    { "ts": "2026-06-13T13:30:00", "level": "INFO", "source": "web",    "message": "TLS-Zertifikat erneuert (läuft ab 2027-06-13)" },
    { "ts": "2026-06-13T12:15:00", "level": "INFO", "source": "deploy", "message": "Deployment v2.4.1 erfolgreich abgeschlossen" },
    { "ts": "2026-06-13T11:00:00", "level": "WARN", "source": "db",     "message": "Slow Query: SELECT auf users > 2 s (Index fehlt)" },
    { "ts": "2026-06-13T10:00:00", "level": "INFO", "source": "system", "message": "Monitoring-Agent gestartet (Neustart nach Patch)" },
    { "ts": "2026-06-13T09:45:00", "level": "INFO", "source": "system", "message": "Patch KB2026-06 installiert" },
    { "ts": "2026-06-13T09:00:00", "level": "DEBUG","source": "net",    "message": "MTU-Pfad-Discovery abgeschlossen: 1500 Byte" }
  ],

  // Wartungsfenster — geplante/laufende/abgeschlossene Downtimes
  // status: "planned" | "running" | "completed" | "cancelled"
  "maintenance": [
    { "id": "m1", "title": "Redis Upgrade 7.2 → 7.4",          "start": "2026-06-15T22:00:00", "end": "2026-06-15T23:30:00", "status": "planned",   "services": ["redis"],      "note": "Kurzer Neustart ~5 Min. erwartet. Clients reconnecten automatisch." },
    { "id": "m2", "title": "PostgreSQL Index-Rebuild (users)",  "start": "2026-06-14T02:00:00", "end": "2026-06-14T04:00:00", "status": "planned",   "services": ["postgresql"], "note": "Kein Ausfall erwartet — Index wird im Hintergrund gebaut (CONCURRENTLY)." },
    { "id": "m3", "title": "API Gateway Deployment v2.4.2",     "start": "2026-06-13T12:00:00", "end": "2026-06-13T12:15:00", "status": "completed", "services": ["api"],        "note": "Erfolgreicher Rolling-Deploy. Keine Downtime." },
    { "id": "m4", "title": "TLS-Zertifikat-Rotation (alle)",   "start": "2026-06-13T13:28:00", "end": "2026-06-13T13:31:00", "status": "completed", "services": ["web","cdn"],   "note": "Let's Encrypt Auto-Renewal — kein manueller Eingriff." }
  ],

  // Incident-Timeline — Ausfälle und Vorfälle, neueste zuerst
  // status: "open" | "resolved"
  // severity: "crit" | "warn"
  // mttr_min: mittlere Zeit bis zur Lösung in Minuten (null wenn offen)
  "incidents": [
    { "id": "i1", "title": "Redis — Connection refused",  "start": "2026-06-13T14:27:00", "end": null,                    "status": "open",     "severity": "crit", "services": ["redis","cache"],  "mttr_min": null, "note": "Ursache unklar — Speicher-OOM untersucht" },
    { "id": "i2", "title": "API — Latenz-Spike P95",      "start": "2026-06-13T14:20:00", "end": "2026-06-13T14:35:00",   "status": "resolved", "severity": "warn", "services": ["api"],            "mttr_min": 15,   "note": "Spike nach Deployment; mit Rollback behoben" },
    { "id": "i3", "title": "Backup — Storage-Verzögerung","start": "2026-06-12T13:00:00", "end": "2026-06-12T15:00:00",   "status": "resolved", "severity": "warn", "services": ["backup","nfs"],   "mttr_min": 120,  "note": "NFS-Mount war langsam; NFS-Neustart hat geholfen" },
    { "id": "i4", "title": "DB — Slow Query (users-Tabelle)","start":"2026-06-13T11:00:00","end": "2026-06-13T11:45:00",  "status": "resolved", "severity": "warn", "services": ["postgresql"],     "mttr_min": 45,   "note": "Fehlender Index gefunden; EXPLAIN ANALYZE durchgeführt, Fix eingeplant" }
  ],

  // Inventar — Hosts/Geräte
  // status: "ok" | "warn" | "crit" | "unknown"
  "hosts": [
    { "id": "srv01", "name": "srv01.local", "role": "Webserver",        "os": "Ubuntu 24.04 LTS", "ip": "192.168.1.10", "cpu_cores": 4, "ram_gb": 16, "status": "ok",   "last_seen": "2026-06-13T14:29:00" },
    { "id": "srv02", "name": "srv02.local", "role": "Datenbankserver",   "os": "Ubuntu 24.04 LTS", "ip": "192.168.1.11", "cpu_cores": 8, "ram_gb": 32, "status": "ok",   "last_seen": "2026-06-13T14:29:00" },
    { "id": "srv03", "name": "srv03.local", "role": "Cache / Redis",     "os": "Debian 12",        "ip": "192.168.1.12", "cpu_cores": 4, "ram_gb": 8,  "status": "crit", "last_seen": "2026-06-13T14:27:00" },
    { "id": "srv04", "name": "srv04.local", "role": "API Gateway",       "os": "Ubuntu 22.04 LTS", "ip": "192.168.1.13", "cpu_cores": 4, "ram_gb": 8,  "status": "warn", "last_seen": "2026-06-13T14:28:00" },
    { "id": "nas01", "name": "nas01.local", "role": "NAS / Backup",      "os": "TrueNAS SCALE",    "ip": "192.168.1.20", "cpu_cores": 2, "ram_gb": 16, "status": "ok",   "last_seen": "2026-06-13T14:29:00" }
  ]
};
