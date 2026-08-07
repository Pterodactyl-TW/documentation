---
meta:
- property: og:title
  content: 更新 Panel | Pterodactyl 繁體中文文件
- property: og:description
  content: 本文件說明 1.x 系列版本內的更新流程，例如從 1.5.0 更新至 1.6.0。請勿使用本指南從 0.7 升級。
- property: og:image
  content: https://pterodactyl.tw/og/panel_1.0_updating.png
- property: og:image:width
  content: '1200'
- property: og:image:height
  content: '630'
- name: twitter:title
  content: 更新 Panel | Pterodactyl 繁體中文文件
- name: twitter:description
  content: 本文件說明 1.x 系列版本內的更新流程，例如從 1.5.0 更新至 1.6.0。請勿使用本指南從 0.7 升級。
- name: twitter:image
  content: https://pterodactyl.tw/og/panel_1.0_updating.png
---
# 更新 Panel

本文件說明 `1.x` 系列版本內的更新流程，例如從 `1.5.0` 更新至 `1.6.0`。**請勿使用本指南從 `0.7` 升級。**

## Panel 版本需求

每個版本的 Pterodactyl Panel 都有相對應的 Wings 最低版本需求。請參考下表了解版本的對應關係。
在大多數情況下，Wings 的主要版本應與 Panel 版本一致。

| Panel 版本     | Wings 版本     | 支援狀態  | PHP 版本               |
| ------------- | ------------- | --------- | --------------------- |
| 1.0.x         | 1.0.x         |           | 7.3, 7.4              |
| 1.1.x         | 1.1.x         |           | 7.3, 7.4              |
| 1.2.x         | 1.2.x         |           | 7.3, 7.4              |
| 1.3.x         | 1.3.x         |           | 7.4, 8.0              |
| 1.4.x         | 1.4.x         |           | 7.4, 8.0              |
| 1.5.x         | 1.4.x         |           | 7.4, 8.0              |
| 1.6.x         | 1.4.x         |           | 7.4, 8.0              |
| 1.7.x         | 1.5.x         |           | 7.4, 8.0              |
| 1.8.x         | 1.6.x         |           | 7.4, 8.0, 8.1         |
| 1.9.x         | 1.6.x         |           | 7.4, 8.0, 8.1         |
| 1.10.x        | 1.7.x         |           | 7.4, 8.0, 8.1         |
| **1.11.x**    | **1.11.x**    |           | ~~8.1~~, 8.2, **8.3** |
| **1.12.x**    | **1.12.x**    | ✅        | 8.2, **8.3** |


::: tip Wings 發行版本
Wings 沒有 1.8.x、1.9.x 或 1.10.x 發行版本。
:::

## 更新相依套件

- PHP `8.2` 或 `8.3`（建議使用）
- Composer `2.X`

**繼續之前**，請執行 `php -v` 確認系統與網頁伺服器設定至少已升級至 PHP 8.2，並執行 `composer --version` 確認 Composer 2。
你應會看到類似下方的輸出。如果版本低於 PHP 8.2 或 Composer 2，請依照[PHP 升級指南](/guides/php_upgrade.md)升級，
再返回本文件繼續操作。

```shell
vagrant@pterodactyl:~/app$ php -v
PHP 8.2.5 (cli) (built: Dec 21 2022 10:32:13) (NTS)
Copyright (c) The PHP Group
Zend Engine v4.1.5, Copyright (c) Zend Technologies
    with Zend OPcache v8.2.5, Copyright (c), by Zend Technologies

vagrant@pterodactyl:~/app$ composer --version
Composer version 2.3.5 2022-04-13 16:43:00
```

## 自動升級

::: warning 警告
由於部分相依套件存在問題，目前無法使用自動升級。
在問題解決前，請先執行手動升級。
:::

## 手動升級

如果你不想執行自動升級，或需要查閱升級步驟，可以依照下方文件操作。

::: warning 警告
如果你已成功執行自動升級，就不需要再進行本頁的其他操作。
:::

### 進入維護模式

執行更新時，務必讓 Panel 進入維護模式。這能避免使用者遇到意外錯誤，並確保所有內容在使用者看到新功能前完成更新。

```bash
cd /var/www/pterodactyl

php artisan down
```

### 下載更新

更新流程的第一步是從 GitHub 下載新的 Panel 檔案。下方命令會下載最新 Pterodactyl 版本的發行壓縮檔，
將其儲存到目前目錄，並自動解壓縮到目前資料夾。

```bash
curl -L https://github.com/Pterodactyl-TW/panel/releases/latest/download/panel.tar.gz | tar -xzv
```

下載所有檔案後，需要為快取與儲存目錄設定正確權限，以避免網頁伺服器相關錯誤。

```bash
chmod -R 755 storage/* bootstrap/cache
```

### 更新相依套件

下載所有新檔案後，需要更新 Panel 的核心元件。請執行下方命令並依照提示操作。

```bash
composer install --no-dev --optimize-autoloader
```

### 清除已編譯的範本快取

你也應清除已編譯的範本快取，以確保使用者能正確看到新的與已修改的範本。

```bash
php artisan view:clear
php artisan config:clear
```

### 更新資料庫

你也需要更新資料庫結構，以配合最新版本的 Pterodactyl。執行下方命令會更新結構，確保隨附的預設 Egg 保持最新，
並加入可能新增的 Egg。請記住，_絕對不要編輯我們隨附的核心 Egg_！它們會在更新過程中被覆寫。

```bash
php artisan migrate --seed --force
```

### 設定權限

最後一步是將檔案擁有者設定為執行網頁伺服器的使用者。大多數情況下是 `www-data`，但可能依系統而異，
有時會是 `nginx`、`caddy`、`apache`，甚至是 `nobody`。

```bash
# 若使用 NGINX 或 Apache（CentOS 除外）
chown -R www-data:www-data /var/www/pterodactyl/*

# 若在 CentOS 上使用 NGINX
chown -R nginx:nginx /var/www/pterodactyl/*

# 若在 CentOS 上使用 Apache
chown -R apache:apache /var/www/pterodactyl/*
```

### 重新啟動佇列工作程序

每次更新後都應重新啟動佇列工作程序，確保載入並使用新程式碼。

```bash
php artisan queue:restart
```

### 離開維護模式

現在所有內容都已更新，你需要離開維護模式，讓 Panel 恢復接受連線。

```bash
php artisan up
```

### 遙測

自 1.11 起，Pterodactyl 會收集匿名遙測資料，協助我們更了解軟體的使用方式。若要深入了解此功能或選擇退出，
請參閱[遙測](./additional_configuration.md#遙測)文件。請記得繼續完成其餘升級步驟。

[最後一步：升級 Wings](/wings/1.0/upgrading.md)
