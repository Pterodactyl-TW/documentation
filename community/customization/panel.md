# 建置控制面板資源

:::warning
**請勿在正式環境的節點上執行以下步驟。**
:::

建置控制面板的相關說明也可以參閱 [BUILDING.md](https://github.com/pterodactyl/panel/blob/1.0-develop/BUILDING.md) 檔案。

控制面板的前端使用 React 建置。任何原始檔案的變更都需要重新編譯，樣式表的變更也同樣如此。以下章節將說明如何進行操作。

## 安裝相依套件

以下指令將安裝建置控制面板資源所需的相依套件。

建置工具需要 Node.js，並使用 Yarn 作為套件管理工具。

```bash
# Ubuntu／Debian
curl -sL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# CentOS
curl -sL https://rpm.nodesource.com/setup_22.x | sudo -E bash -
sudo yum install -y nodejs yarn # CentOS 7
sudo dnf install -y nodejs yarn # CentOS 8、Rocky Linux 8、AlmaLinux 8
```

安裝必要的 JavaScript 套件：

```bash
npm i -g yarn # 安裝 Yarn

cd /var/www/pterodactyl
yarn # 安裝控制面板的建置相依套件
```

## 建置控制面板資源

以下指令會重新建置控制面板前端。Node.js 17 及以上版本必須在建置前啟用 `--openssl-legacy-provider` 選項。

```bash
cd /var/www/pterodactyl
export NODE_OPTIONS=--openssl-legacy-provider # 適用於 Node.js v17 以上版本
yarn build:production # 建置控制面板
```

您可以使用 `yarn run watch` 指令，以接近即時的方式查看變更進度，方便進行開發。完成變更後，請使用前述的 `yarn build:production` 指令建置控制面板。