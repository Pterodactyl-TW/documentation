# CentOS 7

這篇指南會帶你一步步在 CentOS 7 上完整安裝 Pterodactyl v1.X，包含所有相依套件的安裝，以及 SSL 設定都會涵蓋到。

[[toc]]

## 安裝相依套件

### SELinux 設定

先確認一下你的系統有沒有啟用 SELinux（用 `sestatus` 就能檢查），如果有啟用，記得先裝好以下這些套件：

```bash
yum install -y policycoreutils policycoreutils-python selinux-policy selinux-policy-targeted libselinux-utils setroubleshoot-server setools setools-console mcstrans
```

### 安裝相依套件

接著執行以下指令，把所有必要的相依套件一次裝齊：

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

接下來要建立一個新的 PHP-FPM 設定檔，路徑是 `/etc/php-fpm.d/www-pterodactyl.conf`，內容如下：

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

設定檔寫好後，啟動 PHP-FPM，並設定成開機時自動啟用：

```bash
sudo systemctl enable --now php-fpm
```

### SELinux 設定

如果前面有啟用 SELinux，這裡還要再跑一次以下指令，讓 Nginx 跟 Redis 可以正常對外連線，不然之後啟動可能會被擋下來。

```bash
setsebool -P httpd_can_network_connect 1
setsebool -P httpd_execmem 1
setsebool -P httpd_unified 1
```

## 安裝控制面板

到這裡，所有必要的相依套件都已經裝好也設定完成了。接下來只要接著照[官方控制面板安裝文件](/panel/1.0/getting_started.md#download-files)繼續操作即可。

::: tip
這裡有個小提醒，設定 Nginx 時記得把 `fastcgi_pass` 的路徑改成 `/var/run/php-fpm/pterodactyl.sock`，跟前面設定的 PHP-FPM socket 對應起來。
:::
