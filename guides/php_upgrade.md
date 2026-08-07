---
meta:
- property: og:title
  content: 升級 PHP | Pterodactyl 繁體中文文件
- property: og:description
  content: 這篇文件會說明如何把系統的 PHP 升級到最新版本。開始之前，先參考下表確認你目前的 Pterodactyl 版本實際上需要哪個 PHP…
- property: og:image
  content: https://pterodactyl.tw/og/guides_php_upgrade.png
- property: og:image:width
  content: '1200'
- property: og:image:height
  content: '630'
- name: twitter:title
  content: 升級 PHP | Pterodactyl 繁體中文文件
- name: twitter:description
  content: 這篇文件會說明如何把系統的 PHP 升級到最新版本。開始之前，先參考下表確認你目前的 Pterodactyl 版本實際上需要哪個 PHP…
- name: twitter:image
  content: https://pterodactyl.tw/og/guides_php_upgrade.png
---
# 升級 PHP

這篇文件會說明如何把系統的 PHP 升級到最新版本。開始之前，先參考下表確認你目前的 Pterodactyl 版本實際上需要哪個 PHP 版本。

| Panel 版本      | PHP 版本      |
| --------------- | ------------- |
| 1.0.0 - 1.2.0   | 7.3, 7.4      |
| 1.3.0+          | 7.4, 8.0      |
| 1.8.0+          | 7.4, 8.0, 8.1 |
| 1.11.0 - 1.11.3 | 8.0, 8.1      |
| 1.11.4+         | 8.1, 8.2, 8.3 |
| 1.11.10+        | 8.2, 8.3      |
| 1.12.0+         | 8.2, **8.3**      |

## 安裝 PHP

要安裝 PHP 8.3，執行下面的指令即可，不過這裡要提醒一下，不同作業系統的指令寫法可能會有些微差異，遇到問題可以對照自己系統的套件管理工具調整。

```bash
# 加入 PHP 的額外套件庫
add-apt-repository -y ppa:ondrej/php
apt -y update
apt -y install php8.3 php8.3-{cli,gd,mysql,common,mbstring,tokenizer,bcmath,xml,fpm,curl,zip}
```

## 更新 Composer

從 `Panel@1.3.0` 開始，系統就要求要用 `composer` 第 2 版了。執行下面的指令可以更新 Composer,它會先跑一次自我更新，再把你切換到第 2 版。

```bash
composer self-update --2
```

## 網頁伺服器設定

升級完 PHP 之後，別忘了網頁伺服器這邊的設定也要對應調整，不然服務可能起不來。以下依你使用的網頁伺服器分別說明。

:::: tabs
::: tab "NGINX"
升級到 PHP 8.3 之後，通常也需要一併更新 NGINX 的設定。設定檔一般叫做 `pterodactyl.conf`，放在 `/etc/nginx/sites-available/` 底下；如果你用的是 CentOS，則會放在 `/etc/nginx/conf.d/`。

執行下面的指令之前，記得先確認一下路徑跟你實際的設定檔位置是否相符。

``` bash
sed -i -e 's/php[7|8].[0-9]-fpm.sock/php8.3-fpm.sock/' /etc/nginx/sites-available/pterodactyl.conf
```

改完設定檔之後，執行下面的指令重新載入 NGINX，變更就會生效。

```bash
systemctl reload nginx
```

:::
::: tab "Apache"
執行下面的指令，把之前舊版本的 PHP 模組都停用，改成用 PHP 8.3 來處理請求。

``` bash
# 小提示：a2dismod 就是 a2_disable_module 的意思 🤯
a2dismod php*

# 小提示：a2enmod 就是 a2_enable_module 的意思 🤯
a2enmod php8.3

```

:::
::::

### [返回 1.X.X 升級指南](/panel/1.0/upgrade/1.0.md#fetch-updated-files)
