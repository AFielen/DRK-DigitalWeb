# DRK Digital — Design-Update 2026

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Das Design von drk-digital.io auf ein unverwechselbares, editorial-inspiriertes Niveau heben — weg von generischer "AI-SaaS-Ästhetik", hin zu einer Identität, die den institutionellen Charakter des Roten Kreuzes mit moderner Digitalkultur verbindet.

**Architecture:** Statische HTML/CSS-Website (kein Build-Step). Shared CSS wird in eine externe `styles.css` extrahiert (aktuell 3x dupliziert). Fonts werden lokal gehostet (DSGVO-Fix). Alle Änderungen direkt in HTML/CSS.

**Tech Stack:** HTML5, CSS3 (Custom Properties, Grid, Container Queries), Vanilla JS (Intersection Observer), selbst-gehostete WOFF2-Fonts

---

## Ist-Analyse & Probleme

### Kritisch (DSGVO)
- **Google Fonts CDN**: Alle 3 HTML-Dateien laden Plus Jakarta Sans von `fonts.googleapis.com` — das ist ein DSGVO-Verstoß. Die Datenschutzseite behauptet "Keine Google Fonts oder andere externe Schriftarten", aber der Code widerspricht dem.

### Architektur
- **CSS-Duplikation**: Design Tokens, Header, Footer, Reset-Styles sind in allen 3 Dateien identisch inline. Änderungen erfordern 3x Edits.
- **Doppeltes `<main>`-Tag**: `index.html` hat ein `<main>` auf Zeile 1184 und ein weiteres auf Zeile 1226 — ungültiges HTML.

### Design
- **Generische Ästhetik**: Plus Jakarta Sans, blaue Gradienten auf Weiß, runde Karten mit Hover-Translate — das ist die Standardsprache von AI-generierten SaaS-Seiten.
- **Fehlende typografische Spannung**: Eine einzige Sans-Serif für alles, keine Display/Body-Unterscheidung.
- **Monotone Cards**: Alle 6 Produkt-Karten, 2 Plattform-Karten, 3 Philosophie-Karten und 5 Roadmap-Karten teilen dasselbe Muster.
- **Schwacher Footer**: Minimal, kein visuelles Gewicht.
- **Animations**: Nur fade-up auf Scroll — keine gestaffelten Reveals, kein Charakter.

---

## Design-Richtung

### Ästhetik: "Institutional Editorial"

Eine Verbindung aus der Autorität und dem Erbe des Roten Kreuzes (gegründet 1863) mit der Klarheit moderner digitaler Produkte. Denke: Schweizer Grafikdesign trifft Editorial-Magazin.

### Typografie-Pairing

| Rolle | Font | Charakter |
|-------|------|-----------|
| **Display/Headlines** | **Instrument Serif** (Italic für Akzente) | Elegant, redaktionell, verleiht Gravitas |
| **Body/UI** | **Onest** (Variable) | Geometrisch-humanistisch, warm, eigenständig |

Dieses Pairing erzeugt sofortige Spannung: Serif-Headlines sagen "Institution mit Geschichte", die geometrische Sans sagt "modern und digital".

### Farbsystem

Beibehaltung der DRK-Markenfarben (`#e60005` Rot, `#002d55` Blau), aber schärfere Akzentuierung:

| Token | Aktuell | Neu | Begründung |
|-------|---------|-----|------------|
| `--bg` | `#fafafa` | `#f7f5f2` | Wärmeres Papier-Weiß statt kaltem Grau |
| `--text` | `#1a1a1a` | `#1c1917` | Stone-900, wärmer |
| `--text-secondary` | `#555555` | `#57534e` | Stone-600, kohärent |
| `--border` | `#e8e5e1` | `#e7e5e4` | Stone-200 |
| `--surface` | `#ffffff` | `#ffffff` | Bleibt, für Kontrast zu warmem BG |

Neuer Akzent: `--accent-warm: #b91c1c` — ein tieferes, edleres Rot für Links und Details.

### Räumliche Komposition

- **Hero**: Asymmetrisch. Text links, dekoratives Rotkreuz-Motiv rechts als geometrische SVG-Komposition.
- **Products**: 2-spaltig mit einer "Feature-Karte" die 2 Spalten spannt, statt uniformem 3er-Grid.
- **Footer**: Dunkler Block (DRK-Blau), mehrzeilig, mit Rotkreuz-Signet.

---

## File Structure

```
/var/www/drk-digital/
├── styles.css              ← NEU: Shared Design System (extrahiert aus inline-Styles)
├── fonts/
│   ├── InstrumentSerif-Regular.woff2   ← NEU: selbst-gehostet
│   ├── InstrumentSerif-Italic.woff2    ← NEU
│   ├── Onest-Variable.woff2            ← NEU
│   └── fonts.css                       ← NEU: @font-face Deklarationen
├── index.html              ← MODIFY: Neues Design, Link zu styles.css
├── impressum.html          ← MODIFY: Link zu styles.css, inline-Styles entfernen
├── datenschutz.html        ← MODIFY: Link zu styles.css, inline-Styles entfernen
├── favicon.svg             ← unverändert
└── logo.png                ← unverändert
```

---

## Task 1: Font-Foundation & DSGVO-Fix

**Files:**
- Create: `fonts/InstrumentSerif-Regular.woff2`
- Create: `fonts/InstrumentSerif-Italic.woff2`
- Create: `fonts/Onest-Variable.woff2`
- Create: `fonts/fonts.css`
- Modify: `index.html:69-71` (Google Fonts entfernen)
- Modify: `impressum.html:32-34`
- Modify: `datenschutz.html:32-34`

- [ ] **Step 1: Fonts herunterladen**

Instrument Serif von Google Fonts API als WOFF2 herunterladen:

```bash
mkdir -p /var/www/drk-digital/fonts

# Instrument Serif Regular
curl -sL "https://fonts.gstatic.com/s/instrumentserif/v4/jizBRFtNs2ka5fXjeivQ4LroWlx-2zIZj1bIkNo.woff2" \
  -o /var/www/drk-digital/fonts/InstrumentSerif-Regular.woff2

# Instrument Serif Italic
curl -sL "https://fonts.gstatic.com/s/instrumentserif/v4/jizHRFtNs2ka5fXjeivQ4LroWlx-6zAST0m0kJm9.woff2" \
  -o /var/www/drk-digital/fonts/InstrumentSerif-Italic.woff2

# Onest Variable (alle Gewichte 100-900)
curl -sL "https://fonts.gstatic.com/s/onest/v7/gNMKW3F-SZuxyR46-cTBhl0.woff2" \
  -o /var/www/drk-digital/fonts/Onest-Variable.woff2
```

Falls die direkten URLs sich geändert haben: Die WOFF2-Dateien können auch über `google-webfonts-helper` oder den manuellen Download unter `fonts.google.com` bezogen werden.

- [ ] **Step 2: fonts.css erstellen**

Datei: `fonts/fonts.css`

```css
/* Instrument Serif — Display/Headlines */
@font-face {
  font-family: 'Instrument Serif';
  src: url('InstrumentSerif-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Instrument Serif';
  src: url('InstrumentSerif-Italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

/* Onest — Body/UI */
@font-face {
  font-family: 'Onest';
  src: url('Onest-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

- [ ] **Step 3: Google Fonts Links entfernen**

In **allen 3 HTML-Dateien** die folgenden 3 Zeilen entfernen:

```html
<!-- ENTFERNEN: -->
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
```

Ersetzen durch:

```html
<link rel="stylesheet" href="fonts/fonts.css"/>
```

- [ ] **Step 4: CSS-Variablen aktualisieren**

In `index.html` (und später in `styles.css`), die Font-Stack-Variablen ändern:

```css
:root {
  --font-display: 'Instrument Serif', Georgia, 'Times New Roman', serif;
  --font-body: 'Onest', system-ui, -apple-system, sans-serif;
}
```

Und `body` aktualisieren:

```css
body {
  font-family: var(--font-body);
}
h1, h2, h3 {
  font-family: var(--font-display);
}
```

- [ ] **Step 5: Visuell verifizieren**

Seite im Browser öffnen. Prüfen:
- Instrument Serif rendert in allen Headlines (h1, h2, h3)
- Onest rendert im Body-Text
- Keine FOUT (Flash of Unstyled Text) dank `font-display: swap`
- Keine externen Requests an Google (DevTools → Network → Filter: `google`)

- [ ] **Step 6: Commit**

```bash
git add fonts/ index.html impressum.html datenschutz.html
git commit -m "feat: DSGVO-konformes Font-Setup mit Instrument Serif + Onest, lokal gehostet"
```

---

## Task 2: Shared Stylesheet extrahieren (DRY)

**Files:**
- Create: `styles.css`
- Modify: `index.html` (inline-Styles auslagern, `<link>` hinzufügen)
- Modify: `impressum.html` (kompletten `<style>`-Block entfernen, `<link>` hinzufügen)
- Modify: `datenschutz.html` (kompletten `<style>`-Block entfernen, `<link>` hinzufügen)

- [ ] **Step 1: Shared styles.css erstellen**

Folgende Abschnitte aus dem `<style>` aller 3 Dateien extrahieren in eine gemeinsame `styles.css`:

1. **Design Tokens** (`:root { ... }`) — die vollständige Version aus `index.html`
2. **Reset & Base** (`*, html, body, a, p, ::selection`)
3. **Skip-Link** (`.skip-link`)
4. **Focus-Visible** (`a:focus-visible, .header a:focus-visible`)
5. **Container** (`.container`)
6. **Header** (`.header, .header-inner, .header-brand, .header-title, .header-subtitle, .header-back, .header-nav, .header-icon-btn, .mobile-menu-btn, .mobile-nav`)
7. **Content Card** (`.content-card, .content-section`) — für Impressum/Datenschutz
8. **Info Box** (`.info-box`) — für Datenschutz und index.html
9. **Footer** (`.footer, .footer-inner, .footer-org, .footer-kv, .footer-links, .footer-heart`)
10. **Reduced Motion** (`@media prefers-reduced-motion`)

- [ ] **Step 2: HTML-Dateien aktualisieren**

In **allen 3 Dateien** den `<link>` nach dem fonts.css einfügen:

```html
<link rel="stylesheet" href="fonts/fonts.css"/>
<link rel="stylesheet" href="styles.css"/>
```

In `impressum.html` und `datenschutz.html`: Den gesamten `<style>...</style>` Block entfernen.

In `index.html`: Nur die shared Teile entfernen, seitenspezifische Styles (Hero, Products, Pillars, Roadmap, CTA, Animations) bleiben inline.

- [ ] **Step 3: Verifizieren**

Alle 3 Seiten im Browser prüfen:
- Impressum rendert korrekt (Header, Content Card, Footer)
- Datenschutz rendert korrekt (Header, Info Box, Content Card, Footer)
- Index rendert korrekt (alle Sektionen)

- [ ] **Step 4: Commit**

```bash
git add styles.css index.html impressum.html datenschutz.html
git commit -m "refactor: Shared CSS in styles.css extrahiert, Duplikation in 3 Dateien beseitigt"
```

---

## Task 3: HTML-Fix & Farbsystem

**Files:**
- Modify: `styles.css` (Farbsystem updaten)
- Modify: `index.html:1184,1226` (doppeltes `<main>` fixen)

- [ ] **Step 1: Doppeltes main-Tag fixen**

In `index.html`:
- Zeile 1184: `<main id="main">` — bleibt
- Zeile 1224: `</section>` (Ende Hero)
- Zeile 1226: `<main>` — **ENTFERNEN** (dieses zweite `<main>` ist invalid)
- Zeile 1581: `</main>` — bleibt (schließt das erste `<main>`)

Die Hero-Section sollte innerhalb des ersten `<main>` bleiben.

- [ ] **Step 2: Warme Farbpalette in styles.css**

Design Tokens aktualisieren:

```css
:root {
  /* Warme Neutrals (Stone-basiert statt reinem Grau) */
  --bg: #f7f5f2;
  --bg-warm: #f3efe9;
  --surface: #ffffff;
  --surface-hover: #fefefe;
  --surface-muted: #f0ece6;

  --text: #1c1917;
  --text-secondary: #57534e;
  --text-muted: #78716c;
  --text-faint: #a8a29e;

  --border: #e7e5e4;
  --border-light: #f5f5f4;
  --border-hover: #d6d3d1;

  /* DRK Brand — unverändert */
  --drk: #e60005;
  --drk-dark: #a51e0f;
  --drk-blue: #002d55;
  --drk-blue-mid: #2276d0;

  /* NEU: Warmer Akzent-Rot für Links/Details */
  --accent-warm: #b91c1c;
}
```

- [ ] **Step 3: Visuell verifizieren**

- Hintergrund sollte leicht cremig/warm wirken statt kalt-grau
- Text-Kontrast prüfen (WCAG AA: mindestens 4.5:1)
- Borders sollten subtiler, wärmer wirken

- [ ] **Step 4: Commit**

```bash
git add styles.css index.html
git commit -m "fix: Doppeltes main-Tag entfernt, warme Stone-Farbpalette eingeführt"
```

---

## Task 4: Header Redesign

**Files:**
- Modify: `styles.css` (Header-Styles)
- Modify: `index.html` (Header-HTML, ggf. Klassen)

- [ ] **Step 1: Header-Typografie**

Header-Brand bekommt die neue Serif-Font für den Titel:

```css
.header-title {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 400; /* Serif braucht kein Bold */
  letter-spacing: 0;
}
.header-subtitle {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 500;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

- [ ] **Step 2: Header-Akzent verfeinern**

Das 3px rote Top-Border durch ein subtileres Element ersetzen — eine dünne Linie, die die Red-Cross-Identität wahrt, ohne plump zu wirken:

```css
.header::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    var(--drk) 20%, 
    var(--drk) 80%, 
    transparent 100%
  );
}
```

- [ ] **Step 3: Navigation-Links mit Serif-Hover**

Nav-Links bekommen beim Hover eine Serif-Italic-Transformation (subtiler, editorial Effekt):

```css
.header-nav a {
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  transition: all 200ms ease;
}
.header-nav a:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}
```

- [ ] **Step 4: Visuell verifizieren & Commit**

```bash
git add styles.css index.html
git commit -m "feat: Header-Redesign mit Serif-Titel und verfeinertem Akzent"
```

---

## Task 5: Hero-Section Overhaul

**Files:**
- Modify: `index.html` (Hero-HTML + Hero-CSS)

Dies ist die wirkungsvollste Änderung. Das Ziel: Ein Hero, der sich anfühlt wie eine Titelseite, nicht wie eine SaaS-Landingpage.

- [ ] **Step 1: Hero-Background neu gestalten**

Statt des generischen blauen Gradienten — ein dunklerer, texturierter Hintergrund mit einem geometrischen Rotkreuz-Motiv:

```css
.hero {
  background: var(--drk-blue);
  color: #fff;
  padding: clamp(5rem, 12vw, 8rem) 0 clamp(4rem, 10vw, 6rem);
  position: relative;
  overflow: hidden;
}
/* Subtiles geometrisches Cross-Motiv als Dekoration */
.hero::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 8%;
  width: 40vw;
  height: 40vw;
  max-width: 500px;
  max-height: 500px;
  transform: translateY(-50%);
  background:
    linear-gradient(var(--drk), var(--drk)) center/12% 100% no-repeat,
    linear-gradient(var(--drk), var(--drk)) center/100% 12% no-repeat;
  opacity: 0.06;
  pointer-events: none;
}
/* Untere Kante: diagonaler Schnitt für Dynamik */
.hero::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 80px;
  background: var(--bg);
  clip-path: polygon(0 100%, 100% 100%, 100% 0);
}
```

- [ ] **Step 2: Hero-Headline mit Serif**

```css
.hero h1 {
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 2rem + 4.5vw, 5rem);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin-bottom: var(--space-6);
}
/* Akzent: Ein Wort in Italic */
.hero h1 em {
  font-style: italic;
  color: rgba(255,255,255,0.7);
}
```

HTML anpassen:
```html
<h1>Digitale Werkzeuge<br/>für das <em>Rote Kreuz</em></h1>
```

- [ ] **Step 3: Hero-Badge aufwerten**

Statt dem grünen pulsierenden Punkt — ein dezenteres Statuselement:

```css
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 1rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0.375rem; /* Weniger rund, editorial */
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.65);
  margin-bottom: 2.5rem;
}
```

- [ ] **Step 4: Hero-Stats mit mehr Charakter**

Stats-Zahlen in Serif, Labels in Sans:

```css
.hero-stats {
  display: flex;
  gap: clamp(2.5rem, 5vw, 4rem);
  padding-top: var(--space-8);
  border-top: 1px solid rgba(255,255,255,0.1);
}
.hero-stat-value {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem);
  font-weight: 400;
  line-height: 1;
  color: #fff;
}
.hero-stat-label {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.4);
  margin-top: 0.5rem;
}
```

- [ ] **Step 5: Hero-Buttons verfeinern**

Weg von voll-runden Pill-Buttons (generisch), hin zu leicht gerundeten Buttons mit mehr Gewicht:

```css
.btn-primary {
  background: #fff;
  color: var(--drk-blue);
  padding: 0.875rem 2rem;
  border-radius: 0.5rem; /* Weniger rund */
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.01em;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 200ms ease;
}
.btn-primary:hover {
  background: #f8f8f8;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}
```

- [ ] **Step 6: Visuell verifizieren & Commit**

Prüfen:
- Rotkreuz-Motiv ist sichtbar aber dezent (opacity 0.06)
- Diagonaler Schnitt am Hero-Ende sieht auf allen Viewports gut aus
- Serif-Headline hat starke Wirkung
- Stats-Border-Top erzeugt klare Trennung

```bash
git add index.html
git commit -m "feat: Hero-Redesign mit Serif-Headline, Cross-Motiv und diagonalem Schnitt"
```

---

## Task 6: Product Cards Redesign

**Files:**
- Modify: `index.html` (Products-CSS + ggf. HTML-Anpassungen)

- [ ] **Step 1: Cards mit Charakter**

Weg vom uniformen 3er-Grid. Neues Layout: 2 Spalten, wobei die erste Karte (oder das Flaggschiff) breiter ist.

```css
.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}
@media (max-width: 680px) {
  .products-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: Karten-Stil: Editorial Lines statt Rounded Boxes**

Statt der generischen gerundeten Karten — ein reduzierter Look mit Linie oben und klarer Typografie:

```css
.product-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  transition: all 250ms ease;
  position: relative;
  overflow: hidden;
}
.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 1.75rem;
  right: 1.75rem;
  height: 1px;
  background: var(--drk);
  opacity: 0;
  transition: opacity 250ms ease;
}
.product-card:hover {
  border-color: var(--border-hover);
  box-shadow: 0 8px 30px rgba(0,0,0,0.06);
}
.product-card:hover::before {
  opacity: 1;
}
```

- [ ] **Step 3: Card-Titel in Serif**

```css
.product-card-name {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 400;
  color: var(--text);
}
```

- [ ] **Step 4: Featured Card als Contrast-Block**

Die Flaggschiff-Card (NIS-2) bekommt stärkeren Kontrast:

```css
.featured-card {
  background: var(--drk-blue);
  color: #fff;
  border-radius: 1rem;
  padding: clamp(2.5rem, 5vw, 4rem);
  position: relative;
  overflow: hidden;
}
.featured-card h3 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem);
  font-weight: 400;
}
```

- [ ] **Step 5: Visuell verifizieren & Commit**

```bash
git add index.html
git commit -m "feat: Product Cards mit Editorial-Stil, 2-Spalten-Layout, Serif-Titel"
```

---

## Task 7: Philosophy, Roadmap & CTA Redesign

**Files:**
- Modify: `index.html` (Pillars, Roadmap, CTA Styles)

- [ ] **Step 1: Philosophie-Pillars mit Nummern statt Icons**

Statt der generischen Icons — große Ordinalzahlen in Serif als visuelles Element:

```css
.pillar-card {
  padding: 2rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  transition: all 250ms ease;
}
.pillar-number {
  font-family: var(--font-display);
  font-size: 3rem;
  font-style: italic;
  color: var(--drk);
  opacity: 0.2;
  line-height: 1;
  margin-bottom: 1rem;
}
.pillar-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--text);
  margin-bottom: 0.5rem;
}
```

HTML-Anpassung (pro Pillar-Card):
```html
<div class="pillar-card fade-up">
  <div class="pillar-number">01</div>
  <div class="pillar-title">Zero-Data & DSGVO</div>
  <p class="pillar-text">...</p>
</div>
```

- [ ] **Step 2: Roadmap als Timeline**

Statt uniformer Karten — eine vertikale Timeline mit Linie:

```css
.roadmap-timeline {
  position: relative;
  padding-left: 2rem;
}
.roadmap-timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--drk) 0%, var(--border) 100%);
}
.roadmap-item {
  position: relative;
  padding-bottom: 2rem;
  padding-left: 2rem;
}
.roadmap-item::before {
  content: '';
  position: absolute;
  left: -2rem;
  top: 0.5rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--surface);
  border: 2px solid var(--drk);
}
.roadmap-item:last-child { padding-bottom: 0; }
```

- [ ] **Step 3: CTA mit Serif-Headline und stärkerem Kontrast**

```css
.cta-card {
  padding: clamp(3rem, 6vw, 5rem);
  background: var(--drk-blue);
  color: #fff;
  border-radius: 1rem;
  text-align: center;
}
.cta-title {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem);
  font-weight: 400;
  margin-bottom: 1rem;
}
.cta-text {
  color: rgba(255,255,255,0.7);
  margin: 0 auto 2rem;
  max-width: 32rem;
}
```

- [ ] **Step 4: Visuell verifizieren & Commit**

```bash
git add index.html
git commit -m "feat: Philosophy-Nummern, Roadmap-Timeline, CTA-Redesign"
```

---

## Task 8: Footer-Redesign

**Files:**
- Modify: `styles.css` (Footer in shared Styles)
- Modify: `index.html`, `impressum.html`, `datenschutz.html` (Footer-HTML)

- [ ] **Step 1: Footer als dunkler Block**

Der Footer bekommt visuelle Substanz — DRK-Blau-Hintergrund, wie eine Visitenkarte:

```css
.footer {
  background: var(--drk-blue);
  color: #fff;
  padding: 3rem 0 2rem;
}
.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
}
.footer-org {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 400;
  color: #fff;
}
.footer-kv {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  font-weight: 500;
}
.footer-links {
  display: flex;
  gap: 1.5rem;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
}
.footer-links a:hover { color: #fff; }
.footer-heart {
  font-size: 0.6875rem;
  color: rgba(255,255,255,0.3);
  margin-top: 0.5rem;
}
/* Rotkreuz-Signet im Footer */
.footer-cross {
  width: 24px;
  height: 24px;
  opacity: 0.15;
  margin-bottom: 0.5rem;
}
```

- [ ] **Step 2: Footer-HTML aktualisieren**

In allen 3 Dateien den Footer aktualisieren — `border-top` entfernen, Rotkreuz-Signet hinzufügen:

```html
<footer class="footer">
  <div class="container">
    <div class="footer-inner">
      <svg class="footer-cross" viewBox="0 0 24 24"><path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7V2z" fill="#fff"/></svg>
      <div class="footer-org">Deutsches Rotes Kreuz</div>
      <div class="footer-kv">Kreisverband StädteRegion Aachen e.V.</div>
      <div class="footer-links">
        <a href="impressum.html">Impressum</a>
        <a href="datenschutz.html">Datenschutz</a>
        <a href="mailto:digitalisierung@drk-aachen.de">Kontakt</a>
      </div>
      <div class="footer-heart">
        made with &#10084; for &#10010;
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Verifizieren & Commit**

Alle 3 Seiten prüfen — Footer sollte als dunkler Abschlussblock wirken.

```bash
git add styles.css index.html impressum.html datenschutz.html
git commit -m "feat: Footer-Redesign als dunkler DRK-Blau-Block mit Kreuz-Signet"
```

---

## Task 9: Animationen & Micro-Interactions

**Files:**
- Modify: `index.html` (Animation-CSS + JS)

- [ ] **Step 1: Staggered Reveal verfeinern**

Mehr Charakter in der Scroll-Animation — nicht nur fade-up, sondern auch leichte Rotation:

```css
.fade-up {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger mit mehr Verzögerung für eleganteres Reveal */
.stagger > .fade-up:nth-child(1) { transition-delay: 0ms; }
.stagger > .fade-up:nth-child(2) { transition-delay: 80ms; }
.stagger > .fade-up:nth-child(3) { transition-delay: 160ms; }
.stagger > .fade-up:nth-child(4) { transition-delay: 240ms; }
.stagger > .fade-up:nth-child(5) { transition-delay: 320ms; }
.stagger > .fade-up:nth-child(6) { transition-delay: 400ms; }
```

- [ ] **Step 2: Hero-Headline animieren**

Headline bekommt einen Clip-Path-Reveal beim Laden:

```css
@keyframes revealUp {
  from {
    clip-path: inset(100% 0 0 0);
    transform: translateY(20px);
  }
  to {
    clip-path: inset(0 0 0 0);
    transform: translateY(0);
  }
}

.hero h1 {
  animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}
.hero-description {
  animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.35s both;
}
.hero-actions {
  animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}
.hero-stats {
  animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.65s both;
}
```

- [ ] **Step 3: Card-Hover verfeinern**

Subtilere Hover-States — weniger Translate, mehr Shadow-Fokus:

```css
.product-card:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  border-color: var(--border-hover);
  transform: translateY(-2px); /* Subtiler als -4px */
}
```

- [ ] **Step 4: Visuell verifizieren & Commit**

```bash
git add index.html
git commit -m "feat: Verfeinerte Animationen mit Clip-Path-Reveal und subtilerem Stagger"
```

---

## Task 10: Impressum & Datenschutz anpassen

**Files:**
- Modify: `impressum.html` (HTML-Anpassungen an neues Design)
- Modify: `datenschutz.html` (HTML-Anpassungen an neues Design)

- [ ] **Step 1: Content-Card-Typografie**

In `styles.css` die Content-Card-Styles an die neuen Fonts anpassen:

```css
.content-card h1 {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 1.5rem + 1.25vw, 2.5rem);
  font-weight: 400;
  margin-bottom: 2rem;
  letter-spacing: -0.01em;
}
.content-section h2 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 400;
  color: var(--drk-blue);
  margin-bottom: 0.75rem;
}
```

- [ ] **Step 2: Seiten mit neuem Footer aktualisieren**

Falls in Task 8 noch nicht geschehen — Footer-HTML in beiden Dateien durch den neuen dunklen Footer ersetzen.

- [ ] **Step 3: Google-Fonts-Referenz in datenschutz.html korrigieren**

In `datenschutz.html` Abschnitt 5 steht:
> "Alle Schriftarten verwenden den System-Font-Stack des Betriebssystems."

Das muss aktualisiert werden auf:
> "Alle Schriftarten (Instrument Serif, Onest) werden lokal auf dem eigenen Server gehostet. Es werden keine externen Font-Dienste eingebunden."

- [ ] **Step 4: Visuell verifizieren & Commit**

```bash
git add styles.css impressum.html datenschutz.html
git commit -m "feat: Impressum & Datenschutz an neues Design angepasst, Font-Referenz korrigiert"
```

---

## Task 11: Final Polish & Review

**Files:**
- Alle Dateien

- [ ] **Step 1: Cross-Browser-Test**

Prüfen in:
- Chrome/Edge (aktuell)
- Firefox (aktuell)
- Safari/iOS (falls möglich)
- Mobile Viewport (360px, 768px)

Spezifisch prüfen:
- `clip-path` Animation funktioniert
- `backdrop-filter` im Header funktioniert
- Fonts laden ohne FOUT
- Kein horizontaler Overflow

- [ ] **Step 2: Performance-Check**

```bash
# Font-Dateien: sollten jeweils < 100KB sein
ls -lah /var/www/drk-digital/fonts/

# Keine externen Requests
# DevTools → Network → Alle Requests prüfen
```

- [ ] **Step 3: HTML-Validierung**

```bash
# W3C Validator (lokal mit curl oder im Browser unter validator.w3.org)
# Kein doppeltes <main>
# Alle Tags korrekt geschlossen
# Keine obsoleten Attribute
```

- [ ] **Step 4: Lighthouse-Audit**

DevTools → Lighthouse ausführen. Ziele:
- Performance: > 95
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 95

- [ ] **Step 5: Finaler Commit**

```bash
git add -A
git commit -m "polish: Final Review, Cross-Browser-Fixes, Performance-Optimierung"
```

---

## Zusammenfassung der Design-Änderungen

| Bereich | Vorher | Nachher |
|---------|--------|---------|
| **Fonts** | Plus Jakarta Sans (Google CDN) | Instrument Serif + Onest (lokal) |
| **DSGVO** | Verstoß (externe Fonts) | Konform (alles lokal) |
| **CSS** | 3x inline-Duplikation | Shared `styles.css` |
| **Farben** | Kaltes Grau (#fafafa) | Warmes Stone (#f7f5f2) |
| **Hero** | Blauer Gradient | Solides DRK-Blau + Cross-Motiv |
| **Headlines** | Sans-Serif, Bold | Serif, Regular (Instrument Serif) |
| **Cards** | 3-spaltig, uniform | 2-spaltig, differenziert |
| **Buttons** | Pill-Shape (border-radius: 9999px) | Leicht gerundet (8px) |
| **Footer** | Minimal, transparent | Dunkler DRK-Blau-Block |
| **Animationen** | Nur fade-up | Clip-Path-Reveal + verfeinert Stagger |
| **HTML** | Doppeltes `<main>` | Valides HTML5 |
