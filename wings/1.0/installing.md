# 安裝 Wings

Wings 是 Pterodactyl 的新一代伺服器控制平面。它以 Go 和第一代 Node.js Daemon 的經驗為基礎，從頭重新打造。

::: warning
只有在執行 **Pterodactyl 1.x** 時才應安裝 Wings。請勿在舊版 Pterodactyl 上安裝此軟體。
:::

## 支援的系統

以下是支援的作業系統清單。請注意，這並非完整清單；你很可能也能在其他 Linux 發行版上輕鬆執行此軟體。
你需要自行判斷那些系統可能需要哪些套件。下列支援作業系統的新版本也很可能能正常運作，不受限於下表列出的版本。

| Operating System                   | Version |     Supported      | Notes                                                       |
| ---------------------------------- | ------- | :----------------: | ----------------------------------------------------------- |
| **Ubuntu**                         | 20.04   | :white_check_mark: | Documentation written assuming Ubuntu 20.04 as the base OS. |
|                                    | 22.04   | :white_check_mark: |                                                             |
|                                    | 24.04   | :white_check_mark: |                                                             |
| **RHEL / Rocky Linux / AlmaLinux** | 8       | :white_check_mark: |                                                             |
|                                    | 9       | :white_check_mark: |                                                             |
| **Debian**                         | 11      | :white_check_mark: |                                                             |
|                                    | 12      | :white_check_mark: |                                                             |
|                                    | 13      | :white_check_mark: |                                                             |
| **Windows**                        | All     |        :x:         | This software will not run in Windows environments.         |

## 系統需求

若要執行 Wings，需要具備執行 Docker 容器能力的 Linux 系統。大多數 VPS 與幾乎所有專用伺服器都能執行 Docker，
但仍有少數例外情況。

如果供應商使用 `Virtuozzo`、`OpenVZ`（或 `OVZ`）或 `LXC` 虛擬化，你很可能無法執行 Wings。部分供應商已進行必要變更，
透過巢狀虛擬化支援 Docker；請向供應商支援團隊確認。KVM 確定可以正常運作。

最簡單的檢查方式是輸入 `systemd-detect-virt`。如果結果不包含 `OpenVZ` 或 `LXC`，通常就沒問題。
在沒有任何虛擬化的專用硬體上執行時，結果會顯示 `none`。

如果因故無法使用上述方法，或你仍不確定，也可以執行下方命令。

```bash
dane@pterodactyl:~$ sudo dmidecode -s system-manufacturer
VMware, Inc.
```

## Dependencies

- curl
- Docker

### 安裝 Docker

若要快速安裝 Docker CE，可以執行下方命令：

```bash
curl -sSL https://get.docker.com/ | CHANNEL=stable bash
```

如果想手動安裝，請參閱 [Docker 官方文件](https://docs.docker.com/engine/install/)，了解如何在伺服器上安裝 Docker CE。

::: warning 檢查核心
請注意，部分主機安裝了修改過的核心，可能不支援重要的 Docker 功能。請執行 `uname -r` 檢查核心。
如果核心版本以 `-xxxx-grs-ipv6-64` 或 `-xxxx-mod-std-ipv6-64` 結尾，可能使用了不受支援的核心。
詳細資訊請參閱[核心修改](../../../daemon/0.6/kernel_modifications.md)指南。
:::

#### 開機時啟動 Docker

如果使用具備 systemd 的作業系統（Ubuntu 16+、Debian 8+、CentOS 7+），請執行下方命令，讓 Docker 在機器開機時啟動。

```bash
sudo systemctl enable --now docker
```

#### 啟用 Swap
::: tip 新版 Linux 核心
自 Linux 核心 6.1 起，Swap 預設已啟用。如果執行核心版本 6.1 或更新版本，可以跳過此步驟。
請執行 `uname -r` 檢查核心版本。
:::

在大多數系統上，Docker 預設無法設定 Swap 空間。你可以執行 `docker info`，查看輸出底部附近是否有 `WARNING: No swap limit support`。

啟用 Swap 完全是選擇性的，但如果要為他人提供託管服務，建議啟用以防止 OOM 錯誤。

若要啟用 Swap，請以 root 使用者開啟 `/etc/default/grub`，找到以 `GRUB_CMDLINE_LINUX_DEFAULT` 開頭的行，
並確認雙引號內包含 `swapaccount=1`。

接著執行 `sudo update-grub`，再執行 `sudo reboot` 重新啟動伺服器並啟用 Swap。
以下是該行的範例，_請勿原樣複製，因為其中通常還有作業系統專用參數_。

```text
GRUB_CMDLINE_LINUX_DEFAULT="swapaccount=1"
```

::: tip GRUB 設定
部分 Linux 發行版可能會忽略 `GRUB_CMDLINE_LINUX_DEFAULT`。如果預設設定無法運作，可能需要改用 `GRUB_CMDLINE_LINUX`。
:::

## 安裝 Wings

安裝 Wings 的第一步，是確認已建立必要的目錄結構。請執行下方命令建立基礎目錄並下載 Wings 執行檔。

```bash
sudo mkdir -p /etc/pterodactyl
curl -L -o /usr/local/bin/wings "https://github.com/pterodactyl/wings/releases/latest/download/wings_linux_$([[ "$(uname -m)" == "x86_64" ]] && echo "amd64" || echo "arm64")"
sudo chmod u+x /usr/local/bin/wings
```

::: warning OVH/SYS Servers
如果使用 OVH 或 SoYouStart 提供的伺服器，請注意主要磁碟空間很可能預設配置給 `/home`，而不是 `/`。
請考慮使用 `/home/daemon-data` 儲存伺服器資料。建立節點時即可輕鬆設定。
:::

## 設定

安裝 Wings 與必要元件後，下一步是在已安裝的 Panel 上建立節點。前往 Panel 管理介面，從側邊欄選取 Nodes，
再點選右側的 Create New 按鈕。

建立節點後，點選該節點，你會看到名為 Configuration 的分頁。複製程式碼區塊內容，貼到 `/etc/pterodactyl` 中名為 `config.yml` 的新檔案，
然後儲存。

或者可以點選 Generate Token 按鈕，複製 Bash 命令並貼到終端機中。

![example image of wings configuration](./../../.vuepress/public/wings_configuration_example.png)

::: warning
如果 Panel 使用 SSL，Wings 的 FQDN 也必須建立 SSL 憑證。繼續之前，請參閱[建立 SSL 憑證](/tutorials/creating_ssl_certificates.html)文件頁面，
了解如何建立這些憑證。
:::

### 啟動 Wings

若要啟動 Wings，請執行下方命令，以除錯模式啟動。確認沒有錯誤後，使用 `CTRL+C` 終止程序，並依照下方說明將其作為 Daemon 執行。
依伺服器網際網路連線速度而定，Wings 首次拉取並啟動可能需要幾分鐘。

```bash
sudo wings --debug
```

你也可以選擇加入 `--debug` 旗標，以除錯模式執行 Wings。

### 以 Daemon 執行（使用 systemd）

讓 Wings 在背景執行很簡單，但請先確認它能無錯誤執行。將下方內容放入 `/etc/systemd/system` 目錄中名為 `wings.service` 的檔案。

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

接著執行下方命令重新載入 systemd 並啟動 Wings。

```bash
sudo systemctl enable --now wings
```

### 節點配置

配置是可以指派給伺服器的 IP 與連接埠組合。每台建立的伺服器至少必須有一個配置。配置通常是網路介面的 IP 位址；
在 NAT 後方等情況下，則會是內部 IP。若要建立新配置，請前往 Nodes > 你的節點 > Allocation。

![example image of node allocations](../../.vuepress/public/node_allocations.png)

輸入 `hostname -I | awk '{print $1}'` 找出配置要使用的 IP。或者輸入 `ip addr | grep "inet "` 查看所有可用介面與 IP 位址。
請勿將 127.0.0.1 用於配置。
