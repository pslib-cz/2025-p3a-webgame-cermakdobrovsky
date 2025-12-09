# 🏰 Webová hra | WEB + MPA

Naše hra je jednoduché **budovatelské RPG** v prohlížeči. Hráč si buduje vlastní vesnici, rozvíjí ji, sbírá suroviny (ovce 🐑) a postupně odemyká nové možnosti.

## 🎮 Herní koncept

- **Budování vesnice** – hráč staví a vylepšuje budovy, které generují ovce, obyvatele nebo strategické bonusy.
- **Unikátní role budov** – každá budova má vlastní účel (produkční, obranné, rekrutovací…).
- **Dobývání jiných vesnic** _(pokud stihneme)_ – trénink vojáků, útoky na jiné hráče, porovnání statistik.
- **Náhodné události (Eventy)** _(pokud stihneme)_ – bonusy, katastrofy, buffy a speciální herní situace.

## 🧩 Klíčová logika | Mini hry
- **Generování vesnice z databáze** podle přihlášeného hráče.
- **Akční menu budov** – upgrady, čas stavby, prodej, detailní panel informací.
- **Animační logika** – efekty stavby, upgradu, produkce nebo boje.
- **Úvodní tutorial** – interaktivní vedení hráče při začátku hry.
- **Dynamické renderování grafiky** podle vybraného klanu / stylu hráče.
- **Ukládání hry** - s NoSQL db
- **Počasí podle lokace hráče (z DB)** _(pokud zbyde čas)_ – mění světlo, efekty, vizuální atmosféru a možné eventy.
- **Battle logika** _(pokud zbyde čas)_ – simulace soubojů, výpočty armád, zásob a levelů.

---

## ⚙️ Technologie
Používáme moderní stack, který kombinuje backend, frontend i práci s animacemi:

- **ASP.NET** – backendová logika, API, autentizace
- **React** – frontend, dynamické UI
- **NoSQL databáze** – ukládání vesnic, hráčů, budov a progresu
- **Konva.js** – animace jednotek, efektů a objektů
- **Canvas** – vykreslování mapy a herních prvků
- **Docker** – snadné nasazení

---
  
## Gameplay

### Mění
- **Ovce** - Hlavní měna
- **Populace** - Čím větší populace tím rychleji se množí ovce
- **Vojáci** - Na dobývání jiných vesnic *(pokud zbyde čas)*
- **Level** - Ukazuje současný level radnice. Vedlejší budovy nejdou upgradovat na vyšší level než tento.

### Budování vesnice
- Uživatel může stavit nové budovy, nebo upgradovat staré.
- Každá budova má svůj level - maximální level budovy je vždy level radnice

### Menu budovy
- Po kliknutí na budovu vyskočí menu, kde uživatel uvidí popis budovy a bude moct upgradovat nebo odstranit budovu.

### Obchod
- v HUD bude tlačítko "Obchod" kde si uživatel bude moct koupit nové budovy
- Po koupení budovy si uživatel vybere kam chce budovu položit.

### Budovy
- **Radnice** - Hlavní budova, uřčuje level hráče, maximální level ostatních budov a maximální peníze. Upgrade této budovy vyžaduje nejvíce peněz a maximální level ostatních budov.
- **Domek** - Navyšuje populaci
- **Věž** - Navyšuje vojstvo *(pokud zbyde čas)*

### Menu bojování 
*(pokud zbyde čas)*
- Mapa vesnic, u vesnice je napsané kolik je potřeba vojstva, levelu aby byla dobyta.
- Jestli uživatel múže dobýt vesnicy tak dostane víc penež než bylo potřeba (funguje to vlastně jako výměna vojska za peníze)