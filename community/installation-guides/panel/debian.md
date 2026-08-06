# Debian 11、12 與 13

[[toc]]

::: tip
本指南是以[官方安裝文件](/panel/1.0/getting_started.md)為基礎，再針對 Debian 11、12 與 13 做了些微調整，方便你照著做。
:::

| 作業系統                         | 版本 |     支援狀態      | 備註                                                         |
| -------------------------------- | ---- | :----------------: | ------------------------------------------------------------ |
| **Debian**                       | 11   | :white_check_mark: |                                                              |
|                                  | 12   | :white_check_mark: |                                                              |
|                                  | 13   | :white_check_mark: | - 無需執行套件庫設定指令碼即可安裝 MariaDB<br> - 無需使用 Redis APT 套件庫即可安裝 Redis |

## 安裝相依套件

這一步會把 Pterodactyl 控制面板需要用到的相依套件全部裝好，完成之後，就可以接著照官方安裝文件繼續往下操作。

```bash
# 安裝必要套件
apt install -y curl ca-certificates gnupg2 sudo lsb-release

# 新增 PHP 的額外套件庫
echo "deb https://packages.sury.org/php/ $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/sury-php.list
curl -fsSL https://packages.sury.org/php/apt.gpg | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/sury-keyring.gpg

# 新增 Redis 官方 APT 套件庫（Debian 11 與 12）
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

# MariaDB 套件庫設定指令碼（Debian 11 與 12）
curl -LsS https://r.mariadb.com/downloads/mariadb_repo_setup | sudo bash

# 更新套件庫清單
apt update

# 安裝相依套件
apt install -y php8.3 php8.3-{common,cli,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip} mariadb-server nginx tar unzip git redis-server
```

### 安裝 Composer

這裡要提醒一下，Composer 是 PHP 的相依套件管理工具，控制面板執行時需要的所有程式碼相依套件，都是靠它來處理的，所以在繼續往下安裝之前，得先把 Composer 裝起來。

```bash
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

### 下載檔案

到這裡，所有相依套件都處理完畢了。接下來請直接接續[官方文件中的「下載檔案」章節](/panel/1.0/getting_started.md#download-files)，完成剩下的安裝步驟。

### Wings

如果你用的是 Debian 11、12 或 13，Wings 這邊不需要額外做什麼特別設定，直接照著[官方 Wings 安裝文件](/wings/1.0/installing.md)操作即可，裡面也有包含 Debian 的 Docker 安裝說明可以參考。
