---
meta:
- property: og:title
  content: 一鍵安裝腳本 | Pterodactyl 繁體中文文件
- property: og:description
  content: 這支腳本可以幫你把繁體中文化版本的 Panel、Wings 自動裝好，相依套件、資料庫、Web 伺服器、佇列服務都會幫你設定完成。
- property: og:image
  content: https://pterodactyl.tw/og/project_installer.png
- property: og:image:width
  content: '1200'
- property: og:image:height
  content: '630'
- name: twitter:title
  content: 一鍵安裝腳本 | Pterodactyl 繁體中文文件
- name: twitter:description
  content: 這支腳本可以幫你把繁體中文化版本的 Panel、Wings 自動裝好，相依套件、資料庫、Web 伺服器、佇列服務都會幫你設定完成。
- name: twitter:image
  content: https://pterodactyl.tw/og/project_installer.png
---
# 一鍵安裝腳本

[[toc]]

::: tip 這不是官方工具
這是 Pterodactyl Taiwan 自己維護的安裝腳本，改自 [pterodactyl-installer](https://github.com/pterodactyl-installer/pterodactyl-installer)，跟官方 Pterodactyl 專案沒有直接關聯。
:::

## 這是什麼

如果你不想照著 [Panel 安裝說明](/panel/1.0/getting_started.md) 或 [Wings 安裝說明](/wings/1.0/installing.md) 一步一步手動操作，這支腳本可以幫你把繁體中文化版本的 Panel、Wings 自動裝好，相依套件、資料庫、Web 伺服器、佇列服務都會幫你設定完成，過程中用互動問答的方式詢問你的設定，不需要自己動手改設定檔。

## 快速開始

以 **root** 身分在你的伺服器上執行：

```bash
bash <(curl -s https://installer.pterodactyl.tw)
```

建議在全新安裝、沒有跑其他服務的伺服器上執行，避免覆蓋或影響既有環境。目前支援 Ubuntu、Debian、Rocky Linux、AlmaLinux，實際支援的版本清單可以參考 [installer 原始碼的 README](https://github.com/Pterodactyl-TW/installer#支援的-panel-與-wings-作業系統)。

## 可以做什麼

執行後會出現一個選單：

1. **安裝繁體中文化 Pterodactyl Panel**
2. **安裝繁體中文化 Pterodactyl Wings**
3. **同時安裝 Panel 與 Wings**（Panel 安裝完成後會自動接著執行 Wings 安裝）
4. **解除安裝**（過程中會再詢問要移除 Panel、Wings，還是兩者都移除）

## 安裝過程會詢問什麼

視你選擇安裝的項目不同，腳本可能會詢問：

- 資料庫名稱、使用者、密碼
- 時區
- 初始管理員帳號的信箱、使用者名稱、姓名、密碼
- 網域名稱（FQDN）
- 是否自動設定 Let's Encrypt，或是否要「假設已有 SSL」
- 是否自動設定防火牆
- 是否啟用匿名遙測（詳見[遙測說明](/panel/1.0/additional_configuration.md#遙測)）

這些設定大多也能在安裝完成後，透過 Panel 後台或設定檔再調整，不用擔心一開始選錯。

## 原始碼與回報問題

腳本的原始碼放在 [Pterodactyl-TW/installer](https://github.com/Pterodactyl-TW/installer)，歡迎直接看程式碼、送 PR，或到 [Discord](https://pterodactyl.tw/discord) 回報問題與提供意見。網站上也有一個簡單的介紹頁：[installer.pterodactyl.tw/about](https://installer.pterodactyl.tw/about)。
