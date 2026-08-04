# 進階設定

[[toc]]

## 備份

Pterodactyl Panel 允許使用者建立伺服器備份。若要建立備份，必須先設定備份儲存方式。

變更 Pterodactyl Panel 的備份儲存方式後，使用者仍可從先前的儲存驅動程式下載或刪除既有備份。如果要從 S3 遷移至本機備份，
切換至本機備份儲存方式後，仍必須保留 S3 憑證設定。

### 使用本機備份

Pterodactyl Panel 預設透過 Wings 使用本機儲存空間進行備份。你也可以在 `.env` 檔案中加入以下設定，明確指定此備份儲存方式：

```bash
# Sets your panel to use local storage via Wings for backups
APP_BACKUP_DRIVER=wings
```

請注意，透過 Wings 使用本機儲存空間時，備份目的地要在 Wings 的 `config.yml` 中使用以下設定金鑰指定：

```yml
system:
  backup_directory: /path/to/backup/storage
```

### 使用 S3 備份

AWS S3（或相容的儲存服務）可用來儲存遠端或雲端備份。若要啟用此功能，必須在 `.env` 檔案或環境變數中設定以下選項：

```bash
# Sets your panel to use s3 for backups
APP_BACKUP_DRIVER=s3

# Info to actually use s3
AWS_DEFAULT_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BACKUPS_BUCKET=
AWS_ENDPOINT=
```

某些設定可能需要將 S3 URL 從 `bucket.domain.com` 改為 `domain.com/bucket`。若要達成此目的，請在 `.env` 檔案加入 `AWS_USE_PATH_STYLE_ENDPOINT=true`。

#### 分段上傳

S3 備份使用 S3 的分段上傳功能。在少數情況下，你可能需要調整單一分段的大小或產生的預簽章 URL 有效期限。
預設分段大小為 5GB，預設預簽章 URL 有效期限為 60 分鐘。

你可以使用 `BACKUP_MAX_PART_SIZE` 環境變數設定分段大小上限，大小必須以位元組指定。若要設定預簽章 URL 有效期限，
請使用 `BACKUP_PRESIGNED_URL_LIFESPAN` 變數，單位為分鐘。

The following `.env` snippet configures 1GB parts and uses 120 minutes as the pre-signed URL lifespan:

```bash
BACKUP_MAX_PART_SIZE=1073741824
BACKUP_PRESIGNED_URL_LIFESPAN=120
```

#### 儲存類別

若需要指定儲存類別，請使用 `AWS_BACKUPS_STORAGE_CLASS` 環境變數。預設選項為 `STANDARD`（S3 Standard）。

The following `.env` snippet sets the class to `STANDARD_IA` (this is an example).

```bash
# STANDARD_IA is an example.
AWS_BACKUPS_STORAGE_CLASS=STANDARD_IA
```

## 反向 Proxy 設定

當 Pterodactyl 執行於反向 Proxy 後方，例如 [Cloudflare Flexible SSL](https://support.cloudflare.com/hc/en-us/articles/200170416-What-do-the-SSL-options-mean-)
或 NGINX／Apache／Caddy 等，你需要稍微修改 Panel，確保其正常運作。使用這些反向 Proxy 時，Panel 預設無法正確處理要求，
你很可能無法登入，或在瀏覽器主控台看到載入不安全資源的安全性警告。這是因為 Panel 用來判斷連結產生方式的內部邏輯，
會認為自己執行於 HTTP，而不是 HTTPS。

你至少需要編輯 Panel 根目錄中的 `.env` 檔案，加入 `TRUSTED_PROXIES=*`。我們強烈建議提供特定 IP 位址（或以逗號分隔的 IP 清單），
而不是允許 `*`。例如，如果 Proxy 與伺服器執行於同一台機器，使用 `TRUSTED_PROXIES=127.0.0.1` 通常即可正常運作。

### NGINX 專用設定

若要讓 Pterodactyl 正確回應 NGINX 反向 Proxy，NGINX 的 `location` 設定必須包含以下內容：

```Nginx
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header Host $host;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_redirect off;
proxy_buffering off;
proxy_request_buffering off;
```

### Cloudflare 專用設定

如果使用 Cloudflare Flexible SSL，應將 `TRUSTED_PROXIES` 設為包含[其 IP 位址](https://www.cloudflare.com/ips/)。以下是設定範例。

```text
TRUSTED_PROXIES=173.245.48.0/20,103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,141.101.64.0/18,108.162.192.0/18,190.93.240.0/20,188.114.96.0/20,197.234.240.0/22,198.41.128.0/17,162.158.0.0/15,104.16.0.0/13,104.24.0.0/14,172.64.0.0/13,131.0.72.0/22
```

## reCAPTCHA

Panel 使用隱形 reCAPTCHA 保護登入頁面，防止暴力破解攻擊。如果登入嘗試被判定為可疑，使用者可能需要完成 reCAPTCHA 驗證。

### 設定 reCAPTCHA

雖然系統預設提供全域 Site Key 與 Secret Key，我們仍強烈建議為自己的環境更換金鑰。

You can generate your own keys in the [reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin).

接著可以在管理面板的設定中套用金鑰。reCAPTCHA 設定位於 **Advanced** 分頁。

### 停用 reCAPTCHA

:::warning 安全性警告
我們不建議停用 reCAPTCHA。它是一項能提高使用者帳戶暴力破解難度的安全機制。
:::

如果使用者難以登入，或你的 Panel 沒有暴露在網際網路上，停用 reCAPTCHA 可能是合理的做法。

你可以使用管理面板輕鬆停用 reCAPTCHA。在設定中選取 **Advanced** 分頁，將 reCAPTCHA 的 **Status** 設為 **disabled**。

#### 編輯資料庫

如果無法存取 Panel，可以使用以下命令直接修改資料庫。

```sql
# If using MariaDB (v11.0.0+)
mariadb -u root -p

# If using MySQL
mysql -u root -p
```
```sql
UPDATE panel.settings SET value = 'false' WHERE `key` = 'settings::recaptcha:enabled';
```

## 雙因素驗證（2FA）

如果可以，應使用 Panel 更新 2FA 設定。如果因任何原因無法存取 Panel，可以使用以下步驟。

### 停用 2FA 要求

```sql
# If using MariaDB (v11.0.0+)
mariadb -u root -p

# If using MySQL
mysql -u root -p
```
```sql
UPDATE panel.settings SET value = 0 WHERE `key` = 'settings::pterodactyl:auth:2fa_required';
```

### 停用特定使用者的 2FA

請在 `/var/www/pterodactyl` 目錄中執行以下命令。

``` bash
php artisan p:user:disable2fa
```

## 遙測

自 1.11 起，Panel 會收集 Panel 與所有已連線節點的匿名指標。
此功能預設啟用，但可以停用。

此功能收集的資料不會出售，也不會用於廣告用途。為了改善軟體，彙總統計資料可能會公開或與第三方分享。

### 運作方式

遙測系統會先為 Panel 安裝產生隨機的 UUIDv4 識別碼。此識別碼會儲存在資料庫中，讓使用多個 Panel 執行個體進行負載平衡的使用者
仍能擁有唯一識別碼。接著，系統會將此識別碼與相關遙測資料一併傳送至遠端伺服器。遙測資料每 24 小時收集一次，
不會持續收集，也不會在本機儲存遙測資料；系統會在傳送至遠端伺服器前才收集資料。

目前，所有遙測收集邏輯都由 Panel 中的 [TelemetryCollectionService](https://github.com/pterodactyl/panel/blob/1.0-develop/app/Services/Telemetry/TelemetryCollectionService.php#L53)
處理。此服務負責收集要傳送至遠端伺服器的所有資料。

### 收集哪些資料？

如果你想查看完整的收集資料，請參閱上方連結的 TelemetryCollectionService，或使用 `php artisan p:telemetry` 命令查看
將傳送至遠端伺服器的確切資料。

截至 2022-12-12，收集的資料包括：

* Panel 的唯一識別碼
* Panel 版本
* PHP 版本
* 備份儲存驅動程式（S3、本機等）
* 快取驅動程式（Redis、Memcached 等）
* 資料庫驅動程式與版本（MySQL、MariaDB、PostgreSQL 等）
* 資源
  * 配置
    * 總數
    * 已使用配置的總數（已指派給伺服器）
  * 備份
    * 總數
    * 備份儲存內容的總位元組數
  * Egg
    * 總數
    * ~~使用各 Egg 的伺服器數量與 Egg UUID 對應表~~（已於 1.11.2 移除）
  * 位置
    * 總數
  * 掛載
    * 總數
  * Nest
    * 總數
    * ~~使用各 Nest 中 Egg 的伺服器數量與 Nest UUID 對應表~~（已於 1.11.2 移除）
  * 節點
    * 總數
  * 伺服器
    * 總數
    * 已暫停的伺服器數量
  * 使用者
    * 總數
    * 管理員使用者數量
* 節點
  * 節點 UUID
  * 節點上的 Wings 版本
  * Docker
    * 版本
    * Cgroups
      * 驅動程式
      * 版本
    * 容器
      * 總數
      * 執行中
      * 已暫停
      * 已停止
    * 儲存空間
      * 驅動程式
      * 檔案系統
    * runc
      * 版本
  * 系統
    * 架構（`amd64`、`arm64` 等）
    * CPU 執行緒
    * 記憶體位元組數
    * 核心版本
    * 作業系統（Debian、Fedora、RHEL、Ubuntu 等）
    * 作業系統類型（bsd、linux、windows 等）

### 資料如何儲存？

目前資料儲存在 Cloudflare。我們使用 Worker 接收所有遙測資料，執行驗證等基本處理後，再將資料寫入 Cloudflare D1。
目前沒有任何收集資料的 API 或視覺化介面，只能手動查詢。現階段只有 Matthew 能查詢資料，但我們正在研究替代方案，
讓這些資料更容易存取。

### 為什麼收集？

收集這些資料的主要原因，是協助我們為這套軟體的未來做出更好的決策。1.11 發行時，最低 PHP 版本需求從 7.4 提升至 8.0；
然而，我們想加入一項需要 PHP 8.1 的功能，這會進一步提高版本需求，並可能為部分使用者帶來問題。透過收集這些資料，
我們希望更了解這類變更會如何影響社群，並在未來做出更好的決策。節點使用的架構、核心版本與作業系統等資訊尤其重要。
例如，我們想採用只有部分檔案系統支援的功能，但不知道有多少人使用那些檔案系統，因此無法判斷是否值得投入實作。

部分資料對決策的幫助較小，但我們仍希望了解這些資訊。例如，你是否曾想知道目前有多少個 Panel 執行個體？
所有執行個體總共執行多少台伺服器？有多少使用者正在使用 Panel？其中有多少是管理員？有多少伺服器使用特定 Egg？
有多少伺服器使用特定 Nest？我們收集的資料可以回答所有這些問題，並協助我們與社群更了解軟體的使用方式。

如果你對我們收集的資料有任何疑問，歡迎在 Discord 聯絡我們。我們的目標是盡可能透明，並確保社群了解我們正在做什麼以及原因。

### 啟用遙測

遙測預設啟用。如果停用後想重新啟用，請編輯 `.env` 檔案，移除 `PTERODACTYL_TELEMETRY_ENABLED` 行，或將其設為 `true`。

```text
PTERODACTYL_TELEMETRY_ENABLED=true
```

你也可以使用 `php artisan p:environment:setup` 命令啟用遙測；非互動式設定時可選擇搭配 `--telemetry` 旗標。

### 停用遙測

若要停用遙測，請編輯 `.env` 檔案，將 `PTERODACTYL_TELEMETRY_ENABLED` 設為 `false`。

```text
PTERODACTYL_TELEMETRY_ENABLED=false
```

你也可以使用 `php artisan p:environment:setup` 命令停用遙測；非互動式設定時可選擇搭配 `--telemetry=false` 旗標。
