---
meta:
- property: og:title
  content: 安裝 Wings | Pterodactyl 繁體中文文件
- property: og:description
  content: Wings 是 Pterodactyl 全新一代的伺服器控制平面，用 Go 語言從頭打造，並吸收了初代 Node.js Daemon 累…
- property: og:image
  content: https://pterodactyl.tw/og/wings_1.0_installing.png
- property: og:image:width
  content: '1200'
- property: og:image:height
  content: '630'
- name: twitter:title
  content: 安裝 Wings | Pterodactyl 繁體中文文件
- name: twitter:description
  content: Wings 是 Pterodactyl 全新一代的伺服器控制平面，用 Go 語言從頭打造，並吸收了初代 Node.js Daemon 累…
- name: twitter:image
  content: https://pterodactyl.tw/og/wings_1.0_installing.png
---
# 安裝 Wings

Wings 是 Pterodactyl 全新一代的伺服器控制平面，用 Go 語言從頭打造，並吸收了初代 Node.js Daemon 累積下來的經驗。

::: warning 警告
Wings 只能安裝在 **Pterodactyl 1.x** 上，千萬不要拿去裝在舊版的 Pterodactyl。
:::

::: tip 一鍵安裝腳本
如果你不想照著下面的步驟一步一步手動安裝，我們也維護了一支自動化安裝腳本，可以超簡單地把繁體中文化版本的 Wings（也能一起裝 Panel）裝好，相依套件、Docker 等都會幫你設定完成。詳細說明與使用方式請參考[一鍵安裝腳本](/project/installer.md)。

如果你想更了解每個步驟實際在做什麼，或是想手動調整某些設定，還是建議往下讀完整份手動安裝說明。
:::

## 支援的系統

下表列出目前支援的作業系統，但這並不是一份完整清單；實際上你很可能在其他 Linux 發行版上也能順利跑起來,只是需要自己判斷該裝哪些對應套件。另外，表中列出版本的更新版通常也能正常運作，不必被表格本身限制住。

| 作業系統                            | 版本    |      是否支援       | 說明                                     |
| ---------------------------------- | ------- | :----------------: | ---------------------------------------- |
| **Ubuntu**                         | 20.04   | :white_check_mark: | 本文件以 Ubuntu 20.04 作為基礎作業系統撰寫。 |
|                                    | 22.04   | :white_check_mark: |                                           |
|                                    | 24.04   | :white_check_mark: |                                           |
| **RHEL / Rocky Linux / AlmaLinux** | 8       | :white_check_mark: |                                           |
|                                    | 9       | :white_check_mark: |                                           |
| **Debian**                         | 11      | :white_check_mark: |                                           |
|                                    | 12      | :white_check_mark: |                                           |
|                                    | 13      | :white_check_mark: |                                           |
| **Windows**                        | 全部    |        :x:         | 此軟體無法在 Windows 環境中執行。          |

## 系統需求

要跑 Wings，前提是這台 Linux 系統要能執行 Docker 容器。大多數 VPS，以及幾乎所有的專用伺服器都符合這個條件，不過仍然有少數例外要注意。

如果你的供應商用的是 `Virtuozzo`、`OpenVZ`（或稱 `OVZ`）或 `LXC` 這類虛擬化技術，那 Wings 很可能沒辦法在上面執行。雖然有些供應商已經透過巢狀虛擬化的方式讓 Docker 能跑起來，但保險起見還是建議先跟供應商的支援團隊確認清楚。相對地，KVM 虛擬化是確定沒問題的。

最簡單的確認方式，就是執行 `systemd-detect-virt` 這個指令。只要結果不是 `OpenVZ` 或 `LXC`，基本上就沒問題；如果你的機器是完全沒有虛擬化的專用硬體，這裡通常會顯示 `none`。

萬一上面這個方法在你的環境行不通，或是你還是不放心，也可以改用下面這個指令再確認一次。

```bash
dane@pterodactyl:~$ sudo dmidecode -s system-manufacturer
VMware, Inc.
```

## 相依套件

- curl
- Docker

### 安裝 Docker

想快速裝好 Docker CE，直接執行下面這行指令就好。

```bash
curl -sSL https://get.docker.com/ | CHANNEL=stable bash
```

如果你比較想自己手動安裝，可以參考 [Docker 官方文件](https://docs.docker.com/engine/install/)，裡面有詳細的 Docker CE 安裝步驟。

::: warning 檢查核心
這裡要提醒一下：有些主機商會提供經過修改的核心，這種核心可能不支援 Docker 的一些關鍵功能。建議先執行 `uname -r` 檢查一下核心版本，如果版本結尾是 `-xxxx-grs-ipv6-64` 或 `-xxxx-mod-std-ipv6-64`，就代表你用的很可能是不受支援的核心版本，詳細說明可以參考[核心修改](../../../daemon/0.6/kernel_modifications.md)這篇指南。
:::

#### 開機時啟動 Docker

如果你的作業系統有 systemd（例如 Ubuntu 16 以上、Debian 8 以上、CentOS 7 以上），執行下面這行指令，就能讓 Docker 在每次開機時自動啟動。

```bash
sudo systemctl enable --now docker
```

#### 啟用 Swap
::: tip 新版 Linux 核心
簡單來說，從 Linux 核心 6.1 開始，Swap 預設就已經啟用了，如果你的核心版本是 6.1 以上，這一步可以直接跳過。想確認核心版本，執行 `uname -r` 就能看到。
:::

在大多數系統上，Docker 預設其實是無法設定 Swap 空間的。你可以執行 `docker info`，看輸出結果的最後幾行有沒有出現 `WARNING: No swap limit support` 這樣的警告。

啟用 Swap 完全是可選的步驟，但如果你打算對外提供代管服務，還是建議啟用一下，可以避免發生 OOM（記憶體不足）錯誤。

如果要啟用 Swap，先以 root 身分開啟 `/etc/default/grub` 這個檔案，找到以 `GRUB_CMDLINE_LINUX_DEFAULT` 開頭的那一行，確認雙引號裡面有包含 `swapaccount=1`。

接著執行 `sudo update-grub`，再執行 `sudo reboot` 重新啟動伺服器，Swap 就會生效。下面是這一行設定的範例，_請不要直接整行複製貼上，因為裡面通常還會有你這台機器作業系統專屬的其他參數_。

```text
GRUB_CMDLINE_LINUX_DEFAULT="swapaccount=1"
```

::: tip GRUB 設定
小提醒：部分 Linux 發行版可能不會讀取 `GRUB_CMDLINE_LINUX_DEFAULT` 這個變數。如果照著上面設定卻沒有效果，可以試著改用 `GRUB_CMDLINE_LINUX` 看看。
:::

## 安裝 Wings

安裝 Wings 的第一步，是先把需要的目錄結構建起來。執行下面的指令，建立基礎目錄並下載 Wings 的執行檔。

```bash
sudo mkdir -p /etc/pterodactyl
curl -L -o /usr/local/bin/wings "https://github.com/Pterodactyl-TW/wings/releases/latest/download/wings_linux_$([[ "$(uname -m)" == "x86_64" ]] && echo "amd64" || echo "arm64")"
sudo chmod u+x /usr/local/bin/wings
```

::: warning OVH/SYS Servers
如果你用的是 OVH 或 SoYouStart 提供的伺服器，要注意一下：主要磁碟空間預設很可能是配置給 `/home`，而不是 `/`。這種情況下，建議把伺服器資料改存在 `/home/daemon-data`，建立節點的時候就能順手設定好。
:::

## 設定

裝好 Wings 跟相關元件之後，接下來要做的是回到已經安裝好的 Panel，在裡面建立一個節點。進入 Panel 管理介面，從側邊欄點選 Nodes，再按右邊的 Create New 按鈕即可。

節點建立完成後，點進去會看到一個叫 Configuration 的分頁。把裡面的程式碼區塊內容複製起來，貼到 `/etc/pterodactyl` 目錄下新建的 `config.yml` 檔案中,存檔即可。

或者更省事的做法是，直接點 Generate Token 按鈕，把它給你的 Bash 指令複製貼到終端機執行。

![wings 設定範例圖片](./../../.vuepress/public/wings_configuration_example.png)

::: warning 警告
如果你的 Panel 有啟用 SSL，那 Wings 的 FQDN 也需要一份對應的 SSL 憑證才行。繼續下一步之前，建議先看一下[建立 SSL 憑證](/tutorials/creating_ssl_certificates.html)這篇文件，了解怎麼把憑證準備好。
:::

### 啟動 Wings

先用下面的指令，加上 `--debug` 旗標以除錯模式啟動 Wings，確認過程中沒有任何錯誤之後，按 `CTRL+C` 把它終止，再依照下一節的說明改成以 Daemon 方式常駐執行。這裡提醒一下，依你伺服器的網路速度而定，Wings 第一次拉取映像檔並啟動可能會需要幾分鐘,耐心等一下就好。

```bash
sudo wings --debug
```

### 以 Daemon 執行（使用 systemd）

讓 Wings 在背景常駐執行其實不難，但前提是要先確認它能正常無錯誤地跑起來。準備好之後，在 `/etc/systemd/system` 目錄下新增一個叫 `wings.service` 的檔案，內容如下。

```text
[Unit]
Description=Pterodactyl Wings Daemon
After=docker.service
Requires=docker.service
PartOf=docker.service

[Service]
User=root
WorkingDirectory=/etc/pterodactyl
LimitNOFILE=4096
PIDFile=/var/run/wings/daemon.pid
ExecStart=/usr/local/bin/wings
Restart=on-failure
StartLimitInterval=180
StartLimitBurst=30
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

接著執行下面的指令，重新載入 systemd 設定並啟動 Wings。

```bash
sudo systemctl enable --now wings
```

### 節點配置

配置（Allocation）指的是可以指派給伺服器使用的 IP 與連接埠組合，每一台建立出來的伺服器至少都需要一組配置才能運作。一般情況下，配置用的會是網路介面本身的 IP 位址；但如果你的機器是在 NAT 後方，那就會改用內部 IP。想建立新的配置，前往 Nodes > 你的節點 > Allocation 頁面即可。

![節點配置範例圖片](../../.vuepress/public/node_allocations.png)

不確定該用哪個 IP 的話，可以執行 `hostname -I | awk '{print $1}'` 快速找出配置要用的 IP；如果想看所有可用的介面與位址，用 `ip addr | grep "inet "` 會列出完整清單。這裡要特別注意，127.0.0.1 不能拿來當作配置使用。
