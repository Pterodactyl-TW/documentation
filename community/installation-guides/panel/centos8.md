# Enterprise Linux 8 與 Fedora Server 40

這篇指南會詳細帶你在 CentOS 8、Rocky Linux 8、AlmaLinux 8，以及 Fedora Server 40 上安裝 Pterodactyl v1.X，所有必要的相依套件都會一併說明。

[[toc]]

## 安裝相依套件

### SELinux 設定

先檢查一下系統有沒有啟用 SELinux（用 `sestatus` 就能看到），如果有的話，先把以下套件裝起來：

```bash
sudo dnf install -y policycoreutils selinux-policy selinux-policy-targeted setroubleshoot-server setools setools-console mcstrans
```

### 安裝相依套件

接下來執行以下指令，一次裝齊所有必要的相依套件：

```bash
# 更新系統
sudo dnf update -y

# 安裝 EPEL 與 Remi 套件庫
sudo dnf install -y epel-release
# 新增 PHP 所需的額外套件庫（Enterprise Linux 8）
sudo dnf install -y https://rpms.remirepo.net/enterprise/remi-release-8.rpm
# 新增 PHP 所需的額外套件庫（Fedora Server 40）
sudo dnf install -y https://rpms.remirepo.net/fedora/remi-release-40.rpm

# 啟用 Remi 提供的 PHP 8.3
sudo dnf module reset php
sudo dnf module enable php:remi-8.3 -y

# 安裝相依套件
sudo dnf install -y php php-{common,cli,gd,mysql,mbstring,bcmath,xml,fpm,curl,zip} mariadb mariadb-server nginx redis zip unzip tar

# 啟動服務，並設定為開機時自動啟用
sudo systemctl enable --now mariadb nginx redis

# 設定防火牆
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-service=https --permanent 
sudo firewall-cmd --reload

# 安裝 Composer
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

## PHP 設定

接著要建立一個新的 PHP-FPM 設定檔，位置在 `/etc/php-fpm.d/www-pterodactyl.conf`，內容如下：

```conf
[pterodactyl]

user = nginx
group = nginx

listen = /var/run/php-fpm/pterodactyl.sock
listen.owner = nginx
listen.group = nginx
listen.mode = 0750

pm = ondemand
pm.max_children = 9
pm.process_idle_timeout = 10s
pm.max_requests = 200
```

設定完成後，啟動 PHP-FPM，並讓它開機時自動啟用：

```bash
sudo systemctl enable --now php-fpm
```

## 安裝控制面板

到這裡，所有必要的相依套件都已經安裝並設定完成了。接下來只要接著照[官方控制面板安裝文件](/panel/1.0/getting_started.md#download-files)繼續操作就可以了。

::: tip 提示
小提醒，設定 Nginx 時記得把 `fastcgi_pass` 的路徑改成 `/var/run/php-fpm/pterodactyl.sock`，這樣才會對應到前面設定好的 PHP-FPM socket。
:::
