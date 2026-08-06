# 建置控制面板資源

:::warning
**請勿在正式環境的節點上執行以下步驟。**
:::

如果想看更完整的說明，也可以參考 [BUILDING.md](https://github.com/Pterodactyl-TW/panel/blob/1.0-develop/BUILDING.md) 檔案。

這裡要先說明一個觀念：控制面板的前端是用 React 建置的，所以只要你動到任何原始檔案，或是改了樣式表，都需要重新編譯一次，改動才會真正生效。接下來會依序說明整個流程該怎麼做。

## 安裝相依套件

在開始建置之前，得先把需要用到的相依套件裝好。這裡要用到的建置工具需要 Node.js，並且用 Yarn 來管理套件。

```bash
# Ubuntu／Debian
curl -sL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# CentOS
curl -sL https://rpm.nodesource.com/setup_22.x | sudo -E bash -
sudo yum install -y nodejs yarn # CentOS 7
sudo dnf install -y nodejs yarn # CentOS 8、Rocky Linux 8、AlmaLinux 8
```

裝好 Node.js 之後，接著安裝必要的 JavaScript 套件：

```bash
npm i -g yarn # 安裝 Yarn

cd /var/www/pterodactyl
yarn # 安裝控制面板的建置相依套件
```

## 建置控制面板資源

準備工作都做完後，就可以用下面的指令重新建置控制面板前端了。這裡有個小提醒：如果你用的是 Node.js 17 以上版本，建置前必須先加上 `--openssl-legacy-provider` 選項，不然可能會建置失敗。

```bash
cd /var/www/pterodactyl
export NODE_OPTIONS=--openssl-legacy-provider # 適用於 Node.js v17 以上版本
yarn build:production # 建置控制面板
```

如果你正在開發、需要頻繁修改程式碼，可以改用 `yarn run watch` 指令，這樣就能以接近即時的方式看到變更效果，不用每次改完都手動重新建置一次。等所有變更都確定完成後，再用前面提到的 `yarn build:production` 指令做最終建置即可。
