# 升級 PHP

本文件說明如何將系統升級至最新版本的 PHP。請參考下表，確認你的 Pterodactyl 版本需要哪個 PHP 版本。

| Panel Version   | PHP Version   |
| --------------- | ------------- |
| 1.0.0 - 1.2.0   | 7.3, 7.4      |
| 1.3.0+          | 7.4, 8.0      |
| 1.8.0+          | 7.4, 8.0, 8.1 |
| 1.11.0 - 1.11.3 | 8.0, 8.1      |
| 1.11.4+         | 8.1, 8.2, 8.3 |
| 1.11.10+        | 8.2, 8.3      |
| 1.12.0+         | 8.2, **8.3**      |

## 安裝 PHP

若要安裝 PHP 8.3，請執行下方命令。請注意，不同作業系統對命令格式的要求可能略有不同。

```bash
# Add additional repository for PHP
add-apt-repository -y ppa:ondrej/php
apt -y update
apt -y install php8.3 php8.3-{cli,gd,mysql,common,mbstring,tokenizer,bcmath,xml,fpm,curl,zip}
```

## 更新 Composer

從 `Panel@1.3.0` 起，系統要求使用 `composer` v2。若要更新 Composer，請執行下方命令；它會執行 Composer 自我更新，
並將你切換至第 2 版。

```bash
composer self-update --2
```

## 網頁伺服器設定

:::: tabs
::: tab "NGINX"
升級至 PHP 8.3 後，你很可能需要更新 NGINX 設定。設定檔通常名為 `pterodactyl.conf`，位於 `/etc/nginx/sites-available/`；
如果使用 CentOS，則位於 `/etc/nginx/conf.d/`。

請確認下方命令中的路徑符合設定檔的實際位置。

``` bash
sed -i -e 's/php[7|8].[0-9]-fpm.sock/php8.3-fpm.sock/' /etc/nginx/sites-available/pterodactyl.conf
```

編輯檔案後，執行下方命令重新載入 NGINX 並套用變更。

```bash
systemctl reload nginx
```

:::
::: tab "Apache"
執行下方命令停用所有先前的 PHP 版本，並啟用 PHP 8.3 來處理要求。

``` bash
# Hint: a2dismod = a2_disable_module 🤯
a2dismod php*

# Hint: a2enmod = a2_enable_module 🤯
a2enmod php8.3

```

:::
::::

### [返回 1.X.X 升級指南](/panel/1.0/upgrade/1.0.md#fetch-updated-files)
