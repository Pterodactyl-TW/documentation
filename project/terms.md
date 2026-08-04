# 術語
**Panel** — 指 Pterodactyl Panel 本身，可讓你在系統中新增節點與伺服器。

**Node** — 執行 Wings 執行個體的實體機器。

**Wings** — 以 Go 撰寫的新一代服務，與 Docker 和 Panel 介接，為透過 Panel 控制伺服器提供安全存取。

**Server** — 此處的伺服器是指由 Panel 建立的執行中執行個體。這些伺服器會建立在節點上，
每個節點可以擁有多台伺服器。

**Docker** — Docker 是一個可將應用程式與基礎架構分離，並放入隔離且安全容器的平台。

**Docker Image** — Docker 映像檔包含執行容器化應用程式所需的一切內容（例如 Minecraft 伺服器所需的 Java）。

**Container** — 每台伺服器都會在隔離的容器中執行，以強制套用硬體限制（例如 CPU 與 RAM），
並避免同一節點上的伺服器彼此干擾。這些容器由 Docker 建立。

**Nest** — 每個 Nest 通常代表一款特定遊戲或服務，例如 Minecraft、Teamspeak 或 Terraria，並可包含多個 Egg。

**Egg** — 每個 Egg 通常用來儲存特定遊戲類型的設定，例如 Minecraft 的 Vanilla、Spigot 或 Bungeecord。

**Yolks** — 精選的核心 Docker 映像檔集合，可搭配 Pterodactyl 的 Egg 系統使用。


## 簡易設定架構圖
![](./../.vuepress/public/simple_setup_diagram.png)


## 進階設定架構圖
::: tip 在同一台機器上執行 Panel 與 Wings
你也可以將 Wings 安裝在 Panel 所在的機器上，讓同一台機器同時擔任 Panel 與節點。
:::
![](./../.vuepress/public/example_setup.png)
