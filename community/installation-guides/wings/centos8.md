# Enterprise Linux 8 與 Fedora Server 40

這篇指南會詳細帶你在 CentOS 8、Rocky Linux 8、AlmaLinux 8，以及 Fedora Server 40 上安裝 Pterodactyl Wings v1.X。

[[toc]]

## 安裝相依套件

```bash
# 安裝必要套件
sudo dnf install -y dnf-utils device-mapper-persistent-data lvm2

# 新增 Docker 套件庫（Enterprise Linux 8）
sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
# 新增 Docker 套件庫（Fedora Server 40）
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo

## 安裝 Docker
sudo dnf install -y docker-ce docker-ce-cli containerd.io

## 啟用 Docker 服務
systemctl enable --now docker

# 設定防火牆
firewall-cmd --add-port 8080/tcp --permanent
firewall-cmd --add-port 2022/tcp --permanent
firewall-cmd --permanent --zone=trusted --change-interface=pterodactyl0
firewall-cmd --zone=trusted --add-masquerade --permanent
firewall-cmd --reload
```

## 安裝 Wings

到這裡，相依套件跟防火牆規則都已經處理好了。接下來只要接著照[官方 Wings 安裝文件](/wings/1.0/installing.html#enabling-swap)繼續操作即可。

::: tip 提示
這裡有個小提醒：如果你的系統已經啟用 SELinux 強制執行模式，而且容器出現了 AVC 拒絕訊息，可以試著把 Wings 的資料目錄從 `/var/lib/pterodactyl` 搬到 `/var/srv/containers/pterodactyl`。之所以這樣做，是因為目標原則（targeted policy）預期 Docker 是從這個位置讀寫資料的，換個路徑通常就能解決這類權限問題。
:::
