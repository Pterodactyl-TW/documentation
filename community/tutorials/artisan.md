# Artisan CLI

Artisan CLI（命令列介面）其實是 Laravel 框架內建的工具，而 Pterodactyl 正是用 Laravel 打造出來的，所以你也可以直接透過它來管理控制面板。如果你是照著官方指南安裝的，Artisan 檔案會放在 `/var/www/pterodactyl` 這個目錄底下。這篇教學會介紹幾個 Pterodactyl 特有、或跟它相關的 Artisan 指令，這些指令都有個共同特徵：一律以字母 `p` 開頭，例如 `p:user:make`。想看完整的指令清單，可以執行：

```bash
php artisan list
```

如果想查某個特定指令的詳細用法，可以執行：

```bash
php artisan help <command>
```

::: tip 提示
為了讓後面的說明看起來簡潔一點，這裡先統一標記規則，指令用法中會看到以下符號：

`<hello-world>` - 必填引數

`[hello-world]` - 選填引數

`{--hello-world}` - 選項

:::

## 使用者管理

底下這幾個指令有個共通的彈性：你可以直接用選項把參數帶進去，也可以什麼都不填、改用互動式提示一步步輸入；甚至也能兩者混搭，先帶部分選項，剩下的再透過互動式提示補齊。

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

### 停用兩步驟驗證

::: warning 警告
這裡要提醒一下，停用兩步驟驗證只應該在復原使用者帳戶時，當作最後的手段使用。**請務必謹慎使用這項功能。**
:::

```bash
php artisan p:user:disable2fa {--email=user@example.com}
```

## 伺服器與節點管理

### 建立地區

```bash
php artisan p:location:make {--short=us1}
                            {--long="A description of this location."}
```

### 刪除地區

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

這個指令會顯示各種控制面板的資訊，方便你快速檢查資料庫、電子郵件等相關設定目前是什麼狀態。

### 更新控制面板

```bash
php artisan p:upgrade   {--user=www-data}
                        {--group=www-data}
                        {--url=https://example.com/panel.tar.gz}
                        {--release=latest}
                        {--skip-download}
```

執行這個指令後，系統會下載 Pterodactyl 的新版壓縮檔，並自動跑一遍標準的更新流程，不用你再手動一步步操作。
