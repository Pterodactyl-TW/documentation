---
meta:
    - name: robots
      content: noindex
---
# 開始使用

::: danger 此版本已終止支援
本文件適用於**已終止支援的軟體**，不再提供任何安全性更新或社群支援。基於歷史原因，本文件仍保留供查閱。

在正式環境中，您應使用 [Pterodactyl Panel 1.0](/panel/1.0/getting_started.md)。
:::

Pterodactyl Panel 設計為在您自己的 Web 伺服器上執行。您需要具備伺服器的 Root 存取權限，才能安裝與使用此控制面板。

此控制面板不是能以拖放方式執行伺服器的服務，而是一個需要多個相依套件的複雜系統，並要求管理員投入時間學習如何使用。  
**如果您不具備基本的 Linux 系統管理知識，卻期望能直接完成安裝，請現在停止操作。**

[[toc]]

## 選擇伺服器作業系統

Pterodactyl 支援多種作業系統，請選擇您最熟悉的系統。

::: warning
由於 Docker 相容性問題，Pterodactyl 不支援大多數 OpenVZ 系統。如果您打算在 OpenVZ 系統上執行此軟體，成功的可能性很低。
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

- PHP `7.2`，以及以下擴充功能：`cli`、`openssl`、`gd`、`mysql`、`PDO`、`mbstring`、`tokenizer`、`bcmath`、`xml` 或 `dom`、`curl`、`zip`。如果使用 Nginx，還需要 `fpm`。
- MySQL `5.7` **或** MariaDB `10.1.3` 以上版本。
- Web 伺服器（Apache、Nginx、Caddy 等）。
- `curl`
- `tar`
- `unzip`
- `git`
- `composer`

### 安裝相依套件範例

以下指令僅為安裝這些相依套件的範例。請參閱您所使用作業系統的套件管理工具，以確認正確的安裝套件名稱。

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

Composer 是 PHP 的相依套件管理工具，可用來提供執行控制面板所需的程式碼相依套件。在繼續此安裝流程之前，您需要先安裝 Composer。

```bash
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer --1
```

## 下載檔案

首先，建立控制面板所需的資料夾，然後切換至該資料夾。以下是範例操作方式：

```bash
mkdir -p /var/www/pterodactyl
cd /var/www/pterodactyl
```

建立控制面板目錄並切換進入後，您需要下載控制面板檔案。只要使用 `curl` 下載預先打包的檔案即可。下載完成後，解壓縮套件，並為 `storage/` 與 `bootstrap/cache/` 目錄設定正確權限。這些目錄用於儲存檔案，以及保存快取以縮短載入時間。

```bash
curl -Lo panel.tar.gz https://github.com/pterodactyl/panel/releases/download/v0.7.19/panel.tar.gz
tar --strip-components=1 -xzvf panel.tar.gz
chmod -R 755 storage/* bootstrap/cache/
```

## 安裝

::: danger 此版本已終止支援
本文件適用於**已終止支援的軟體**，不再提供任何安全性更新或社群支援。基於歷史原因，本文件仍保留供查閱。

在正式環境中，您應安裝並使用 [Pterodactyl Panel 1.0](/panel/1.0/getting_started.md)。
:::

現在所有檔案都已下載完成，接著需要設定控制面板的一些核心項目。

::: tip 資料庫設定
在繼續之前，您需要先建立資料庫，以及一個具備正確權限的資料庫使用者。如果您不確定如何操作，或想了解更多資訊，請參閱[設定 MySQL](/tutorials/mysql_setup.html)。

以下指令可快速建立 Pterodactyl 控制面板所需的資料庫與使用者：

```sql
$ mysql -u root -p

mysql> CREATE USER 'pterodactyl'@'localhost' IDENTIFIED WITH mysql_native_password BY 'A secure password';
mysql> CREATE DATABASE panel;
mysql> GRANT ALL ON panel.* TO 'pterodactyl'@'localhost' WITH GRANT OPTION;
```

:::

首先，複製預設的環境設定檔、安裝核心相依套件，然後產生新的應用程式加密金鑰。

```bash
cp .env.example .env
composer install --no-dev --optimize-autoloader

# 只有在首次安裝控制面板，且資料庫中沒有任何
# Pterodactyl Panel 資料時，才需要執行以下指令。
php artisan key:generate --force
```

::: danger
請備份您的加密金鑰（`.env` 檔案中的 `APP_KEY`）。此金鑰會用來加密所有需要安全儲存的資料，例如 API 金鑰。

請將它儲存在安全的位置，而不只是伺服器上。如果遺失此金鑰，所有已加密的資料都將無法使用且無法復原，即使您擁有資料庫備份也一樣。
:::

### 環境設定

Pterodactyl 的核心環境可以透過應用程式內建的數個 CLI 指令輕鬆設定。本步驟將設定工作階段、快取、資料庫憑證與電子郵件傳送等項目。

```bash
php artisan p:environment:setup
php artisan p:environment:database

# 若要使用 PHP 內建的郵件傳送功能（不建議），請選擇「mail」。
# 若要使用自訂 SMTP 伺服器，請選擇「smtp」。
php artisan p:environment:mail
```

### 設定資料庫

現在需要將控制面板的所有基本資料寫入先前建立的資料庫。**以下指令可能需要一段時間才能完成，實際時間取決於您的機器效能。請勿在程序完成前退出！**

此指令會建立資料庫資料表，並加入運作 Pterodactyl 所需的所有 Nest 與 Egg。

```bash
php artisan migrate --seed
```

### 新增第一位使用者

接著，您需要建立一名管理員使用者，才能登入控制面板。請執行以下指令。目前密碼**必須**符合以下要求：至少 8 個字元、包含大小寫字母，並至少包含一個數字。

```bash
php artisan p:user:make
```

### 設定權限

安裝流程的最後一步，是為控制面板檔案設定正確的擁有者，讓 Web 伺服器可以正常使用這些檔案。

```bash
# 使用 Nginx 或 Apache（CentOS 除外）
chown -R www-data:www-data *

# 在 CentOS 上使用 Nginx
chown -R nginx:nginx *

# 在 CentOS 上使用 Apache
chown -R apache:apache *
```

## 佇列監聽器

我們使用佇列讓應用程式執行得更快，並在背景處理電子郵件傳送與其他工作。您需要設定佇列工作程序，才能處理這些工作。

### Crontab 設定

首先，需要建立一項每分鐘執行一次的 Cron 工作，用於處理特定的 Pterodactyl 工作，例如清理工作階段，以及將排程工作傳送至 Daemon。請使用 `sudo crontab -e` 開啟 Crontab，然後貼上以下內容：

```bash
* * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1
```

### 建立佇列工作程序

接著，需要建立新的 systemd 工作程序，讓佇列程序持續在背景執行。此佇列負責傳送電子郵件，以及處理 Pterodactyl 的許多其他背景工作。

在 `/etc/systemd/system` 中建立名為 `pteroq.service` 的檔案，內容如下：

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
如果您使用 CentOS，需要將 `After=` 行中的 `redis-server.service` 替換為 `redis.service`，以確保 Redis 會在佇列工作程序之前啟動。
:::

::: tip
如果您沒有將 Redis 用於任何用途，應移除 `After=` 行，否則服務啟動時可能會發生錯誤。
:::

如果您的系統使用 Redis，請確認已將 Redis 設定為開機時自動啟動。執行以下指令即可：

```bash
sudo systemctl enable --now redis-server
```

最後，啟用服務，並將其設定為在機器啟動時自動執行：

```bash
sudo systemctl enable --now pteroq.service
```

#### 下一步：[Web 伺服器設定](./webserver_configuration)