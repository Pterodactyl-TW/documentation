---
meta:
    - name: robots
      content: noindex
---
# 環境設定

[[toc]]

Pterodactyl 的環境設定會設定並儲存在環境檔案 `.env` 中；該檔案位於安裝根目錄，通常是 `/var/www/pterodactyl`。
部分設定也會儲存在資料庫中，並覆寫環境檔案中的設定。

若要變更此行為，可以編輯 `.env` 檔案，將 `APP_ENVIRONMENT_ONLY=false` 改為 `APP_ENVIRONMENT_ONLY=true`，
下一次重新整理 Panel 頁面時便會生效。通常只有在 Panel 設定嚴重損壞，或正在深入開發軟體時才需要這麼做。

## 回報所有例外
Pterodactyl 預設只記錄並回報真正屬於例外情況的例外。有些例外是預期會發生的，例如驗證失敗或驗證問題。
但在少數開發情況，甚至正式伺服器上，你可能需要記錄所有例外，以偵測不一致的行為。

若要啟用，請在 `.env` 檔案中設定 `APP_REPORT_ALL_EXCEPTIONS=true`。完成需要例外記錄的工作後，請將其關閉，
否則記錄檔很快就會變得非常龐大。

## 使用者資料庫
Pterodactyl 預設允許使用者擁有每台伺服器各自的資料庫。若要停用此功能，請將 `PTERODACTYL_CLIENT_DATABASES_ENABLED`
設為 `false`。Pterodactyl 也會嘗試在目前伺服器節點所指派的資料庫主機上建立資料庫；如果找不到，則會使用任何可用主機。
若要強制資料庫只能建立在該伺服器節點所屬的主機上，請將 `PTERODACTYL_CLIENT_DATABASES_ALLOW_RANDOM` 設為 `false`。

```
PTERODACTYL_CLIENT_DATABASES_ENABLED=true
PTERODACTYL_CLIENT_DATABASES_ALLOW_RANDOM=true
```

## 反向 Proxy 設定
如果計畫讓 Pterodactyl 執行於反向 Proxy 後方，例如使用 NGINX，或因為使用
[Cloudflare's Flexible SSL](https://support.cloudflare.com/hc/en-us/articles/200170416-What-do-the-SSL-options-mean-),
你需要稍微修改 Panel，確保其正常運作。使用這些反向 Proxy 時，Panel 預設無法正確處理要求，你很可能無法登入，
或在瀏覽器主控台看到載入不安全資源的安全性警告。這是因為 Panel 用來判斷連結產生方式的內部邏輯，會認為自己執行於 HTTP，
而不是 HTTPS。

你至少需要編輯 Panel 根目錄中的 `.env` 檔案，加入 `TRUSTED_PROXIES=*`。我們強烈建議提供特定 IP 位址
（或以逗號分隔的 IP 清單），而不是允許 `*`。例如，如果 Proxy 與伺服器執行於同一台機器，使用
`TRUSTED_PROXIES=127.0.0.1` 通常即可正常運作。

### NGINX 專用設定
若要讓 Pterodactyl 正確回應 NGINX 反向 Proxy，NGINX 的 `location` 設定必須包含以下內容：
```
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

```
TRUSTED_PROXIES=103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,104.16.0.0/12,108.162.192.0/18,131.0.72.0/22,141.101.64.0/18,162.158.0.0/15,172.64.0.0/13,173.245.48.0/20,188.114.96.0/20,190.93.240.0/20,197.234.240.0/22,198.41.128.0/17
```

## 增加可編輯檔案大小
Panel 預設會為網頁檔案管理器設定合理的檔案編輯大小限制。然而，部分使用者可能覺得限制過於嚴格而希望提高上限。
此限制由設定值控制，也可以在 `.env` 檔案中設定。預設值為 `50,000` 位元組，你可以依需求提高。

```
PTERODACTYL_FILES_MAX_EDIT_SIZE=50000
```

## 停用或修改 reCAPTCHA
若要在登入或重設密碼時停用 reCAPTCHA，只要在環境檔案中設定 `RECAPTCHA_ENABLED=false`，變更會立即生效。

### 使用自己的金鑰
Pterodactyl 預先設定了一組公開的 reCAPTCHA 金鑰，但你可能希望使用自己網站專用的金鑰。請依照以下步驟操作。

1. 前往 [Google reCAPTCHA 管理主控台](https://www.google.com/recaptcha/admin#list)。
2. 點選「Register New Site」，並為金鑰填寫名稱。
3. 選擇 `reCAPTCHA v2`，並確認已選取 `Invisible` 選項。
4. 加入 Panel 所在的網域。
5. 在下一個頁面找到「Site Key」與「Secret Key」。在 Pterodactyl 控制面板中點選「Settings」，再選取「Advanced」分頁，
  分別將金鑰填入「Site Key」與「Secret Key」欄位。

::: warning 停用網域驗證
如果不希望 reCAPTCHA 驗證提出驗證要求的網域，產生金鑰後可以在「Advanced Settings」中取消勾選「Verify the origin of reCaptcha solution」。
:::
