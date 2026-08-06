# 開始使用

[[toc]]

Pterodactyl Panel 是設計來架設在你自己的網頁伺服器上的，所以在開始之前，你需要對伺服器有 root 存取權限，才能完成安裝與後續使用。

在動手之前，有件事想先提醒你：這份文件值得你花時間仔細讀完，而不是急著複製貼上指令。Panel 並不是那種拖拉幾下就能跑起來的服務，而是一套牽涉多個相依套件的系統，需要你投入一些時間去理解每個步驟在做什麼。**如果你對 Linux 系統管理還不熟悉，卻期望裝完就能直接上手，建議你先停下來，補足基礎知識再回來操作。**

::: tip 想找更簡單的設定方式嗎？
[WISP](https://wisp.gg) 是一個以 Pterodactyl 為基礎的 SaaS 服務，適合企業與個人使用，提供完整功能且不需要自己動手設定，同時完全相容於 Pterodactyl Egg。功能上可以對標 MultiCraft 或 TCAdmin，也有一些自己的獨特特色。想了解更多可以點此[進一步了解](https://wisp.gg/features)。
:::

## 選擇伺服器作業系統

Pterodactyl 支援多種作業系統，挑一個你自己最熟悉的就好。

::: warning
由於 Docker 相容性問題，Pterodactyl 目前不支援大多數的 OpenVZ 系統。如果你打算在 OpenVZ 上安裝，先說在前面，成功機率非常低。
:::

| 作業系統 | 版本 | 支援狀態 | 備註 |
| ---------------------------------- | ------- | :----------------: | ----------------------------------------------------------- |
| **Ubuntu** | 22.04 | :white_check_mark: | PHP 需要額外的套件庫。 |
| | 24.04 | :white_check_mark: | 不使用套件庫設定指令碼也能安裝 MariaDB。 |
| **RHEL / Rocky Linux / AlmaLinux** | 8 | :white_check_mark: | 需要額外的套件庫。 |
|                                    | 9       | :white_check_mark: |                                                             |
| **Debian** | 11 | :white_check_mark: | [Debian 相依套件](/community/installation-guides/panel/debian.md) |
|                                    | 12      | :white_check_mark: | [Debian 相依套件](/community/installation-guides/panel/debian.md)
|                                    | 13      | :white_check_mark: | [Debian 相依套件](/community/installation-guides/panel/debian.md)

## 相依套件

在安裝之前，你的系統需要先具備以下這些套件：

* PHP `8.2` 或 `8.3`（建議使用），並安裝以下擴充功能：`cli`、`openssl`、`gd`、`mysql`、`PDO`、`mbstring`、`tokenizer`、`bcmath`、`xml` 或 `dom`、`curl`、`zip`；若計畫使用 NGINX，還需要額外裝 `fpm`。
* MySQL `5.7.22` 以上版本（建議使用 MySQL `8`），或是 MariaDB `10.2` 以上版本，兩者擇一即可。
* Redis (`redis-server`)
* 一套網頁伺服器（Apache、NGINX、Caddy 等，任選其一）
* `curl`
* `tar`
* `unzip`
* `git`
* `composer` v2

### 相依套件安裝範例

下面這段命令只是示範怎麼安裝這些相依套件，實際套件名稱可能因你的作業系統版本而略有不同，安裝前建議先確認一下自己系統的套件管理器。

``` bash
# Add "add-apt-repository" command
apt -y install software-properties-common curl apt-transport-https ca-certificates gnupg

# Add additional repositories for PHP (Ubuntu 22.04)
LC_ALL=C.UTF-8 add-apt-repository -y ppa:ondrej/php

# Add Redis official APT repository
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

# Update repositories list
apt update

# Install Dependencies
apt -y install php8.3 php8.3-{common,cli,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip} mariadb-server nginx tar unzip git redis-server
```

### 安裝 Composer

Composer 是 PHP 生態系的相依套件管理器，Panel 執行所需的程式碼相依套件都要靠它來安裝，所以在繼續之前，記得先把它裝好。

``` bash
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

## 下載檔案

第一步，先建立一個用來放置 Panel 的資料夾，然後切換進去：

``` bash
mkdir -p /var/www/pterodactyl
cd /var/www/pterodactyl
```

進到資料夾之後，接著要把 Panel 的檔案下載下來。這裡直接用 `curl` 抓取我們預先打包好的內容，下載完解壓縮，再把 `storage/` 與 `bootstrap/cache/` 兩個目錄設定成正確的權限即可。簡單說明一下：這兩個目錄分別用來存放檔案，以及提供快取加速頁面載入，所以權限一定要設對，之後 Panel 才能正常寫入資料。

> [!NOTE]
> 由於我們僅提供最新版本文件的翻譯，通常只有依照我們的文件說明操作、或使用我們的一鍵安裝程式，才會套用我們的繁體中文化版本。若你選擇安裝舊版本，即代表你將安裝官方的英文版本，我們將不提供翻譯內容上的支援；但技術問題仍可透過 [Discord](https://pterodactyl.tw/discord) 與我們聯絡，或與其他使用者討論翻譯相關問題。

``` bash
curl -Lo panel.tar.gz https://github.com/pterodactyl/panel/releases/latest/download/panel.tar.gz
tar -xzvf panel.tar.gz
chmod -R 755 storage/* bootstrap/cache/
```

## 安裝

檔案都下載好之後，接下來要動手設定 Panel 的幾個核心項目。

::: tip 資料庫設定
在繼續往下之前，你需要先建立一個資料庫，以及一個具備正確權限的使用者。下面示範怎麼快速幫 Pterodactyl Panel 建立專用的使用者與資料庫；如果想看更完整的說明，可以參考[設定 MySQL](/tutorials/mysql_setup.html)。

```sql
# If using MariaDB (v11.0.0+) (This is the default when installing Pterodactyl by following the documentation.)
mariadb -u root -p

# If using MySQL
mysql -u root -p
```
```sql

# Remember to change 'yourPassword' below to be a unique password
CREATE USER 'pterodactyl'@'127.0.0.1' IDENTIFIED BY 'yourPassword';
CREATE DATABASE panel;
GRANT ALL PRIVILEGES ON panel.* TO 'pterodactyl'@'127.0.0.1' WITH GRANT OPTION;
exit
```

:::

接下來，我們要先複製一份預設的環境設定檔，安裝核心相依套件，然後產生應用程式的加密金鑰：

``` bash
cp .env.example .env
COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader

# Only run the command below if you are installing this Panel for
# the first time and do not have any Pterodactyl Panel data in the database.
php artisan key:generate --force
```

::: danger
這一步請務必留意：一定要備份好你的加密金鑰（也就是 `.env` 檔案中的 `APP_KEY`）。這組金鑰是用來加密所有需要安全儲存的資料（例如 API 金鑰）的，一旦遺失，就算你有完整的資料庫備份，所有被加密過的資料也永遠救不回來了，所以千萬別只把它留在伺服器上。

想取得目前的 `APP_KEY`，開啟終端機，在你的 panel 目錄中執行以下命令：

```bash
grep APP_KEY /var/www/pterodactyl/.env
```

執行後你應該會看到類似這樣的內容：

```text
APP_KEY=base64:YOUR_LONG_RANDOM_STRING
```

把整行內容複製下來，存放到安全的地方，例如：
- 密碼管理員
- 本機上的加密檔案
- 安全的隨身碟
- 可信任的雲端保險箱

再提醒一次，不要只把它留在伺服器上，一旦遺失，加密資料就永遠無法復原了。
:::

### 環境設定

Pterodactyl 的核心環境可以透過內建的幾個 CLI 命令快速設定完成，這一步會依序帶你設定工作階段（session）、快取、資料庫憑證，以及郵件傳送方式。

``` bash
php artisan p:environment:setup
php artisan p:environment:database

# To use PHP's internal mail sending (not recommended), select "mail". To use a
# custom SMTP server, select "smtp".
php artisan p:environment:mail
```

### 資料庫設定

接下來，我們要把 Panel 運作所需的基礎資料寫入剛才建立的資料庫。**這裡有個地方要特別注意：下方命令視你機器的效能，可能需要跑上一段時間，執行過程中請耐心等待，_千萬不要_ 中途中斷！** 這道命令會建立所有必要的資料表，並把支援 Pterodactyl 運作所需的 Nest 與 Egg 一併寫入。

``` bash
php artisan migrate --seed --force
```

### 新增第一位使用者

接著要建立一個管理員帳號，這樣才能實際登入 Panel。執行以下命令即可，這裡先提醒你，密碼**必須**符合以下規則：至少 8 個字元、包含大小寫英文字母，以及至少一個數字。

``` bash
php artisan p:user:make
```

### 設定權限

安裝流程的最後一步，是把 Panel 檔案的權限設定正確，讓網頁伺服器能夠順利存取這些檔案：

``` bash
# If using NGINX, Apache or Caddy (not on RHEL / Rocky Linux / AlmaLinux)
chown -R www-data:www-data /var/www/pterodactyl/*

# If using NGINX on RHEL / Rocky Linux / AlmaLinux
chown -R nginx:nginx /var/www/pterodactyl/*

# If using Apache on RHEL / Rocky Linux / AlmaLinux
chown -R apache:apache /var/www/pterodactyl/*
```

## 佇列監聽器

Panel 內部使用佇列（queue）機制，讓應用程式反應更快，並把寄送郵件之類的工作丟到背景處理。要讓這些工作真正被執行，你還需要設定對應的 queue worker。

### Crontab 設定

首先，我們要建立一個每分鐘執行一次的排程工作（cronjob），用來處理一些 Pterodactyl 專屬的例行任務，例如清除過期的工作階段，以及把排程工作傳送給 daemon。執行 `sudo crontab -e` 開啟你的 crontab，然後把下面這行貼進去即可。

```bash
* * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1
```

### 建立 Queue Worker

接下來要建立一個 systemd worker，讓佇列處理程序能持續在背景執行。這個佇列負責寄送郵件，以及處理 Pterodactyl 許多其他的背景工作，缺了它有些功能會無法正常運作。

在 `/etc/systemd/system` 目錄下建立一個名為 `pteroq.service` 的檔案，內容如下：

``` text
# Pterodactyl Queue Worker File
# ----------------------------------

[Unit]
Description=Pterodactyl Queue Worker
After=redis-server.service

[Service]
# On some systems the user and group might be different.
# Some systems use `apache` or `nginx` as the user and group.
User=www-data
Group=www-data
Restart=always
ExecStart=/usr/bin/php /var/www/pterodactyl/artisan queue:work --queue=high,standard,low --sleep=3 --tries=3
StartLimitInterval=180
StartLimitBurst=30
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

::: tip RHEL / Rocky Linux / AlmaLinux 上的 Redis
如果你是在 RHEL、Rocky Linux 或 AlmaLinux 上安裝，記得把 `After=` 那一行的 `redis-server.service` 改成 `redis.service`，這樣才能確保 `redis` 會在 queue worker 啟動之前先跑起來。
:::

::: tip
如果你的系統完全沒有安裝 `redis`，就把 `After=` 這一行整個移除，不然服務啟動時會噴錯誤。
:::

如果你的系統有安裝 redis，務必確認它會隨開機自動啟動，執行以下命令來啟用：

```bash
sudo systemctl enable --now redis-server
```

最後，啟用 queue worker 這個服務，並讓它開機時自動啟動：

``` bash
sudo systemctl enable --now pteroq.service
```

### 遙測

自 1.11 版起，Pterodactyl 會收集匿名的遙測資料，幫助我們更了解軟體實際的使用情形。如果你想進一步了解這項功能的細節，或是想選擇停用它，可以參考[遙測](./additional_configuration.md#遙測)文件；不過建議你先把剩下的安裝流程走完，再回頭處理這件事。

#### 下一步：[網頁伺服器設定](./webserver_configuration)
