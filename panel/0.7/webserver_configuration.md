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

::: danger 危險
記得移除 Apache 或 NGINX 的預設設定，因為這些預設設定可能會把應用程式的機密資訊暴露給有心人士。
:::

## NGINX
把下方的檔案內容貼上，並將其中的 `<domain>` 換成你實際使用的網域名稱，存成一個叫做 `pterodactyl.conf` 的檔案，
放到 `/etc/nginx/sites-available/` 目錄下；如果你用的是 CentOS，則放到 `/etc/nginx/conf.d/`。

### 使用 SSL 的 NGINX
這份設定假設 Panel 與 Wings 都會啟用 SSL，這樣一來，使用者與 Panel 之間的通訊安全性會大幅提升。要做到這點，
你需要先準備好一張有效的 SSL 憑證，而 Let's Encrypt 就能免費申請到。

::: warning 警告
使用這份 SSL 設定時，**一定要**先建立好 SSL 憑證，不然 NGINX 會直接無法啟動。繼續之前，建議先參考
[建立 SSL 憑證](/tutorials/creating_ssl_certificates.html)這篇文件，了解該怎麼建立。
:::

<<< @/.snippets/webservers/nginx.conf{5,11,26-27}

設定完之後別急著結束，請繼續往下看完本節最後的步驟，才算真正完成 NGINX 的設定！

### 不使用 SSL 的 NGINX

<<< @/.snippets/webservers/nginx-nossl.conf{3}

### 啟用設定
最後一步是啟用這份 NGINX 設定，並重新啟動 NGINX。
``` bash
# 如果使用 CentOS，則不需要為此檔案建立符號連結。
sudo ln -s /etc/nginx/sites-available/pterodactyl.conf /etc/nginx/sites-enabled/pterodactyl.conf

# 無論使用哪種作業系統，都需要重新啟動 nginx。
systemctl restart nginx
```

## Apache
把下方的檔案內容貼上，並將其中的 `<domain>` 換成你實際使用的網域名稱，存成一個叫做 `pterodactyl.conf` 的檔案，
放到 `/etc/apache2/sites-available` 目錄下；如果你用的是 CentOS，則放到 `/etc/httpd/conf.d/`。

小提醒：使用 Apache 時，記得先確認已經安裝 `libapache2-mod-php` 這個套件，不然 PHP 不會在網頁伺服器上正常運作。

### 使用 SSL 的 Apache
跟 NGINX 的設定一樣，這份設定同樣假設 Panel 與 Wings 都會啟用 SSL，以提升整體安全性。

::: warning 警告
使用這份 SSL 設定時，**一定要**先建立好 SSL 憑證，不然 Apache 會直接無法啟動。繼續之前，建議先參考
[建立 SSL 憑證](/tutorials/creating_ssl_certificates.html)這篇文件，了解該怎麼建立。
:::

<<< @/.snippets/webservers/apache.conf{2,8,17-18}

### 不使用 SSL 的 Apache

<<< @/.snippets/webservers/apache-nossl.conf{2}

### 啟用設定
建立好上面的檔案後，執行下方指令即可啟用。如果你用的是 CentOS，_不需要執行下方指令！_ 只要執行
`systemctl restart httpd` 就完成了。

``` bash
# 如果使用 CentOS，則不需要執行以下任何指令
sudo ln -s /etc/apache2/sites-available/pterodactyl.conf /etc/apache2/sites-enabled/pterodactyl.conf
sudo a2enmod rewrite
systemctl restart apache2
```
