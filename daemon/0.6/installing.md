---
meta:
    - name: robots
      content: noindex
---
# 安裝

::: danger 此軟體已遭棄用
本文件適用於**已遭棄用的軟體**，不再提供任何安全性更新或社群支援。
基於歷史原因，本文件仍保留供查閱。

在正式環境中，你應安裝並使用 [Wings](/wings/1.0/installing.md) 以及 [Pterodactyl 控制面板 1.0](/panel/1.0/getting_started.md)。
:::

::: warning
此軟體僅適用於 Pterodactyl v0.7，**不得用於 Pterodactyl v1.0**。如果你已經安裝了 1.0，請改用 [Wings](/wings/1.0/installing.html)。
:::

[[toc]]

## 支援的系統
| 作業系統          | 版本                                                             |        支援與否        | 備註                                                       |
| ---------------- | -------------------------------------------------------------- | :----------------: | ----------------------------------------------------------- |
| **Ubuntu**       | 18.04                                                          | :white_check_mark: | 本文件以 Ubuntu 18.04 作為基礎作業系統撰寫。 |
|                  | [20.04](/community/installation-guides/daemon/ubuntu2004.html) | :white_check_mark: |
| **CentOS**       | [7](/community/installation-guides/daemon/centos7.html)        |     :warning:      | 需要額外的套件庫                                    |
|                  | [8](/community/installation-guides/daemon/centos8.html)        | :white_check_mark: |                                                             |
| **Debian**       | [9](/community/installation-guides/daemon/debian9.html)        | :white_check_mark: |                                                             |
|                  | [10](/community/installation-guides/daemon/debian10.html)      | :white_check_mark: |                                                             |

## 系統需求
在開始安裝之前，先確認一下環境是否合適：Daemon 需要一套能夠執行 Docker 容器的系統才能運作。大多數 VPS 與幾乎所有專用伺服器都能執行 Docker，但仍有少數例外情況要留意。

舉例來說，如果你的服務供應商使用的是 `Virtuozzo`、`OpenVZ`（或 `OVZ`）或 `LXC`，你很可能無法在上面執行 Daemon。如果不確定主機用的是哪種虛擬化技術，最簡單的辦法就是查看供應商網站，或直接聯絡他們的支援團隊詢問。

除此之外，你也可以自己動手查：執行 `lscpu`，看看列出的虛擬化類型是什麼。以下範例顯示 Hypervisor 使用完整虛擬化（full virtualization），代表可以正常支援 Docker；如果供應商顯示為 `KVM`，通常也沒問題。

``` bash
dane@daemon:~$ lscpu | grep 'vendor\|type'
Hypervisor vendor:     VMware
Virtualization type:   full
```

如果上述方法因故無法使用，或你查完之後還是不太確定，也可以改執行下方命令；一般來說，只要結果不是 `Xen` 或 `LXC`，就通常可以繼續往下操作。

``` bash
dane@daemon:~$ sudo dmidecode -s system-manufacturer
VMware, Inc.
```

## 相依套件
確認環境沒問題之後，接下來 Pterodactyl Daemon 還需要系統中安裝好以下這些相依套件才能正常運作。

* Docker
* Nodejs（`v10`、`v12`，較新版本應該也可以運作，但未經測試）
* `node-gyp`
* `tar`
* `unzip`
* `make`、`gcc`（CentOS 上為 `gcc-c++`）、`g++`
* `python`

### 安裝 Docker
先從 Docker 開始。如果只是想快速安裝 Docker CE，可以直接執行下方命令：
``` bash
curl -sSL https://get.docker.com/ | CHANNEL=stable bash
```

如果你比較想手動安裝，可以參閱 Docker 官方文件，了解如何在伺服器上安裝 Docker CE。以下列出幾個常見系統的快速連結，方便你直接查閱：

* [Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce)
* [CentOS](https://docs.docker.com/install/linux/docker-ce/centos/#install-docker-ce)
* [Debian](https://docs.docker.com/install/linux/docker-ce/debian/#install-docker-ce)

::: warning 檢查你的核心
這裡有個地方要特別注意：部分主機安裝了修改過的核心，可能不支援重要的 Docker 功能。建議先執行 `uname -r` 檢查一下核心版本。如果版本是以 `-xxxx-grs-ipv6-64` 或 `-xxxx-mod-std-ipv6-64` 結尾，就代表你用的可能是不受支援的核心，詳細狀況可以參閱[核心修改](kernel_modifications.md)這篇指南。
:::

# 安裝
Docker 裝好之後，如果你的作業系統具備 systemd（例如 Ubuntu 16+、Debian 8+、CentOS 7+），可以執行下方命令，讓 Docker 在開機時自動啟動。

``` bash
systemctl enable docker
```

接著簡單來說一下 Swap：在大多數系統上，Docker 預設不會設定 Swap 空間，你可以執行 `docker info` 來檢查是否屬於這種情況，如果輸出結果底部附近出現 `WARNING: No swap limit support`，就代表確實沒有設定。啟用 Swap 完全是選擇性的，但如果你打算對外提供託管服務，建議還是啟用比較好，可以有效防止 OOM（記憶體不足）錯誤發生。

如果你決定要啟用 Swap，請以 root 使用者開啟 `/etc/default/grub`，找到以 `GRUB_CMDLINE_LINUX_DEFAULT` 開頭的那一行。
下面的範例只是示意這一行大致的樣子，_請不要直接複製貼上，因為實際內容通常還會包含其他作業系統專屬的參數_。

``` text
GRUB_CMDLINE_LINUX_DEFAULT="swapaccount=1"
```

### 安裝 Node.js
``` bash
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
```

::: tip 其他作業系統發行版
如果你用的是 CentOS，請[依照這些說明](https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora)操作。Ubuntu 與 Debian 使用者則可以參閱 Node.js 提供的[官方說明](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)。
:::

::: warning OVH/SYS 伺服器
如果你的伺服器是由 OVH 或 SoYouStart 提供，這裡要提醒一下：主要磁碟空間可能已經配置給其他用途了，所以安裝過程可能需要多花幾分鐘，請耐心等待，不要中途中斷。
:::

## 安裝 Daemon 軟體
準備工作都完成後，安裝 Daemon 的第一步，是先建立好必要的目錄結構。請執行下方命令。

``` bash
mkdir -p /srv/daemon /srv/daemon-data
cd /srv/daemon
```

安裝好 Daemon 與相關必要元件後，下一步就是回到已安裝的 Panel 上建立節點。建立完成、查看該節點時，你會看到一個名為 Configuration 的分頁，接下來的設定就是在那裡進行的。

## 設定 Daemon
![](./../../.vuepress/public/daemon_configuration_example.png)

在該分頁中，你會看到一段程式碼區塊，請把它整段複製，貼到 `/srv/daemon/config` 目錄下一個名為 `core.json` 的檔案裡，然後儲存即可。如果你不想手動建立這個檔案，也可以直接使用自動部署功能來完成。

## 啟動 Daemon
設定檔就緒後，就可以啟動 Daemon 了。請進入 Daemon 目錄，執行下方命令以前景模式啟動；完成測試後，用 `CTRL+C` 就能終止程序。小提醒：依你伺服器的網路連線狀況，首次拉取並啟動 Daemon 可能需要花上幾分鐘時間，請耐心等待。

``` bash
sudo npm start
```

### 以 Daemon 執行（使用 systemd）

確認 Daemon 可以無錯誤執行後，接下來就可以讓它改在背景常駐運作，設定起來其實很簡單。請將下方內容放入 `/etc/systemd/system` 目錄中，建立一個名為 `wings.service` 的檔案。

``` text
Description=Pterodactyl Wings Daemon
After=docker.service

[Service]
User=root
WorkingDirectory=/srv/daemon
LimitNOFILE=4096
PIDFile=/var/run/wings/daemon.pid
ExecStart=/usr/bin/node /srv/daemon/src/index.js
Restart=on-failure
StartLimitInterval=600

[Install]
WantedBy=multi-user.target
```

檔案建立好之後，執行下方命令重新載入 systemd 並啟動 Daemon，這樣就大功告成了。

``` bash
systemctl enable --now wings
```
