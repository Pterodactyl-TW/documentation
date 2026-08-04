# 開始使用

[[toc]]

Pterodactyl Panel 設計為在你自己的網頁伺服器上執行。你需要具備伺服器的 root 存取權，才能執行和使用此控制面板。

你需要具備閱讀文件的能力，才能使用此控制面板。我們花費許多時間詳細說明安裝與升級流程，請先花時間閱讀，
不要只複製貼上，遇到問題後才抱怨。此控制面板不是可以用拖放方式執行伺服器的服務，而是一個需要多個相依套件的複雜系統，
並要求管理員投入時間學習如何使用。**如果你不具備基本 Linux 系統管理知識，卻期望能直接完成安裝，請現在停止操作。**

::: tip 想找簡單的設定方式嗎？
[WISP](https://wisp.gg) is a Pterodactyl powered SaaS suitable for enterprise and personal use. Offering all the features without the setup hassle, and fully compatible with Pterodactyl eggs. Comparable to MultiCraft or TCAdmin while offering new and unique features. Click here to [learn more](https://wisp.gg/features).
:::

## 選擇伺服器作業系統

Pterodactyl 支援多種作業系統，請選擇你最熟悉的系統。

::: warning
由於 Docker 相容性問題，Pterodactyl 不支援大多數 OpenVZ 系統。如果打算在 OpenVZ 系統上執行此軟體，成功的可能性很低。
:::

| 作業系統 | 版本 | 支援狀態 | 備註 |
| ---------------------------------- | ------- | :----------------: | ----------------------------------------------------------- |
| **Ubuntu** | 22.04 | :white_check_mark: | PHP 需要額外的套件庫。 |
| | 24.04 | :white_check_mark: | 不使用套件庫設定指令碼也能安裝 MariaDB。 |
| **RHEL / Rocky Linux / AlmaLinux** | 8 | :white_check_mark: | 需要額外的套件庫。 |
|                                    | 9       | :white_check_mark: |                                                             |
| **Debian** | 11 | :white_check_mark: | [Debian 相依套件](/community/installation-guides/panel/debian.md) |
|                                    | 12      | :white_check_mark: | [Debian Dependencies](/community/installation-guides/panel/debian.md)
|                                    | 13      | :white_check_mark: | [Debian Dependencies](/community/installation-guides/panel/debian.md)

## 相依套件

* PHP `8.2` or `8.3` (recommended) with the following extensions: `cli`, `openssl`, `gd`, `mysql`, `PDO`, `mbstring`, `tokenizer`, `bcmath`, `xml` or `dom`, `curl`, `zip`, and `fpm` if you are planning to use NGINX.
* MySQL `5.7.22` and higher (MySQL `8` recommended) **or** MariaDB `10.2` and higher.
* Redis (`redis-server`)
* A webserver (Apache, NGINX, Caddy, etc.)
* `curl`
* `tar`
* `unzip`
* `git`
* `composer` v2

### 相依套件安裝範例

下方命令只是安裝這些相依套件的範例。請參閱作業系統的套件管理器，以確認應安裝的正確套件。

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

Composer 是 PHP 的相依套件管理器，能提供執行控制面板所需的所有程式碼相依套件。
繼續進行前，必須先安裝 Composer。

``` bash
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

## 下載檔案

第一步是建立放置控制面板的資料夾，然後進入新建立的資料夾。以下是操作範例。

``` bash
mkdir -p /var/www/pterodactyl
cd /var/www/pterodactyl
```

建立控制面板資料夾並進入其中後，需要下載控制面板檔案。只要使用 `curl` 下載我們預先打包的內容即可。
下載完成後解壓縮封存檔，並設定 `storage/` 與 `bootstrap/cache/` 目錄的正確權限。
這些目錄用於儲存檔案，以及提供快速快取以縮短載入時間。

``` bash
curl -Lo panel.tar.gz https://github.com/pterodactyl/panel/releases/latest/download/panel.tar.gz
tar -xzvf panel.tar.gz
chmod -R 755 storage/* bootstrap/cache/
```

## Installation

Now that all of the files have been downloaded we need to configure some core aspects of the Panel.

::: tip Database Configuration
You will need a database setup and a user with the correct permissions created for that database before
continuing any further. See below to create a user and database for your Pterodactyl panel quickly. To find more detailed information
please have a look at [Setting up MySQL](/tutorials/mysql_setup.html).

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

First we will copy over our default environment settings file, install core dependencies, and then generate a
new application encryption key.

``` bash
cp .env.example .env
COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader

# Only run the command below if you are installing this Panel for
# the first time and do not have any Pterodactyl Panel data in the database.
php artisan key:generate --force
```

::: danger
Back up your encryption key (`APP_KEY` in the `.env` file). It is used as an encryption key for all data that needs to be stored securely (e.g. API keys).
Store it somewhere safe - not just on your server. If you lose it, all encrypted data is irrecoverable, even with database backups.

To grab your `APP_KEY`, open a terminal and run the following in your panel directory:

```bash
grep APP_KEY /var/www/pterodactyl/.env
```

You should see something like:

```text
APP_KEY=base64:YOUR_LONG_RANDOM_STRING
```

Copy that entire line and save it somewhere secure:
- A password manager
- An encrypted file on your local machine
- A secure USB drive
- A trusted cloud vault

Do not keep it only on the server. If you lose this key, your encrypted data is permanently unrecoverable.
:::

### Environment Configuration

Pterodactyl's core environment is easily configured using a few different CLI commands built into the app. This step
will cover setting up things such as sessions, caching, database credentials, and email sending.

``` bash
php artisan p:environment:setup
php artisan p:environment:database

# To use PHP's internal mail sending (not recommended), select "mail". To use a
# custom SMTP server, select "smtp".
php artisan p:environment:mail
```

### Database Setup

Now we need to setup all of the base data for the Panel in the database you created earlier. **The command below
may take some time to run depending on your machine. Please _DO NOT_ exit the process until it is completed!** This
command will setup the database tables and then add all of the Nests & Eggs that power Pterodactyl.

``` bash
php artisan migrate --seed --force
```

### Add The First User

You'll then need to create an administrative user so that you can log into the panel. To do so, run the command below.
At this time passwords **must** meet the following requirements: 8 characters, mixed case, at least one number.

``` bash
php artisan p:user:make
```

### Set Permissions

The last step in the installation process is to set the correct permissions on the Panel files so that the webserver can
use them correctly.

``` bash
# If using NGINX, Apache or Caddy (not on RHEL / Rocky Linux / AlmaLinux)
chown -R www-data:www-data /var/www/pterodactyl/*

# If using NGINX on RHEL / Rocky Linux / AlmaLinux
chown -R nginx:nginx /var/www/pterodactyl/*

# If using Apache on RHEL / Rocky Linux / AlmaLinux
chown -R apache:apache /var/www/pterodactyl/*
```

## Queue Listeners

We make use of queues to make the application faster and handle sending emails and other actions in the background.
You will need to setup the queue worker for these actions to be processed.

### Crontab Configuration

The first thing we need to do is create a new cronjob that runs every minute to process specific Pterodactyl tasks, such
as session cleanup and sending scheduled tasks to daemons. You'll want to open your crontab using `sudo crontab -e` and
then paste the line below.

```bash
* * * * * php /var/www/pterodactyl/artisan schedule:run >> /dev/null 2>&1
```

### Create Queue Worker

Next you need to create a new systemd worker to keep our queue process running in the background. This queue is responsible
for sending emails and handling many other background tasks for Pterodactyl.

Create a file called `pteroq.service` in `/etc/systemd/system` with the contents below.

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

::: tip Redis on RHEL / Rocky Linux / AlmaLinux
If you are using RHEL, Rocky Linux, or AlmaLinux, you will need to replace `redis-server.service` with `redis.service` at the `After=` line in order to ensure `redis` starts before the queue worker.
:::

::: tip
If you are not using `redis` for anything you should remove the `After=` line, otherwise you will encounter errors
when the service starts.
:::

If you are using redis for your system, you will want to make sure to enable that it will start on boot. You can do that by running the following command:

```bash
sudo systemctl enable --now redis-server
```

Finally, enable the service and set it to boot on machine start.

``` bash
sudo systemctl enable --now pteroq.service
```

### Telemetry

Since 1.11, Pterodactyl will collect anonymous telemetry to help us better understand how the
software is being used. To learn more about this feature and to opt-out, please see our [Telemetry](./additional_configuration.md#telemetry)
documentation. Make sure to continue with the rest of the installation process.

#### Next Step: [Webserver Configuration](./webserver_configuration)
