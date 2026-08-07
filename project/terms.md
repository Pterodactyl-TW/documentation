---
meta:
- property: og:title
  content: 術語 | Pterodactyl 繁體中文文件
- property: og:description
  content: 剛接觸 Pterodactyl 的時候，常常會被一堆專有名詞搞得一頭霧水。這裡把常見的詞彙都整理在一起，看到不熟悉的名詞時，回來查看一下…
- property: og:image
  content: https://pterodactyl.tw/og/project_terms.png
- property: og:image:width
  content: '1200'
- property: og:image:height
  content: '630'
- name: twitter:title
  content: 術語 | Pterodactyl 繁體中文文件
- name: twitter:description
  content: 剛接觸 Pterodactyl 的時候，常常會被一堆專有名詞搞得一頭霧水。這裡把常見的詞彙都整理在一起，看到不熟悉的名詞時，回來查看一下…
- name: twitter:image
  content: https://pterodactyl.tw/og/project_terms.png
---
# 術語

剛接觸 Pterodactyl 的時候，常常會被一堆專有名詞搞得一頭霧水。這裡把常見的詞彙都整理在一起，看到不熟悉的名詞時，回來查看一下就好。

**Panel（控制面板）**：指 Pterodactyl Panel 本身，也就是你平常在瀏覽器裡操作、用來新增節點與伺服器的網頁介面。

**Node（節點）**：實際跑著 Wings 的那台實體（或虛擬）機器，伺服器最終都是在節點上執行的。

**Wings**：用 Go 語言寫成的新一代服務，負責跟 Docker、Panel 溝通，讓 Panel 能安全地控制伺服器。

**Server（伺服器）**：這裡指的是由 Panel 建立、實際在執行中的一個個體。每個伺服器都會被建立在某個節點上，一個節點可以同時容納多台伺服器。

**Docker**：一個能把應用程式跟它所需的執行環境打包在一起、放進隔離且安全容器裡執行的平台。

**Docker Image（Docker 映像檔）**：包含執行某個容器化應用程式所需的一切內容，例如要跑 Minecraft 伺服器，映像檔裡就會包含所需的 Java 環境。

**Container（容器）**：每台伺服器實際上都是在一個獨立的容器裡執行的，這樣才能強制套用硬體限制（例如 CPU、RAM），也能避免同一節點上的伺服器互相干擾。容器本身是由 Docker 建立的。

**Nest**：通常代表某一款特定遊戲或服務，例如 Minecraft、Teamspeak 或 Terraria，一個 Nest 底下可以包含多個 Egg。

**Egg**：用來儲存某種特定遊戲類型的設定範本，例如同樣是 Minecraft，就可以有 Vanilla、Spigot、Bungeecord 等不同的 Egg。

**Yolks**：一組經過挑選、能搭配 Pterodactyl 的 Egg 系統使用的核心 Docker 映像檔集合。


## 簡易設定架構圖
![](./../.vuepress/public/simple_setup_diagram.png)


## 進階設定架構圖
::: tip 在同一台機器上執行 Panel 與 Wings
你也可以將 Wings 安裝在 Panel 所在的機器上，讓同一台機器同時擔任 Panel 與節點。
:::
![](./../.vuepress/public/example_setup.png)
