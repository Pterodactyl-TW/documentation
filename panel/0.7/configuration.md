---
meta:
- name: robots
  content: noindex
- property: og:title
  content: 環境設定 | Pterodactyl 繁體中文文件
- property: og:description
  content: Pterodactyl 的環境設定會儲存在 .env 這個環境檔案中，通常位於安裝根目錄，也就是 /var/www/pterodactyl。
- property: og:image
  content: https://pterodactyl.tw/og/panel_0.7_configuration.png
- property: og:image:width
  content: '1200'
- property: og:image:height
  content: '630'
- name: twitter:title
  content: 環境設定 | Pterodactyl 繁體中文文件
- name: twitter:description
  content: Pterodactyl 的環境設定會儲存在 .env 這個環境檔案中，通常位於安裝根目錄，也就是 /var/www/pterodactyl。
- name: twitter:image
  content: https://pterodactyl.tw/og/panel_0.7_configuration.png
---
# 環境設定

[[toc]]

Pterodactyl 的環境設定會儲存在 `.env` 這個環境檔案中，通常位於安裝根目錄，也就是 `/var/www/pterodactyl`。
這裡要注意的是，部分設定其實也會同時存放在資料庫中，而且資料庫裡的設定會覆寫 `.env` 檔案裡寫的內容。

如果你想改變這個行為，讓 `.env` 檔案的設定值永遠優先，可以編輯 `.env` 檔案，把 `APP_ENVIRONMENT_ONLY=false` 改成
`APP_ENVIRONMENT_ONLY=true`，下次重新整理 Panel 頁面時就會生效。不過小提醒，一般情況下用不太到這個設定，通常只有在
Panel 設定嚴重損壞、或是你正在深入開發這套軟體時，才需要動用它。

## 回報所有例外
Pterodactyl 預設只會記錄並回報真正算是「例外情況」的例外，像是驗證失敗這類本來就預期會發生的情況，就不會特別記錄下來。
但在少數狀況下，即使是正式伺服器，你可能還是會想記錄下所有例外，方便用來追查一些不太一致、難以重現的行為。

想開啟這個功能的話，只要在 `.env` 檔案中加入 `APP_REPORT_ALL_EXCEPTIONS=true` 即可。不過要提醒的是，完成偵錯工作後記得
把它關掉，不然記錄檔很快就會變得非常龐大。

## 使用者資料庫
Pterodactyl 預設會讓每個使用者的每台伺服器都能擁有自己專屬的資料庫。如果不想要這個功能，把
`PTERODACTYL_CLIENT_DATABASES_ENABLED` 設為 `false` 就能停用。另外，Pterodactyl 建立資料庫時，預設會先嘗試使用該伺服器
所屬節點指派的資料庫主機；如果找不到，才會退而求其次，改用任何可用的主機。如果你希望資料庫「只能」建立在該節點所屬的主機上，
不允許使用其他主機，就把 `PTERODACTYL_CLIENT_DATABASES_ALLOW_RANDOM` 設為 `false`。

```
PTERODACTYL_CLIENT_DATABASES_ENABLED=true
PTERODACTYL_CLIENT_DATABASES_ALLOW_RANDOM=true
```

## 反向 Proxy 設定
如果你打算讓 Pterodactyl 運作在反向 Proxy 後方，例如搭配 NGINX，或是因為使用了
[Cloudflare's Flexible SSL](https://support.cloudflare.com/hc/en-us/articles/200170416-What-do-the-SSL-options-mean-)，
那就需要對 Panel 做一點調整，才能讓它正常運作。

原因是這樣的：在這類反向 Proxy 架構下，Panel 預設無法正確判斷請求的來源，很可能導致你完全無法登入，或是在瀏覽器主控台看到
「載入不安全資源」的安全性警告。這是因為 Panel 內部用來判斷連結產生方式的邏輯，會誤以為自己是跑在 HTTP 上，而不是實際的
HTTPS。

要解決這個問題，至少要編輯 Panel 根目錄中的 `.env` 檔案，加入 `TRUSTED_PROXIES=*`。不過這裡強烈建議不要偷懶用 `*`，
而是填入具體的 IP 位址（可以用逗號分隔多個 IP），安全性會好上許多。舉例來說，如果 Proxy 跟伺服器是跑在同一台機器上，
通常寫 `TRUSTED_PROXIES=127.0.0.1` 就足夠了。

### NGINX 專用設定
如果想讓 Pterodactyl 能正確回應 NGINX 反向 Proxy 傳來的請求，NGINX 設定檔的 `location` 區塊中必須包含以下內容：
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
如果你是用 Cloudflare 的 Flexible SSL，記得把 `TRUSTED_PROXIES` 設定為包含[所有 Cloudflare 的 IP 位址](https://www.cloudflare.com/ips/)。
以下是一個設定範例：

```
TRUSTED_PROXIES=103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,104.16.0.0/12,108.162.192.0/18,131.0.72.0/22,141.101.64.0/18,162.158.0.0/15,172.64.0.0/13,173.245.48.0/20,188.114.96.0/20,190.93.240.0/20,197.234.240.0/22,198.41.128.0/17
```

## 增加可編輯檔案大小
Panel 內建的網頁檔案管理器，預設會有一個合理的檔案編輯大小限制。不過如果你覺得這個限制太嚴格，其實可以自行調高。
這個限制由設定值控制，同樣可以在 `.env` 檔案中修改，預設值是 `50,000` 位元組，你可以依照需求往上調整。

```
PTERODACTYL_FILES_MAX_EDIT_SIZE=50000
```

## 停用或修改 reCAPTCHA
如果想在登入或重設密碼時停用 reCAPTCHA，只要在環境檔案中設定 `RECAPTCHA_ENABLED=false` 就好，變更會立即生效，
不需要額外的步驟。

### 使用自己的金鑰
Pterodactyl 預設已經幫你設定好一組公開的 reCAPTCHA 金鑰，但如果你想改用自己網站專屬的金鑰，可以依照下面的步驟操作。

1. 前往 [Google reCAPTCHA 管理主控台](https://www.google.com/recaptcha/admin#list)。
2. 點選「Register New Site」，替這組金鑰取個名稱。
3. 選擇 `reCAPTCHA v2`，並確認有勾選 `Invisible` 選項。
4. 加入 Panel 所在的網域。
5. 下一頁會看到「Site Key」與「Secret Key」，接著回到 Pterodactyl 控制面板，點選「Settings」再切到「Advanced」分頁，
  把這兩組金鑰分別填入「Site Key」與「Secret Key」欄位即可。

::: warning 停用網域驗證
如果不希望 reCAPTCHA 去驗證發出要求的網域是否相符，可以在產生金鑰後，到「Advanced Settings」中取消勾選
「Verify the origin of reCaptcha solution」。
:::
