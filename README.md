# 🧩 HTML-Blueprint — Baukasten für statische Mehrseiten-Projekte

Ein wiederverwendbares Template für kleine bis mittlere Info-Projekte: Reiseplaner, Vergleichsseiten, Wissenssammlungen, Familien-Dashboards, Event-Guides. **Kein Build, kein Framework, kein Package Manager** — jede Seite ist eine einzelne HTML-Datei, die direkt im Browser läuft, auch per Doppelklick vom Dateisystem (`file://`).

Entstanden ist das Template aus einem realen Projekt mit 31 Seiten (einem Familien-Urlaubsplaner), aus dem alle bewährten Muster, Bausteine und Qualitätsregeln extrahiert wurden.

## Warum dieses Template?

- **Null Abhängigkeiten.** Keine npm-Installation, kein Bundler, kein Server. Klonen, `index.html` öffnen, fertig. Einzige externe Ressource ist ein Google Font — mit System-Font-Fallback.
- **Jede Seite ist self-contained.** Kompletter eigener CSS- und JS-Block pro Datei. Eine Seite geht nie kaputt, weil eine andere geändert wurde — und einzelne Seiten lassen sich verschicken oder kopieren.
- **Baukasten statt Framework.** Ein fester Kern (Theming, einklappbare Sektionen, Druckausgabe, Barrierefreiheit) plus über 20 optionale Bausteine, die sich einzeln übernehmen oder weglassen lassen. Die beiden Beispielseiten zeigen bewusst *alles* im Einsatz — sie sind Schaukasten, nicht Mindestumfang.
- **Für die Arbeit mit KI-Agenten gebaut.** Die ausführliche `CLAUDE.md` dokumentiert jede Konvention, jeden Fallstrick und einen Fragenkatalog für den Projektstart — [Claude Code](https://claude.com/claude-code) (oder ein anderes Agenten-Tool) kann daraus direkt neue Projekte aufbauen.

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

## Theming: 6 Farbwelten × Dark/Light

Zwei unabhängige Achsen am `<html>`-Tag: `data-theme` (dark/light) und `data-design` (Farbwelt). Im Template schaltet eine Auswahlbox live um; in fertigen Projekten wird das Design einmal fixiert.

| Design | Charakter |
|---|---|
| **Polar** (Standard) | kühles Blau, Slate-Töne |
| **Wald** | grün-erdig, gedeckte Naturtöne |
| **Abend** | warmes Terracotta, Sonnenuntergangstöne |
| **Graphit** | neutral, entsättigt, dezent |
| **Terminal** ⚡ | radikal: Monospace, null Radien, Phosphorgrün / „Papier-Terminal" im Light-Mode |
| **Brutal** ⚡ | radikal: null Radien, 2px-Rahmen in Akzentfarbe, harte Offset-Schatten |

Möglich machen das **Struktur-Tokens**: Schrift, Eckenradien, Rahmenstärke und Schatten sind als CSS-Variablen definiert — ein Design kann damit weit mehr ändern als Farben, ohne eine einzige Komponente anzufassen. Der Dark/Light-Default folgt der OS-Einstellung (`prefers-color-scheme`), ein Anti-Flicker-Script verhindert Aufblitzen, und ein Link-Interceptor reicht Theme + Design per URL-Parameter an jede Seite weiter (nötig, weil Firefox/Safari den localStorage bei `file://` pro Datei isolieren).

## Die Bausteine

**Kern (auf jeder Seite):** Design-System mit CSS-Variablen · Dark/Light-Toggle · einklappbare Sektionen mit Sprungleiste · Print-Stylesheet (druckt immer hell und vollständig aufgeklappt) · ARIA-Attribute, `noscript`-Fallback, `prefers-reduced-motion`.

**Optional (pro Projekt wählen):**

| Kategorie | Bausteine |
|---|---|
| Navigation | Tab-Navigation mit `?tab=`-Rücksprung · TOC-Sprungleiste · Back-to-top |
| Finden & Wählen | Live-Suche + Tag-Filter + Favoriten · seitenübergreifende Suche (`search-index.js`) · Favoriten-Vergleichsansicht · Sortierung für Grids und Tabellen · interaktiver Entscheidungsbaum · Schnellauswahl-Box |
| Karten | Google-Maps-Routen ohne API-Key (Anreise-Karte + „🚗 Route"-Buttons) · OpenStreetMap-Embeds |
| Inhalt | Cards, POI-Listen, Termin-Listen, Vergleichstabellen, Key-Value-Kacheln, Begriffstabellen · Zwei-Ansichten-Toggle · Timeline · Balkendiagramm (CSS-only) · FAQ-Akkordeon (komplett JS-frei) |
| Persistenz | abhakbare Checkliste mit Fortschrittsbalken · Notizfeld pro Seite · Termin-Intelligenz (vergangene Termine dimmen + Countdown) · Daten-Export/Import als JSON |
| Komfort | Tastatur-Shortcuts (`t` Theme, `/` Suche) · Lightbox-Galerie |

Jeder Baustein besteht aus einem markierten CSS-Block, optionalem Markup und einem benannten Script-Block — alles einzeln kopier- und entfernbar. Die `CLAUDE.md` dokumentiert pro Baustein, was dazugehört und wie man ihn sauber weglässt.

## Qualität eingebaut

- **QS-Werkzeuge als Copy-&-Paste-Snippets** (Python-Heredocs, keine Hilfsdateien im Projekt): HTML-Tag-Balance-Check, Abgleich benutzter vs. definierter CSS-Klassen, **Block-Sync** (hält geteilte CSS-Blöcke über alle Seiten identisch) und ein **WCAG-Kontrast-Check** für neue Farbwelten.
- Dokumentierte Fallstricke aus dem Ursprungsprojekt (häufige Klassen-Tippfehler, Link-Verifikation per `curl`, localStorage-Eigenheiten bei `file://`).
- Ein **Projektstart-Fragenkatalog** in der `CLAUDE.md`: sechs Fragengruppen (Thema, Struktur, Design, Bausteine, Inhalte, Pflege), die vor dem ersten Code geklärt werden — damit das Projekt von Anfang an die richtigen Bausteine bekommt.

## Dateien

```
├── index.html        Übersichtsseite — Tabs, Karten-Grid, Suche, Filter, Entscheidungsbaum
├── detail.html       Detailseiten-Muster — alle Content- und Persistenz-Bausteine
├── search-index.js   Daten-Datei des Such-Bausteins (einzige Nicht-HTML-Datei, optional)
├── CLAUDE.md         Vollständige technische Doku: Konventionen, Bausteine, Checklisten, QS
└── README.md         Diese Datei
```

## Neues Projekt starten (Kurzfassung)

1. Repo kopieren, `CLAUDE.md`-Fragenkatalog durchgehen (Thema, Tabs, Design, Bausteine).
2. Design festlegen: per Auswahlbox durchprobieren, dann `data-design` im `<html>`-Tag fixieren und die drei markierten Template-Stellen entfernen (in der `CLAUDE.md` Schritt für Schritt beschrieben).
3. Nicht benötigte Bausteine entfernen — Markup und Script-Blöcke raus, CSS bleibt als Werkzeugkasten drin.
4. `detail.html` pro Unterseite kopieren, Inhalte füllen, Karte auf der Index einhängen — Checkliste in der `CLAUDE.md`.

## Browser & Grenzen

Läuft in allen aktuellen Browsern (Chrome/Edge, Firefox, Safari), ohne JavaScript bleiben alle Inhalte lesbar (`noscript`-Fallback). Bekannte, dokumentierte Grenzen: Bei `file://` isolieren Firefox/Safari den localStorage pro Datei (der Export/Import-Baustein ist der Ausweg), und das keylose Google-Maps-Embed ist inoffiziell (die normalen Maps-Links bleiben als Fallback immer funktionsfähig).

## Lizenz

Noch nicht festgelegt — vor der Veröffentlichung eine `LICENSE`-Datei ergänzen (für ein Template dieser Art bietet sich z. B. MIT an).
