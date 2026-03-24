Playwright E2E Test für Restaurant-Buchungsplattform

Beschreibung

Dieser automatisierte End-to-End-Test führt eine vollständige Veranstaltungserstellung auf einer Restaurant-Buchungsplattform durch:

Login mit Testzugang

Auswahl eines Saals

Dynamische Auswahl des ersten verfügbaren Datums im Kalender (belegte Termine werden automatisch übersprungen)

Eingabe von Zeit, Gästezahl, Veranstaltungstyp und Quelle

Vergabe eines eindeutigen Namens für die Veranstaltung

Absenden des Formulars und Überprüfung der erfolgreichen Erstellung

Technologien

Playwright

TypeScript

Node.js

Ausführen

Abhängigkeiten installieren:
npm install

Test im Chrome starten:
npx playwright test tests/create-event.spec.ts --project=chromium --headed

Struktur

tests/
create-event.spec.ts # Haupttest
playwright.config.ts # Konfiguration
package.json

Sicherheit

Login-Daten werden über eine .env-Datei eingelesen und sind nicht im Repository enthalten.

Autor

Alena Lisniak
https://www.linkedin.com/in/alena-lisniak-718588141/
