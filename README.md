# 🌐 DRK Digital

**Internetauftritt für die DRK-Digitalisierungstools.**

Open Source · Kostenlos · DSGVO-konform

---

## Was ist das?

Die Website [drk-digital.io](https://drk-digital.io) präsentiert die Open-Source-Digitalisierungstools des DRK-Kreisverband Städteregion Aachen e.V. — ein One-Pager mit Produktübersicht, Dienstleistungen, Philosophie und Roadmap.

## ✨ Features

* **Statische Website** — Reines HTML/CSS plus ein kleines Vanilla-JS (`main.js`: Mobile-Menü, Header-Schatten); kein Framework, kein Build-Step
* **Strikte Content-Security-Policy** — Keine Inline-Styles, keine `style`-Attribute, keine Inline-Scripts; alle Styles liegen in `styles.css`/`index.css`, das Script in `main.js`
* **Security-Header** — HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` (siehe Caddyfile)
* **Eigene 404-Seite** — `404.html` im Design der Website, Statuscode 404 bleibt erhalten
* **SEO-Grundausstattung** — `robots.txt`, `sitemap.xml`, Canonical-Links, Open Graph mit `og-image.png`, Web-Manifest
* **security.txt** — Sicherheitskontakt nach RFC 9116 unter `/.well-known/security.txt`
* **NIS2-Design-System** — Einheitliches DRK-Designsystem mit CSS-Variablen
* **Zero External Dependencies** — Keine Google Fonts, keine CDNs, keine Tracker
* **DSGVO-konform** — Keine Cookies, kein Tracking, Hosting bei Hetzner (Deutschland)
* **Responsive** — Optimiert für Mobile, Tablet und Desktop
* **Impressum & Datenschutz** — Rechtlich vollständig

## 🚀 Deployment

### Statisch auf Hetzner (Caddy)

#### 1. Dateien auf den Server kopieren

```bash
# Alles Nötige per rsync synchronisieren (inkl. .well-known/, Icons, robots.txt, sitemap.xml)
rsync -av --delete \
  --exclude .git --exclude .gitignore \
  --exclude docs --exclude README.md --exclude LICENSE \
  ./ user@server:/var/www/drk-digital/
```

Hinweise:

* `--delete` entfernt auf dem Server alles, was lokal nicht (mehr) existiert — z. B. das frühere Verzeichnis `fonts/`. Vorher mit `--dry-run` (`-n`) prüfen, was gelöscht würde.
* Versteckte Dateien und Verzeichnisse werden von rsync mitkopiert; `--exclude .git` trifft nur `.git` selbst, `.well-known/` kommt also mit.
* `docs/`, `README.md`, `LICENSE` und `.gitignore` werden nicht ausgeliefert.

#### 2. Caddyfile

Produktionsreife Vorlage für `/etc/caddy/Caddyfile` (Caddy 2):

```caddyfile
# /etc/caddy/Caddyfile — drk-digital.io (statische Website, Caddy 2)
#
# Prüfen:   caddy validate --config /etc/caddy/Caddyfile
# Laden:    sudo systemctl reload caddy
#
# Voraussetzungen:
# - A/AAAA-Records für alle unten genannten Hostnamen zeigen auf diesen Server
#   (Caddy holt TLS-Zertifikate automatisch für jeden Hostnamen).
# - mkdir -p /var/log/caddy && chown caddy:caddy /var/log/caddy

# ── Snippet: Security-Header ──
# Wird im Hauptblock UND in handle_errors importiert, weil die header-Direktive
# des Hauptblocks nicht auf Fehler-Routen (z. B. die 404-Seite) wirkt.
(security_headers) {
	header {
		# HSTS: 1 Jahr, inkl. Subdomains, für die Preload-Liste (hstspreload.org) geeignet.
		# Achtung: "preload" ist praktisch unumkehrbar – nur setzen, wenn ALLE Subdomains HTTPS können.
		Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

		# CSP: ausschließlich eigene Skripte, Styles, Bilder; keine Inline-Styles/-Scripts,
		# keine Formulare, kein Einbetten in fremde Frames.
		# JSON-LD-Blöcke (type="application/ld+json") sind davon nicht betroffen.
		Content-Security-Policy "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; manifest-src 'self'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'"

		X-Content-Type-Options "nosniff"
		Referrer-Policy "strict-origin-when-cross-origin"
		Permissions-Policy "camera=(), microphone=(), geolocation=()"
		X-Frame-Options "DENY"

		# Server-Banner entfernen
		-Server
	}
}

# ── Nebendomains → kanonische Domain (301) ──
drk-digital.net, www.drk-digital.net, www.drk-digital.io {
	redir https://drk-digital.io{uri} permanent
}

# ── Hauptdomain ──
drk-digital.io {
	root * /var/www/drk-digital
	encode zstd gzip

	import security_headers

	# ── Cache-Control ──
	# HTML: immer beim Server nachfragen (ETag/Last-Modified → 304), Änderungen greifen sofort
	@html path / *.html
	header @html Cache-Control "no-cache"

	# CSS/JS: 1 Tag
	@code path *.css *.js
	header @code Cache-Control "public, max-age=86400"

	# Bilder, SVG, Web-Manifest: 30 Tage
	@assets path *.png *.svg *.ico *.jpg *.jpeg *.webp *.webmanifest
	header @assets Cache-Control "public, max-age=2592000"

	# ── Fehlerseiten ──
	# 404 → /404.html. file_server übernimmt im Fehlerkontext den Statuscode
	# des Fehlers, die Antwort bleibt also ein echter 404.
	handle_errors {
		@notfound expression `{err.status_code} == 404`
		handle @notfound {
			import security_headers
			header Cache-Control "no-cache"
			rewrite * /404.html
			file_server
		}
	}

	file_server

	# ── Access-Log ──
	# Rotation ab 10 MiB, höchstens 7 Dateien, Löschung spätestens nach 168 h (7 Tage).
	# Bildet die Zusage der Datenschutzerklärung technisch ab:
	# Server-Logs werden nach spätestens 7 Tagen automatisch gelöscht.
	# Hinweis: Caddy rotiert nur nach Größe. Erreicht die aktive Datei bei sehr wenig
	# Traffic die 10 MiB nicht, ergänzend täglich per logrotate (copytruncate, rotate 7)
	# oder Cron-Job rotieren, damit die 7-Tage-Frist in jedem Fall eingehalten wird.
	log {
		output file /var/log/caddy/drk-digital.log {
			roll_size 10MiB
			roll_keep 7
			roll_keep_for 168h
		}
	}
}
```

Was die Vorlage abdeckt:

* `drk-digital.net`, `www.drk-digital.net` und `www.drk-digital.io` leiten per 301 auf `https://drk-digital.io` weiter (Pfad bleibt erhalten).
* Kompression mit zstd und gzip.
* Security-Header inkl. strikter CSP; der `Server`-Header wird entfernt.
* Cache-Control: HTML `no-cache` (Revalidierung per ETag), CSS/JS 1 Tag, Bilder/SVG/Manifest 30 Tage.
* Eigene 404-Seite mit erhaltenem Statuscode.
* Access-Log mit Rotation und automatischer Löschung nach spätestens 7 Tagen.

#### 3. Nach dem Deployment prüfen

```bash
# Alle Assets erreichbar? (erwartet: jeweils 200)
for p in / /styles.css /index.css /main.js /.well-known/security.txt /robots.txt /sitemap.xml /site.webmanifest /og-image.png; do
  printf '%-32s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "https://drk-digital.io$p"
done

# 404-Seite: erwartet Status 404 mit HTML-Body
curl -s -o /dev/null -w '%{http_code}\n' https://drk-digital.io/gibt-es-nicht

# Security- und Cache-Header prüfen
curl -I https://drk-digital.io/
curl -I https://drk-digital.io/styles.css
curl -I https://drk-digital.io/og-image.png

# Redirects: erwartet 301 + Location: https://drk-digital.io/
curl -sI https://drk-digital.net/ | grep -i -E '^(HTTP|location)'
curl -sI https://www.drk-digital.net/impressum.html | grep -i -E '^(HTTP|location)'
curl -sI https://www.drk-digital.io/ | grep -i -E '^(HTTP|location)'
```

Zusätzlich lohnt ein Blick in die Browser-Konsole: Unter der strikten CSP darf keine Meldung zu blockierten Inline-Styles oder -Scripts erscheinen.

### Lokal testen

```bash
# Einfach mit Python
python3 -m http.server 8000

# Oder mit Node
npx serve .
```

Hinweis: Lokale Server setzen keine Security-Header. Wer die CSP lokal testen will, kann Caddy mit der Vorlage oben und `root * .` starten (`caddy run --config Caddyfile.dev`).

## 🛠️ Tech-Stack

* HTML5 + CSS3 (kein Build-Step)
* Vanilla JavaScript (`main.js`, keine Abhängigkeiten)
* System-Font-Stack (keine externen Fonts)
* Inline-SVG-Icons (Lucide-Style)
* CSS Custom Properties (DRK Design Tokens)
* Caddy 2 als Webserver (TLS automatisch, Security-Header, Logging)

## 📐 Projektstruktur

```
DRK-DigitalWeb/
├── index.html              # Hauptseite (One-Pager)
├── index.css               # Styles nur für die Hauptseite
├── main.js                 # Mobile-Menü, Header-Schatten (alle Seiten)
├── styles.css              # Gemeinsames Stylesheet (Design Tokens, Header, Footer, Content)
├── impressum.html          # Impressum
├── datenschutz.html        # Datenschutzerklärung (DSGVO)
├── 404.html                # Fehlerseite (Caddy handle_errors)
├── robots.txt              # Crawler-Regeln + Sitemap-Verweis
├── sitemap.xml             # Sitemap (sitemaps.org)
├── site.webmanifest        # Web-App-Manifest
├── favicon.svg             # Favicon (Rotkreuz-Emblem, Vektor)
├── favicon-32.png          # Favicon-Fallback (32×32)
├── apple-touch-icon.png    # iOS-Homescreen-Icon (180×180)
├── icon-192.png            # Manifest-Icon (192×192)
├── icon-512.png            # Manifest-Icon (512×512)
├── og-image.png            # Open-Graph-/Social-Vorschaubild (1200×630)
├── logo.png                # DRK-Logo, Quelle (710×709)
├── logo-68.png             # DRK-Logo für den Header (68×68, 2x für 34 px)
├── .well-known/
│   └── security.txt        # Sicherheitskontakt (RFC 9116)
├── .gitignore
├── docs/                   # Interne Dokumentation (wird nicht deployt)
├── LICENSE                 # MIT
└── README.md
```

## 🔒 Datenschutz & Sicherheit

* Keine Cookies, kein Tracking, keine Datenbank
* Keine externen Dienste oder CDNs; System-Font-Stack (keine Google Fonts)
* Strikte Content-Security-Policy (`default-src 'none'`, nur eigene Skripte/Styles/Bilder); keine Inline-Styles, keine `style`-Attribute, keine Inline-Scripts
* Weitere Security-Header: HSTS (inkl. Preload), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `X-Frame-Options: DENY`; kein `Server`-Header
* Server-Logs werden nach spätestens 7 Tagen automatisch gelöscht (Caddy `roll_keep_for 168h`) — entsprechend der Datenschutzerklärung
* Sicherheitskontakt nach RFC 9116: `/.well-known/security.txt`
* Hosting bei Hetzner (Deutschland), DNS über Hetzner DNS

## 🤝 Beitragen

1. Fork erstellen
2. Feature-Branch anlegen (`git checkout -b feat/mein-feature`)
3. Commit (`git commit -m 'feat: Neues Feature'`)
4. Push (`git push origin feat/mein-feature`)
5. Pull Request erstellen

Bitte beachten: Wegen der strikten CSP keine `style`-Attribute, keine `<style>`-Blöcke und keine Inline-Scripts in den HTML-Dateien verwenden — Styles gehören nach `styles.css` bzw. `index.css`, Script-Code nach `main.js`.

## 📄 Lizenz

MIT — Frei verwendbar für alle DRK-Gliederungen und darüber hinaus.

## 🏥 Über

Ein Projekt des [DRK-Kreisverband Städteregion Aachen e.V.](https://www.drk-aachen.de/)

---

*Gebaut mit ❤️ für das Deutsche Rote Kreuz*
