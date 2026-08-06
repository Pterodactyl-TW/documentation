# CentOS 7

這篇指南會詳細帶你在 CentOS 7 上安裝 Pterodactyl Wings v1.X。

[[toc]]

## 安裝相依套件

```bash
## 安裝 yum 工具
yum install -y yum-utils device-mapper-persistent-data lvm2

## 新增 Docker 套件庫
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

## 安裝 Docker
yum install -y docker-ce docker-ce-cli

## 啟用 Docker 服務
systemctl enable --now docker

# 設定防火牆
firewall-cmd --add-port 8080/tcp --permanent
firewall-cmd --add-port 2022/tcp --permanent
firewall-cmd --permanent --zone=trusted --change-interface=docker0
firewall-cmd --zone=trusted --add-masquerade --permanent
firewall-cmd --reload
```

## 安裝 Wings

到這裡，相依套件跟防火牆規則都已經處理好了。接下來只要接著照[官方 Wings 安裝文件](/wings/1.0/installing.html#enabling-swap)繼續操作即可。
