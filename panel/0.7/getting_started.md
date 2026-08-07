---
meta:
    - name: robots
      content: noindex
---
# 開始使用

::: danger 此版本已終止支援
本文件適用於**已終止支援的軟體**，不再提供任何安全性更新或社群支援。基於歷史原因，本文件仍保留供查閱。

在正式環境中，你應使用 [Pterodactyl Panel 1.0](/panel/1.0/getting_started.md)。
:::

Pterodactyl Panel 是設計來跑在你自己的 Web 伺服器上的，所以你需要具備伺服器的 Root 存取權限，才有辦法安裝並使用它。

這裡要先說清楚一件事：這套控制面板並不是那種拖拉幾下就能架起伺服器的懶人服務，而是一套需要多個相依套件、結構相對複雜的
系統，需要管理員花一點時間學習才能上手。
**如果你還沒有基本的 Linux 系統管理知識，卻期待能一路直接裝完，建議先停下來，補一些基礎知識會比較保險。**

[[toc]]

## 選擇伺服器作業系統

Pterodactyl 支援多種作業系統，挑一個你自己最熟悉的系統就好。

::: warning 警告
由於 Docker 相容性問題，Pterodactyl 並不支援大多數 OpenVZ 系統。如果你打算在 OpenVZ 上安裝，成功的機率不高，
建議提前有心理準備。
:::

| 作業系統 | 版本 | 支援狀態 | 備註 |
| --- | --- | :---: | --- |
| **Ubuntu** | 18.04 | :white_check_mark: | 本文件以 Ubuntu 18.04 作為基礎作業系統撰寫。 |
| | [20.04](/community/installation-guides/panel/ubuntu2004.html) | :white_check_mark: | |
| **CentOS** | [7](/community/installation-guides/panel/centos7.html) | :white_check_mark: | 需要額外的套件庫。 |
| | [8](/community/installation-guides/panel/centos8.html) | :white_check_mark: | 所有必要套件都包含在基礎套件庫中。 |
| **Debian** | [9](/community/installation-guides/panel/debian9.html) | :white_check_mark: | 需要額外的套件庫。 |
| | [10](/community/installation-guides/panel/debian10.html) | :white_check_mark: | 所有必要套件都包含在基礎套件庫中。 |

## 相依套件

在開始安裝之前，先確認你的系統上有以下這些相依套件：

- PHP `7.2`，並包含以下擴充功能：`cli`、`openssl`、`gd`、`mysql`、`PDO`、`mbstring`、`tokenizer`、`bcmath`、`xml` 或 `dom`、`curl`、`zip`。如果你用的是 Nginx，還需要額外裝 `fpm`。
- MySQL `5.7` **或** MariaDB `10.1.3` 以上版本。
- 一套 Web 伺服器（Apache、Nginx、Caddy 等，任選一種即可）。
- `curl`
- `tar`
- `unzip`
- `git`
- `composer`

### 安裝相依套件範例

以下指令只是示範怎麼安裝這些相依套件，實際套件名稱可能因作業系統而異，建議先查一下你所用系統的套件管理工具，
確認名稱正確再執行。

```bash
# 新增「add-apt-repository」指令
apt -y install software-properties-common curl

# 新增 PHP、Redis 與 MariaDB 的額外套件庫
LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php
add-apt-repository -y ppa:chris-lea/redis-server
curl -LsS https://r.mariadb.com/downloads/mariadb_repo_setup | sudo bash

# 更新套件庫清單
apt update

# 如果使用 Ubuntu 18.04，請新增 universe 套件庫
apt-add-repository universe

# 安裝相依套件
apt -y install php7.2 php7.2-cli php7.2-gd php7.2-mysql php7.2-pdo php7.2-mbstring php7.2-tokenizer php7.2-bcmath php7.2-xml php7.2-fpm php7.2-curl php7.2-zip mariadb-server nginx tar unzip git redis-server
```

### 安裝 Composer

Composer 是 PHP 的相依套件管理工具，控制面板執行時需要的程式碼相依套件，都要靠它來安裝，所以在往下走之前，
記得先把 Composer 裝起來。

```bash
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer --1
```

## 下載檔案

首先，建立控制面板要用的資料夾，然後切換進去，範例如下：

```bash
mkdir -p /var/www/pterodactyl
cd /var/www/pterodactyl
```

進到目錄之後，接下來就是下載控制面板的檔案。直接用 `curl` 抓取官方預先打包好的壓縮檔即可。下載完成後記得解壓縮，
並幫 `storage/` 與 `bootstrap/cache/` 這兩個目錄設定正確的權限，這兩個目錄分別用來存放檔案，以及保存快取資料以加快
之後的載入速度。

::: warning 警告
由於我們僅提供最新版本文件的翻譯，通常只有依照我們的文件說明操作、或使用我們的一鍵安裝程式，才會套用我們的繁體中文化版本。若你選擇安裝舊版本，即代表你將安裝官方的英文版本，我們將不提供翻譯內容上的支援；但技術問題仍可透過 [Discord](https://pterodactyl.tw/discord) 與我們聯絡，或與其他使用者討論翻譯相關問題。
:::

```bash
curl -Lo panel.tar.gz https://github.com/pterodactyl/panel/releases/download/v0.7.19/panel.tar.gz
tar --strip-components=1 -xzvf panel.tar.gz
chmod -R 755 storage/* bootstrap/cache/
```

## 安裝

::: danger 此版本已終止支援
本文件適用於**已終止支援的軟體**，不再提供任何安全性更新或社群支援。基於歷史原因，本文件仍保留供查閱。

在正式環境中，你應安裝並使用 [Pterodactyl Panel 1.0](/panel/1.0/getting_started.md)。
:::

檔案都下載好之後，接下來要設定控制面板的一些核心項目。

::: tip 資料庫設定
在繼續之前，你需要先建立一個資料庫，以及一個具備正確權限的資料庫使用者。如果不確定怎麼做，或想多了解一些細節，
可以參考[設定 MySQL](/tutorials/mysql_setup.html)這篇文件。

如果只是想快速建立 Pterodactyl 控制面板需要的資料庫與使用者，可以直接執行以下指令：

```sql
$ mysql -u root -p

mysql> CREATE USER 'pterodactyl'@'localhost' IDENTIFIED WITH mysql_native_password BY 'A secure password';
mysql> CREATE DATABASE panel;
mysql> GRANT ALL ON panel.* TO 'pterodactyl'@'localhost' WITH GRANT OPTION;
```

:::

接下來，先複製一份預設的環境設定檔，安裝核心相依套件，再產生一組新的應用程式加密金鑰。

```bash
cp .env.example .env
composer install --no-dev --optimize-autoloader

# 只有在首次安裝控制面板，且資料庫中沒有任何
# Pterodactyl Panel 資料時，才需要執行以下指令。
php artisan key:generate --force
```

::: danger 危險
這裡要特別提醒：務必備份你的加密金鑰（`.env` 檔案中的 `APP_KEY`）。這組金鑰會用來加密所有需要安全儲存的資料，
例如 API 金鑰。

請把它存放在安全的地方，不要只留在伺服器上。萬一遺失這組金鑰，所有已加密的資料就會永久無法還原，即使你手上有
完整的資料庫備份也一樣救不回來。
:::

### 環境設定

Pterodactyl 的核心環境，可以透過幾個應用程式內建的 CLI 指令輕鬆完成設定。這一步會依序處理工作階段、快取、
資料庫憑證，以及電子郵件傳送等項目。

```bash
php artisan p:environment:setup
php artisan p:environment:database

# 若要使用 PHP 內建的郵件傳送功能（不建議），請選擇「mail」。
# 若要使用自訂 SMTP 伺服器，請選擇「smtp」。
php artisan p:environment:mail
```

### 設定資料庫

接著要把控制面板運作所需的所有基本資料，寫入剛才建立好的資料庫。**這道指令執行起來可能需要一點時間，實際快慢要看
機器效能，請耐心等它跑完，不要中途退出！**

簡單來說，這道指令會建立資料庫資料表，並把 Pterodactyl 運作所需的所有 Nest 與 Egg 一併加進去。

```bash
php artisan migrate --seed
```

### 新增第一位使用者

再來，你需要建立一名管理員使用者，才能真正登入控制面板，執行以下指令即可。這裡提醒一下，密碼**必須**符合以下規則：
至少 8 個字元、大小寫字母都要有，並且至少包含一個數字。

```bash
php artisan p:user:make
```

### 設定權限

安裝流程的最後一步，是幫控制面板檔案設定正確的擁有者，這樣 Web 伺服器才有辦法正常讀寫這些檔案。

```bash
# 使用 Nginx 或 Apache（CentOS 除外）
chown -R www-data:www-data *

# 在 CentOS 上使用 Nginx
chown -R nginx:nginx *

# 在 CentOS 上使用 Apache
chown -R apache:apache *
```

## 佇列監聽器

Pterodactyl 使用佇列機制，讓應用程式執行得更快，把電子郵件傳送之類的工作丟到背景處理。因此，你還需要設定佇列
工作程序，才能真正把這些工作處理掉。

### Crontab 設定

首先，需要建立一項每分鐘執行一次的 Cron 工作，用來處理一些 Pterodactyl 專屬的排程任務，例如清理過期的工作階段，
以及把排定的工作傳送給 Wings。請用 `sudo crontab -e` 開啟 Crontab，然後貼上以下內容：

```bash
* * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1
```

### 建立佇列工作程序

接著，需要建立一個新的 systemd 工作程序，讓佇列可以持續在背景運作。這個佇列負責寄送電子郵件，也負責處理
Pterodactyl 許多其他的背景工作。

在 `/etc/systemd/system` 目錄下建立一個名為 `pteroq.service` 的檔案，內容如下：

```text
# Pterodactyl 佇列工作程序檔案
# ----------------------------------

[Unit]
Description=Pterodactyl Queue Worker
After=redis-server.service

[Service]
# 在部分系統中，使用者與群組可能不同。
# 某些系統使用 apache 或 nginx 作為使用者與群組。
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /var/www/pterodactyl/artisan queue:work --queue=high,standard,low --sleep=3 --tries=3

[Install]
WantedBy=multi-user.target
```

::: tip CentOS 上的 Redis
如果你用的是 CentOS，記得把 `After=` 這一行裡的 `redis-server.service` 換成 `redis.service`，這樣才能確保 Redis
會在佇列工作程序啟動前先跑起來。
:::

::: tip 提示
如果你根本沒在用 Redis，建議直接移除 `After=` 這一行，不然服務啟動時可能會跳出錯誤。
:::

如果系統上有裝 Redis，記得確認它已設定為開機自動啟動，執行以下指令就能完成：

```bash
sudo systemctl enable --now redis-server
```

最後，啟用這個服務，並設定成開機時自動執行：

```bash
sudo systemctl enable --now pteroq.service
```

#### 下一步：[Web 伺服器設定](./webserver_configuration)
