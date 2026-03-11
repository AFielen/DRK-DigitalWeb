# 🌐 DRK Digital

**Internetauftritt für die DRK-Digitalisierungstools.**

Open Source · Kostenlos · DSGVO-konform

---

## Was ist das?

Die Website [drk-digital.io](https://drk-digital.io) präsentiert die Open-Source-Digitalisierungstools des DRK Kreisverband StädteRegion Aachen e.V. — ein One-Pager mit Produktübersicht, Philosophie und Roadmap.

## ✨ Features

* **Statische Website** — Reines HTML/CSS, kein JavaScript-Framework
* **NIS2-Design-System** — Einheitliches DRK-Designsystem mit CSS-Variablen
* **Zero External Dependencies** — Keine Google Fonts, keine CDNs, keine Tracker
* **DSGVO-konform** — Keine Cookies, kein Tracking, Hosting bei Hetzner (Deutschland)
* **Responsive** — Optimiert für Mobile, Tablet und Desktop
* **Impressum & Datenschutz** — Rechtlich vollständig

## 🚀 Deployment

### Statisch auf Hetzner (Caddy)

```bash
# Dateien auf den Server kopieren
scp index.html impressum.html datenschutz.html logo.png favicon.svg user@server:/var/www/drk-digital/
```

```caddyfile
# Caddyfile
drk-digital.io, drk-digital.net {
    root * /var/www/drk-digital
    file_server
    encode gzip
}
```

### Lokal testen

```bash
# Einfach mit Python
python3 -m http.server 8000

# Oder mit Node
npx serve .
```

## 🛠️ Tech-Stack

* HTML5 + CSS3 (kein Build-Step)
* System-Font-Stack (keine externen Fonts)
* Inline-SVG-Icons (Lucide-Style)
* CSS Custom Properties (DRK Design Tokens)

## 📐 Projektstruktur

```
DRK-DigitalWeb/
├── index.html          # Hauptseite (One-Pager)
├── impressum.html      # Impressum (§ 5 TMG)
├── datenschutz.html    # Datenschutzerklärung (DSGVO)
├── logo.png            # DRK-Logo (42×42)
├── favicon.svg         # Favicon (Rotkreuz-Emblem)
├── LICENSE             # MIT
└── README.md
```

## 🔒 Datenschutz & Sicherheit

* Keine Cookies
* Keine externen Dienste oder CDNs
* Keine Datenbank
* System-Font-Stack (keine Google Fonts)
* Hosting bei Hetzner (Deutschland)
* DNS über Hetzner DNS

## 🤝 Beitragen

1. Fork erstellen
2. Feature-Branch anlegen (`git checkout -b feat/mein-feature`)
3. Commit (`git commit -m 'feat: Neues Feature'`)
4. Push (`git push origin feat/mein-feature`)
5. Pull Request erstellen

## 📄 Lizenz

MIT — Frei verwendbar für alle DRK-Gliederungen und darüber hinaus.

## 🏥 Über

Ein Projekt des [DRK Kreisverband StädteRegion Aachen e.V.](https://www.drk-aachen.de/)

---

*Gebaut mit ❤️ für das Deutsche Rote Kreuz*
