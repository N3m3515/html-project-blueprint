# 🧩 HTML-Blueprint — Baukasten für statische Mehrseiten-Projekte

Ein wiederverwendbares Template für kleine bis mittlere Info-Projekte: Reiseplaner, Vergleichsseiten, Wissenssammlungen, Familien-Dashboards, Event-Guides. **Kein Build, kein Framework, kein Package Manager** — jede Seite ist eine einzelne HTML-Datei, die direkt im Browser läuft, auch per Doppelklick vom Dateisystem (`file://`).

Entstanden ist das Template aus einem realen Projekt mit 31 Seiten (einem Familien-Urlaubsplaner), aus dem alle bewährten Muster, Bausteine und Qualitätsregeln extrahiert wurden. **Das gesamte Projekt wurde mit [Claude Code](https://claude.com/claude-code) (Anthropics KI-Agent) entwickelt** — von der ersten Seite bis zur Extraktion dieses Templates. Es ist gezielt für die weitere Arbeit mit Claude ausgelegt: Die `CLAUDE.md` ist so geschrieben, dass Claude Code ein neues Projekt eigenständig aufbauen, Reviews durchführen und Konventionen einhalten kann.

## Warum dieses Template?

- **Null Abhängigkeiten.** Keine npm-Installation, kein Bundler, kein Server. Klonen, `index.html` öffnen, fertig. Einzige externe Ressource ist ein Google Font — mit System-Font-Fallback.
- **Jede Seite ist self-contained.** Kompletter eigener CSS- und JS-Block pro Datei. Eine Seite geht nie kaputt, weil eine andere geändert wurde — und einzelne Seiten lassen sich verschicken oder kopieren.
- **Baukasten statt Framework.** Ein fester Kern (Theming, einklappbare Sektionen, Druckausgabe, Barrierefreiheit) plus über 30 optionale Bausteine, die sich einzeln übernehmen oder weglassen lassen. Die drei Beispielseiten zeigen bewusst *alles* im Einsatz — sie sind Schaukasten, nicht Mindestumfang.
- **Für die Arbeit mit KI-Agenten gebaut.** Die ausführliche `CLAUDE.md` dokumentiert jede Konvention, jeden Fallstrick und einen Fragenkatalog für den Projektstart — [Claude Code](https://claude.com/claude-code) (oder ein anderes Agenten-Tool) kann daraus direkt neue Projekte aufbauen.

## Einordnung

**Gibt es das schon?** Ähnliche Ansätze existieren teils: No-build CSS-Frameworks wie [Pico.css](https://picocss.com/) oder Simple.css sind schlank und abhängigkeitsfrei, aber ohne Dark/Light-System, Fold-Mechanismus oder Baukasten-Konzept. HTML5 Boilerplate ist build-orientiert. KI-Generatoren wie v0, Lovable oder Bolt.new erzeugen Seiten auf Abruf, speichern aber keine Konventionen, die über Gespräche hinweg gelten. Die `CLAUDE.md` als persistentes KI-Gedächtnis — eine Datei, die Claude Code bei jedem Gespräch automatisch als Kontext lädt und die Fallstricke, Klassen-Konventionen und QS-Werkzeuge eines gewachsenen Projekts festhält — ist der eigentlich neue Ansatz.

**Spart es Token bei KI-Agenten?** Ja, aber erst ab einer gewissen Projektgröße. Die `CLAUDE.md` selbst kostet ~15–20k Zeichen Kontext pro Gespräch. Dieser Overhead rechnet sich durch verhinderte Fehler-Korrektur-Runden: Jeder nicht dokumentierte Fallstrick kostet typischerweise eine ganze Iteration (Fehlerbericht → Analyse → Fix → Verifikation). Im Ursprungsprojekt traten beim ersten Code-Review allein 8 solche Fälle auf, dazu Design-Drift zwischen Seiten, der ohne das Block-Sync-Skript unsichtbar geblieben wäre. Faustregel: **ab 5+ Seiten** oder bei Projekten, die über mehrere Gespräche gepflegt werden, überwiegt der Nutzen deutlich.

**Wann lohnt es sich nicht?** Für React-, Vue- oder Next.js-Projekte bietet das Template nichts — dort gibt es ausgereifte Ökosysteme mit besseren Werkzeugen. Wenn ein Build-Schritt kein Problem ist, sind Static-Site-Generatoren wie Eleventy oder Astro die durchdachtere Wahl. Das Template ist für einen spezifischen Raum: persönliche Projekte, lokale Werkzeuge und kleine Informationsseiten, die einfach funktionieren sollen — ohne Toolchain, ohne Server, per Doppelklick.

## Live-Demo

👉 **[n3m3515.github.io/html-project-blueprint](https://n3m3515.github.io/html-project-blueprint/)** — direkt im Browser ausprobieren, alle Designs und Bausteine live testen. Auf der Demo-Seite lässt sich die App auch als PWA installieren (Chrome/Edge: Installieren-Symbol in der Adresszeile).

## Schnellstart

```bash
git clone <repo-url>
cd <repo>
# kein Build-Schritt — einfach öffnen:
xdg-open index.html        # Linux
open index.html            # macOS
start index.html           # Windows
```

`index.html` ist die Übersichtsseite (Tabs, Karten-Grid, Suche, Filter), `detail.html` das Muster für beliebig viele Unterseiten.

## Theming: 8 Farbwelten × Dark/Light

Zwei unabhängige Achsen am `<html>`-Tag: `data-theme` (dark/light) und `data-design` (Farbwelt). Im Template schaltet eine Auswahlbox live um; in fertigen Projekten wird das Design einmal fixiert.

| Design | Charakter |
|---|---|
| **Polar** (Standard) | kühles Blau, Slate-Töne |
| **Wald** | grün-erdig, gedeckte Naturtöne |
| **Abend** | warmes Terracotta, Sonnenuntergangstöne |
| **Graphit** | neutral, entsättigt, dezent |
| **Terminal** ⚡ | radikal: Monospace, null Radien, Phosphorgrün / „Papier-Terminal" im Light-Mode |
| **Brutal** ⚡ | radikal: null Radien, 2px-Rahmen in Akzentfarbe, harte Offset-Schatten |
| **Material 3** | Material Design 3: lila Primärfarbe, tonale Flächen, weiche Radien (28 px) |
| **Liquid Glass** ⚡ | Liquid Glass: Gradient-Body, `backdrop-filter:blur`, semi-transparente Glasflächen |

Möglich machen das **Struktur-Tokens**: Schrift, Eckenradien, Rahmenstärke und Schatten sind als CSS-Variablen definiert — ein Design kann damit weit mehr ändern als Farben, ohne eine einzige Komponente anzufassen. Der Dark/Light-Default folgt der OS-Einstellung (`prefers-color-scheme`), ein Anti-Flicker-Script verhindert Aufblitzen, und ein Link-Interceptor reicht Theme + Design per URL-Parameter an jede Seite weiter (nötig, weil Firefox/Safari den localStorage bei `file://` pro Datei isolieren).

## Die Bausteine

**Kern (auf jeder Seite):** Design-System mit CSS-Variablen · Dark/Light-Toggle · einklappbare Sektionen mit Sprungleiste · Print-Stylesheet (druckt immer hell und vollständig aufgeklappt) · ARIA-Attribute, `noscript`-Fallback, `prefers-reduced-motion`.

**Optional (pro Projekt wählen):**

| Kategorie | Bausteine |
|---|---|
| Navigation | Tab-Navigation mit `?tab=`-Rücksprung · TOC-Sprungleiste · Back-to-top · **Scroll-Spy** (aktiver TOC-Chip beim Scrollen hervorgehoben) |
| Finden & Wählen | Live-Suche + Tag-Filter + Favoriten · **Sterne-Bewertung** (1–5 pro Indexkarte) · seitenübergreifende Suche mit **Suchfeld-Highlighting** · Favoriten-Vergleichsansicht · Sortierung für Grids und Tabellen · interaktiver Entscheidungsbaum · Schnellauswahl-Box · **URL-State** (Filter/Tab in der URL — bookmarkbar und teilbar) |
| Karten | Google-Maps-Routen ohne API-Key (Anreise-Karte + „🚗 Route"-Buttons) · OpenStreetMap-Embeds |
| Inhalt | Cards, POI-Listen, Termin-Listen, Vergleichstabellen, Key-Value-Kacheln, Begriffstabellen · Zwei-Ansichten-Toggle · Timeline · Balkendiagramm (CSS-only) · FAQ-Akkordeon (komplett JS-frei) · **Abschnitts-Permalinks** (🔗-Button an jedem Sektions-Titel) · **Kalkulations-Widget** (Kostenfelder mit Summe + localStorage) |
| Persistenz | abhakbare Checkliste mit Fortschrittsbalken · **Drag-&-Drop-Sortierung** (Checklisten-Reihenfolge per Maus/Touch) · Notizfeld pro Seite · Termin-Intelligenz (vergangene Termine dimmen + Countdown) · Daten-Export/Import als JSON |
| Komfort | **Ankündigungs-Banner** (schließbarer Hinweisstreifen, Status in localStorage) · Tastatur-Shortcuts (`t` Theme, `/` Suche) · **Tastatur-Shortcut-Übersicht** (`?`-Taste) · Lightbox-Galerie **mit ←/→-Navigation** (Tastatur + Buttons) · **Druckauswahl** (🖨-Button wählt Sektionen vor dem Drucken) |
| Offline & Mobil | **PWA-Baustein** (`manifest.json` + `sw.js`): installierbar als App, Offline-Nutzung via Service Worker — automatisch aktiv auf HTTPS, bei `file://` übersprungen |
| IT-Monitoring | **IT-Dashboard** (`dashboard.html` + `data.js`): Status-Matrix mit Uptime-Badge + Latenz-Sparkline pro Service · Metric Cards mit SVG-Sparklines + Threshold-Balken · Log-Viewer mit Level-/Volltext-Filter und Pagination · Inventar-Grid · Wartungsfenster · Incident-Timeline mit proportionalem Dauer-Balken und MTTR · Tab-Titel-Ampel (❌/⚠/✅) · Auto-Refresh (HTTPS) |
| API-Integration | **API-Connector** (OAuth2 Client Credentials, Bearer-Token im sessionStorage, clientSecret nie persistiert) · **Toast-Notifications** (Statusmeldungen ok/err/info, auto-dismiss) · **Confirmation-Dialog** (modales Overlay für destruktive Aktionen) · **Editierbare Datentabelle** (Paginierung, Suche, Inline-Edit mit PATCH) · **Multi-Step-Wizard** (Schritt-Indikator, hier: CSR-Generator mit PEM-Download) · **NetEdit Backup Manager** (Backup-Liste über SSH-Proxy, Restore mit Bestätigung) |

Jeder Baustein besteht aus einem markierten CSS-Block, optionalem Markup und einem benannten Script-Block — alles einzeln kopier- und entfernbar. Die `CLAUDE.md` dokumentiert pro Baustein, was dazugehört und wie man ihn sauber weglässt.

## Qualität eingebaut

- **QS-Werkzeuge als Copy-&-Paste-Snippets** (Python-Heredocs, keine Hilfsdateien im Projekt): HTML-Tag-Balance-Check, Abgleich benutzter vs. definierter CSS-Klassen, **Block-Sync** (hält geteilte CSS-Blöcke über alle Seiten identisch) und ein **WCAG-Kontrast-Check** für neue Farbwelten.
- **Sicherheit**: XSS-Schutz durch `esc()`-Helper in allen `innerHTML`-Pfaden · `importData()` nur mit Whitelist bekannter localStorage-Keys · URL-Parameter korrekt enkodiert.
- Dokumentierte Fallstricke aus dem Ursprungsprojekt (häufige Klassen-Tippfehler, Link-Verifikation per `curl`, localStorage-Eigenheiten bei `file://`).
- Ein **Projektstart-Fragenkatalog** in der `CLAUDE.md`: sechs Fragengruppen (Thema, Struktur, Design, Bausteine, Inhalte, Pflege), die vor dem ersten Code geklärt werden — damit das Projekt von Anfang an die richtigen Bausteine bekommt.

## Dateien

```
├── index.html        Übersichtsseite — Tabs, Karten-Grid, Suche, Filter, Entscheidungsbaum
├── detail.html       Detailseiten-Muster — alle Content- und Persistenz-Bausteine
├── dashboard.html    IT-Dashboard — Status-Matrix, Metriken, Logs, Inventar, Wartung, Incidents
├── data.js           Daten-Datei des IT-Dashboards (var DASH_DATA = {...}) — per Script erzeugen
├── search-index.js   Daten-Datei des Such-Bausteins (optional)
├── manifest.json     PWA-Manifest — bei Projektstart anpassen (Name, Icon, Farbe)
├── sw.js             Service Worker — cacht alle Seiten für Offline-Nutzung
├── icon.svg          Template-App-Icon — durch projektspezifisches Icon ersetzen
├── CLAUDE.md         Vollständige technische Doku: Konventionen, Bausteine, Checklisten, QS
└── README.md         Diese Datei
```

## Neues Projekt starten (Kurzfassung)

1. Repo kopieren, `CLAUDE.md`-Fragenkatalog durchgehen (Thema, Tabs, Design, Bausteine).
2. Design festlegen: per Auswahlbox durchprobieren, dann `data-design` im `<html>`-Tag fixieren und die drei markierten Template-Stellen entfernen (in der `CLAUDE.md` Schritt für Schritt beschrieben).
3. Nicht benötigte Bausteine entfernen — Markup und Script-Blöcke raus, CSS bleibt als Werkzeugkasten drin.
4. `detail.html` pro Unterseite kopieren, Inhalte füllen, Karte auf der Index einhängen — Checkliste in der `CLAUDE.md`.
5. PWA anpassen: `manifest.json` (Name, Farbe), `icon.svg` (eigenes Icon), `sw.js` (PRECACHE-Liste mit allen neuen `.html`-Seiten ergänzen).

## Browser & Grenzen

Läuft in allen aktuellen Browsern (Chrome/Edge, Firefox, Safari), ohne JavaScript bleiben alle Inhalte lesbar (`noscript`-Fallback). Bekannte, dokumentierte Grenzen: Bei `file://` isolieren Firefox/Safari den localStorage pro Datei (der Export/Import-Baustein ist der Ausweg); der PWA-Service-Worker erfordert HTTPS und ist bei `file://` deaktiviert; das keylose Google-Maps-Embed ist inoffiziell (die normalen Maps-Links bleiben als Fallback immer funktionsfähig).

## Mit Claude Code verwenden

Dieses Template ist auf die Zusammenarbeit mit [Claude Code](https://claude.com/claude-code) ausgelegt:

1. **Repo klonen und Claude Code starten** — die `CLAUDE.md` wird automatisch als Kontext geladen.
2. **Neues Projekt initialisieren** — Claude stellt die Fragen aus dem Projektstart-Katalog (Thema, Struktur, Design, Bausteine) und befüllt dann die Seiten.
3. **Iterativ weiterentwickeln** — Claude kennt alle Klassen-Konventionen, Fallstricke und QS-Werkzeuge und kann neue Sektionen, Seiten oder Designs hinzufügen, ohne dass man die Dokumentation selbst lesen muss.

Die `CLAUDE.md` beschreibt außerdem, welche Fragen Claude vor dem ersten Code-Schritt stellen soll — so entstehen keine unnötigen Umbauten, weil Design oder Struktur hinterher nicht passen.

## Lizenz

[MIT](LICENSE) — frei verwendbar für private, kommerzielle und proprietäre Projekte. Einzige Bedingung: der Lizenztext bleibt erhalten.
