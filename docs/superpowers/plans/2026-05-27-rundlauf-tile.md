# Rundlaufbeschlüsse-Kachel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Neue, eigenständige Produkt-Kachel für `rundlauf.drk-abstimmung.de` (Rundlaufbeschlüsse) in den Produkt-Grid auf drk-digital.io einfügen.

**Architecture:** Reine HTML-Änderung in `index.html`. Eine zusätzliche `<a class="product-card">` direkt nach der bestehenden Abstimmung-Kachel (thematisch verwandt → visuelle Nachbarschaft). Eigene Akzentfarbe (Indigo), damit die Kachel optisch klar als separates Tool erkennbar ist, aber dezent zur Familie passt. Inline-SVG für das Icon (Rotationssymbol = Rundlauf). Keine CSS-Änderungen nötig — bestehende `.product-card`-Klassen wiederverwenden.

**Tech Stack:** Statisches HTML, Caddy file_server, Git-basiertes Deployment (`origin/redesign/editorial-design-update`).

---

## Vorabentscheidungen

| Entscheidung | Wert | Begründung |
|---|---|---|
| Position im Grid | direkt nach Abstimmung-Kachel (vor NIS2 Audit) | Rundlauf ist semantisch eine Erweiterung der Abstimmung |
| Akzentfarbe | Indigo (`#eef2ff` → `#e0e7ff`, Icon `#4f46e5`) | Noch nicht im Grid verwendet; visuell distinkt aber harmonisch |
| Icon | `refresh-cw` (zwei rotierende Pfeile) aus dem bestehenden Lucide-Stil | Visualisiert Rundlauf/Umlaufverfahren |
| Card-Name | "DRK Rundlaufbeschlüsse" | Konsistent zu "DRK …" Namensschema |
| Beschreibung | Kurz, max 2 Sätze, Bezug zu Vereinsrecht/Vorständen, DSGVO-Hinweis | Konsistent zu anderen Karten |
| Badge | `badge-live` | Wenn Tool live ist (verifizieren in Task 1) |
| Link-Target | `_blank` + `rel="noopener"` | Konsistent zu allen anderen Karten |

---

## Task 1: Erreichbarkeit & Live-Status prüfen

**Files:** keine — reine Verifikation

- [ ] **Step 1: HTTPS-Erreichbarkeit prüfen**

```bash
curl -sI -o /dev/null -w "%{http_code}\n" https://rundlauf.drk-abstimmung.de
```

Erwartet: `200` (oder `301`/`302` → dann Ziel folgen mit `-L`).

Falls **nicht** 200/3xx: Badge in Task 2 auf `badge-beta` setzen statt `badge-live`. Falls Domain noch nicht aufgelöst wird: dem Nutzer melden und auf Bestätigung warten, bevor weitergemacht wird.

- [ ] **Step 2: Vorhandene Badge-Klassen verifizieren**

```bash
grep -nE "badge-(live|beta|soon)" /var/www/drk-digital/index.html | head -5
```

Erwartet: `badge-live` existiert. Falls `badge-beta` oder ähnliches benötigt wird und nicht existiert → in Task 2 trotzdem `badge-live` verwenden und im Commit-Body anmerken.

---

## Task 2: Kachel in index.html einfügen

**Files:**
- Modify: `/var/www/drk-digital/index.html` (Einfügung **nach Zeile 874**, also direkt nach dem schließenden `</a>` der Abstimmung-Kachel)

- [ ] **Step 1: Read aktuelle Stelle, um Kontext für Edit zu haben**

Read `/var/www/drk-digital/index.html` Zeilen 860–880, um sicherzustellen, dass die Abstimmung-Kachel unverändert ist und der `old_string` für den Edit eindeutig matcht.

- [ ] **Step 2: Edit ausführen**

`old_string` (genau wie in der Datei, inkl. Einrückung mit Leerzeichen):

```html
          <!-- Abstimmung -->
          <a href="https://drk-abstimmung.de" target="_blank" rel="noopener" class="product-card fade-up">
            <div class="product-card-header">
              <div class="product-icon-wrap" style="background:linear-gradient(135deg,#fef2f2,#fee2e2);color:#dc2626;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 13-6-6-6 6"/><path d="M6 5v14"/><path d="M18 5v14"/></svg>
              </div>
              <span class="badge badge-live">Live</span>
            </div>
            <div class="product-card-name">DRK Vereinsabstimmung</div>
            <p class="product-card-desc">Digitale Abstimmungen für Gremien und Mitgliederversammlungen — anonym, nachvollziehbar und DSGVO-konform.</p>
            <div class="product-card-footer">
              Tool öffnen
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </a>
```

`new_string` (identischer Block + neue Kachel direkt darunter, mit identischer Einrückung):

```html
          <!-- Abstimmung -->
          <a href="https://drk-abstimmung.de" target="_blank" rel="noopener" class="product-card fade-up">
            <div class="product-card-header">
              <div class="product-icon-wrap" style="background:linear-gradient(135deg,#fef2f2,#fee2e2);color:#dc2626;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 13-6-6-6 6"/><path d="M6 5v14"/><path d="M18 5v14"/></svg>
              </div>
              <span class="badge badge-live">Live</span>
            </div>
            <div class="product-card-name">DRK Vereinsabstimmung</div>
            <p class="product-card-desc">Digitale Abstimmungen für Gremien und Mitgliederversammlungen — anonym, nachvollziehbar und DSGVO-konform.</p>
            <div class="product-card-footer">
              Tool öffnen
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </a>

          <!-- Rundlaufbeschlüsse -->
          <a href="https://rundlauf.drk-abstimmung.de" target="_blank" rel="noopener" class="product-card fade-up">
            <div class="product-card-header">
              <div class="product-icon-wrap" style="background:linear-gradient(135deg,#eef2ff,#e0e7ff);color:#4f46e5;">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/></svg>
              </div>
              <span class="badge badge-live">Live</span>
            </div>
            <div class="product-card-name">DRK Rundlaufbeschlüsse</div>
            <p class="product-card-desc">Beschlüsse im Umlaufverfahren — rechtssicher dokumentiert für Vorstände und Gremien zwischen den Sitzungen. DSGVO-konform.</p>
            <div class="product-card-footer">
              Tool öffnen
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </a>
```

**Hinweis:** Falls Task 1 Step 1 nicht `200`/`3xx` ergab, in der neuen Kachel `badge-live`/`Live` durch das passende Badge ersetzen (oder Badge komplett weglassen, falls keine Beta-Klasse existiert).

---

## Task 3: HTML-Validität und Rendering prüfen

**Files:** keine

- [ ] **Step 1: Anzahl `product-card` zählen (Vorher 6 → Nachher 7)**

```bash
grep -c 'class="product-card fade-up"' /var/www/drk-digital/index.html
```

Erwartet: `7`

- [ ] **Step 2: Tag-Balance prüfen — sicherstellen, dass die neue Kachel die Grid-Struktur nicht bricht**

```bash
python3 -c "
import re
html = open('/var/www/drk-digital/index.html').read()
# Anzahl öffnender vs. schließender Tags in der Produkt-Section
section = re.search(r'<section id=\"produkte\".*?</section>', html, re.DOTALL).group()
a_open = len(re.findall(r'<a [^>]*class=\"product-card', section))
a_close = section.count('</a>')
print(f'product-card-Links: {a_open}, </a> in Section: {a_close}')
assert a_open == 7, f'Erwartet 7 product-cards, gefunden {a_open}'
print('OK')
"
```

Erwartet: `product-card-Links: 7, </a> in Section: 7` + `OK`

- [ ] **Step 3: Lokales Rendering verifizieren via Caddy**

```bash
curl -s https://drk-digital.io | grep -c "rundlauf.drk-abstimmung.de"
```

Erwartet: `1` (genau ein Treffer in der ausgelieferten Seite).

Falls `0`: Caddy serviert evtl. cached. Mit `systemctl reload caddy` neu laden und erneut prüfen.

---

## Task 4: Git-Commit und Push

**Files:** alle in Task 2 geänderten

- [ ] **Step 1: Diff sichten**

```bash
cd /var/www/drk-digital && git diff index.html
```

Erwartet: Nur die neue Kachel als Hinzufügung, keine ungewollten Änderungen (Whitespace, Tag-Ordering).

- [ ] **Step 2: Commit anlegen**

```bash
cd /var/www/drk-digital && git add index.html && git commit -m "$(cat <<'EOF'
feat: Rundlaufbeschlüsse-Kachel hinzugefügt

Neue Produkt-Kachel für rundlauf.drk-abstimmung.de — eigenständig
neben DRK Vereinsabstimmung positioniert, Indigo-Akzent.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 3: Push zum Remote**

```bash
cd /var/www/drk-digital && git push origin redesign/editorial-design-update
```

Erwartet: `redesign/editorial-design-update -> redesign/editorial-design-update` erfolgreich.

⚠️ **Vor dem Push beim Nutzer rückversichern**, falls die Branch auf einen Pull Request hin gearbeitet wird oder das Live-Deployment direkt vom Push triggert. (Caddy serviert `/var/www/drk-digital` direkt — Änderung ist sofort live, sobald in dem Verzeichnis. Hier wurde direkt im Live-Pfad gearbeitet.)

---

## Self-Review Notes

- Spec-Abdeckung: ✅ neue Kachel (Task 2), separat (eigene Card, eigener Akzent), für `rundlauf.drk-abstimmung.de` (Link in Task 2)
- Keine Placeholders: SVG, Farben, Texte alle ausformuliert
- Type-Konsistenz: identisches Markup-Schema zu den 6 anderen Karten
- Fallback bei Erreichbarkeitsproblem in Task 1 explizit beschrieben
