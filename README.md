# 🏰 Webová hra | WEB + MPA | ClashOfBrynza

Naše hra je jednoduché **budovatelské RPG** v prohlížeči. Hráč si buduje vlastní vesnici, rozvíjí ji, sbírá suroviny (ovce 🐑) a postupně odemyká nové možnosti.

---

[🚀 Otevřít hru](https://id-117.pslib.cloud/)

---

## ⚙️ Technologie

Používáme moderní stack, který kombinuje backend, frontend i práci s animacemi:

- **ASP.NET** – backendová logika, API, autentizace
- **React** – frontend, dynamické UI
- **Konva.js** – animace jednotek, efektů a objektů
- **Canvas** – vykreslování mapy a herních prvků
- **Docker** – snadné nasazení

---

## 🎯 Gameplay

Základní ekonomický model a herní logika budovatelské strategie založené na balancování zdrojů, populace a prostoru.

### 🕹️ Přehled herního systému

Hra je založena na uzavřeném cyklu tří hlavních proměnných: **Ovce**, **Populace** a **Volná půda**. Hráč musí expandovat, aby odemkl nové technologie, ale každá expanze ohrožuje jeho potravinovou bezpečnost.

---

### 📊 Hlavní proměnné

| Proměnná       | Symbol | Popis                                                     |
| :------------- | :----- | :-------------------------------------------------------- |
| **Ovce**       | $S$    | Hlavní měna pro stavbu a zároveň potrava pro lidi.        |
| **Populace**   | $P$    | Počet obyvatel. Určuje spotřebu a odemyká upgrady.        |
| **Volná půda** | $L$    | Celková plocha mínus zastavěná plocha. Určuje limit ovcí. |

---

### ⚙️ Core Mechaniky

#### 1. Management prostoru

Každá postavená budova (dům) snižuje množství volné půdy ($L$). Množství volné půdy přímo definuje **maximální počet ovcí**, které může hráč vlastnit.

- _Důsledek:_ Čím více domů postavíš, tím méně ovcí můžeš dlouhodobě chovat.

#### 2. Spotřeba a Hladomor

Populace ke svému přežití vyžaduje neustálý přísun ovcí.

- **Stav hladomoru:** Pokud zásoba ovcí ($S$) klesne na 0, populace začne vymírat ($P$ se snižuje v čase).

#### 3. Progres (Radnice)

Radnice slouží jako technologický uzel. Její vylepšení je podmíněno dosažením určité úrovně populace.

- _Strategický prvek:_ Hráč musí často postavit více domů, než kolik dokáže jeho půda dlouhodobě uživit, jen aby "protnul" hranici pro upgrade radnice.

---

### 🔄 Herní smyčka (Game Loop)

1.  **Sběr zdrojů:** Ovce se generují na volné půdě (do výše $S_{max}$).
2.  **Expanze:** Hráč utratí ovce za stavbu domů -> zvýší se populace, ale klesne $S_{max}$.
3.  **Krize:** Vyšší populace spotřebovává více ovcí. Hráč musí balancovat na hraně kapacity.
4.  **Upgrade:** Dosažení populačního cíle -> Upgrade radnice -> Nové možnosti (efektivita, vertikální růst).

---

### 🛠️ Budoucí rozšíření

- [ ] **Efektivita pastvy:** Technologie zvyšující počet ovcí na jednotku půdy.
- [ ] **Vertikální růst:** Upgrady domů (více lidí na stejné ploše)