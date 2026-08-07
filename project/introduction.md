---
meta:
- property: og:title
  content: 介紹 | Pterodactyl 繁體中文文件
- property: og:description
  content: Pterodactyl 是一套採用 PHP、React 與 Go 建置的開源遊戲伺服器管理面板。從一開始設計就把安全性放在第一位，
- property: og:image
  content: https://pterodactyl.tw/og/project_introduction.png
- property: og:image:width
  content: '1200'
- property: og:image:height
  content: '630'
- name: twitter:title
  content: 介紹 | Pterodactyl 繁體中文文件
- name: twitter:description
  content: Pterodactyl 是一套採用 PHP、React 與 Go 建置的開源遊戲伺服器管理面板。從一開始設計就把安全性放在第一位，
- name: twitter:image
  content: https://pterodactyl.tw/og/project_introduction.png
---
# 介紹
Pterodactyl 是一套採用 PHP、React 與 Go 建置的開源遊戲伺服器管理面板。從一開始設計就把安全性放在第一位，
所有遊戲伺服器都跑在互相隔離的 Docker 容器裡，同時還提供美觀又直覺的介面，不管是管理員還是一般使用者都能輕鬆上手。
不用再忍受難用的管理後台了，讓遊戲伺服器也能享有第一等公民的待遇。

## 支援的遊戲
因為每個遊戲執行個體都跑在各自獨立的 Docker 容器裡，Pterodactyl 天生就能支援非常多種不同的遊戲。
不管你的伺服器散布在世界各地，都不需要在每台實體機器上手動安裝一堆額外的相依套件。

以下是我們核心支援的遊戲：

* Minecraft：包含 Spigot、Sponge、Bungeecord、Waterfall 等多種核心可選
* Rust
* Terraria
* Teamspeak
* Mumble
* Team Fortress 2
* Counter Strike: Global Offensive
* Garry's Mod
* ARK: Survival Evolved

除了官方標準支援的遊戲 Nest 之外，社群也一直在不斷擴充這套軟體能支援的範圍，額外提供了許多其他遊戲。以下列出其中幾個：

* Factorio
* San Andreas: MP
* Pocketmine MP
* Squad
* FiveM
* Xonotic
* Discord ATLBot
* [還有更多...](https://eggs.pterodactyl.tw)

## 負責任的漏洞揭露
Pterodactyl 完全開放原始碼，非常歡迎獨立使用者與資安研究人員檢視程式碼、尋找潛在的安全性問題。
如果你發現任何可疑之處，請直接聯絡 `support@pterodactyl.io`。這裡要特別提醒：回報安全性問題時請採取負責任的揭露方式，_千萬不要_ 把問題直接公開回報到錯誤追蹤系統上，以免在修復之前就被有心人士利用。
