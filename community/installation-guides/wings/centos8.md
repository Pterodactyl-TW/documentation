# Enterprise Linux 8 與 Fedora Server 40

本指南將詳細說明如何在 CentOS 8、Rocky Linux 8、AlmaLinux 8 以及 Fedora Server 40 上安裝 Pterodactyl Wings v1.X。

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

很好，現在所有相依套件與防火牆規則都已處理完畢。接下來請依照[官方 Wings 安裝文件](/wings/1.0/installing.html#enabling-swap)繼續操作。

::: tip
如果您已啟用 SELinux 強制執行模式，且容器出現 AVC 拒絕訊息，請嘗試將 Wings 資料目錄從 `/var/lib/pterodactyl` 移至 `/var/srv/containers/pterodactyl`。這是目標原則預期 Docker 讀取與寫入資料的位置。
:::