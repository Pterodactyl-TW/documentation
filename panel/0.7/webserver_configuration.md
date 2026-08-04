---
meta:
    - name: robots
      content: noindex
---
# 網頁伺服器設定

::: danger 此版本已終止支援
本文件適用於**已終止生命週期的軟體**，不再提供任何安全性更新或社群支援。
基於歷史原因，本文件仍保留供查閱。

在正式環境中，你應安裝並使用 [Pterodactyl Panel 1.0](/panel/1.0/getting_started.md)。
:::

[[toc]]

::: danger
你應移除預設的 Apache 或 NGINX 設定，因為預設設定可能會將應用程式機密暴露給惡意使用者。
:::

## NGINX
請將下方檔案內容貼上，將 `<domain>` 替換為使用的網域名稱，存入名為 `pterodactyl.conf` 的檔案，
並放在 `/etc/nginx/sites-available/`；如果使用 CentOS，則放在 `/etc/nginx/conf.d/`。

### 使用 SSL 的 NGINX
此設定假設 Panel 與 Daemon 都使用 SSL，以大幅提升使用者與 Panel 之間的通訊安全性。你需要取得有效的 SSL 憑證，
可以免費使用 Let's Encrypt 取得。

::: warning
使用 SSL 設定時，**必須**建立 SSL 憑證，否則 NGINX 將無法啟動。繼續之前，請參閱[建立 SSL 憑證](/tutorials/creating_ssl_certificates.html)文件，
了解如何建立這些憑證。
:::

<<< @/.snippets/webservers/nginx.conf{5,11,26-27}

請繼續閱讀本節底部，完成 NGINX 的最後步驟！

### 不使用 SSL 的 NGINX

<<< @/.snippets/webservers/nginx-nossl.conf{3}

### 啟用設定
最後一步是啟用 NGINX 設定並重新啟動 NGINX。
``` bash
# You do not need to symlink this file if you are using CentOS.
sudo ln -s /etc/nginx/sites-available/pterodactyl.conf /etc/nginx/sites-enabled/pterodactyl.conf

# You need to restart nginx regardless of OS.
systemctl restart nginx
```

## Apache
請將下方檔案內容貼上，將 `<domain>` 替換為使用的網域名稱，存入名為 `pterodactyl.conf` 的檔案，
並放在 `/etc/apache2/sites-available`；如果使用 CentOS，則放在 `/etc/httpd/conf.d/`。

注意：使用 Apache 時，請確認已安裝 `libapache2-mod-php` 套件，否則 PHP 不會在網頁伺服器上顯示。

### 使用 SSL 的 Apache
與 NGINX 設定一樣，此設定假設 Panel 與 Daemon 都使用 SSL，以提升安全性。

::: warning
使用 SSL 設定時，**必須**建立 SSL 憑證，否則 Apache 將無法啟動。繼續之前，請參閱[建立 SSL 憑證](/tutorials/creating_ssl_certificates.html)文件，
了解如何建立這些憑證。
:::

<<< @/.snippets/webservers/apache.conf{2,8,17-18}

### 不使用 SSL 的 Apache

<<< @/.snippets/webservers/apache-nossl.conf{2}

### 啟用設定
建立上方檔案後，執行下方命令即可。如果使用 CentOS，_不需要執行下方命令！_ 只需執行 `systemctl restart httpd`。

``` bash
# You do not need to run any of these commands on CentOS
sudo ln -s /etc/apache2/sites-available/pterodactyl.conf /etc/apache2/sites-enabled/pterodactyl.conf
sudo a2enmod rewrite
systemctl restart apache2
```
