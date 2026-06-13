// Baustein „Seitenübergreifende Suche" — manuell gepflegter Such-Index (einzige Daten-Datei des Blueprints).
// fetch() funktioniert bei file:// nicht, eine per <script src> geladene Datei schon — deshalb dieser Weg.
// Pro Seite ein Eintrag: title (Linktext) · url (Dateiname) · desc (Unterzeile im Ergebnis) · keywords (zusätzliche Suchbegriffe).
// PFLICHT bei jeder neuen Seite: hier einen Eintrag ergänzen (Schritt in der „Neue Detailseite"-Checkliste der CLAUDE.md).
var SEARCH_INDEX=[
  {
    title: "Übersicht — Blueprint-Startseite",
    url: "index.html",
    desc: "Tab-Navigation mit Karten-Grid, Filter & Favoriten, Schnellauswahl, seitenübergreifende Suche, Vergleichsansicht, Entscheidungsbaum, Sortierung, Druckauswahl, Daten Export/Import",
    keywords: "start home übersicht tabs kategorien karten pcard plink grid filter suche favoriten sternchen fav tagchip tags schnellauswahl entscheidungsbaum vergleich sortierung druckauswahl export import dark light theme design farbwelt polar wald abend graphit terminal brutal material glass css variablen einklappbar fold prefs eh-grid back-btn zurück url-state bookmark"
  },
  {
    title: "Eintrag Alpha — Detailseiten-Muster",
    url: "detail.html",
    desc: "Schaukasten aller Detailseiten-Bausteine: Anreise-Karte (Google Maps), Ansicht-Toggle, Guide/POI-Liste, Termine mit Countdown, Vergleichstabelle, Specgrid, Kosten-Kacheln, Checkliste, Galerie + Lightbox, Timeline, Balkendiagramm, FAQ, Notizen",
    keywords: "detail detailseite muster template anreise karte route google maps iframe embed toc sprungleiste fold einklappbar sec-body ansicht toggle sonne regen wtoggle poi guide stadtführer cityguide poi-list evlist termine events countdown termin-intelligenz ev-past vergleich tabelle rt symbole ok mb no specgrid auswahl eignung sc-wife ti-grid eckdaten kosten checkliste packliste abhaken cl-bar galerie bilder lightbox lb-prev lb-next navigation pfeil pfeiltasten timeline ablauf tl-item balkendiagramm bar-fill faq akkordeon details summary js-frei notizen localstorage note permalink hash abschnitts-link back-to-top totop druckauswahl print-cfg export import shortcuts tastatur"
  },
  {
    title: "IT-Dashboard",
    url: "dashboard.html",
    desc: "Monitoring-Template: Service-Status-Matrix mit Uptime-Badge + Latenz-Sparkline, Metrik-Karten mit Schwellwert-Balken, Log-Viewer mit Level-Filter + Pagination, Inventar-Grid, Wartungsfenster, Incident-Timeline mit MTTR",
    keywords: "dashboard monitoring infrastruktur it service status ampel dot ok warn crit unknown uptime latenz sparkline svg polyline webserver cdn api postgresql redis rabbitmq nfs backup dns frontend backend infrastruktur metriken cpu ram disk netzwerk schwellwert warn crit history verlauf balken fortschritt log logs level error info debug filter suche pagination mehr laden log-viewer inventar hosts geräte server nas ip os cpu-cores ram rolle last-seen wartung maintenance downtime geplant running completed cancelled incident vorfälle ausfall mttr dauer proportional open resolved severity data.js dash-data generated-at stale veraltet live-clock uhr systemzeit auto-refresh reload https tab-titel ampel crit-badge scrollen"
  }
];
