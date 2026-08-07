# 建立 SSL 憑證

本教學將簡要說明如何為控制面板與 Wings 建立新的 SSL 憑證。

:::: tabs
::: tab "方法 1：Certbot"

首先，我們將安裝 Certbot。這是一個能自動更新憑證，並讓憑證建立流程更加簡單的指令碼。以下指令適用於 Ubuntu 發行版，但你也可以前往 [Certbot 官方網站](https://certbot.eff.org/)查看安裝說明。我們也提供了 Nginx／Apache 外掛的安裝指令，因此不需要停止 Web 伺服器。

```bash
sudo apt update
sudo apt install -y certbot
# 如果你使用 Nginx，請執行此指令
sudo apt install -y python3-certbot-nginx
# 如果你使用 Apache，請執行此指令
sudo apt install -y python3-certbot-apache
```

## 建立憑證

安裝 Certbot 後，我們需要產生憑證。產生憑證的方法有幾種，但最簡單的方式是使用剛才安裝的 Web 伺服器專用 Certbot 外掛。對於不需要 Web 伺服器的 Wings 專用機器，請使用 Certbot 的獨立模式或 DNS 方法，因為這些方法不需要 Web 伺服器。

接著，請將以下指令中的 `example.com` 替換成你要產生憑證的網域。如果你需要為多個網域建立憑證，只要在指令中加入更多 `-d anotherdomain.com` 參數即可。你也可以研究如何產生萬用字元憑證，但本教學不涵蓋此內容。

使用 Certbot 的 Nginx／Apache 外掛時，只要你已依照[設定 Web 伺服器](/panel/1.0/webserver_configuration.html)步驟完成 SSL 設定，通常不需要重新啟動 Web 伺服器即可套用憑證。

### HTTP 挑戰

HTTP 挑戰需要開放 80 連接埠，以進行驗證。

```bash
# Nginx 版本
certbot certonly --nginx -d example.com
# Apache 版本
certbot certonly --apache -d example.com
# 獨立模式－如果上述方法都無法使用，請採用此方法。使用前請先停止 Web 伺服器。
certbot certonly --standalone -d example.com
```

### DNS 挑戰

DNS 挑戰需要建立新的 TXT DNS 記錄，以驗證網域擁有權，因此不必開放 80 連接埠。執行以下 Certbot 指令時，終端機會顯示相關操作說明。

```bash
certbot -d example.com --manual --preferred-challenges dns certonly
```

### 自動更新

你可能也會想設定憑證自動更新，以避免憑證意外過期。你可以使用 `sudo crontab -e` 開啟 Crontab，然後將以下行加入檔案底部，使系統每天 23:00（晚上 11 點）嘗試更新憑證。

Deploy hook 會在憑證成功更新後重新啟動 Nginx 服務，使新憑證生效。請根據你的實際需求，將重新啟動指令中的 `nginx` 替換成 `apache` 或 `wings` 等服務名稱。

對於進階使用者，我們建議安裝並使用 [acme.sh](https://acme.sh)。它提供更多選項，功能也比 Certbot 更強大。

```text
0 23 * * * certbot renew --quiet --deploy-hook "systemctl restart nginx"
```

### 疑難排解

如果你在存取控制面板或 Wings 時看到 `Insecure Connection` 或 SSL／TLS 相關錯誤，憑證可能已經過期。通常只要更新 SSL 憑證即可解決；不過，若 80 連接埠正在使用中，執行 `certbot renew` 可能無法正常運作，並回傳類似以下錯誤：

```text
Error: Attempting to renew cert (domain) from /etc/letsencrypt/renew/domain.conf produced an unexpected error
```

如果你使用的是 Nginx 而不是 Apache，尤其容易遇到此問題。解決方法是使用 Nginx 或 Apache 外掛，也就是加上 `--nginx` 或 `--apache` 參數。或者，你也可以先停止 Nginx，更新憑證後再重新啟動 Nginx。若你更新的是 Wings 的憑證，請將 `nginx` 替換成 `wings`。

停止 Nginx：

```bash
systemctl stop nginx
```

更新憑證：

```bash
certbot renew
```

完成後，重新啟動 Nginx 服務：

```bash
systemctl start nginx
```

你可能也需要重新啟動 Wings，因為並非所有服務都能自動套用更新後的憑證：

```bash
systemctl restart wings
```

:::
::: tab "方法 2：acme.sh（使用 Cloudflare API）"

此方法適用於進階使用者，特別是伺服器無法存取 80 連接埠的情況。以下指令適用於 Ubuntu 發行版與 Cloudflare API（其他 DNS 供應商的 API 可自行搜尋相關方法），你也可以前往 [acme.sh 官方網站](https://github.com/acmesh-official/acme.sh)查看安裝說明。

請務必閱讀兩邊的說明，因為部分使用者可能已經改用 Cloudflare 的[新授權系統](https://blog.cloudflare.com/permissions-best-practices)（Modern），但也有部分使用者仍使用[舊版系統](https://cloudflare.tv/event/ea8JJLgR)（Legacy）。

```bash
curl https://get.acme.sh | sh
```

### 取得 Cloudflare API 金鑰（舊版）

安裝 acme.sh 後，我們需要取得 Cloudflare API 金鑰。在 Cloudflare 網站中選取你的網域，接著在右側複製 `Zone ID` 與 `Account ID`，然後點選 `Get your API token`，再點選 `Create Token`，選取 `Edit zone DNS` 範本，選擇 `Zone Resources` 範圍，接著點選 `Continue to summary`，最後複製你的 Token。

### 建立憑證

由於設定檔是以 Certbot 為基礎，因此我們需要手動建立資料夾：

```bash
sudo mkdir -p /etc/letsencrypt/live/example.com
```

安裝 acme.sh 並取得 Cloudflare API 金鑰後，接著即可產生憑證。首先，輸入 Cloudflare API 憑證：

```bash
export CF_Token="Your_CloudFlare_API_Key"
export CF_Account_ID="Your_CloudFlare_Account_ID"
export CF_Zone_ID="Your_CloudFlare_Zone_ID"
```

### 取得 Cloudflare API 金鑰（新版）

安裝 acme.sh 後，我們需要取得 Cloudflare API 金鑰。在 Cloudflare 網站右上角點選你的個人資料，接著前往 `My Profile`，再從左側找到 `API Tokens`。點選後會前往[API Tokens 頁面](https://dash.cloudflare.com/profile/api-tokens)。

選取 `Create Token`，並使用 `Edit zone DNS` 範本。接著在下一頁前往 `Zone Resources`，選取 `Include` > `Specific Zone`，再選擇你要使用的網域。繼續前往摘要頁面，確認要建立此 Token。

### 建立憑證

由於設定檔是以 Certbot 為基礎，因此我們需要手動建立資料夾：

```bash
sudo mkdir -p /etc/letsencrypt/live/example.com
```

安裝 acme.sh 並取得 Cloudflare API 金鑰後，接著即可產生憑證。首先，輸入 Cloudflare API 憑證：

```bash
export CF_Key="Your_CloudFlare_API_Key"
export CF_Email="Your_CloudFlare_Email"
```

接著建立憑證。由於 API 金鑰已綁定至該網域，Cloudflare 應允許你產生憑證。

```bash
acme.sh --issue --dns dns_cf -d "example.com" --server letsencrypt \
--key-file /etc/letsencrypt/live/example.com/privkey.pem \
--fullchain-file /etc/letsencrypt/live/example.com/fullchain.pem
```

### 自動更新

第一次執行此指令碼後，它會自動加入 Crontab。你可以編輯 Crontab 來調整自動更新的執行間隔：

```bash
sudo crontab -e
```

:::
::: tab "方法 3：Caddy（使用 Cloudflare API）"

此方法適用於進階使用者，例如使用 Cloudflare Proxy 模式，或無法存取 `80` 連接埠的情況。

### 安裝含 Cloudflare DNS 外掛的 Caddy

Caddy 預設不包含 Cloudflare DNS 外掛，因此你需要自行安裝。

主要有以下幾種方法：

1. 使用 `xcaddy` CLI 工具，自行建置 Caddy。
2. 從 [Caddy 下載頁面](https://caddyserver.com/download)下載預先建置的執行檔。
3. 使用 Ansible 下載並安裝含外掛的 Caddy。請參閱 [caddy-ansible](https://github.com/caddy-ansible/caddy-ansible)。

#### 在伺服器上使用 `xcaddy` 建置 Caddy

請參閱 [Caddy 建置文件](https://caddyserver.com/docs/build#xcaddy)。

### 取得 Cloudflare API Token

安裝 acme.sh 後，我們需要取得 Cloudflare API 金鑰。請確認 DNS 記錄（A 或 CNAME 記錄）已指向你的目標節點，並將 Cloudflare Proxy 設為灰色雲朵，以繞過 Cloudflare Proxy。

接著前往 `My Profile` > `API keys`，在 `Global API Key` 分頁中點選 `view`，輸入你的 Cloudflare 密碼，然後複製 API 金鑰。

安裝含 Cloudflare DNS 外掛的 Caddy 後，我們需要取得 Cloudflare API Token。請確認 DNS 記錄（A 或 CNAME 記錄）已指向你的目標節點。接著前往 `My Profile` > `API Tokens`，點選 `Create Token`。

進入 `Create API Token` > `API token templates`，在 `Edit zone DNS` 旁邊點選 `Use template`。在 **Zone Resources** 下選取你要建立 API Token 的 DNS 區域，然後點選 `Continue to summary`。確認 API Token 摘要內容後，點選 `Create Token`，最後複製 API Token。

### 重新設定 Caddy，使用 Cloudflare DNS 取得憑證

建立環境變數檔案，例如 `.env`。請注意，此檔案包含機密資訊，不應讓公開使用者存取。

我們建議你在以下位置建立機密檔案：

`/etc/caddy/.secrets.env`

```bash
CLOUDFLARE_API_TOKEN=<your cloudflare api token>
```

基於安全性考量，建議將檔案權限設定為 `0600`，也就是只有檔案擁有者能夠讀取或寫入。

```bash
# 將 `.secrets.env` 檔案的擁有者設定為 caddy 系統使用者
chown caddy:caddy /etc/caddy/.secrets.env

# 僅允許擁有者（caddy 系統使用者）讀取與寫入
chmod 0600 /etc/caddy/.secrets.env
```

修改 systemd 單元檔案，使其從檔案載入環境變數（在 `ExecStart` 中加入 `--envfile /etc/caddy/.secrets.env` 參數）。預設的 systemd 單元檔案位置為 `/etc/systemd/system/caddy.service`：

```unit{12}
[Unit]
Description=Caddy
Documentation=https://caddyserver.com/docs/
After=network.target network-online.target
Requires=network-online.target

[Service]
Type=notify
User=caddy
Group=caddy
ExecStart=/usr/bin/caddy run --environ --envfile /etc/caddy/.secrets.env --config /etc/caddy/Caddyfile
ExecReload=/usr/bin/caddy reload --config /etc/caddy/Caddyfile
TimeoutStopSec=5s
LimitNOFILE=1048576
LimitNPROC=512
PrivateTmp=true
ProtectSystem=full
AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target
```

你可以在控制面板設定中的 `<domain>` 區塊下方，將 `tls` 區塊加入 `Caddyfile`。Caddy 設定檔的位置為 `/etc/caddy/Caddyfile`：

```caddyfile{5-7}
<domain> {
  # ...

  tls {
    dns cloudflare {env.CLOUDFLARE_API_TOKEN}
  }
}
```

:::
::::