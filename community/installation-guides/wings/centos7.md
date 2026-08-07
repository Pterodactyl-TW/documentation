---
meta:
- property: og:title
  content: CentOS 7 | Pterodactyl 繁體中文文件
- property: og:description
  content: 這篇指南會詳細帶你在 CentOS 7 上安裝 Pterodactyl Wings v1.X。
- property: og:image
  content: https://pterodactyl.tw/og/community_installation-guides_wings_centos7.png
- property: og:image:width
  content: '1200'
- property: og:image:height
  content: '630'
- name: twitter:title
  content: CentOS 7 | Pterodactyl 繁體中文文件
- name: twitter:description
  content: 這篇指南會詳細帶你在 CentOS 7 上安裝 Pterodactyl Wings v1.X。
- name: twitter:image
  content: https://pterodactyl.tw/og/community_installation-guides_wings_centos7.png
---
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
