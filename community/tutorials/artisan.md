# Artisan CLI

Artisan CLI（命令列介面）是 Laravel 框架的一部分，而 Pterodactyl 正是建構於 Laravel 之上。如果您是按照官方指南安裝，Artisan 檔案位於 `/var/www/pterodactyl`。本指南將介紹一些 Pterodactyl 特有或相關的 Artisan 指令，這些指令皆以字母 `p` 開頭，例如 `p:user:make`。若要查看所有可用指令，請執行：

```bash
php artisan list
```

若要查看特定指令的相關資訊，請執行：

```bash
php artisan help <command>
```

::: tip
為了簡化本文件，您會在指令用法中看到以下標記：

`<hello-world>` - 必填引數

`[hello-world]` - 選填引數

`{--hello-world}` - 選項

:::

## 使用者管理

執行以下任一指令時，您可以使用選項傳入參數，也可以不傳入任何內容，改用互動式提示。您也可以同時傳入部分選項，並透過互動式提示輸入其餘內容。

### 建立使用者

```bash
php artisan p:user:make {--email=user@example.com}
                        {--username=myusername}
                        {--name-first=My}
                        {--name-last=Name}
                        {--password=supersecret}
                        {--admin=1|0}
                        {--no-password}
```

### 刪除使用者

```bash
php artisan p:user:delete {--user=username/email/UUID}
```

### 停用雙因素驗證

::: warning
停用雙因素驗證僅應作為復原使用者帳戶的最後手段。**請謹慎使用此功能。**
:::

```bash
php artisan p:user:disable2fa {--email=user@example.com}
```

## 伺服器與節點管理

### 建立位置

```bash
php artisan p:location:make {--short=us1}
                            {--long="A description of this location."}
```

### 刪除位置

```bash
php artisan p:location:delete {--short=us1}
```

### 伺服器批次電源控制

```bash
php artisan p:server:bulk-power <start, stop, kill, restart>
                                {--servers=1,2,3}
                                {--nodes=1,2,3}
```

## 控制面板管理

### 查看控制面板資訊

```bash
php artisan p:info
```

顯示各種控制面板資訊，可用於檢查資料庫、電子郵件等項目的設定。

### 更新控制面板

```bash
php artisan p:upgrade   {--user=www-data}
                        {--group=www-data}
                        {--url=https://example.com/panel.tar.gz}
                        {--release=latest}
                        {--skip-download}
```

下載 Pterodactyl 的新壓縮檔，並執行標準的更新指令。