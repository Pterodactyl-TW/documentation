# 舊版升級

本升級指南適用於**從 0.7.X 升級至 1.3.x**。如果您要升級的是 1.X 控制面板，請改為[使用此指南](/panel/1.0/updating.md)。升級過程中，控制面板將會有幾段時間無法使用，但底層的遊戲伺服器執行個體不會停止。

## 進入維護模式

開始升級前，您應先執行以下 `down` 指令，將控制面板置於維護模式。這可以防止使用者在控制面板功能異常或無法正常運作期間存取控制面板。執行指令前，請確認目前位於 `/var/www/pterodactyl` 目錄。

```bash
# 將控制面板置於維護模式，拒絕使用者存取
php artisan down
```

## 更新相依套件

執行升級前，請確認系統相依套件均為最新版本。請參考以下清單，確認您已安裝所有必要版本：

- PHP `8.0` 或 `8.1`（建議使用），並包含以下擴充功能：`cli`、`openssl`、`gd`、`mysql`、`PDO`、`mbstring`、`tokenizer`、`bcmath`、`xml` 或 `dom`、`curl`、`zip`。如果您計畫使用 Nginx，還需要 `fpm`。詳細資訊請參閱[升級 PHP](/guides/php_upgrade.md)指南。
- Composer v2（`composer self-update --2`）

::: warning Nginx
如果您升級了 PHP 版本，且使用 Nginx 作為 Web 伺服器，則必須更新 Nginx 的 `pterodactyl.conf` 設定檔中的 `fastcgi_pass` 值，使其指向正確的 `php-fpm` Socket。
:::

- MySQL `5.7.22` 或更高版本（建議使用 MySQL `8`），或 MariaDB `10.2` 或更高版本。

::: warning 請務必再次確認資料庫版本
請確認您使用的是上述列出的正確 MariaDB 或 MySQL 版本！否則，執行資料庫遷移時**一定會**發生錯誤。

先前的文件，以及這套軟體本身的年代，可能使您安裝了 MariaDB 10.1；但此版本的 Pterodactyl **無法使用** MariaDB 10.1。
:::

## 取得更新後的檔案

升級流程的第一步，是從 GitHub 下載新的控制面板檔案。以下指令會下載最新版本 Pterodactyl 的發行套件，並將其儲存至目前目錄。由於此指令會自動將套件解壓縮至目前資料夾，因此現在應確認目前位於 `/var/www/pterodactyl` 目錄。

我們也會刪除 `app/` 目錄。由於安裝與升級的處理方式，刪除的檔案不一定會被正確偵測，因此直接在此位置覆寫檔案可能會造成難以理解的問題。

```bash
# 刪除 app 目錄，確保從乾淨的狀態開始。
# 此操作不會影響任何設定或伺服器。
curl -L -o panel.tar.gz https://github.com/pterodactyl/panel/releases/latest/download/panel.tar.gz
rm -rf $(find app public resources -depth | head -n -1 | grep -Fv "$(tar -tf panel.tar.gz)")

# 下載更新後的檔案，並刪除壓縮檔
tar -xzvf panel.tar.gz && rm -f panel.tar.gz
```

完成檔案下載後，需要為快取與儲存目錄設定正確的權限，以避免發生與 Web 伺服器相關的錯誤。

```bash
chmod -R 755 storage/* bootstrap/cache
```

## 更新相依套件

下載所有更新後的檔案後，您需要升級控制面板的核心元件。請執行以下指令，並依照畫面上的提示操作：

```bash
composer install --no-dev --optimize-autoloader
```

## 清除已編譯的範本快取

您也應清除已編譯的範本快取，以確保新的或修改過的範本能正確顯示給使用者。

```bash
php artisan view:clear
php artisan config:clear
```

## 更新資料庫

您還需要更新資料庫結構，以符合最新版本的 Pterodactyl。執行以下兩個指令後，系統會更新資料庫結構，並確保內建的預設 Egg 保持最新（同時加入可能新增的 Egg）。請記住，_切勿編輯我們提供的核心 Egg_！這些修改會在更新過程中被覆寫。

::: warning
如果您曾在 0.7 版本使用允許伺服器轉移的自訂外掛，則在繼續之前，**必須**刪除或重新命名 `server_transfers` 資料表。
:::

```bash
php artisan migrate --force
php artisan db:seed --force
```

## 設定檔案權限

最後一步，是將檔案的擁有者設定為執行 Web 伺服器的使用者。大多數情況下是 `www-data`，但不同系統可能有所不同，例如 `nginx`、`apache`，甚至 `nobody`。

```bash
# 使用 Nginx 或 Apache（CentOS 除外）
chown -R www-data:www-data *

# 在 CentOS 上使用 Nginx
chown -R nginx:nginx *

# 在 CentOS 上使用 Apache
chown -R apache:apache *
```

## 重新啟動佇列工作程序

每次更新後，都應重新啟動佇列工作程序，以確保載入並使用新的程式碼。

```bash
php artisan queue:restart
```

## 離開維護模式

升級完成後，請退出維護模式，控制面板便會重新開放使用：

```bash
# 重新啟動控制面板以接受連線
php artisan up
```

## 切換至 Wings

我們已棄用舊版 Node.js Daemon，改用 [Wings](https://github.com/pterodactyl/wings)，這是以 Go 語言編寫的新伺服器控制平面。新系統速度更快、更容易安裝，且佔用空間更小。您只需要在系統上安裝單一執行檔，並將其設定為開機時自動執行即可。**Pterodactyl 控制面板 1.0 無法使用舊版 Node.js Daemon 執行伺服器。**

請參閱[遷移至 Wings](/wings/1.0/migrating.md)以了解相關操作說明。