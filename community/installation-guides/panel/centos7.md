# CentOS 7

本指南將詳細說明如何在 CentOS 7 上安裝 Pterodactyl v1.X，包括所有相依套件與 SSL 設定。

[[toc]]

## 安裝相依套件

### SELinux 設定

如果已啟用 SELinux（可使用 `sestatus` 檢查），請安裝以下套件：

```bash
yum install -y policycoreutils policycoreutils-python selinux-policy selinux-policy-targeted libselinux-utils setroubleshoot-server setools setools-console mcstrans
```

### 安裝相依套件

執行以下指令以安裝所有必要的相依套件：

```bash
# 新增 MariaDB 套件庫
sudo tee /etc/yum.repos.d/mariadb.repo <<EOF
[mariadb]
name = MariaDB
baseurl = http://yum.mariadb.org/10.5/centos7-amd64
gpgkey = https://yum.mariadb.org/RPM-GPG-KEY-MariaDB
gpgcheck = 1
EOF

# 安裝 EPEL 與 Remi 套件庫
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
sudo yum install -y https://rpms.remirepo.net/enterprise/remi-release-7.rpm

# 啟用 Remi 提供的 PHP 8.3
sudo yum install -y yum-utils
sudo yum-config-manager --disable 'remi-php*'
sudo yum-config-manager --enable remi-php83

sudo yum update -y

# 安裝相依套件
sudo yum install -y MariaDB-common MariaDB-server php php-{common,fpm,cli,json,mysqlnd,mcrypt,gd,mbstring,pdo,zip,bcmath,dom,opcache} nginx zip unzip

# 安裝 Redis
sudo yum install -y --enablerepo=remi redis

# 啟動並設定服務於開機時自動啟用
sudo systemctl enable --now mariadb nginx redis

# 設定防火牆
sudo firewall-cmd --add-service=http --permanent
sudo firewall-cmd --add-service=https --permanent 
sudo firewall-cmd --reload

# 安裝 Composer
curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
```

## 伺服器設定

### PHP 設定

在 `/etc/php-fpm.d/www-pterodactyl.conf` 建立新的 PHP-FPM 設定檔：

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

啟動 PHP-FPM，並設定為開機時自動啟用：

```bash
sudo systemctl enable --now php-fpm
```

### SELinux 設定

以下指令會允許 Nginx 與 Redis 連線。

```bash
setsebool -P httpd_can_network_connect 1
setsebool -P httpd_execmem 1
setsebool -P httpd_unified 1
```

## 安裝控制面板

很好，現在所有必要的相依套件都已安裝並完成設定。接下來請依照[官方控制面板安裝文件](/panel/1.0/getting_started.md#download-files)繼續操作。

::: tip
您需要將 Nginx 設定中的 `fastcgi_pass` 路徑變更為 `/var/run/php-fpm/pterodactyl.sock`。
:::