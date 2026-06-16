# CLAUDE.md — Blueprint für statische HTML-Mehrseiten-Projekte

Dieser Ordner ist ein wiederverwendbares Template, extrahiert aus dem Urlaubsplaner-Projekt (30 Detailseiten + Index, Stand Juni 2026). Er ist als **Baukasten** gedacht: ein fester Kern (Design-System, Theme, Fold, Qualitätsregeln) plus optionale Bausteine (Maps, Tabs, TOC, Content-Muster), aus denen sich jedes neue Projekt nur das nimmt, was es braucht. Die drei Beispielseiten zeigen bewusst **alle** Bausteine im Einsatz — sie sind Schaukasten, nicht Mindestumfang.

## Architektur-Prinzipien

1. **Kein Build, kein Framework, kein Package Manager.** Jede `.html`-Datei läuft direkt im Browser, auch per `file://` vom Dateisystem. Keine externen Abhängigkeiten außer Google Fonts (mit System-Font-Fallback).
2. **Jede Seite ist self-contained**: kompletter eigener `<style>`-Block und eigene `<script>`-Blöcke. Kein geteiltes CSS-/JS-File — bewusste Entscheidung, damit eine Seite nie kaputt geht, weil eine andere geändert wurde, und damit einzelne Dateien verschickt/kopiert werden können. (Dokumentierte Ausnahmen: die **Daten**-Datei `search-index.js` des Such-Bausteins — fehlt sie, zeigt die Suche keine Treffer; `data.js` des IT-Dashboard-Grundgerüsts — fehlt sie, bleibt `dashboard.html` leer; `sw.js`/`manifest.json`/`icon.svg` des PWA-Bausteins — Web-Standards, die im Projektstamm liegen müssen.)
3. **Konsequenz daraus**: Änderungen an geteilten Klassen müssen **auf allen Seiten identisch** nachgezogen werden (Script-gestützt per `sed`/Python), sonst entsteht Design-Drift. Und: eine benutzte, aber im File nicht definierte Klasse rendert **stillschweigend unstyled** — bei neuen Sektionen immer prüfen, ob alle verwendeten Klassen im `<style>`-Block der Datei existieren.
4. **Struktur**: eine `index.html` als Einstieg/Übersicht (Tab-Navigation, Karten-Grid mit Links) + beliebig viele Detailseiten (`detail.html` ist das Muster). Detailseiten verlinken zurück per fixiertem Zurück-Button.

## Dateien in diesem Blueprint

| Datei | Rolle |
|---|---|
| `CLAUDE.md` | Diese Doku — bei Projektstart anpassen (Inhalt, Tabs, Domäne) und kontinuierlich pflegen |
| `index.html` | Übersichtsseite: Hero mit einklappbarem Infokasten, Schnellauswahl-Box, Tab-Navigation, verlinkte Karten (`.pcard`) |
| `detail.html` | Detailseiten-Template mit allen Mustern: TOC, Fold, Theme, Karten-Embeds, Cards, POI-Listen, Events, Vergleichstabelle, Specgrid, Key-Value-Infos |
| `dashboard.html` | IT-Dashboard-Template: Status-Matrix, Metric Cards + SVG-Sparklines, Log-Viewer, Inventar — wird durch `data.js` befüllt |
| `data.js` | Daten-Datei des IT-Dashboard-Bausteins (`var DASH_DATA = {...}`) — Felder: `services[]` (inkl. `uptime_pct`, `latency_history`), `metrics[]`, `logs[]`, `maintenance[]`, `incidents[]`, `hosts[]`, `certificates[]` (Zertifikats-Ablaufdaten); per Monitoring-Script erzeugen; funktioniert bei `file://` |
| `search-index.js` | Daten-Datei des Such-Bausteins (manuell gepflegter Seiten-Index) — nur nötig, wenn der Baustein „Seitenübergreifende Suche" verwendet wird |
| `manifest.json` | PWA-Manifest: App-Name, Icon, Theme-Farbe, Display-Modus — bei Projektstart anpassen |
| `sw.js` | Service Worker für Offline-Support (PWA-Baustein) — cacht alle HTML-Seiten; CACHE-Version und PRECACHE-Liste bei neuen Seiten aktualisieren |
| `icon.svg` | Template-Icon (🧩 auf dunklem Hintergrund) — durch projektspezifisches Icon ersetzen |
| `README.md` | Öffentliche Projektbeschreibung (GitHub-Schaufenster) — bei Projektstart auf das neue Projekt umschreiben oder entfernen |

## Baukasten-Prinzip — Kern vs. optionale Bausteine

Nicht jedes Projekt braucht jeden Baustein (eine Google-Maps-Anbindung ist z. B. nur bei Geo-Bezug sinnvoll). Das Template trennt deshalb:

### Kernbausteine — in jeder Seite, nie weglassen

| Baustein | Besteht aus |
|---|---|
| Design-System | CSS-Variablen, Reset, Layout-Grundwerte, Light-Override, Komponenten-Klassen |
| Theme-Toggle | `color-scheme`-Meta, Script-Block 1 (Anti-Flicker), Script-Block 3 (Toggle + Link-Interceptor), `.theme-toggle`-Button |
| Fold-System | `.fold-btn`/`.folded`/`sec-body`-Wrapper, Fold-Script (auf Detailseiten Block 5, auf der Index im show()-Block) |
| Robustheit | `<noscript>`-Fallback, ARIA-Attribute, Reduced-Motion-Block, Print-Block |
| Qualitätsregeln | QS-Snippet, Link-Verifikation, Konventionen dieser Doku |

### Optionale Bausteine — pro Projekt entscheiden

| Baustein | Wofür | Besteht aus | Weglassen |
|---|---|---|---|
| **Google-Maps-Routen** | nur bei Geo-Bezug (Reise, Standorte, Filialen) | Anreise-Sektion, `🚗 Route`-Buttons, Script-Block 4 (`MAP_ORIGIN`+`showRoute`), CSS `/* === Karten-Embeds === */` | Sektion + Buttons + Script-Block 4 nicht übernehmen; `<noscript>`-/Print-Regeln zu `.lb-btn`/`.map-embed` schaden ohne sie nicht |
| **Tab-Navigation** (Index) | mehrere gleichrangige Kategorien | `.tabs`/`.page`-Markup, `show()` + `?tab=`-Init im Script-Block 2, Mobile-Media-Query | Markup + `show()`/`?tab=`-Init weglassen; Detailseiten-Back-Buttons dann ohne `?tab=` |
| **TOC-Sprungleiste** (Detail) | lange Seiten mit vielen Sektionen | `<nav class="toc">`, TOC-Aufklapp-Listener im Fold-Script | bei kurzen Seiten (< ~5 Sektionen) einfach weglassen |
| **Zwei-Ansichten-Toggle** | ein Inhalt, zwei Filter (Sonne/Regen, Einsteiger/Profi, …) | `.wtoggle`/`.wsec`-Markup, Script-Block 2 (`setW`) | Markup + Script-Block 2 weglassen |
| **Schnellauswahl-Box** (Index) | Einstiegshilfe bei vielen Einträgen | `.eh-*`-Markup, `eh-grid`-Eintrag im Fold-Init | erst ab ~10 Einträgen sinnvoll |
| **Content-Muster** | Cards, POI-Listen, Events, Vergleichstabellen, Specgrid, Key-Value-Kacheln, Begriffstabellen | reines Markup + vorhandene CSS-Klassen | per Markup opt-in — einfach nicht verwenden |
| **Filter & Favoriten** (Index) | Grids mit vielen Einträgen durchsuchen/filtern/merken | `.filterbar` (Suchfeld + Tag-Chips + ⭐-Filter), `.fav-btn`-Sterne auf Karten, `data-tags`/`data-fav` auf Grid-Kindern, `id="filter-grid"`, `.filter-empty`, eigener Script-Block, CSS `/* === Baustein: Filter & Favoriten === */` | Markup + Script-Block weglassen |
| **Checkliste** | abhakbare Listen mit Fortschritt (Packliste, To-do) | `.checklist`-Markup (`data-ck` pro Punkt projektweit eindeutig!), `.cl-progress`/`.cl-bar`/`.cl-count`, Checklisten-Teil von Script-Block 6, CSS `/* === Baustein: Checkliste === */` | Sektion + Script-Teil weglassen |
| **Galerie + Lightbox** | Bilder mit Vollbild-Ansicht | `.gallery`/`.g-item`-Markup, `#lightbox`-Overlay vor den Scripts, Lightbox-Teil von Script-Block 6, CSS `/* === Baustein: Galerie & Lightbox === */` | Sektion + Overlay + Script-Teil weglassen |
| **Timeline** | Tagespläne, Abläufe, Projektphasen | `.timeline`/`.tl-*`-Markup, reines CSS `/* === Baustein: Timeline === */` | per Markup opt-in |
| **Balkendiagramm** | Vergleichswerte ohne Chart-Library | `.bars`/`.bar-*`-Markup (Breite per Inline-`width:NN%`), reines CSS `/* === Baustein: Balkendiagramm === */` | per Markup opt-in |
| **Back-to-top** | lange Detailseiten | `#totop`-Button vor den Scripts, Scroll-Teil von Script-Block 6, CSS `/* === Baustein: Back-to-top === */` | Button + Script-Teil weglassen |
| **OSM-Embed** | Orts-Karte als offiziell unterstützte Alternative zum Google-Embed | iframe `openstreetmap.org/export/embed.html?bbox=…&marker=lat,lon` in `.map-embed` | zeigt nur Orte (Marker), **keine Routen** — ergänzt den Google-Baustein, ersetzt ihn nicht |
| **Seitenübergreifende Suche** (Index) | über alle Seiten suchen (`fetch()` geht bei `file://` nicht — daher Index-Datei per `<script src>`) | `search-index.js` (manuell pflegen!), `.ss-wrap`-Markup nach dem Hero, Such-Script-Block, CSS `/* === Baustein: Seitenübergreifende Suche === */` | Markup + Script-Block + Datei weglassen; **wenn aktiv: jede neue Seite in `search-index.js` eintragen** (Checkliste) |
| **Vergleichsansicht** (Index) | 2+ Favoriten nebeneinander vergleichen | `⚖`-Button (`#cmpbtn`) in der filterbar, `data-cmp`-JSON auf den Grid-Kindern, `#cmp-overlay` vor den Scripts, Vergleich-Script-Block, CSS `/* === Baustein: Vergleichsansicht === */` | setzt **Filter & Favoriten** voraus; `toggleFav` ruft `updateCmpBtn` nur guarded auf (`typeof`-Check) — Baustein ist sauber entfernbar |
| **Sortierung** | Grids und Tabellen umsortieren | Index: `.fsort`-Select in der filterbar + `data-sort-val` auf Grid-Kindern + Sortier-Script-Block · Detail: `onclick="sortRt(this)"` auf den `th` einer `.rt` + `sortRt` in Script-Block 6, CSS-Marker je Datei | Select bzw. `th`-onclick + Script-Teil weglassen |
| **Termin-Intelligenz** (Detail) | vergangene Termine automatisch dimmen + Countdown im Hero | `data-date="YYYY-MM-DD"` (Endtermin) auf `.ev`-Einträgen, `#countdown`-Badge (startet `hidden`) in der `meta-row`, Script-Teil in Block 6, CSS `.ev-past` | Attribute + Badge + Script-Teil weglassen; `.ev` ohne `data-date` bleiben unberührt |
| **Entscheidungsbaum** (Index) | Fragen beantworten → passende Karten hervorheben | `.dt-q`-Sektion mit `.dt-opt`-Buttons (`data-q` = Fragengruppe, `data-need` = Kriterium: `tag:<tag>` oder `ready`), Entscheidungsbaum-Script-Block, CSS-Marker | Sektion + Script-Block weglassen; markiert `.pcard`s im `#filter-grid` mit `dt-hit`/`dt-dim` |
| **FAQ** (Detail) | Frage-Antwort-Akkordeon | `<details class="faq"><summary>…</summary><div class="faq-a">…</div></details>`, CSS-Marker; Druck-Helfer (`beforeprint` öffnet alle) in Script-Block 6 | per Markup opt-in — **einziger komplett JS-freier interaktiver Baustein** (Druck-Helfer optional) |
| **Notizen** (Detail) | Freitext pro Seite, lokal gespeichert | Sektion mit `.notes-area`-Textarea + `.notes-status`, Notiz-Teil von Script-Block 6 (Key `note-<dateiname>`), CSS-Marker | Sektion + Script-Teil weglassen |
| **Daten Export/Import** | localStorage-Stand als JSON sichern/einspielen — der Ausweg aus der `file://`-Isolation und für Browser-Wechsel | `.data-tools`-Leiste am Seitenende, Script-Block 7 (`exportData`/`importData`), CSS-Marker | Leiste + Export/Import-Teil von Block 7 weglassen |
| **Tastatur-Shortcuts** | `t` = Theme umschalten, `/` = Suchfeld fokussieren | Listener in Script-Block 7 (greift nicht in Eingabefeldern; `Esc` haben Lightbox/Vergleich eigene Listener) | Listener-Teil von Block 7 weglassen |
| **Lightbox-Navigation** | ←/→ zwischen Galerie-Bildern | `lb-prev`/`lb-next`-Buttons im `#lightbox`-Overlay, `lbNav(dir)` + `_lbItems[]`/`_lbIdx` in Script-Block 6, `ArrowLeft`/`ArrowRight` im keydown-Listener | Pfeiltasten-Listener im keydown-Block entfernen, Prev/Next-Buttons aus dem Overlay löschen |
| **URL-State** (Index) | Tab + Filter in der URL — teilbare und bookmarkbare Filterzustände | `show()` schreibt `?tab=` · `applyFilter()` schreibt `?q=`/`?tags=` · Init-IIFE liest sie beim Laden — alles per `history.replaceState` | `history.replaceState`-Zeilen + Init-IIFE aus `applyFilter()` entfernen |
| **Abschnitts-Permalink** (Detail) | 🔗-Button an jedem Sektions-Titel zum Kopieren des `#hash`-Links | IIFE in Script-Block 5, injiziert `.permalink-btn` in jede `.sec[id] .sec-hd`; öffnet beim Laden eingeklappte Hash-Ziele | IIFE + CSS `/* === Baustein: Permalink === */` weglassen |
| **Suchfeld-Highlighting** (Index) | Treffertext in Suchergebnissen gelb markiert | `hi()`-Funktion in `siteSearch()` + CSS `mark`-Regel in `/* === Baustein: Permalink === */`-Block | `hi()`-Aufrufe durch direktes `esc()` ersetzen + `mark`-CSS entfernen |
| **Druckauswahl** | 🖨-Button öffnet Panel — Sektionen per Checkbox auswählen; nicht angekreuzte werden beim Drucken ausgeblendet | `.print-cfg-btn`/`.print-cfg`-HTML, CSS `/* === Baustein: Druckauswahl === */`, Script-Block „Druckauswahl" (Index) bzw. Teil von Script-Block 6 (Detail) | HTML-Panel + Script-Block weglassen; CSS bleibt harmlos im Datei |
| **Ankündigungs-Banner** | Amber-Banner am Seitenanfang (sticky, klebt unterhalb der Fixed-Controls) — schließbar, Zustand in localStorage; z. B. für Systemhinweise, Template-Hinweise, saisonale Infos | `.ann-wrap`-HTML nach `<body>` (auf allen 3 HTML-Seiten), CSS `/* === Baustein: Ankündigungs-Banner === */`, `dismissAnn(key)` + Init-IIFE im Theme-Script-Block; `data-ann-key` muss projektweit eindeutig sein; **⚠ `top`-Wert muss mit `body{padding-top}` übereinstimmen** — bei Änderung der Fixed-Controls-Höhe beide Werte synchron anpassen | `.ann-wrap`-HTML + `dismissAnn`-Zeilen entfernen; CSS bleibt harmlos |
| **Scroll-Spy für TOC** | Hebt den aktiven TOC-Chip (`.active`) beim Scrollen hervor — nutzt `IntersectionObserver` mit `-10%/−60%` rootMargin | CSS `/* === Baustein: Scroll-Spy === */` (`.toc a.active`-Regel), IIFE am Ende von Script-Block 5 (`detail.html` + `dashboard.html`) | IIFE weglassen; `.active`-CSS-Regel bleibt harmlos ohne JS |
| **Sterne-Bewertung** (Index) | 1–5 Sterne pro `.pcard[id]`, gespeichert als `rating-<card-id>` in localStorage; Sortier-Option „⭐ Bewertung" im `.fsort`-Select | CSS `/* === Baustein: Sterne-Bewertung === */`, `.star-rating-wrap` + `.star-rating#sr-<id>` in `.pc-footer`, `<option value="rating">` im Select, `initStars()` + Sortier-Fall `'rating'` im Favoriten-Script-Block | `.star-rating-wrap`-Markup + `initStars()`-Aufruf + Sort-Option entfernen; pcard-`id`-Attribute können bleiben |
| **Tastatur-Shortcut-Übersicht** | `?`-Taste öffnet modal ein Overlay mit allen Shortcuts; `Esc` schließt | CSS `/* === Baustein: Tastatur-Shortcut-Übersicht === */`, `.sc-overlay`-Overlay-HTML vor den Scripts (auf allen 3 HTML-Seiten), `openShortcuts()`/`closeShortcuts()` + `?`-Fall im keydown-Listener in Script-Block 7 | Overlay-HTML + Funktionen + `?`-Fall entfernen; CSS bleibt harmlos |
| **Drag-&-Drop-Sortierung** (Detail) | Checklist-`<li>`-Elemente per Drag-&-Drop umsortierbar; Reihenfolge in `ck-order-<list-id>` persistiert | CSS `/* === Baustein: Drag-&-Drop-Sortierung === */`, `draggable="true"` auf `<li>`-Elementen, `id` auf der `<ul class="checklist">`, IIFE in Script-Block 6 | `draggable`-Attribute + IIFE entfernen; `id` auf `<ul>` kann bleiben |
| **Kalkulations-Widget** (Detail) | Editierbare Kostenfelder mit automatischer Gesamtsumme, localStorage-Persistenz (Key `calc-<feldname>`) und Reset-Button | CSS `/* === Baustein: Kalkulations-Widget === */`, Sektions-HTML (`id="kalkulation"`) mit `.calc-wrap`/`.calc-row`/`.calc-input[data-calc-key]`/`.calc-total-val`, TOC-Chip, `updateCalc()`/`resetCalc()` + Init-IIFE in Script-Block 6; Export/Import-Keys um `calc-` erweitert | Sektion + Funktionen weglassen; CSS bleibt harmlos |
| **Leer-Zustand** | Standardisierter Platzhalter für Sektionen, die erst nach einer Benutzeraktion Inhalte zeigen (Ladestart, Suchergebnis, API-Antwort) | CSS `/* === Baustein: Leer-Zustand === */` auf Detail + Dashboard (und Index); Markup: `<div class="empty"><div class="ei">🔑</div>Text …</div>` | CSS bleibt harmlos; Markup einfach weglassen |
| **Formular-System** (Detail + Dashboard) | Konsistentes Layout für Eingabemasken: 2-spaltiger Grid, Label+Input-Spalten, Card-artige Abschnitte, Aktionszeile, gestylte Radio-Buttons | CSS `/* === Baustein: Formular-System === */` (`.form-section`/`.form-section-title`, `.form-grid`, `.form-group`/`.form-group.full`, `.form-row`, `.radio-group`) | Markup weglassen; CSS bleibt harmlos |
| **Datentabelle (read-only)** (Detail + Dashboard) | Leichtgewichtige Tabelle für datenreiche, nicht-editierbare Inhalte — ergänzt `.rt` (Vergleich mit Status-Symbolen) und `.edt-table` (Inline-Edit); `.mono` auf `<td>` für Monospace (IP/MAC/UUID), `.actions` für kompakte Button-Zelle | CSS `/* === Baustein: Datentabelle (read-only) === */` (`.tbl-wrap`, `.tbl`, `.tbl td.mono`, `.tbl td.actions`, `.tbl .tbl-empty`) | Markup weglassen; CSS bleibt harmlos |
| **Bulk-Aktions-Leiste** (Dashboard) | Fixe Leiste am unteren Bildschirmrand, erscheint wenn ≥1 Tabellen-Zeile per Checkbox ausgewählt ist; eigener Script-Block mit `Set`-basiertem Selection-State (`_bulkIds`, `bulkToggle`, `bulkToggleAll`, `bulkClear`) | CSS `/* === Baustein: Bulk-Aktions-Leiste === */` (`.bulk-bar`, `.bulk-count`, `.bulk-actions`); `<div class="bulk-bar" id="bulk-bar">` im Body; `<input type=checkbox class="bulk-cb" data-id="…">` in Tabellenzeilen + `id="bulk-select-all"` in `<th>`; `body{padding-bottom:4rem}` für Abstand; eigener Script-Block vor Block 7 | Markup + Script-Block entfernen; `.bulk-cb`-Checkboxen aus Tabelle entfernen; CSS bleibt harmlos |
| **PWA / Offline** | App installierbar + Offline-Nutzung via Service Worker | `manifest.json` + `icon.svg` + `sw.js`; `<link rel="manifest">` + `<meta name="theme-color" id="theme-color-meta">` im `<head>`; SW-Registrierung + `theme-color`-Update in `toggleTheme()` — **nur auf HTTPS aktiv** (`file://` wird per Check übersprungen) | `manifest.json`/`sw.js`/`icon.svg` löschen, `<link rel="manifest">` + `<meta name="theme-color">` + SW-Registrierungszeile aus HTML entfernen |
| **IT-Dashboard — Grundgerüst** | Basis für alle Dashboard-Sektionen: `dashboard.html` als self-contained Template + `data.js` als Datendatei; Hero mit Live-Clock (lokale Systemzeit, aktualisiert alle 10 s), Tab-Titel-Ampel (❌ N CRIT / ⚠ N WARN / ✅ OK), CRIT-Badge (klickbar, scrollt zum ersten kritischen Service), Stale-Indikator wenn `generated_at` > 10 Min. alt, Auto-Refresh-Checkbox (nur HTTPS) | `dashboard.html` (TOC + alle Sektionen) + `data.js` (`var DASH_DATA = {generated_at, ...}` via `<script src="data.js">` — funktioniert bei `file://`); Script-Block 6 (IIFE mit `esc()`, `fmtTs()`, `fmtDur()`-Helpern + Hero-Logik); `DASH_DATA.generated_at` für Stale-Check | `dashboard.html` + `data.js` komplett entfernen; `PRECACHE`-Liste in `sw.js` kürzen; alle 6 Dashboard-CSS-Blöcke bleiben in anderen Seiten harmlos (kein Markup = kein Effekt) |
| **IT-Dashboard — Status-Matrix** | Ampel-Dot-Grid pro Service (ok/warn/crit/unknown), gruppiert nach `group`-Feld; optional Uptime-Badge (%) und Latenz-Sparkline (80×18 SVG, bis zu 10 Messpunkte, `null` für Ausfallslücken) | `<section id="services">` in `dashboard.html`; `DASH_DATA.services[]`: `id`, `name`, `group`, `status`, `message`, `uptime_pct` (opt.), `latency_history` (opt., 10 Werte), `checked_at`; CSS `/* === Baustein: IT-Dashboard — Status-Matrix === */` (`.sm-wrap`, `.sm-group`, `.sm-dot`, `.sm-uptime`, `.sm-spark-cell`); Script-Teil in Block 6 rendert nach Gruppen + erzeugt SVG-Sparkline inline | Sektion aus `dashboard.html` + zugehörigen Script-Teil entfernen; `services`-Feld in `data.js` weglassen (fehlendes Feld → Sektion wird ausgeblendet) |
| **IT-Dashboard — Metrik-Karten** | Kennzahlen-Karten mit Verlaufs-Sparkline (180×40 SVG, 30 Werte) und Schwellwert-Balken (warn amber / crit coral); optionaler Fortschrittsbalken wenn `max` gesetzt | `<section id="metriken">`; `DASH_DATA.metrics[]`: `id`, `name`, `unit`, `value`, `warn`, `crit`, `max` (opt.), `history` (30 Werte); CSS `/* === Baustein: IT-Dashboard — Metriken === */` (`.metric-grid`, `.metric-card`, `.metric-spark`, `.metric-bar-*`); Script-Teil in Block 6 | Sektion + Script-Teil entfernen; `metrics`-Feld weglassen |
| **IT-Dashboard — Log-Viewer** | Scrollbare Log-Tabelle mit Level-Filter-Chips (CRIT/ERROR/WARN/INFO/DEBUG), Volltext-Suche und Pagination (50 Einträge/Batch, „Weitere laden"-Button); Treffer-Zähler | `<section id="logs">` mit Toolbar + `.log-table-wrap` + `#log-more-wrap`/`#log-more-btn`; `DASH_DATA.logs[]`: `ts`, `level`, `source`, `message`; CSS `/* === Baustein: IT-Dashboard — Log-Viewer === */` (`.log-toolbar`, `.log-chip`, `.log-table`, `.log-count`, `.log-more-*`); Script-Teil: `applyLogFilter()` + `logLoadMore()`; `window._logLoadMore` für `onclick` aus dem IIFE heraus | Sektion + Script-Teil entfernen; `logs`-Feld weglassen |
| **IT-Dashboard — Inventar** | Host-/Geräte-Grid mit Status-Farbrand (ok/warn/crit/unknown) und Key-Value-Details (IP, OS, CPU, RAM, zuletzt gesehen) | `<section id="inventar">`; `DASH_DATA.hosts[]`: `id`, `name`, `role`, `os`, `ip`, `cpu_cores`, `ram_gb`, `status`, `last_seen`; CSS `/* === Baustein: IT-Dashboard — Inventar === */` (`.inv-grid`, `.inv-item`, `.inv-header`, `.inv-details`, `.inv-kv`); Script-Teil in Block 6 | Sektion + Script-Teil entfernen; `hosts`-Feld weglassen |
| **IT-Dashboard — Wartungsfenster** | Liste geplanter/laufender/abgeschlossener Wartungsfenster mit Status-Badge, Zeitraum und betroffenen Services | `<section id="wartung">` mit `.maint-list`; `DASH_DATA.maintenance[]`: `id`, `title`, `start`, `end`, `status` (planned/running/completed/cancelled), `services[]`, `note`; CSS `/* === Baustein: IT-Dashboard — Wartungsfenster === */` (`.maint-item`, `.maint-dot`, `.maint-body`, `.maint-title`, `.maint-meta`, `.maint-note`, `.maint-services`, `.maint-status`); Script-Teil in Block 6 | Sektion + Script-Teil entfernen; `maintenance`-Feld weglassen |
| **IT-Dashboard — Incident-Timeline** | Vorfall-Liste mit proportionalem Dauer-Balken (relativ zur längsten Incident-Dauer), MTTR-Angabe, Schweregrad-Färbung (crit/warn) und betroffenen Services | `<section id="incidents">` mit `.incident-list`; `DASH_DATA.incidents[]`: `id`, `title`, `start`, `end` (null wenn offen), `status` (open/resolved), `severity` (crit/warn), `services[]`, `mttr_min`, `note`; CSS `/* === Baustein: IT-Dashboard — Incident-Timeline === */` (`.incident-item`, `.inc-row`, `.inc-title`, `.inc-meta`, `.inc-note`, `.inc-services`, `.inc-bar-*`); Script-Teil: berechnet `maxDur` über alle Incidents, rendert proportionale Balken | Sektion + Script-Teil entfernen; `incidents`-Feld weglassen |
| **Toast-Notifications** (Dashboard) | Kurzlebige Status-Meldungen (ok/err/info) fixed unten rechts — auto-dismiss nach ~4 s | `#toast-container` im Body, CSS `/* === Baustein: Toast-Notifications === */`, `showToast(msg,type)` im API-Connector-Script-Block | `#toast-container` + `showToast`-Aufruf entfernen; CSS bleibt harmlos |
| **Confirmation-Dialog** (Dashboard) | Modales Overlay für destruktive Aktionen — Abbrechen/Bestätigen-Buttons, Esc schließt. Erweiterte API: `showConfirm({icon, title, body, okLabel, okClass, callback})` — zeigt Emoji-Icon + Titel + HTML-Body + dynamischen OK-Button; `confirmDialog(msg,cb)` ist ein Alias für Rückwärtskompatibilität. | `#confirm-overlay` im Body (vor den Scripts) mit `.confirm-header`/`.confirm-icon`/`.confirm-title`/`.confirm-body`-Elementen, CSS `/* === Baustein: Confirmation-Dialog === */`, `showConfirm(opts)` + `confirmDialog(msg,cb)` + `closeConfirm()` + Init-IIFE im API-Connector-Script-Block | `#confirm-overlay` + Funktionen + IIFE entfernen; `showConfirm`-Aufrufe durch `window.confirm()` ersetzen |
| **API-Connector** (Dashboard) | OAuth2-Client-Credentials-Flow für REST-APIs; zentraler `apiFetch(method,path,body)` Helper; Token im sessionStorage mit Ablaufzeit | `<section id="api-config">` mit `.api-form`-Feldern, CSS `/* === Baustein: API-Connector === */`, `apiLogin()`/`apiLogout()`/`apiFetch()`/`updateApiStatus()` + Init-IIFE im API-Connector-Script-Block; **Sicherheit: clientSecret NIEMALS persistieren** — nur `api_base_url` + `api_client_id` + `api_token` im sessionStorage; `proxy_url` optional für SSH-Proxy | Sektion + Script-Block weglassen; `apiFetch`-Aufrufe in abhängigen Bausteinen ebenfalls entfernen; OAuth2-Pfad (`/api/oauth`) an eigenes System anpassen |
| **Editierbare Datentabelle** (Dashboard) | Datentabelle mit Paginierung, Volltextsuche und Inline-Bearbeitung (Attribute) — PATCH pro Zeile | `<section id="rest-endpoints">` mit `.edt-wrap`/`.edt-table`, CSS `/* === Baustein: Editierbare Datentabelle === */`, `loadEndpoints()`/`renderEndpointTable()`/`saveEndpoint(btn)`/`epPrevPage()`/`epNextPage()` + Init-IIFE im Script-Block; setzt **API-Connector** voraus | Sektion + Script-Teil weglassen; API-Pfad (`/api/items`) und Filterfeld auf das eigene System anpassen |
| **Multi-Step-Wizard** (Dashboard) | Drei-Schritt-Wizard mit Schritt-Indikator — hier: CSR-Generator (Service wählen → Felder füllen → PEM herunterladen). Schritt 2 enthält eine **Prefill-Import-Bar**: Felder aus PEM-Datei (client-seitiger ASN.1-Parser, kein Server nötig) oder aus der Zertifikatsüberwachungstabelle übernehmen | `<section id="csr-generator">` mit `.wiz-indicator`/`.wiz-step`-Markup + `.wiz-import`-Bar (`.wiz-import-label`/`.wiz-import-sep`/`.wiz-import-file`/`.wiz-import-select`) + `.wiz-required-note`, CSS `/* === Baustein: Multi-Step-Wizard === */`, `csrSetStep(n)`/`csrNext1()`/`csrGenerate()`/`csrDownload()`/`csrPrefillFrom(f)`/`csrFromPem(text)` global, `csrFromCert(id)` global (auch von Zertifikatsüberwachung genutzt) + IIFEs (Service-Select, file-input-Listener, cert-select-Befüllung aus `DASH_DATA.certificates`) im Script-Block; setzt **API-Connector** voraus; Download via Blob-URL | Sektion + alle CSR-/Prefill-Funktionen + IIFEs aus Script-Block weglassen; Schritt-Texte + API-Pfad (`/api/cert-csr/`) anpassen |
| **SSH-Backup-Manager** (Dashboard) | Liste + Erstellen + Restore von System-Backups über einen SSH-Proxy; Restore mit Confirmation-Dialog | `<section id="system-backups">` mit `.backup-list`, CSS `/* === Baustein: SSH-Backup-Manager === */`, `loadSystemBackups()`/`createSystemBackup()`/`renderBackupList()`/`restoreBackup(name)` im Script-Block; setzt **Confirmation-Dialog** voraus; Proxy-URL aus sessionStorage (`proxy_url`); **kein eigenes Auth** — Proxy übernimmt SSH | Sektion + Script-Teil weglassen; Proxy-Endpunkte `GET /backups`, `POST /backup`, `POST /restore` an eigenes System anpassen |
| **Zertifikatsüberwachung** (Dashboard) | Ablaufdaten von TLS-Zertifikaten als Tabelle mit Ampel-Färbung; optionales Live-Prüfen via Proxy; 📜-Button je Zeile springt zum CSR-Generator und befüllt CN/SAN | `<section id="cert-monitor">` mit `.cert-table-wrap`/`.cert-table`, CSS `/* === Baustein: Zertifikatsüberwachung === */`, Rendering-Code in IT-Dashboard-IIFE (`D.certificates[]`), `checkCert(btn)` + `csrFromCert(id)` global (kommt aus **Multi-Step-Wizard**-Block); Proxy-Endpunkt `GET /cert-check?host=HOST&port=PORT` → `{days_remaining:N}`; Schwellwerte: crit < 14 Tage, warn < 30 Tage | Sektion + Rendering-Code + `checkCert` weglassen; `csrFromCert`-Aufruf entfällt automatisch mit dem Rendering-Code; `certificates`-Feld in data.js bleibt harmlos |

**Wichtige Klarstellung zur „keine Klassen löschen"-Regel:** Ungenutzte CSS-Klassen bleiben immer im `<style>`-Block — sie sind der Werkzeugkasten und kosten nichts. Aktiv entfernt wird beim Zuschneiden nur **Markup** (Sektionen, Buttons) und ggf. der zugehörige **Script-Block**. Die Script-Blöcke sind genau dafür nummeriert bzw. per HTML-Kommentar benannt und unabhängig: Blöcke 1/3/5 sind Kern, alle anderen sind je nach Projekt verzichtbar (Details im Abschnitt „JavaScript-Muster").

## Projektstart — diese Fragen zuerst stellen

**Anweisung an Claude:** Wenn aus diesem Blueprint ein neues Projekt entsteht, **zuerst fragen, dann bauen**. Die Antworten entscheiden über Bausteine, Design und Struktur — und ersparen späteres Umbauen. Nicht alle Fragen auf einmal stellen (max. ~4 pro Runde, Wichtigstes zuerst); Offensichtliches aus dem Projektauftrag nicht erneut abfragen. Die Antworten anschließend als ausgefüllten Steckbrief in die Projekt-CLAUDE.md übernehmen.

**1. Thema & Nutzer**
- Worum geht es, und was soll ein Besucher auf der Seite erledigen können (nachschlagen, vergleichen, planen, abhaken)?
- Wer nutzt die Seiten (nur du / Familie / Team / öffentlich) und vorwiegend auf welchem Gerät (Desktop, Handy, Tablet)?
- Werden die Seiten lokal per `file://` geöffnet oder gehostet? (Beeinflusst localStorage-Verhalten und Link-Strategie.)

**2. Struktur**
- Welche Kategorien gibt es → werden das die Tabs der Index? Wie viele? (Bei nur einer Kategorie: Tab-Baustein weglassen.)
- Wie viele Detailseiten sind zum Start geplant, und wachsen sie über die Zeit? (Beeinflusst Statusmodell `ready`/`wip` und die Schnellauswahl-Box.)
- Gibt es einen „aktuellen/gebuchten/aktiven" Eintrag, der grün hervorgehoben werden soll (`current`)?

**3. Design**
- Welche Farbwelt: Polar, Wald, Abend, Graphit, Terminal, Brutal, Material 3, Liquid Glass oder Orange — oder ein eigenes Design nach Vorbild? (Auswahlbox im Template zum Durchprobieren nutzen, dann fixieren.)
- Soll der Default Dark oder Light sein — oder die OS-Einstellung (aktuelles Verhalten)?
- Eigene Schrift oder Emoji-Favicon-Wunsch?

**4. Bausteine** (pro Baustein nur fragen, wenn das Thema es nahelegt)
- Gibt es Geo-Bezug (Orte, Anfahrten) → Google-Maps-Routen und/oder OSM-Ortskarten?
- Viele gleichartige Einträge → Live-Suche + Tag-Filter + Favoriten + Schnellauswahl-Box? Sollen Filter und aktiver Tab in der URL gespeichert werden (URL-State — sinnvoll wenn Links geteilt/bookmarkt werden)?
- Gibt es Abhakbares (Packliste, To-dos) → Checkliste? Bilder → Galerie (mit ←/→-Navigation)? Abläufe/Tagespläne → Timeline? Vergleichswerte → Balkendiagramm oder `rt`-Tabelle?
- Brauchen Inhalte zwei Sichten (z. B. Sonne/Regen, Einsteiger/Profi, Sommer/Winter) → Zwei-Ansichten-Toggle, und wie heißen die Sichten?
- Werden Detailseiten-Sektionen direkt verlinkt (aus externen Quellen, per Teilen-Funktion) → Abschnitts-Permalinks aktivieren?
- Wird die Seite auf HTTPS gehostet (GitHub Pages, Netlify, …) → PWA-Baustein aktivieren (installierbar als App, Offline-Nutzung); `manifest.json`/`icon.svg`/`sw.js` anpassen und `PRECACHE`-Liste aktualisieren.
- Soll Infrastruktur oder System-Status überwacht werden → IT-Dashboard (`dashboard.html` + `data.js`); welche der 6 Sektionen werden gebraucht (Status-Matrix / Metrik-Karten / Log-Viewer / Inventar / Wartungsfenster / Incident-Timeline)? Wird `data.js` manuell gepflegt oder von einem Monitoring-Script erzeugt? (Script-Vorlage in `data.js` als Kommentar enthalten.)

**5. Inhalte**
- In welcher Sprache werden die Inhalte geschrieben?
- Gibt es externe Links/Quellen → alle per `curl` verifizieren; gibt es bekannte tote Domains aus Vorprojekten?
- Sind Termine/Events relevant → für welchen Zeitraum? (Wenn unbekannt: generisch schreiben und kennzeichnen.)
- Gibt es Personen-Profile mit Eignungs-Logik (wie ✓/~/✗-Spalten pro Person) — für wen, nach welchen Kriterien?

**6. Pflege & Rahmen**
- Einmaliges Projekt oder dauerhaft gepflegt? Wer pflegt es — wie ausführlich soll die Projekt-CLAUDE.md Konventionen festhalten?
- Ist Drucken/PDF ein echter Anwendungsfall? (Druckauswahl-Baustein erlaubt, Sektionen vor dem Drucken abzuwählen — sinnvoll bei langen Seiten.)
- Gibt es Barrierefreiheits-Anforderungen über den eingebauten Standard (ARIA, Reduced Motion, noscript) hinaus?
- Falls PWA aktiv: bei jeder neuen `.html`-Seite die `PRECACHE`-Liste in `sw.js` ergänzen und die `CACHE`-Versionsnummer erhöhen.

## Design-System

### CSS-Variablen (Dark = `:root`, Light via `html[data-theme="light"]`)

| Gruppe | Zweck |
|---|---|
| `--bg` … `--bg4` | Background-Ebenen (dunkel → hell; im Light-Mode invertiert) |
| `--bdr`, `--bdr2` | Borders (normal / kräftiger) |
| `--tx` … `--tx3` | Text (primär → muted) |
| `--blue / -teal / -green / -amber / -coral / -purple` | Akzentfarben, je mit `-bg` (Flächen), `-dim` (Badges), `-bdr` (Ränder) |
| `--ok` / `--no` / `--maybe` | Status-Semantik (teal / coral / amber) |

**Regel:** Niemals Hex-Farben direkt im Markup — immer Variablen, sonst bricht der Light-Mode. Einzige Ausnahme: die Sonnen-Gelbtöne (`#FFD84D`/`#2a1f00`) der Toggle-Buttons, die eigene Light-Overrides haben.

### Layout-Grundwerte (auf allen Seiten exakt gleich)

```css
body{max-width:min(1200px,92vw);margin:0 auto;padding:1.25rem clamp(1rem,4vw,2rem);}
```

Wrapper-Divs im Body **nie** mit eigenem `max-width`/`padding` versehen — nur `margin`. Der Body übernimmt die Zentrierung.

### Typografie & Kopf-Boilerplate

- **Google Fonts** im `<head>` vor `<style>`: 2× `preconnect` + Plus-Jakarta-Sans-`<link>` (kein `@import`). Fallback-Stack: `'Plus Jakarta Sans',system-ui,-apple-system,sans-serif`.
- **Favicon**: Emoji-SVG-Data-URL-Zeile nach `</title>` — kein separates Icon-File nötig, Emoji pro Projekt wählen.
- **Semantik**: Seitentitel ist `<h1 class="hero-title">`, jede Sektion `<h2 class="sec-title">`. Ein `h1,h2{margin:0;font:inherit}`-Reset macht die Heading-Tags layoutneutral.
- **Fließtext 13px** (body + Prosa-Klassen); Badges, Tabellen, Chips bleiben 11–12px.

### CSS-Blöcke & Marker

Der `<style>`-Block ist in markierte Abschnitte gegliedert. Die Marker-Kommentare dienen als Idempotenz-Check bei Script-gestützten Masse-Edits („ist der Patch schon drin?") — bei neuen Seiten **komplett** aus dem Template übernehmen, nie teilweise:

| Marker | Inhalt |
|---|---|
| (Basis, ohne Marker) | Variablen, Reset, Komponenten-Klassen, Light-Override |
| `/* === Designs (Farbwelten) === */` | `.design-select` + die Dark/Light-Paletten aller Designs außer Polar (siehe Abschnitt „Designs") |
| `/* === Design-Verbesserungen === */` | Body-Font, smooth scroll, Scrollbar-/Selection-Styling, Card-Schatten + Hover, Hero-Gradient |
| `/* === Semantik & Lesbarkeit === */` | `h1,h2`-Reset, Fließtext 13px, `.toc`-Chips |
| `/* === Karten-Embeds === */` | `.map-embed`, `.map-embed.tall`, `.lb-btn` |
| `/* === Fold & fixierter Zurück-Button === */` | `.fold-btn`, `.folded`, fixierter `.back-btn`, `body{padding-top:3.4rem}` |
| `/* === Baustein: … === */` | Je ein Marker pro optionalem Baustein — einzeln kopierbar. Index: Filter & Favoriten · Seitenübergreifende Suche · Vergleichsansicht · Sortierung · Entscheidungsbaum · Daten Export/Import. Detail: Checkliste · Galerie & Lightbox · Timeline · Balkendiagramm · Back-to-top · Tabellen-Sortierung · Termin-Intelligenz · Notizen · FAQ · Daten Export/Import. Dashboard: IT-Dashboard — Status-Matrix · IT-Dashboard — Metriken · IT-Dashboard — Log-Viewer · IT-Dashboard — Inventar · IT-Dashboard — Wartungsfenster · IT-Dashboard — Incident-Timeline · Zertifikatsüberwachung · API-Connector · Toast-Notifications · Confirmation-Dialog · Editierbare Datentabelle · Multi-Step-Wizard · SSH-Backup-Manager |
| `/* === Reduced Motion === */` | Schaltet smooth scroll und alle Transitions/Animationen ab, wenn der Nutzer `prefers-reduced-motion` gesetzt hat |
| `/* === Print === */` | Druck-Stylesheet (siehe eigener Abschnitt unten) — **muss letzter Block bleiben** |

## Light/Dark-Mode — drei Pflichtteile pro Seite

Button fixed oben rechts (`id="theme-btn"`, `☀️` = aktuell Dark, `🌙` = aktuell Light). Bei neuen Seiten alle drei Teile aus einer bestehenden Seite übernehmen:

1. **CSS**: `:root` = Dark-Werte; Light-Override unter `html[data-theme="light"]`. Zusätzlich `<meta name="color-scheme" content="dark light">` im `<head>` — damit rendern native Browser-Elemente (Scrollbalken, Formularelemente) im jeweiligen Modus korrekt.
2. **Anti-Flicker**: Inline-`<script>` im `<head>` setzt `data-theme` **vor** dem ersten Render. Priorität: **URL-Param > localStorage > OS-Einstellung (`prefers-color-scheme`) > Dark**. Erstbesucher bekommen also das Theme ihres Betriebssystems; sobald sie einmal togglen, gewinnt localStorage.
3. **Toggle + Link-Interceptor** (vor `</body>`): `toggleTheme()` schaltet um und persistiert in localStorage. Der Klick-Interceptor hängt an jeden internen `.html`-Link `?theme=<aktuell>` an. Das Button-Icon wird beim Laden aus dem `data-theme`-Attribut initialisiert (nicht aus localStorage — das wäre bei URL-Param-Übergabe falsch).

## Designs (Farbwelten) — zweite Theming-Achse

Neben `data-theme` (dark/light) trägt das `<html>`-Tag die Achse **`data-design`** (Farbwelt). Jedes Design definiert eine komplette Variablen-Palette für Dark **und** Light — alle Komponenten bleiben unverändert, nur die Variablen wechseln. Vier Farbwelten sind enthalten (CSS-Marker `/* === Designs (Farbwelten) === */`):

| Design | `data-design` | Charakter | Dark-Basis | Light-Basis |
|---|---|---|---|---|
| **Polar** (Standard) | `polar` (bzw. Attribut weglassen) | kühles Blau, Slate-Töne — die Original-Palette | `#0f1117` Nachtblau | `#f5f7fb` Blaugrau |
| **Wald** | `wald` | grün-erdig, gedeckte Naturtöne | `#11150f` Tannengrün | `#f3f6ee` Papiergrün |
| **Abend** | `abend` | warmes Terracotta, Sonnenuntergangstöne | `#171110` Warmbraun | `#faf4ef` Creme |
| **Graphit** | `graphit` | neutral, entsättigte Akzente, dezent | `#101012` Anthrazit | `#f5f5f7` Hellgrau |
| **Terminal** ⚡ | `terminal` | radikal: Monospace-Schrift, null Radien, keine Schatten, Phosphorgrün | `#0a0e0a` CRT-Schwarzgrün | `#f6f3ea` Papier-Terminal |
| **Brutal** ⚡ | `brutal` | radikal: null Radien, 2px-Rahmen in Akzentfarbe, harte Offset-Schatten | `#141414` Hartschwarz | `#ffffff` Weiß + schwarze Rahmen |
| **Material 3** | `material` | M3: Roboto-Typeface, lila Primärfarbe (primary80=#d0bcff/primary40=#6750a4), tonale Surfaces, M3-Shape-Scale (xl=28/lg=16/md=12/sm=8/xs=4px), M3-Elevation-Shadows, M3-Typescale (Body 14sp, Title Large 22sp/400, Label 500wght), Buttons=pill/Chips=8px/Badges=pill, State Layer 8% auf Hover, Filled-Text-Field-Style, Material Symbols lazy-geladen (nur bei `design=material`) | `#141218` neutral6 | `#fffbff` neutral99 |
| **Liquid Glass** ⚡ | `glass` | Liquid Glass: Highlights+Shadows+Glow+Tint via `backdrop-filter:blur(24px) saturate(1.8)`, innerer Specular-Highlight im Shadow-Token, sehr runde Radien (xl=28/lg=22), Gradient-Body | `#1e0442` → `#04112e` → `#032a12` | `#ccd8f8` → `#ecdcfc` → `#baf0d8` |
| **Orange** | `orange` | Enterprise-Charcoal: neutrales Dunkelgrau (`#212326`) statt Navy, kräftiges Orange (`#ff7700`) als Primärfarbe (Dark); gedämpft zu `#8f4600` (WCAG AA ≥ 4,5:1) im Light-Mode; neutrale Grau-Borders, reduzierte Radien (xl=12/lg=10) | `#212326` Charcoal | `#f0f2f4` Hellgrau |

⚡ = nutzt die Struktur-Tokens (siehe unten) — Beleg, dass Designs weit über Farbwechsel hinausgehen können.

### Struktur-Tokens — was Designs außer Farben ändern dürfen

Alle gestalterischen Grundwerte sind als Variablen in `:root` definiert; Komponenten verwenden ausschließlich die Tokens. Ein Design darf sie überschreiben und damit den Charakter der Seite radikal ändern:

| Token | Default | Zweck |
|---|---|---|
| `--font-body` | Plus Jakarta Sans + System-Fallback | Schriftfamilie der ganzen Seite (Terminal: Monospace-Stack) |
| `--r-xl/-lg/-md/-sm/-xs/-pill` | 16/12/10/8/6/999 px | Eckenradien aller Komponenten (Terminal/Brutal: alle 0) |
| `--bw` | 1px | Rahmenstärke aller Borders (Brutal: 2px) |
| `--shadow` / `--shadow-hover` / `--shadow-lift` | weiche rgba-Schatten (Light-Mode: schwächer, via Default-Light-Block) | Card-/Hover-Schatten (Terminal: `none` · Brutal: harte Offset-Schatten `4px 4px 0 …`) |

Regeln dazu: **Nie** Radien/Borders/Schriften wieder hart in Komponenten codieren — neue Komponenten verwenden die Tokens. Designs, die Struktur-Tokens im Dark-Block setzen, müssen sie (Pflichtregel oben) auch im Light-Block setzen. Bewusst **nicht** tokenisiert: 4–5px-Mikro-Radien (Mini-Badges, Scrollbar) und die 50%-Kreise (Back-to-top, Timeline-Punkte) — sie sollen in jedem Design rund bzw. unverändert bleiben.

**Mechanik & Regeln:**
- `polar` ist die `:root`-/Default-Light-Palette und hat keinen eigenen Block. Jedes weitere Design besteht aus zwei Blöcken: `html[data-design="X"]{…}` (Dark) und `html[data-design="X"][data-theme="light"]{…}` (Light).
- **Pflichtregel**: Der Light-Block eines Designs muss **alle** Variablen neu setzen, die sein Dark-Block setzt — sonst „blutet" der Dark-Wert in den Light-Mode durch (der Dark-Block hat dieselbe Spezifität wie der Default-Light-Block und steht später im Stylesheet).
- Designs setzen `--ok/--no/--maybe` als `var()`-Referenzen auf ihre teal/coral/amber-Töne — die Status-Semantik (✓/~/✗) folgt damit automatisch der Palette.
- Die Sonne/Regen-Sonderfarben des Ansicht-Toggles und der **Print-Block** (druckt immer in der Polar-Light-Palette — deterministische Druckausgabe) sind bewusst designunabhängig.
- Designs ändern Farben **und** Struktur-Tokens (Schrift, Radien, Rahmenstärke, Schatten — siehe Tabelle unten), aber nie Komponenten-Markup oder parallele Klassen.

**Im Template (Vorschau-Modus):** Auswahlbox `.design-select` neben dem Theme-Toggle; Auswahl wird in localStorage (`design`) persistiert und per `?design=`-URL-Param an interne Links weitergegeben (gleiche `file://`-Begründung wie beim Theme). Anti-Flicker-Priorität: URL-Param > localStorage > `polar`.

**In fertigen Projekten (Design fixieren):** Das Design wird zu Projektbeginn festgelegt und die Auswahlbox existiert nicht. Vorgehen auf jeder Seite:
1. `data-design="<name>"` fest ins `<html>`-Tag schreiben (bei `polar`: Attribut einfach weglassen),
2. die drei mit `DESIGN-AUSWAHL (nur Template)` kommentierten Stellen entfernen: das `<select>` im Body, die zwei Design-Zeilen im Anti-Flicker-Script und den `&design=`-Teil im Link-Interceptor (inkl. `setDesign()`/Select-Init im Theme-Block),
3. optional die ungenutzten Design-Blöcke aus dem CSS löschen — sie sind als zusammenhängende, kommentierte Blöcke dafür ausgelegt (Ausnahme von der „CSS nie löschen"-Regel, weil ganze markierte Blöcke, keine Einzelklassen).

**Neues Design anlegen:** Beide Blöcke (Dark + Light) eines bestehenden Designs kopieren, `data-design`-Namen ändern, Werte anpassen, als `<option>` in die Template-Auswahlbox eintragen — und **auf allen Seiten identisch** einfügen. Kontrast grob prüfen: `--tx` auf `--bg2` und Akzentfarbe auf zugehörigem `-bg`/`-dim` müssen lesbar bleiben (Richtwert WCAG AA, Kontrast ≥ 4,5:1 für Fließtext).

**Warum der Link-Interceptor?** Bei `file://` isolieren Firefox/Safari den localStorage pro Datei — ohne Theme-Weitergabe per URL-Param würde jede Seite mit ihrem eigenen (ggf. abweichenden) Theme öffnen. Der Interceptor ignoriert externe Links (`https:`, `mailto:`), reine Anker-Links und Links, die schon `?theme=` tragen.

## PWA / Offline-Baustein

Funktioniert **nur auf HTTPS** (GitHub Pages, Netlify, eigener Server) — bei `file://` wird der Service Worker per Check übersprungen, nichts bricht.

**Drei Pflichtdateien im Projektstamm:**
- `manifest.json` — App-Metadaten. Bei Projektstart anpassen: `name`, `short_name`, `description`, `background_color`, `theme_color`.
- `icon.svg` — App-Icon; durch ein projektspezifisches Icon ersetzen. Ein SVG-Icon mit `"sizes":"any"` deckt alle Browser-Anforderungen ab.
- `sw.js` — Service Worker. **Zwei Stellen pflegen**: `CACHE`-Version erhöhen (`'bp-v1'` → `'bp-v2'` usw.) nach jeder Inhaltsänderung, damit alle Clients das Update erhalten; `PRECACHE`-Liste aktualisieren wenn neue `.html`-Seiten hinzukommen.

**Pro HTML-Seite drei Zeilen:**
1. `<link rel="manifest" href="manifest.json">` nach dem Favicon-Link im `<head>`
2. `<meta name="theme-color" content="#0f1117" id="theme-color-meta">` danach (Farbe = Dark-Hintergrund)
3. In `toggleTheme()`: `var mc=document.getElementById('theme-color-meta');if(mc)mc.content=n==='light'?'#f5f7fb':'#0f1117';` — hält die Browser-Chrome-Farbe mit dem Theme synchron.
4. Am Ende des Theme-Script-Blocks: `if('serviceWorker' in navigator && location.protocol !== 'file:')navigator.serviceWorker.register('sw.js',{updateViaCache:'none'});` — `updateViaCache:'none'` ist wichtig: ohne diese Option cached der Browser `sw.js` selbst per HTTP-Cache und erkennt neue Versionen nicht zuverlässig.

**SW-Strategie**: Cache-First mit dynamischer Befüllung — bekannte Seiten werden vorab gecacht (`PRECACHE`), unbekannte beim ersten Abruf ergänzt. `skipWaiting` + `clients.claim()` sorgen dafür, dass Updates sofort aktiv werden.

**⚠ Wichtig — Cache-Busting bei jedem Deploy**: Der SW bedient alle Requests Cache-First. Ohne Versions-Bump sehen Besucher nach einem Push weiterhin die alte Version, bis sie den Browser-Cache manuell leeren. **Regel: bei jedem Commit/Push, der Inhalte ändert, die `CACHE`-Konstante in `sw.js` erhöhen** (`'bp-v1'` → `'bp-v2'` → …). Erst dann erkennt der Browser beim nächsten Seitenaufruf, dass ein neuer Service Worker vorhanden ist, und lädt alle Seiten frisch.

**Architektur-Ausnahme**: `sw.js`, `manifest.json` und `icon.svg` sind die einzigen Nicht-HTML-Dateien neben `search-index.js` und `data.js` — sie sind Web-Standards, keine Hilfsskripte, und müssen im Projektstamm liegen.

## Tab-Navigation (nur Index)

- `.tabs` > `.tab`-Buttons rufen `show(id,btn)` auf; Inhalte liegen in `.page`-Divs mit `id="p-<kürzel>"`, sichtbar via `.page.on`.
- **Tab-Rücksprung per `?tab=` URL-Param**: Detailseiten verlinken zurück mit `index.html?tab=<kürzel>`; ein Init-Block auf der Index liest den Param und aktiviert den passenden Tab — sonst landet man nach „Zurück" immer auf dem ersten Tab. Der Link-Interceptor hängt das Theme korrekt mit `&theme=` an (er prüft, ob schon ein `?` in der URL ist). **Bei jeder neuen Detailseite das `?tab=` im Zurück-Button mitgeben.**
- **Mobile**: `@media (max-width:760px)` lässt die Tab-Leiste umbrechen (`flex-wrap:wrap`, Einzelbuttons mit eigenem Rahmen). Ohne diesen Block werden Tabs im Hochformat abgeschnitten (`overflow:hidden` + `min-width:auto` der Flex-Items) — **nicht entfernen**.
- Die Index hat **keine** TOC — die Tabs übernehmen die Navigation.

## Einklappbare Sektionen (Fold-System)

Alle Top-Level-Sektionen (`.sec`) sind einklappbar:

- Inhalt nach der `.sec-hd` in `<div class="sec-body" id="<sec-id>-body">` wrappen (Sektionen ohne eigene `id`: fortlaufend `secbody-N`).
- Rechts in der `.sec-hd` ein `.fold-btn` — **nur Pfeil** als Inhalt (`▾` offen / `▸` zu); `toggleFold(id,btn)` animiert `.sec-body` per `max-height`-Transition (0.28s ease) + Opacity (0.22s ease) und tauscht den Pfeil.
- **Animation**: `.sec-body` hat `overflow:hidden` + CSS-Transition; `.sec-body.folded` überschreibt `display:none` mit `display:block !important; max-height:0 !important; opacity:0`. `toggleFold` misst die echte Höhe via `scrollHeight`, setzt sie als Inline-`max-height` und animiert. Auf der **Index** sind auch `.prefs` und `.eh-grid` in derselben CSS-Transition definiert und bekommen dieselbe max-height-Animation — dort hat `toggleFold` keine `sec-body`-Unterscheidung. Auf **Detailseiten** und dem **Dashboard** fällt `toggleFold` für Nicht-`.sec-body`-Elemente auf `display:none/block`-Toggle ohne Animation zurück (die `if(!el.classList.contains('sec-body'))`-Abfrage greift dort, trifft in der Praxis aber nie, da alle Fold-Targets `.sec-body`-Elemente sind). Print-Block setzt `.sec-body.folded{max-height:none !important;opacity:1}` und analog `.prefs.folded,.eh-grid.folded` — gedruckt werden alle Sektionen aufgeklappt. `prefers-reduced-motion` schaltet die Transition ab (globale `*{transition:none !important}`-Regel im Reduced-Motion-Block).
- **Defaults**: Neue Sektionen starten offen (`▾`, ohne `folded`). Eingeklappt starten nur „Nachschlage-Sektionen" (Detailinfos, die man selten braucht). Auf der Index: alles eingeklappt außer den Haupt-Karten-Sektionen.
- **Kein localStorage für Sektions-Fold** — nur die beiden Index-Kästen (`#prefs`, `#eh-grid`) merken sich ihren Zustand (`fold-<id>`-Keys). Wichtig gegen Aufblitzen: deren Default ist **eingeklappt direkt im Markup** (`folded`-Klasse), das Init-Script klappt nur auf, wenn localStorage explizit `'0'` enthält. Das Init-Script sucht den zugehörigen Button über `data-fold="<id>"` — dieser Wert muss daher auf dem `.fold-btn` gesetzt sein (spiegelt `aria-controls`, ist aber ein separates Attribut).
- **TOC-Integration**: Ein Klick auf einen TOC-Chip klappt die Ziel-Sektion automatisch auf (Listener im Fold-Script).

## Sprungleiste (TOC, nur Detailseiten)

Einzeilige `<nav class="toc">` vor der ersten Sektion, ein Chip `<a href="#slug">emoji Kurztitel</a>` pro Sektion. Sektions-`id` = Kebab-Case-Slug (Umlaute transliteriert, lange Titel vor dem Gedankenstrich gekürzt). Der Link-Interceptor ignoriert Anker-Links — kein Konflikt mit der Theme-Weitergabe.

## Google-Maps-Routenkarten ohne API-Key

Keyless über das inoffizielle `output=embed`-Format — funktioniert auch bei `file://`:

1. **Anreise-/Übersichtskarte**: eigene Sektion direkt nach der TOC, iframe `maps.google.com/maps?saddr=<START>&daddr=<ZIEL>&output=embed` in `.map-embed.tall`, plus Tip-Box mit „In Google Maps öffnen"-Link. Erster TOC-Chip zeigt darauf.
2. **Routen-Buttons**: Hinter jedem `?q=`-Maps-Link ein `<button class="lb lb-btn" data-dest="<q-Wert>" onclick="showRoute(this)">🚗 Route</button>`. Klick blendet die Route Basisort→Ziel als iframe ein (Toggle: zweiter Klick entfernt sie). **Kein iframe lädt vor dem Klick** — Ladezeit! `?cid=`-Maps-Links (feste Place-IDs) bekommen keine Buttons, da `data-dest` einen Suchstring braucht.
3. **JS**: `var MAP_ORIGIN='<Basisort>'` + `showRoute(btn)` im Karten-Script-Block.
4. Einträge ohne navigierbares Einzelziel (Aktivitäten, Kategorien, Punkte innerhalb eines Geländes) bekommen bewusst keine Buttons.

**Fallback-Hinweis**: Das keylose Embed ist inoffiziell — sollte Google es abschalten, bleiben die 📍-Maps-Links funktionsfähig. Embeds folgen nicht dem Dark Mode und zeigen ggf. einmalig einen Cookie-Hinweis.

## Barrierefreiheit & Robustheit (Pflichtteile jeder Seite)

- **Fold-Buttons** tragen `aria-controls="<sec-body-id>"` + `aria-expanded="true|false"` passend zum Startzustand; `toggleFold()` pflegt `aria-expanded` bei jedem Klick mit (auch das Fold-Init-Script der Index). So wissen Screenreader, was der Pfeil-Button tut und ob die Sektion offen ist.
- **Tabs** (Index): `.tabs` hat `role="tablist"`, jeder `.tab`-Button `role="tab"` + `aria-selected`; die `.page`-Container `role="tabpanel"`. `show()` pflegt `aria-selected` mit.
- **Zwei-Ansichten-Toggle** (Detailseiten): `.wtab`-Buttons tragen `aria-pressed`; `setW()` pflegt es mit.
- **Theme-Button** hat ein `aria-label` (das Emoji allein ist nicht vorlesbar).
- **`<noscript>`-Fallback** im `<head>` (nach dem `<style>`-Block, damit er gewinnt): Ohne JavaScript werden alle `folded`-Sektionen und alle `.page`-/`.wsec`-Inhalte sichtbar; funktionslose Bedienelemente (Fold-Buttons, Tabs/Toggle, Theme-Button, Route-Buttons) werden ausgeblendet. Die Seiten bleiben so vollständig lesbar.
- **`prefers-reduced-motion`**: eigener CSS-Block schaltet smooth scroll und Transitions ab.

## Print-Stylesheet (`/* === Print === */`, letzter CSS-Block)

Jede Seite ist druckbar (Strg+P), unabhängig vom aktiven Theme:

- Die `:root`-Variablen werden im Print-Block mit der **Light-Palette** überschrieben (der Block steht nach der Dark-Definition und gewinnt daher auch bei `data-theme="dark"`).
- **Ausgeblendet**: Theme-Button, Zurück-Button, Fold-Buttons, TOC, Tabs/Ansicht-Toggle, Route-Buttons, Karten-iframes (drucken nicht zuverlässig — die 📍-Links stehen ja im Text).
- **Aufgeklappt**: alle `folded`-Sektionen, alle Tab-`.page`s und beide `wsec`-Ansichten — gedruckt wird immer der komplette Inhalt. FAQ-`<details>` lassen sich nicht per CSS öffnen — dafür öffnet ein `beforeprint`-Helfer in Script-Block 6 alle Einträge und setzt sie nach dem Druck zurück.
- Interaktive Baustein-Elemente (Suchfeld, Filterbar, Sortier-Select, Entscheidungsbaum-Buttons, Vergleichs-Overlay, Daten-Leiste, Notiz-Status) sind im Druck ausgeblendet; das Notiz-Textfeld druckt seinen Inhalt mit.
- `break-inside:avoid` auf Cards/POIs/Kacheln/Tabellenzeilen verhindert zerschnittene Kästen am Seitenumbruch; Schatten sind entfernt.
- **Reihenfolge wichtig**: Der Print-Block muss der letzte CSS-Block bleiben, damit sein `.folded{display:block !important}` das `display:none !important` des Fold-Blocks überstimmt (gleiche Spezifität → letzter gewinnt). Für animierte `.sec-body.folded`-Elemente ergänzt der Print-Block zusätzlich `max-height:none !important;opacity:1` — sonst bleiben sie trotz `display:block` auf Höhe 0 und unsichtbar.

## Wiederverwendbare Klassen (Katalog)

- `.hero` — Seitenkopf (blau + Gradient) mit `.hero-title` (h1), `.hero-sub`, `.meta-row`
- `.sec` / `.sec-hd` / `.sec-sym` / `.sec-title` — Sektionen (kein Kasten; `.div`-Trennlinien dazwischen) · `.sub` — Zwischen-Label in Versalien
- `.b` / `.b-{blue|teal|green|amber|coral|purple|gray}` / `.b-sm` — Badges
- `.lb` / `.lb-{blue|teal|amber|green|coral}` — Link-Buttons · `.lb-btn` — als `<button>` (Route-Toggle)
- `.tip` / `.tip-{blue|teal|amber|coral|green}` — Hinweiskästen mit `.s`-Symbol-Span
- `.card` / `.card.hl` (teal = Highlight) / `.card.hl2` (amber = zweite Wahl) mit `.card-hd`/`.card-name`/`.card-dist`/`.card-body`/`.price-row`(`.plabel`+`.pval`)/`.links`
- `.grid` / `.info-grid` — auto-fit-Grids · `.ig-item` mit `.ig-label`/`.ig-val`/`.ig-note` — kompakte Info-Kacheln
- `.cityguide` > `.cg-title` + `.cg-intro` + `.poi-list` — Pflichtmuster für Guide-Sektionen
- `.poi-list` / `.poi` / `.poi.hl` mit `.poi-sym`/`.poi-name`/`.poi-desc`/`.poi-tags`/`.poi-links`
- `.evlist` / `.ev` / `.ev-hl` — Termin-/Ereignislisten: Datum `.edate` (blau) bzw. `.edate.edate-t` (teal), Inhalt `.einfo` > `.ename`+`.edetail`, optional `.nbdg`-Mini-Badge. **Exakte Namen beachten**: `evlist`, `edate`, `ename` — *nicht* `ev-list`, `ev-date`, `ev-name` (häufiger Tippfehler, rendert dann unstyled).
- `.rt-wrap` / `.rt` — Vergleichstabelle (Format siehe unten) mit `.rn`/`.rm`/`.stars`
- `.specgrid` > `.sc` mit `.sc-sym`/`.sc-name`/`.sc-desc`/`.sc-price`/`.sc-wife` (Eignungszeile, Klasse `ok`/`no`/`mb`) — **ein Wort** `specgrid`, nicht `spec-grid`
- `.ti-wrap` / `.ti-grid` / `.ti-item` mit `.ti-label`/`.ti-val`/`.ti-note` — Key-Value-Infos (Kosten, Eckdaten)
- `.lang-wrap` / `.lang-table` — Begriffs-/Übersetzungstabelle: Zellen `.lang-kw` (Schlüsselbegriff, teal) / `.lang-de` / `.lang-pr` (Zusatz, kursiv)
- `.wtoggle` / `.wtab` / `.wsec` — Segmented-Control mit zwei Ansichten (Original: Sonne/Regen; generisch: Ansicht A/B)
- `.solo` / `.solo-hd` — hervorgehobener Einzelkasten (amber)
- `.theme-toggle` · `.toc` (nur Detailseiten) · `.back-btn` (fixiert oben links) · `.fold-btn` / `.folded`
- Nur Index: `.tabs`/`.tab`/`.page` · `.park-grid`/`.plink`/`.pcard` (+ `.hl`/`.hl2`/`.current`) mit `.pc-top`/`.pc-name`/`.pc-op`/`.pc-tags`/`.pc-body`/`.pc-footer`/`.pc-drive`/`.pc-action`(`.ready`/`.wip`) · `.drive-{g|a|c}` (Ampel-Badges) · `.prefs`/`.pref` · `.eh-*` (Schnellauswahl-Box)
- Baustein Filter & Favoriten (Index): `.filterbar` > `.fsearch` + `.tagchip`(`.on`) · `.fav-btn` (☆/⭐, `aria-pressed`) · `.filter-empty` (Leer-Zustand)
- Baustein Checkliste: `.checklist` (li > label > input`[data-ck]` + span) · `.cl-progress`/`.cl-bar`/`.cl-count`
- Baustein Galerie: `.gallery` > `.g-item` (button mit img + `data-cap`) · `#lightbox` mit `.lb-cap`/`.lb-close`
- Baustein Timeline: `.timeline` > `.tl-item`(`.hl`) mit `.tl-dot`/`.tl-time`/`.tl-body`>`.tl-name`+`.tl-desc`
- Baustein Balkendiagramm: `.bars` > `.bar-row` mit `.bar-label` + `.bar-track`>`.bar-fill`(`.teal`/`.amber`)
- Baustein Back-to-top: `.totop`(`.show`)
- Baustein Suche (Index): `.ss-wrap` > `#sitesearch` (nutzt `.fsearch`-Styling) + `.ss-results` mit `.ss-hit`>`.ss-title`+`.ss-desc` / `.ss-none`
- Baustein Vergleichsansicht (Index): `#cmpbtn` (tagchip) · `.cmp-overlay`(`.on`) > `.cmp-panel` > `.cmp-title` + `.cmp-table`
- Baustein Sortierung: `.fsort` (Select, Index) · `th[onclick]`-Cursor auf `.rt` (Detail)
- Baustein Entscheidungsbaum (Index): `.dt-q` > `.dt-opt`(`.on`) · Karten-Markierungen `.pcard.dt-hit` / `.pcard.dt-dim`
- Baustein Termin-Intelligenz (Detail): `.ev-past` (gesetzt per JS) · `#countdown`-Badge
- Baustein Notizen (Detail): `.notes-area` (Textarea) + `.notes-status`
- Baustein FAQ (Detail): `details.faq` > `summary` + `.faq-a`
- Baustein Daten Export/Import: `.data-tools` (Leiste mit `.lb`-Buttons + hidden `#imp-file`)
- IT-Dashboard — Status-Matrix: `.sm-wrap` > `.sm-group`(`.sm-group-label` + `.sm-row`*) · `.sm-dot`(`.ok`/`.warn`/`.crit`/`.unknown`) · `.sm-name` · `.sm-msg` · `.sm-uptime`(`.ok`/`.warn`/`.crit`) · `.sm-spark-cell` > SVG
- IT-Dashboard — Metrik-Karten: `.metric-grid` > `.metric-card` mit `.metric-name`/`.metric-val`/`.metric-unit`/`.metric-spark`(SVG)/`.metric-bar-wrap`>`.metric-bar`(`.warn`/`.crit`)
- IT-Dashboard — Log-Viewer: `.log-toolbar` > `.log-chip`(`.on`) + `#log-search` + `.log-count` · `.log-table-wrap` > `.log-table` mit `.log-ts`/`.log-level`(`.CRIT`/`.ERROR`/`.WARN`/`.INFO`/`.DEBUG`)/`.log-src`/`.log-msg` · `#log-more-wrap` > `#log-more-btn`
- IT-Dashboard — Inventar: `.inv-grid` > `.inv-item`(`.ok`/`.warn`/`.crit`/`.unknown`) mit `.inv-header`(`.inv-name`+`.inv-role`)/`.inv-details`>`.inv-kv`*
- IT-Dashboard — Wartungsfenster: `.maint-list` > `.maint-item`(`.planned`/`.running`/`.completed`/`.cancelled`) mit `.maint-dot`/`.maint-body`(`.maint-title`+`.maint-meta`+`.maint-note`+`.maint-services`)/`.maint-status`
- IT-Dashboard — Incident-Timeline: `.incident-list` > `.incident-item`(`.open`/`.crit`/`.warn`) mit `.inc-row`(`.inc-title`+Badges)/`.inc-meta`/`.inc-note`/`.inc-services`/`.inc-bar-row`>`.inc-bar-wrap`>`.inc-bar`(`.open`/`.crit`/`.warn`)
- Baustein API-Connector: `.api-form` (Grid-Label-Input-Layout) · `.api-dot`(`.ok`/`.err`) · `.api-msg` · `.api-status`
- Baustein Toast-Notifications: `#toast-container` > `.toast`(`.toast-ok`/`.toast-err`/`.toast-info`/`.toast-hide`) — `showToast(msg,type)` global
- Baustein Editierbare Datentabelle: `.edt-toolbar` · `.edt-wrap` > `.edt-table`(`th`/`td`) · `.ep-attr-input` · `.edt-empty`
- Baustein Multi-Step-Wizard: `.wiz-indicator` > `.wi-col`(`.wi-dot`(`.wi-active`/`.wi-done`)+`.wi-label`) + `.wi-line` · `.wiz-step`(`.wiz-active`) · `.wiz-import`(`.wiz-import-label`+`.wiz-import-sep`+`.wiz-import-file`+`.wiz-import-select`) · `.wiz-fields`(Labels+Inputs) · `.wiz-required-note` · `.wiz-csr-out` · `.wiz-nav`
- Baustein Confirmation-Dialog: `.confirm-overlay`(`.on`) > `.confirm-panel` > `.confirm-header`(`.confirm-icon`+`.confirm-title`) + `.confirm-body` + `.confirm-actions`(`.lb`-Buttons) — `showConfirm({icon,title,body,okLabel,okClass,callback})` global; `confirmDialog(msg,cb)` als Alias
- Baustein Leer-Zustand: `.empty` > `.ei` (Emoji-Icon, 2.25rem)
- Baustein Formular-System: `.form-section`(`.form-section-title`) · `.form-grid` > `.form-group`(`.full`) > `label`+`input`/`select`/`textarea`+`span` · `.form-row` · `.radio-group` > `label`>`input[type=radio]`+span
- Baustein Datentabelle: `.tbl-wrap` > `.tbl` (`thead`/`tbody`) mit `td.mono` · `td.actions` · `.tbl-empty`
- Baustein Bulk-Aktions-Leiste: `.bulk-bar`(`.bulk-count`+`.bulk-actions`) — `bulkToggle(cb)` / `bulkToggleAll(cb)` / `bulkClear()` global; Checkboxen `.bulk-cb[data-id]` in Tabellenzeilen + `id="bulk-select-all"` in `<th>`
- Baustein SSH-Backup-Manager: `.backup-list` > `.backup-item`(`.backup-name`+`.backup-date`+Button)
- Baustein Zertifikatsüberwachung: `.cert-table-wrap` > `.cert-table`(`th`/`td`) · `.cert-days`(`.ok`/`.warn`/`.crit`) · `.cert-check-btn`

### Status-Symbole & Vergleichstabellen (`.rt`)

Status-Spalten enthalten **nur zentrierte Symbole**: `<td style="text-align:center;"><span class="ok">✓</span></td>` (analog `.mb` → `~`, `.no` → `✗`). `th`-Breiten der Symbolspalten 8 %. Über jeder Tabelle eine Legende-Zeile (✓ geeignet · ~ eingeschränkt · ✗ eher nicht). Erläuterungen gehören in eine Hinweis-Spalte, **nie** in die Status-Zellen (sonst ungleiche Zeilenhöhen). Die Klasse heißt `.mb`, **nicht** `.maybe` (`--maybe` existiert nur als CSS-Variable).

### Karten-Hervorhebung auf der Index

`.pcard.hl` teal = Top-Empfehlung (**sparsam, max. 1–2 pro Tab!**) · `.pcard.hl2` amber = zweite Wahl · `.pcard.current` grün = aktiv/gebucht/aktuell · ohne Modifier = neutral. Status-Pille rechts unten: `.pc-action.ready` (fertig, einheitlicher Text mit `→`) vs. `.pc-action.wip` (in Arbeit). Karten ohne existierende Zieldatei **nicht verlinken** (nackte `.pcard` ohne `<a class="plink">`).

## JavaScript-Muster

Detailseiten haben **7 nummerierte Script-Blöcke** — bewusst getrennt, damit sie einzeln per Script ersetzbar sind:

1. **`<head>`** — Anti-Flicker (Theme aus URL-Param/localStorage/OS-Einstellung vor dem Render) — **Kern**
2. **Seiten-Funktion** — `setW(m)` (Zwei-Ansichten-Toggle) — *optional, gehört zum Toggle-Baustein*
3. **Theme-Script** — `toggleTheme()` + Link-Interceptor + Button-Icon-Init — **Kern**
4. **Karten-Script** — `MAP_ORIGIN` + `showRoute(btn)` — *optional, gehört zum Maps-Baustein*
5. **Fold-Script** — `toggleFold` + TOC-Aufklapp-Listener — **Kern**
6. **Bausteine-Script** — Checkliste, Lightbox, Back-to-top, Termin-Intelligenz, `sortRt` (Tabellen-Sortierung), Notizen, Druckauswahl, FAQ-Druckhelfer — *optional, nur die Teile übernehmen, deren Bausteine die Seite nutzt*
7. **Daten & Shortcuts** — `exportData`/`importData` + Tastatur-Shortcuts — *optional; identischer Block auf der Index*

Die Index hat die Kern-Blöcke 1 (Anti-Flicker), den show()-Block (`show(id,btn)` Tabs + `toggleFold` + Fold-Init + `?tab=`-Init) und den Theme-Block — dazwischen liegen die optionalen, per HTML-Kommentar benannten Baustein-Blöcke (in dieser Reihenfolge): **Filter & Favoriten** (`applyFilter` über `#filter-grid`-Kinder: Volltext + `data-tags` + Favoriten-Status; `toggleTag`; `toggleFav` mit Key `favs`), **Seitenübergreifende Suche** (`<script src="search-index.js">` + `siteSearch`), **Vergleichsansicht** (`updateCmpBtn`/`openCmp`/`closeCmp` + Esc-Listener), **Sortierung** (`applySort`, merkt sich die Original-Reihenfolge in `data-orig`), **Entscheidungsbaum** (`dtPick`/`dtReset`/`dtApply`), **Druckauswahl** (eigenständiger benannter Block, kein Nummer, `togglePrintCfg` + `beforeprint`/`afterprint`-Koordination), **Daten Export/Import + Tastatur-Shortcuts**. Querbezug: `toggleFav` ruft `updateCmpBtn` nur über einen `typeof`-Guard auf — die Vergleichsansicht lässt sich entfernen, ohne den Favoriten-Baustein anzufassen.

`dashboard.html` nutzt die Blöcke 1 (Anti-Flicker im `<head>`), 3 (Theme-Toggle), 5 (Fold + TOC), 6 (IT-Dashboard-IIFE mit allen sechs Sektions-Renderern) und 7 (Daten Export/Import + Shortcuts) — kein Block 2 (kein Zwei-Ansichten-Toggle) und kein Block 4 (kein Maps). Zusätzlich: eigener **Bulk-Aktions-Leiste**-Script-Block zwischen Block 6 und 7 (wenn der Baustein aktiv ist).

**Globale Hilfsfunktionen** (in allen Seiten verfügbar, im Daten-Export-Block / Script-Block 6 definiert): `downloadText(content, filename, mimeType)` — universelle Blob-Download-Funktion (funktioniert auch bei `file://`; wird von `exportData()` und `csrDownload()` genutzt). Im Dashboard zusätzlich: `statusBadge(label, statusMap)` — mappt Status-String auf Badge-HTML; `certDaysBadge(days)` — Ampel-Badge für Tage bis Zertifikatsablauf (crit < 14, warn < 30).

**localStorage-Keys im Überblick**: `theme` (Kern) · `design` (Farbwelt — nur Template-Vorschau) · `fold-<id>` (nur Index-Kästen) · `favs` (Favoriten-Array) · `ck-<data-ck>` (Checklisten-Punkte) · `note-<dateiname>` (Notizen pro Seite) · `ann-<key>` (Ankündigungs-Banner geschlossen) · `rating-<card-id>` (Sterne-Bewertung pro Karte, Index) · `ck-order-<list-id>` (Drag-&-Drop-Reihenfolge der Checkliste) · `calc-<feldname>` (Kalkulations-Widget-Felder). Für alle gilt die `file://`-Einschränkung: Firefox/Safari isolieren localStorage pro Datei — persistente Bausteine wirken dort nur innerhalb einer Seite; die Theme-Weitergabe löst das per URL-Param, für die übrigen Keys ist der **Daten-Export/Import-Baustein** der dokumentierte Ausweg (JSON-Datei sichern und auf der anderen Seite/dem anderen Browser einspielen).

Beim Zwei-Ansichten-Toggle (`setW`): Das CSS stylt `.wtab.on:first-child` (Ansicht 1, amber) / `.wtab.on:last-child` (Ansicht 2, blau) — **kein flaches `.wtab.on{}` einführen** und den ersten Button immer als ersten lassen.

## Neue Detailseite anlegen (Checkliste)

1. `detail.html` kopieren und umbenennen.
2. Kompletten CSS-Block behalten — **keine Klassen löschen**, auch wenn sie ungenutzt wirken (fehlendes CSS = stiller Renderfehler beim nächsten Edit).
3. `<title>`, Favicon-Emoji, `<h1 class="hero-title">` anpassen; `<a class="back-btn" href="index.html?tab=XX">` mit dem richtigen Tab-Kürzel.
4. Sektionen aufbauen: pro Sektion `id` (Kebab-Case) + Eintrag in der `<nav class="toc">`; `sec-body`-Wrapper + Fold-Button mitkopieren.
5. Karten: `daddr` der Anreise-Sektion und `MAP_ORIGIN` setzen; `🚗 Route`-Buttons hinter alle `?q=`-Maps-Links.
6. Karte auf der Index unter dem richtigen Tab einhängen (`.plink` + `.pcard`); prüfen, dass (a) die verlinkte Datei existiert, (b) keine andere Karte dieselbe Datei verlinkt (Duplikat = stiller Fehler).
7. Nach Fertigstellung: `pc-action` von `wip` auf `ready` setzen; Statusliste in der CLAUDE.md des Projekts aktualisieren.
8. Falls der Such-Baustein aktiv ist: Eintrag (`title`/`url`/`desc`/`keywords`) in `search-index.js` ergänzen — sonst ist die Seite unauffindbar.

## Qualitätssicherung (vor jedem größeren Edit / Release)

- **Div-Balance prüfen**: Vor und nach Masse-Edits einen HTMLParser-Tiefencheck laufen lassen. Klassische Fehlerquellen: `</td>` statt `</div>`, überzählige `</div>` in Grid-Strukturen, zu früh geschlossene Listen.
- **Used-vs-defined-Abgleich**: Alle im Markup benutzten Klassen gegen den `<style>`-Block der **selben Datei** prüfen (CSS ist per-file!).
- Beide Checks als fertiges Snippet (im Projektordner ausführen; keine Hilfsdatei ablegen, sondern direkt per Heredoc):

```bash
python3 - <<'EOF'
from html.parser import HTMLParser
import re, glob

class Bal(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack=[]; self.errors=[]
    def handle_starttag(self,tag,attrs):
        if tag in ('meta','link','br','img','input','hr'): return
        self.stack.append((tag,self.getpos()))
    def handle_endtag(self,tag):
        if not self.stack:
            self.errors.append(f"unmatched </{tag}> at {self.getpos()}"); return
        if self.stack[-1][0]==tag: self.stack.pop()
        else:
            self.errors.append(f"mismatch: </{tag}> at {self.getpos()}, top={self.stack[-1]}")
            names=[t for t,_ in self.stack]
            if tag in names:
                while self.stack and self.stack[-1][0]!=tag: self.stack.pop()
                if self.stack: self.stack.pop()

for f in sorted(glob.glob('*.html')):
    src=open(f,encoding='utf-8').read()
    p=Bal(); p.feed(src)
    print(f,'— Balance:', p.errors or p.stack or 'OK')
    style=re.search(r'<style>(.*?)</style>', src, re.S).group(1)
    defined=set(re.findall(r'\.([a-zA-Z][\w-]*)', style))
    used=set()
    for m in re.findall(r'class="([^"]+)"', src.split('</style>',1)[1]):
        used.update(m.split())
    missing=sorted(used-defined-{'sec-body'})  # sec-body = reiner Fold-Wrapper ohne Styling
    print(f,'— Klassen ohne CSS:', missing or 'OK')
EOF
```
**Einschränkung**: Seiten, die HTML via `innerHTML` in JavaScript bauen (z. B. `dashboard.html`), erzeugen im QS-Check Falschmeldungen — der Regex trifft auf String-Konkatenationsmuster wie `class="'+barCls+'"` im JS-Code. Diese Treffer sind keine echten fehlenden Klassen und können ignoriert werden.
- **Block-Sync** — die Antwort auf das größte Risiko des Self-contained-Prinzips (Design-Drift): kopiert einen markierten CSS-Block aus einer Master-Datei identisch in alle anderen Seiten. Nach jeder Änderung an geteilten Blöcken (Designs, Design-Verbesserungen, …) laufen lassen; `MASTER`/`MARKER` anpassen. Ein Block endet am nächsten `/* === `-Marker — funktioniert daher nicht für den letzten Block (Print), der ohnehin selten geändert wird:

```bash
python3 - <<'EOF'
import glob
MASTER='index.html'
MARKER='/* === Designs (Farbwelten)'   # Anfang des zu synchronisierenden Blocks
NEXT='/* === '                          # Block endet am nächsten ===-Marker
src=open(MASTER,encoding='utf-8').read()
i=src.index(MARKER); j=src.index(NEXT,i+len(MARKER))
block=src[i:j]
for f in sorted(glob.glob('*.html')):
    if f==MASTER: continue
    t=open(f,encoding='utf-8').read()
    a=t.index(MARKER); b=t.index(NEXT,a+len(MARKER))
    if t[a:b]==block: print(f,'OK (identisch)'); continue
    open(f,'w',encoding='utf-8').write(t[:a]+block+t[b:])
    print(f,'aktualisiert')
EOF
```

- **Kontrast-Check** — prüft beim Anlegen/Ändern von Designs die WCAG-AA-Regel (Fließtext ≥ 4,5:1) automatisiert: rechnet `--tx`/`--tx2` gegen `--bg`–`--bg3` für jeden Variablen-Block (`:root`, Light, alle Designs). Heuristik: `var()`-Referenzen und Akzent-auf-Akzentfläche prüft er nicht — die bleiben Sichtprüfung:

```bash
python3 - <<'EOF'
import re
def lum(h):
    h=h.lstrip('#')
    if len(h)==3: h=''.join(c*2 for c in h)
    def f(c): return c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    r,g,b=(f(int(h[i:i+2],16)/255) for i in (0,2,4))
    return 0.2126*r+0.7152*g+0.0722*b
def ratio(a,b):
    la,lb=sorted((lum(a),lum(b)),reverse=True)
    return (la+0.05)/(lb+0.05)
src=open('index.html',encoding='utf-8').read()
css=src[src.index('<style'):src.index('</style>')]
issues=0
for sel,body in re.findall(r'(:root|html\[[^{]+?)\s*\{([^}]+)\}',css):
    v=dict(re.findall(r'(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,6})',body))
    for tx in ('--tx','--tx2'):
        for bg in ('--bg','--bg2','--bg3'):
            if tx in v and bg in v and ratio(v[tx],v[bg])<4.5:
                print(f'⚠ {sel.strip()}: {tx} auf {bg} = {ratio(v[tx],v[bg]):.2f}:1 (< 4.5)'); issues+=1
print('Kontrast-Check:', f'{issues} Verstöße' if issues else 'OK')
EOF
```

- **Vollständigkeits-Check** — prüft ob jede `.html`-Datei im Verzeichnis auch in der `sw.js`-PRECACHE-Liste und in `search-index.js` eingetragen ist. Läuft still durch, wenn die Dateien fehlen (PWA- bzw. Such-Baustein nicht aktiv):

```bash
python3 - <<'EOF'
import re,glob,os
html=sorted(glob.glob('*.html')); issues=0
if os.path.exists('sw.js'):
    sw=open('sw.js',encoding='utf-8').read()
    m=re.search(r'const PRECACHE\s*=\s*\[(.*?)\]',sw,re.S)
    pc=set(re.findall(r"'([^']+\.html)'",m.group(1))) if m else set()
    for f in html:
        if f not in pc: print(f'⚠ PRECACHE fehlt: {f}'); issues+=1
if os.path.exists('search-index.js'):
    si=open('search-index.js',encoding='utf-8').read()
    idx=set(re.findall(r'\burl\s*:\s*"([^"]+\.html)"',si))
    for f in html:
        if f not in idx: print(f'⚠ search-index.js fehlt: {f}'); issues+=1
print('Vollständigkeits-Check:',f'{issues} Verstöße' if issues else 'OK')
EOF
```

- **`data-ck`-Eindeutigkeit** — prüft ob Checklisten-Keys projektweit wirklich eindeutig sind (`data-ck` darf nicht in mehreren Dateien oder mehrfach auf einer Seite vorkommen; Duplikate überschreiben sich im localStorage still):

```bash
python3 - <<'EOF'
import re,glob
from collections import defaultdict
seen=defaultdict(list)
for f in sorted(glob.glob('*.html')):
    for ck in re.findall(r'data-ck="([^"]+)"',open(f,encoding='utf-8').read()):
        seen[ck].append(f)
issues=0
for ck,files in sorted(seen.items()):
    if len(files)>1: print(f'⚠ data-ck="{ck}" doppelt: {", ".join(files)}'); issues+=1
print('data-ck-Eindeutigkeit:',f'{issues} Duplikate' if issues else 'OK')
EOF
```

- **Fold-ARIA-Konsistenz** — prüft ob `aria-expanded` auf jedem `.fold-btn` mit dem tatsächlichen `folded`-Zustand des Ziel-Elements übereinstimmt. Typischer Fehler beim Kopieren: Button und Element geraten aus dem Takt:

```bash
python3 - <<'EOF'
from html.parser import HTMLParser
import glob

class FC(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.btns={}; self.els={}
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if 'fold-btn' in d.get('class',''):
            c=d.get('aria-controls','')
            if c: self.btns[c]=d.get('aria-expanded','')
        if 'id' in d: self.els[d['id']]='folded' in d.get('class','').split()

for f in sorted(glob.glob('*.html')):
    p=FC(); p.feed(open(f,encoding='utf-8').read()); issues=0
    for cid,exp in p.btns.items():
        if cid not in p.els: print(f'{f}: Ziel fehlt: #{cid}'); issues+=1; continue
        folded=p.els[cid]
        if exp=='true' and folded: print(f'{f}: #{cid} aria-expanded=true, aber "folded" gesetzt'); issues+=1
        elif exp=='false' and not folded: print(f'{f}: #{cid} aria-expanded=false, aber kein "folded"'); issues+=1
    print(f'{f} — Fold-ARIA:','OK' if not issues else f'{issues} Inkonsistenz(en)')
EOF
```

- **`certDaysBadge` / `statusBadge` / `downloadText` müssen in der IT-Dashboard-IIFE lokal verfügbar sein** — diese Helpers sind zwar global in Script-Block 7 definiert, aber die IIFE in Block 6 läuft, bevor Block 7 geparst wird. JavaScript-Funktionsdeklarationen werden nur innerhalb desselben `<script>`-Blocks gehoisted, **nicht** über Block-Grenzen. Lösung: die Helpers lokal in der IIFE duplizieren (wie im Dashboard-Template umgesetzt). Symptom: Cert-Monitor-Sektion bleibt leer, keine JS-Fehlermeldung in der Konsole (die IIFE beendet sich still mit `undefined is not a function`).
- **Bulk-Leiste `body{padding-bottom:4rem}` setzen** — das `#bulk-bar`-Element ist `position:fixed` am unteren Rand. Ohne Abstand verdeckt es den letzten Seiteninhalt. Diese Regel muss explizit gesetzt werden; das Template enthält sie bereits in `dashboard.html`.
- **Links verifizieren** vor dem Einfügen: `curl -s -o /dev/null -w "%{http_code}" -L URL`. Faustregeln: `403` = meist Bot-Schutz, im Browser OK — behalten · `000` = tot — Link entfernen, ggf. Maps-Link behalten · Deep-Paths auf kleinen Sites oft `404` — auf Root kürzen. Tote Domains mit Ersatz in der Projekt-CLAUDE.md dokumentieren.
- **Faktendaten nie schätzen** (Fahrzeiten, Preise, Öffnungszeiten) — immer gegen eine Quelle prüfen (z. B. OSRM `router.project-osrm.org` für Fahrzeiten).
- Keine Script-/Hilfsdateien im Projektordner ablegen (Prüf-Snippets per Heredoc ausführen, siehe oben).

## Arbeitsweise (bewährt aus dem Ursprungsprojekt)

- **Eine Seite nach der anderen** — nie an mehreren gleichzeitig arbeiten; nach Review-Abschluss auf explizite Freigabe warten, bevor die nächste Seite drankommt.
- Unfertige Seiten (Stubs) **komplett neu aus dem Template schreiben**, nie erweitern — Stubs enthalten meist veraltete Klassennamen.
- Fragen stellen, wenn es bessere Ergebnisse bringt (Zielgruppe, Zeitraum, Prioritäten) — fehlende Infos generisch lösen und kennzeichnen.
- **Diese CLAUDE.md kontinuierlich pflegen**: neue Konventionen, gefixte Fallstricke und tote Links sofort dokumentieren.
