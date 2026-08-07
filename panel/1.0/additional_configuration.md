---
meta:
- property: og:title
  content: 進階設定 | Pterodactyl 繁體中文文件
- property: og:description
  content: Pterodactyl Panel 支援建立伺服器備份，不過在開始使用之前，你需要先設定備份要儲存在哪裡。
- property: og:image
  content: https://pterodactyl.tw/og/panel_1.0_additional_configuration.png
- property: og:image:width
  content: '1200'
- property: og:image:height
  content: '630'
- name: twitter:title
  content: 進階設定 | Pterodactyl 繁體中文文件
- name: twitter:description
  content: Pterodactyl Panel 支援建立伺服器備份，不過在開始使用之前，你需要先設定備份要儲存在哪裡。
- name: twitter:image
  content: https://pterodactyl.tw/og/panel_1.0_additional_configuration.png
---
# 進階設定

[[toc]]

## 備份

Pterodactyl Panel 支援建立伺服器備份，不過在開始使用之前，你需要先設定備份要儲存在哪裡。

這裡有個小細節要注意：更換備份儲存方式之後，先前用舊儲存驅動程式建立的備份並不會消失，使用者仍然可以下載或刪除它們。舉例來說，如果你打算把備份從 S3 遷移回本機儲存，切換過去之後別急著刪掉 S3 的憑證設定，因為舊備份仍然要靠這組憑證才能存取。

### 使用本機備份

Pterodactyl Panel 預設就是透過 Wings 把備份存在本機儲存空間，不需要額外設定。如果你想明確指定這個行為，也可以在 `.env` 檔案中加入以下設定：

```bash
# 設定你的 panel 透過 Wings 使用本機儲存空間來備份
APP_BACKUP_DRIVER=wings
```

有一點要提醒你：走本機儲存時，備份實際存放的路徑是由 Wings 決定的，而不是 Panel。你需要在 Wings 的 `config.yml` 中用以下設定金鑰指定目的地：

```yml
system:
  backup_directory: /path/to/backup/storage
```

### 使用 S3 備份

如果你想把備份存到遠端或雲端，AWS S3（或相容的儲存服務）是個好選擇。要啟用這個功能，只要在 `.env` 檔案或環境變數中設定以下選項即可：

```bash
# 設定你的 panel 使用 s3 來備份
APP_BACKUP_DRIVER=s3

# 實際使用 s3 所需的資訊
AWS_DEFAULT_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BACKUPS_BUCKET=
AWS_ENDPOINT=
```

小提醒：有些服務商需要把 S3 URL 的格式從 `bucket.domain.com` 改成 `domain.com/bucket` 才能正常運作。遇到這種情況，只要在 `.env` 檔案加入 `AWS_USE_PATH_STYLE_ENDPOINT=true` 就能解決。

#### 分段上傳

S3 備份底層是靠 S3 的分段上傳功能來運作的。多數情況下你完全不用理會這個機制，但少數情況下，你可能會想調整單一分段的大小，或是預簽章 URL 的有效期限。預設值分別是分段大小 5GB、預簽章 URL 有效期限 60 分鐘。

如果想自行調整，可以用 `BACKUP_MAX_PART_SIZE` 環境變數設定分段大小上限（單位是位元組），並用 `BACKUP_PRESIGNED_URL_LIFESPAN` 變數設定預簽章 URL 有效期限（單位是分鐘）。

舉個例子，以下 `.env` 設定會把分段大小設為 1GB，並將預簽章 URL 有效期限設為 120 分鐘：

```bash
BACKUP_MAX_PART_SIZE=1073741824
BACKUP_PRESIGNED_URL_LIFESPAN=120
```

#### 儲存類別

如果需要指定 S3 的儲存類別，可以使用 `AWS_BACKUPS_STORAGE_CLASS` 環境變數，預設值是 `STANDARD`（也就是 S3 Standard）。

以下範例示範如何把儲存類別改成 `STANDARD_IA`（這裡僅作示範，實際要用哪個類別依你的需求決定）：

```bash
# 這裡的 STANDARD_IA 只是範例。
AWS_BACKUPS_STORAGE_CLASS=STANDARD_IA
```

## 反向代理設定

如果你把 Pterodactyl 架在反向代理後方（例如 [Cloudflare Flexible SSL](https://support.cloudflare.com/hc/en-us/articles/200170416-What-do-the-SSL-options-mean-)，或是 NGINX、Apache、Caddy 這類反向代理），就需要對 Panel 做一點小修改才能正常運作。

這裡先解釋一下為什麼：Panel 預設並不知道自己是透過反向代理接收請求的，判斷連結產生方式時，它會誤以為自己執行在 HTTP 而不是 HTTPS。結果就是你可能會登入失敗，或是在瀏覽器主控台看到「載入不安全資源」的警告。

解法是編輯 Panel 根目錄中的 `.env` 檔案，加入 `TRUSTED_PROXIES=*`。不過這裡建議你不要偷懶用 `*`，而是明確填入實際會轉發流量的 IP 位址（可以用逗號分隔多個）。舉例來說，如果反向代理跟 Panel 是架在同一台機器上，通常只要 `TRUSTED_PROXIES=127.0.0.1` 就夠了。

### NGINX 專用設定

如果你用的是 NGINX，記得在 `location` 設定區塊中加入以下內容，Pterodactyl 才能正確回應：

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

如果你是透過 Cloudflare Flexible SSL 使用反向代理，`TRUSTED_PROXIES` 就要填入 [Cloudflare 的 IP 位址清單](https://www.cloudflare.com/ips/)，設定範例如下：

```text
TRUSTED_PROXIES=173.245.48.0/20,103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,141.101.64.0/18,108.162.192.0/18,190.93.240.0/20,188.114.96.0/20,197.234.240.0/22,198.41.128.0/17,162.158.0.0/15,104.16.0.0/13,104.24.0.0/14,172.64.0.0/13,131.0.72.0/22
```

## reCAPTCHA

Panel 會用隱形 reCAPTCHA 保護登入頁面，防止有心人士暴力破解密碼。簡單來說，只有在系統判斷某次登入嘗試可疑時，使用者才需要額外完成 reCAPTCHA 驗證。

### 設定 reCAPTCHA

系統預設會提供一組全域的 Site Key 與 Secret Key 可以直接用，但強烈建議你換成自己的金鑰，這樣安全性才有保障。

你可以到 [reCAPTCHA 管理主控台](https://www.google.com/recaptcha/admin)自行產生一組金鑰，接著在管理面板的 **Advanced** 分頁套用即可。

### 停用 reCAPTCHA

:::warning 安全性警告
不建議停用 reCAPTCHA，它是提高帳戶被暴力破解難度的重要安全機制。
:::

話雖如此，如果使用者反映登入太麻煩，或是你的 Panel 根本沒有對外網公開，停用 reCAPTCHA 也是合理的選擇。

要停用很簡單，到管理面板的 **Advanced** 分頁，把 reCAPTCHA 的 **Status** 改成 **disabled** 就完成了。

#### 編輯資料庫

萬一你完全無法存取 Panel 介面，也可以直接修改資料庫來達成同樣效果：

```sql
# 若使用 MariaDB（v11.0.0+）
mariadb -u root -p

# 若使用 MySQL
mysql -u root -p
```
```sql
UPDATE panel.settings SET value = 'false' WHERE `key` = 'settings::recaptcha:enabled';
```

## 雙因素驗證（2FA）

一般情況下，2FA 相關設定都應該透過 Panel 介面調整。以下步驟是留給萬一無法存取 Panel 時的備用手段。

### 停用 2FA 要求

```sql
# 若使用 MariaDB（v11.0.0+）
mariadb -u root -p

# 若使用 MySQL
mysql -u root -p
```
```sql
UPDATE panel.settings SET value = 0 WHERE `key` = 'settings::pterodactyl:auth:2fa_required';
```

### 停用特定使用者的 2FA

在 `/var/www/pterodactyl` 目錄中執行以下命令即可：

``` bash
php artisan p:user:disable2fa
```

## 遙測

從 1.11 版開始，Panel 會蒐集自身與所有已連線節點的匿名指標資料。這項功能預設是開啟的，不過你隨時可以關閉它。

先說清楚一件事：這些資料絕對不會被出售，也不會用於廣告。蒐集彙總統計資料的唯一目的，是幫助我們把軟體做得更好，必要時可能會公開或與第三方分享彙總後的結果。

### 運作方式

遙測系統的運作邏輯是這樣的：Panel 安裝時會先產生一組隨機的 UUIDv4 識別碼並存入資料庫，這樣一來，即使你用多個 Panel 執行個體做負載平衡，每個執行個體依然擁有各自唯一的識別碼。之後，系統會把這組識別碼連同相關遙測資料一起傳送到遠端伺服器。

值得注意的是，遙測資料每 24 小時才收集傳送一次，並不是持續蒐集，也不會事先存在本機，而是在真正要傳送前才即時收集。

目前所有遙測收集邏輯都寫在 Panel 的 [TelemetryCollectionService](https://github.com/Pterodactyl-TW/panel/blob/1.0-develop/app/Services/Telemetry/TelemetryCollectionService.php#L53) 裡，負責彙整所有要送往遠端伺服器的資料。

### 收集哪些資料？

如果你想確認完整的收集內容，可以直接參考上面連結的原始碼，或是在伺服器上執行 `php artisan p:telemetry` 命令，就能看到實際會送出的資料內容。

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

目前這些資料存放在 Cloudflare：我們用一個 Worker 接收所有遙測資料，做完基本的驗證等處理後，再寫入 Cloudflare D1。老實說，目前還沒有任何查詢用的 API 或視覺化介面，只能靠手動查詢，而且現階段只有 Matthew 一個人能查得到。我們正在研究更方便的替代方案，讓這些資料未來更容易被存取。

### 為什麼要收集？

收集這些資料，最主要是想幫助我們對這套軟體的未來做出更好的判斷。舉個實際的例子：1.11 版發行時，最低 PHP 版本需求從 7.4 提升到了 8.0；而我們其實還想加入一項需要 PHP 8.1 的功能，這會進一步墊高版本門檻，可能讓部分使用者感到不便。有了這些資料，我們就能更清楚了解這類變更實際上會影響多少人，進而做出更周全的決策。節點的架構、核心版本、作業系統這些資訊尤其重要，例如我們想採用某個只有特定檔案系統才支援的功能時，如果不知道有多少人在用那些檔案系統，就很難判斷值不值得投入開發資源。

當然，也有一部分資料的決策價值沒那麼高，純粹是因為我們也好奇。比如說，你有沒有想過目前全世界到底有多少個 Panel 執行個體在運作？這些執行個體加起來總共跑了多少台伺服器？有多少使用者、其中有多少是管理員？又有多少伺服器在用某個特定的 Egg 或 Nest？這些問題的答案，都藏在我們收集的資料裡，也能幫助我們和社群一起更了解這套軟體實際上是怎麼被使用的。

如果你對我們蒐集的資料有任何疑問，歡迎到 Discord 找我們聊聊。我們的目標是盡可能保持透明，讓社群清楚知道我們在做什麼、為什麼要這麼做。

### 啟用遙測

遙測預設就是啟用狀態。如果你之前手動關閉過，想重新打開的話，只要編輯 `.env` 檔案，把 `PTERODACTYL_TELEMETRY_ENABLED` 這一行刪掉，或是直接設為 `true` 即可：

```text
PTERODACTYL_TELEMETRY_ENABLED=true
```

也可以改用 `php artisan p:environment:setup` 命令來啟用；如果是走非互動式設定，可以搭配 `--telemetry` 旗標。

### 停用遙測

想停用的話，編輯 `.env` 檔案，把 `PTERODACTYL_TELEMETRY_ENABLED` 設為 `false` 即可：

```text
PTERODACTYL_TELEMETRY_ENABLED=false
```

同樣地，也可以使用 `php artisan p:environment:setup` 命令來停用；非互動式設定時可搭配 `--telemetry=false` 旗標。
