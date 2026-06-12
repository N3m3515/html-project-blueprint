// Baustein „Seitenübergreifende Suche" — manuell gepflegter Such-Index (einzige Daten-Datei des Blueprints).
// fetch() funktioniert bei file:// nicht, eine per <script src> geladene Datei schon — deshalb dieser Weg.
// Pro Seite ein Eintrag: title (Linktext) · url (Dateiname) · desc (Unterzeile im Ergebnis) · keywords (zusätzliche Suchbegriffe).
// PFLICHT bei jeder neuen Seite: hier einen Eintrag ergänzen (Schritt in der „Neue Detailseite"-Checkliste der CLAUDE.md).
var SEARCH_INDEX=[
  {title:"Übersicht", url:"index.html", desc:"Startseite mit Tabs, Schnellauswahl, Filter & Favoriten, Entscheidungsbaum", keywords:"start home index kategorien tabs schnellauswahl favoriten"},
  {title:"Eintrag Alpha — Detailseite", url:"detail.html", desc:"Schaukasten aller Detail-Bausteine: Karten, Termine, Checkliste, Galerie, Timeline, FAQ, Notizen", keywords:"alpha detail beispiel musterstadt anreise termine vergleich checkliste galerie timeline faq notizen"}
];
