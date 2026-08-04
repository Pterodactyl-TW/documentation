---
meta:
    - name: robots
      content: noindex
---
# Installation

::: danger 此軟體已遭棄用
本文件適用於**已遭棄用的軟體**，不再提供任何安全性更新或社群支援。
基於歷史原因，本文件仍保留供查閱。

You should be installing and using [Wings](/wings/1.0/installing.md) in production environments with
[Pterodactyl Panel 1.0](/panel/1.0/getting_started.md).
:::

::: warning
This specific software is for Pterodactyl v0.7 and **must not be used for Pterodactyl v1.0**. If you have installed 1.0 you should use [Wings](/wings/1.0/installing.html) instead.
:::

[[toc]]

## Supported Systems
| Operating System | Version                                                        |     Supported      | Notes                                                       |
| ---------------- | -------------------------------------------------------------- | :----------------: | ----------------------------------------------------------- |
| **Ubuntu**       | 18.04                                                          | :white_check_mark: | Documentation written assuming Ubuntu 18.04 as the base OS. |
|                  | [20.04](/community/installation-guides/daemon/ubuntu2004.html) | :white_check_mark: |
| **CentOS**       | [7](/community/installation-guides/daemon/centos7.html)        |     :warning:      | Extra repos are required                                    |
|                  | [8](/community/installation-guides/daemon/centos8.html)        | :white_check_mark: |                                                             |
| **Debian**       | [9](/community/installation-guides/daemon/debian9.html)        | :white_check_mark: |                                                             |
|                  | [10](/community/installation-guides/daemon/debian10.html)      | :white_check_mark: |                                                             |

## 系統需求
若要執行 Daemon，需要具備執行 Docker 容器能力的系統。大多數 VPS 與幾乎所有專用伺服器都能執行 Docker，但仍有少數例外情況。

如果服務供應商使用 `Virtuozzo`、`OpenVZ`（或 `OVZ`）或 `LXC`，你很可能無法執行 Daemon。
如果不確定主機使用哪種虛擬化技術，可以查看供應商網站或聯絡其支援團隊。

你也可以執行 `lscpu`，查看列出的虛擬化類型。以下範例顯示 Hypervisor 使用完整虛擬化，表示可以正常支援 Docker。
如果供應商顯示為 `KVM`，通常也可以正常使用。

``` bash
dane@daemon:~$ lscpu | grep 'vendor\|type'
Hypervisor vendor:     VMware
Virtualization type:   full
```

如果上述方法因故無法使用，或你仍不確定，也可以執行下方命令；只要結果不是 `Xen` 或 `LXC`，通常就能繼續操作。

``` bash
dane@daemon:~$ sudo dmidecode -s system-manufacturer
VMware, Inc.
```

## 相依套件
Pterodactyl Daemon 需要在系統中安裝以下相依套件才能運作。

* Docker
* Nodejs (`v10`, `v12`, higher versions likely work, but are untested)
* `node-gyp`
* `tar`
* `unzip`
* `make`, `gcc` (`gcc-c++` on CentOS), `g++`
* `python`

### 安裝 Docker
若要快速安裝 Docker CE，可以執行下方命令：
``` bash
curl -sSL https://get.docker.com/ | CHANNEL=stable bash
```

如果想手動安裝，請參閱 Docker 官方文件，了解如何在伺服器上安裝 Docker CE。以下列出常見支援系統的快速連結。

* [Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce)
* [CentOS](https://docs.docker.com/install/linux/docker-ce/centos/#install-docker-ce)
* [Debian](https://docs.docker.com/install/linux/docker-ce/debian/#install-docker-ce)

::: warning Check your Kernel
Please be aware that some hosts install a modified kernel that does not support important docker features. Please
check your kernel by running `uname -r`. If your kernel ends in `-xxxx-grs-ipv6-64` or `-xxxx-mod-std-ipv6-64` you're
probably using a non-supported kernel. Check our [Kernel Modifications](kernel_modifications.md) guide for details.
:::

# 安裝
If you are on an operating system with systemd (Ubuntu 16+, Debian 8+, CentOS 7+) run the command below to have Docker start when you boot your machine.

::: danger 此軟體已遭棄用
systemctl enable docker
```
本文件適用於**已遭棄用的軟體**，不再提供任何安全性更新或社群支援。
基於歷史原因，本文件仍保留供查閱。
On most systems, docker will be unable to setup swap space, you can check if this is the case by running `docker info`.
If it outputs `WARNING: No swap limit support` near the bottom, this is the case. Enabling swap is completely optional,
[Pterodactyl Panel 1.0](/panel/1.0/getting_started.md) 安裝並使用 [Wings](/wings/1.0/installing.md) 在正式環境中。

To do so, open `/etc/default/grub` as a root user, and find the line starting with `GRUB_CMDLINE_LINUX_DEFAULT`. Make
::: warning

此軟體僅適用於 Pterodactyl v0.7，**不得用於 Pterodactyl v1.0**。如果已安裝 1.0，請改用 [Wings](/wings/1.0/installing.html)。
Below is an example of what the line should look like, _do not copy this line verbatium, it often has additional
OS specific parameters._
## 支援的系統
``` text
GRUB_CMDLINE_LINUX_DEFAULT="swapaccount=1"
## 系統需求

### Installing Nodejs
若要執行 Daemon，需要具備執行 Docker 容器能力的系統。大多數 VPS 與幾乎所有專用伺服器都能執行 Docker，但仍有少數例外情況。
``` bash
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
## 相依套件
Pterodactyl Daemon 需要在系統中安裝以下相依套件才能運作。
```

### 安裝 Docker
If you are using CentOS, [please follow these instructions](https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora). Ubuntu and Debian users may also follow the [official
若要快速安裝 Docker CE，可以執行下方命令：
:::

::: warning 檢查核心
::: danger This Software is Abandoned
This documentation is for **abandoned software** which does not recieve any security updates or support
from the community. This documentation has been left accessible for historial reasons.
請注意，部分主機安裝了修改過的核心，可能不支援重要的 Docker 功能。請執行 `uname -r` 檢查核心。如果核心版本以 `-xxxx-grs-ipv6-64` 或 `-xxxx-mod-std-ipv6-64` 結尾，可能使用了不受支援的核心。詳細資訊請參閱[核心修改](kernel_modifications.md)指南。
:::
The first step for installing the daemon is to make sure we have the required directory structure setup. To do so,
#### 開機時啟動 Docker

如果你使用具備 systemd 的作業系統（Ubuntu 16+、Debian 8+、CentOS 7+），請執行下方命令，讓 Docker 在開機時啟動。
mkdir -p /srv/daemon /srv/daemon-data
cd /srv/daemon
#### 啟用 Swap

::: warning OVH/SYS Servers
If you are using a server provided by OVH or SoYouStart please be aware that your main drive space is probably allocated to
在大多數系統上，Docker 無法設定 Swap 空間。你可以執行 `docker info` 檢查；如果底部附近輸出 `WARNING: No swap limit support`，就表示無法設定。啟用 Swap 完全是選擇性的，但若要為他人提供託管服務，建議啟用以防止 OOM 錯誤。
:::

### 安裝 Node.js
``` bash
Node.js 也很容易安裝！執行下方命令即可讓系統取得套件。
```

::: tip 其他作業系統發行版
take a few minutes to run, please do not interrupt it.

如果使用 CentOS，請[依照這些說明](https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora)操作。Ubuntu 與 Debian 使用者也可以參閱 Node.js 提供的[官方說明](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)。
```

## 安裝 Daemon 軟體
Once you have installed the daemon and required components, the next step is to create a node on your installed Panel
Once you have done that there will be a tab called Configuration when you view the node.
安裝 Daemon 的第一步，是確認已建立必要的目錄結構。請執行下方命令。
Simply copy and paste the code block and paste it into a file called `core.json` in `/srv/daemon/config` and save it.
You may also use the Auto-Deployment feature rather than manually creating the files.
## 設定 Daemon
![](./../../.vuepress/public/daemon_configuration_example.png)

安裝 Daemon 與必要元件後，下一步是在已安裝的 Panel 上建立節點。完成後查看節點時會看到名為 Configuration 的分頁。
To start your daemon simply move into the daemon directory and run the command below which will start the daemon in
foreground mode. Once you are done, use `CTRL+C` to terminate the process. Depending on your server's internet connection
pulling and starting the Daemon for the first time may take a few minutes.
請將程式碼區塊複製並貼到 `/srv/daemon/config` 中名為 `core.json` 的檔案，然後儲存。你也可以使用自動部署功能，不必手動建立檔案。
sudo npm start
```
## 啟動 Daemon
### Daemonizing (using systemd)

Running Pterodactyl Daemon in the background is a simple task, just make sure that it runs without errors before doing
若要啟動 Daemon，請進入 Daemon 目錄並執行下方命令，以前景模式啟動。完成後使用 `CTRL+C` 終止程序。

``` text
### 以 Daemon 執行（使用 systemd）
Description=Pterodactyl Wings Daemon
After=docker.service
讓 Pterodactyl Daemon 在背景執行很簡單，但請先確認它能無錯誤執行。將下方內容放入 `/etc/systemd/system` 目錄中名為 `wings.service` 的檔案。
[Service]
User=root
然後，執行下方命令重新載入 systemd 並啟動 Daemon。
WorkingDirectory=/srv/daemon
LimitNOFILE=4096
PIDFile=/var/run/wings/daemon.pid
ExecStart=/usr/bin/node /srv/daemon/src/index.js
Restart=on-failure
StartLimitInterval=600

[Install]
WantedBy=multi-user.target
```

Then, run the commands below to reload systemd and start the daemon.

``` bash
systemctl enable --now wings
```
