# Minecraft

[[toc]]

## 設定伺服器網路（BungeeCord、Waterfall、HexaCord 等）

如果您想安全地運行 BungeeCord、Waterfall、HexaCord 等 Minecraft 代理伺服器，只要所有伺服器都位於同一個節點上，即可僅使用 Pterodactyl 完成設定。這與傳統的架設方式有幾項不同之處，並且可能需要額外的防火牆規則，本指南將說明相關設定。

:::warning
以下設定要求所有伺服器都位於同一個節點上。
:::

::: danger
如果您是主機代管服務供應商，並且要將代理網路提供給客戶，則每個節點上只能允許一個代理網路。
:::

### 控制面板中的配置

為代理伺服器建立一般配置，並使用節點的外部 IP 位址，讓使用者可以連線至代理伺服器。

代理伺服器後方的實際遊戲伺服器，應使用 `127.0.0.1` 作為位址的配置，這樣它們只能在節點內連線，而不會暴露於公開網路。

#### 範例

![](../../.vuepress/public/community/games/minecraft/proxy/node-allocations.png)

`10.1.70.62` 僅為範例，請將其替換為您自己的公開 IP 位址。

### 代理伺服器設定

代理伺服器與其他伺服器一樣，都是在具有網路隔離功能的 Docker 容器中執行。因此，`localhost`／`127.0.0.1` 指的是容器本身，而不是節點。您可以從容器內使用 `172.18.0.1` 連線至節點（除非 Pterodactyl 網路使用了不同的設定）。因此，您需要在代理伺服器設定中使用此 IP 位址。

#### BungeeCord／Waterfall 設定

其他代理伺服器的設定方式可能不同，請參閱其官方文件。

![](../../.vuepress/public/community/games/minecraft/proxy/bungee-config.png)

### Paper／Spigot／Bukkit 設定

遊戲伺服器本身需要使用代理伺服器所需的一般設定，通常包括停用線上模式。其他伺服器軟體的設定方式可能不同，請參閱其官方文件。

#### server.properties

將 `online-mode` 設為 `false`。

![](../../.vuepress/public/community/games/minecraft/proxy/paper-server.properties.png)

#### spigot.yml

將 `bungeecord` 設為 `true`。

![](../../.vuepress/public/community/games/minecraft/proxy/paper-spigot.yml.png)

### 防火牆

如果您正在使用防火牆，可能需要新增額外規則，才能讓節點上的伺服器彼此連線。在此情況下，代理伺服器需要連線至其後方的所有遊戲伺服器。因此，我們需要允許來自 Pterodactyl 網路的流量連線至 localhost 上的伺服器連接埠。

您可以參考以下指令。`172.18.0.1` 是 Pterodactyl 網路中預設用來指向節點的位址。請將 `<LOCALHOST_PORT>` 替換為遊戲伺服器所配置的 localhost 連接埠。

:::warning
以下指令會允許節點上的任何伺服器存取已開放的連接埠。
:::

#### UFW（Ubuntu）

允許 Pterodactyl 的 `pterodactyl0` 網路存取指定連接埠。

```bash
ufw allow in on pterodactyl0 to 172.18.0.1 port <LOCALHOST_PORT> proto tcp
```

#### Firewalld（CentOS）

允許來自 Pterodactyl `pterodactyl0` 網路的連線存取 `pterodactyl0`。

:::warning
此指令會允許任何伺服器存取節點上的所有連接埠，以及存取其他伺服器。
:::

```bash
firewall-cmd --permanent --zone=public --add-source=172.18.0.1
```