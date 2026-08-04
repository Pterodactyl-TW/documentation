# Web 伺服器設定

::: warning
使用 SSL 設定時，**必須先建立 SSL 憑證**，否則 Web 伺服器將無法啟動。請參閱[建立 SSL 憑證](/tutorials/creating_ssl_certificates.html)文件，先完成憑證建立，再繼續以下步驟。
:::

::: tip
如果您使用的是[具備自動 SSL 功能的 Caddy](#caddy-with-automatic-ssl)，則不需要手動建立 SSL 憑證，Caddy 會自動處理。
:::

::::: tabs
:::: tab "使用 SSL 的 Nginx"

首先，移除 Nginx 的預設設定：

```bash
rm /etc/nginx/sites-enabled/default
```

接著，將以下檔案的內容貼上到名為 `pterodactyl.conf` 的設定檔中，並將 `<domain>` 替換成您使用的網域名稱。若使用一般 Linux 發行版，請將檔案放置於 `/etc/nginx/sites-available/`；若使用 RHEL、Rocky Linux 或 AlmaLinux，則放置於 `/etc/nginx/conf.d/`。

<<< @/.snippets/webservers/nginx-php8.3.conf{4,11,26-27}

### 啟用設定

最後，啟用 Nginx 設定並重新啟動服務：

```bash
# 如果使用 RHEL、Rocky Linux 或 AlmaLinux，則不需要建立此符號連結。
sudo ln -s /etc/nginx/sites-available/pterodactyl.conf /etc/nginx/sites-enabled/pterodactyl.conf

# 無論使用哪個作業系統，都必須重新啟動 Nginx。
sudo systemctl restart nginx
```

::::
:::: tab "不使用 SSL 的 Nginx"

首先，移除 Nginx 的預設設定：

```bash
rm /etc/nginx/sites-enabled/default
```

接著，將以下檔案的內容貼上到名為 `pterodactyl.conf` 的設定檔中，並將 `<domain>` 替換成您使用的網域名稱。若使用一般 Linux 發行版，請將檔案放置於 `/etc/nginx/sites-available/`；若使用 RHEL、Rocky Linux 或 AlmaLinux，則放置於 `/etc/nginx/conf.d/`。

<<< @/.snippets/webservers/nginx-php8.3-nossl.conf{4}

### 啟用設定

最後，啟用 Nginx 設定並重新啟動服務：

```bash
# 如果使用 RHEL、Rocky Linux 或 AlmaLinux，則不需要建立此符號連結。
sudo ln -s /etc/nginx/sites-available/pterodactyl.conf /etc/nginx/sites-enabled/pterodactyl.conf

# 無論使用哪個作業系統，都必須重新啟動 Nginx。
sudo systemctl restart nginx
```

::::
:::: tab "使用 SSL 的 Apache"

首先，移除 Apache 的預設設定：

```bash
a2dissite 000-default.conf
```

接著，將以下檔案的內容貼上到名為 `pterodactyl.conf` 的設定檔中，並將 `<domain>` 替換成您使用的網域名稱。若使用一般 Linux 發行版，請將檔案放置於 `/etc/apache2/sites-available`；若使用 RHEL、Rocky Linux 或 AlmaLinux，則放置於 `/etc/httpd/conf.d/`。

注意：使用 Apache 時，請確認已安裝 `libapache2-mod-php8.3` 套件，否則 Web 伺服器將無法顯示 PHP 內容。

<<< @/.snippets/webservers/apache.conf{3,12,26-27}

### 啟用設定

建立上述檔案後，執行以下指令。如果您使用的是 RHEL、Rocky Linux 或 AlmaLinux，_則不需要執行以下指令_，只需執行 `systemctl restart httpd` 即可。

```bash
# RHEL、Rocky Linux 或 AlmaLinux 不需要執行以下指令
sudo ln -s /etc/apache2/sites-available/pterodactyl.conf /etc/apache2/sites-enabled/pterodactyl.conf
sudo a2enmod rewrite
sudo a2enmod ssl
sudo systemctl restart apache2
```

::::
:::: tab "不使用 SSL 的 Apache"

首先，移除 Apache 的預設設定：

```bash
a2dissite 000-default.conf
```

接著，將以下檔案的內容貼上到名為 `pterodactyl.conf` 的設定檔中，並將 `<domain>` 替換成您使用的網域名稱。若使用一般 Linux 發行版，請將檔案放置於 `/etc/apache2/sites-available`；若使用 RHEL、Rocky Linux 或 AlmaLinux，則放置於 `/etc/httpd/conf.d/`。

注意：使用 Apache 時，請確認已安裝 `libapache2-mod-php8.3` 套件，否則 Web 伺服器將無法顯示 PHP 內容。

<<< @/.snippets/webservers/apache-nossl.conf{3}

### 啟用設定

建立上述檔案後，執行以下指令。如果您使用的是 RHEL、Rocky Linux 或 AlmaLinux，_則不需要執行以下指令_，只需執行 `systemctl restart httpd` 即可。

```bash
# RHEL、Rocky Linux 或 AlmaLinux 不需要執行以下指令
sudo ln -s /etc/apache2/sites-available/pterodactyl.conf /etc/apache2/sites-enabled/pterodactyl.conf
sudo a2enmod rewrite
sudo systemctl restart apache2
```

::::
:::: tab "使用自動 SSL 的 Caddy"

在加入自訂設定前，請先移除預設設定。您可以清空設定檔內容，或直接刪除設定檔，再重新建立。設定檔路徑為 `/etc/caddy/Caddyfile`。

若要完整刪除設定檔，請執行：

```bash
rm /etc/caddy/Caddyfile
```

接著使用您選擇的編輯器建立新的設定檔。

請將以下檔案的內容貼入設定檔，並將 `<domain>` 替換成您的網域名稱。

<<< @/.snippets/webservers/Caddyfile{10}

::: tip
如果您使用 Cloudflare DNS Proxy 模式，請參閱[此教學](/tutorials/creating_ssl_certificates.html#method-3:-caddy-(using-cloudflare-api))，了解如何設定 Caddy，使用 DNS 挑戰取得 SSL 憑證。
:::

### 啟用設定

最後，重新啟動 Caddy：

```bash
systemctl restart caddy
```

::::
:::: tab "不使用 SSL 的 Caddy"

在加入自訂設定前，請先移除預設設定。您可以清空設定檔內容，或直接刪除設定檔，再重新建立。設定檔路徑為 `/etc/caddy/Caddyfile`。

若要完整刪除設定檔，請執行：

```bash
rm /etc/caddy/Caddyfile
```

接著使用您選擇的編輯器建立新的設定檔。

請將以下檔案的內容貼入設定檔，並將 `<domain>` 替換成您的網域名稱。

此設定有兩項差異：我們在 `<domain>` 後方加上 `:80`，並且在全域設定的 `servers` 指令中，將連接埠從 `:443` 改為 `:80`。

<<< @/.snippets/webservers/Caddyfile-nossl{10}

### 啟用設定

最後，重新啟動 Caddy：

```bash
systemctl restart caddy
```

::::
:::::

#### 下一步：[安裝 Wings](../../wings/installing.md)