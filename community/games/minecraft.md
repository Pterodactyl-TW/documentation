# Minecraft

[[toc]]

## 設定伺服器網路（BungeeCord、Waterfall、HexaCord 等）

如果你想架設 BungeeCord、Waterfall、HexaCord 之類的 Minecraft 代理伺服器，而且是想安全地運行，只要所有伺服器都放在同一個節點上，其實光靠 Pterodactyl 就能完成整套設定，不需要額外工具。這裡要提醒的是，這種架設方式跟傳統做法有幾個地方不太一樣，可能還需要額外開一些防火牆規則，接下來就一步一步說明。

:::warning 警告
以下設定有個前提：所有伺服器都必須位於同一個節點上。
:::

::: danger 危險
如果你是主機代管服務供應商，打算把代理網路開放給客戶使用，這裡要特別注意，每個節點上只能允許存在一個代理網路，不能同時開多組。
:::

### 控制面板中的配置

先幫代理伺服器建立一組一般配置（Allocation），並使用節點的外部 IP 位址，這樣使用者才能連上代理伺服器。

至於代理伺服器後面實際在跑遊戲的伺服器，配置的位址則要改用 `127.0.0.1`，這樣一來，它們就只能在節點內部互相連線，不會直接暴露在公開網路上，安全性會好很多。

#### 範例

![](../../.vuepress/public/community/games/minecraft/proxy/node-allocations.png)

這裡的 `10.1.70.62` 只是範例用的 IP，實際設定時記得換成你自己的公開 IP 位址。

### 代理伺服器設定

有一點要先搞清楚：代理伺服器跟其他伺服器一樣，都是在具有網路隔離功能的 Docker 容器裡執行的。所以這裡說的 `localhost`／`127.0.0.1`，指的其實是容器本身，而不是節點主機。如果要從容器內連到節點，通常要用 `172.18.0.1` 這個位址（除非你的 Pterodactyl 網路做了不同的設定）。也因為這樣，代理伺服器的設定裡也要用這個 IP，才能正確連到後面的遊戲伺服器。

#### BungeeCord／Waterfall 設定

其他代理伺服器軟體的設定方式可能不太一樣，建議直接查閱它們各自的官方文件。

![](../../.vuepress/public/community/games/minecraft/proxy/bungee-config.png)

### Paper／Spigot／Bukkit 設定

遊戲伺服器這邊也要配合做一些基本設定，才能正常接受代理伺服器轉發過來的連線，最常見的就是要把線上模式關掉。同樣地，其他伺服器軟體的做法可能有差異，請以官方文件為準。

#### server.properties

把 `online-mode` 設為 `false`。

![](../../.vuepress/public/community/games/minecraft/proxy/paper-server.properties.png)

#### spigot.yml

把 `bungeecord` 設為 `true`。

![](../../.vuepress/public/community/games/minecraft/proxy/paper-spigot.yml.png)

### 防火牆

如果你的系統有開防火牆，可能還需要額外加幾條規則，才能讓同一個節點上的伺服器彼此連得到。原因是代理伺服器需要主動連到它後面的每一台遊戲伺服器，所以我們得放行從 Pterodactyl 網路過來、連往 localhost 上遊戲伺服器連接埠的流量。

底下提供幾個常見防火牆的設定指令參考。`172.18.0.1` 是 Pterodactyl 網路預設拿來指向節點的位址；記得把指令中的 `<LOCALHOST_PORT>` 換成遊戲伺服器實際配置的 localhost 連接埠。

:::warning 警告
這裡要注意，以下指令會讓節點上的任何伺服器都能存取到已開放的那個連接埠，不是只限代理伺服器。
:::

#### UFW（Ubuntu）

允許 Pterodactyl 的 `pterodactyl0` 網路存取指定連接埠。

```bash
ufw allow in on pterodactyl0 to 172.18.0.1 port <LOCALHOST_PORT> proto tcp
```

#### Firewalld（CentOS）

允許來自 Pterodactyl `pterodactyl0` 網路的連線存取 `pterodactyl0`。

:::warning 警告
這裡要特別小心，這條指令會讓任何伺服器都能存取節點上的所有連接埠，等於也能存取到其他伺服器，開之前務必評估清楚。
:::

```bash
firewall-cmd --permanent --zone=public --add-source=172.18.0.1
```
