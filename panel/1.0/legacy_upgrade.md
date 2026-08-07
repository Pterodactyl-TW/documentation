# 舊版升級

本升級指南適用於**從 0.7.X 升級至 1.3.x** 的情境。如果你要升級的是 1.X 版本的控制面板，請改參考[這份指南](/panel/1.0/updating.md)。這裡要先說明一下：升級過程中控制面板會有幾段時間暫時無法使用，但別擔心，底層的遊戲伺服器執行個體並不會因此停止運作。

## 進入維護模式

開始升級之前，建議先執行 `down` 指令，把控制面板切換到維護模式。這麼做的目的是避免使用者在控制面板功能不穩定或無法正常運作期間進來操作。執行指令前，記得先確認自己目前位於 `/var/www/pterodactyl` 目錄。

```bash
# 將控制面板置於維護模式，拒絕使用者存取
php artisan down
```

## 更新相依套件

在正式升級之前，先確認系統上的相依套件都是最新版本。對照下面這份清單，確認每一項都符合要求：

- PHP `8.0` 或 `8.1`（建議使用），並包含以下擴充功能：`cli`、`openssl`、`gd`、`mysql`、`PDO`、`mbstring`、`tokenizer`、`bcmath`、`xml` 或 `dom`、`curl`、`zip`。如果你打算使用 Nginx，還需要額外裝上 `fpm`。詳細做法可以參考[升級 PHP](/guides/php_upgrade.md)指南。
- Composer v2（執行 `composer self-update --2` 即可升級）

::: warning Nginx
這裡有個容易漏掉的地方：如果你升級了 PHP 版本，且使用 Nginx 作為網頁伺服器，一定要記得更新 Nginx 的 `pterodactyl.conf` 設定檔中的 `fastcgi_pass` 值，讓它指向正確的 `php-fpm` Socket，否則升級後網站可能會直接打不開。
:::

- MySQL `5.7.22` 或更高版本（建議使用 MySQL `8`），或是 MariaDB `10.2` 或更高版本，兩者擇一。

::: warning 請務必再次確認資料庫版本
請務必確認你目前使用的是上面列出的正確版本！如果版本不對，執行資料庫遷移時**一定會**出錯。

這裡特別提醒一下：因為文件與軟體本身都有一定年代，很有可能你當初裝的是 MariaDB 10.1；但很不巧，這個版本的 Pterodactyl **無法使用** MariaDB 10.1，升級前務必先確認並更新。
:::

## 取得更新後的檔案

升級的第一步，是從 GitHub 把新版的控制面板檔案下載下來。以下指令會抓取最新版本 Pterodactyl 的發行套件，並存到目前目錄。由於這道指令會直接把套件解壓縮到目前資料夾，所以動手前務必再次確認自己位於 `/var/www/pterodactyl` 目錄。

另外，這裡也會一併刪除 `app/` 目錄。原因是安裝與升級的處理方式，導致某些已刪除的檔案不一定會被正確偵測到，如果直接在原地覆寫，反而可能造成一些難以排查的問題，所以乾脆先清乾淨再重新展開。

```bash
# 刪除 app 目錄，確保從乾淨的狀態開始。
# 此操作不會影響任何設定或伺服器。
curl -L -o panel.tar.gz https://github.com/Pterodactyl-TW/panel/releases/latest/download/panel.tar.gz
rm -rf $(find app public resources -depth | head -n -1 | grep -Fv "$(tar -tf panel.tar.gz)")

# 下載更新後的檔案，並刪除壓縮檔
tar -xzvf panel.tar.gz && rm -f panel.tar.gz
```

檔案下載完成後，記得把快取與儲存目錄的權限設定正確，避免之後跳出跟網頁伺服器相關的錯誤。

```bash
chmod -R 755 storage/* bootstrap/cache
```

## 更新相依套件

所有更新後的檔案都下載好之後，接下來要升級控制面板的核心元件。執行以下指令，並依照畫面上出現的提示操作即可：

```bash
composer install --no-dev --optimize-autoloader
```

## 清除已編譯的範本快取

別忘了順手清一下已編譯的範本快取，這樣新的或修改過的範本內容才能正確顯示給使用者看到。

```bash
php artisan view:clear
php artisan config:clear
```

## 更新資料庫

接下來要更新資料庫結構，讓它符合最新版本 Pterodactyl 的要求。執行以下兩道指令之後，系統會自動更新資料庫結構，並確保內建的預設 Egg 維持在最新狀態（同時補上可能新增的 Egg）。這裡務必記住一件事：_千萬別自己去改我們提供的核心 Egg_，因為這些修改在更新過程中都會被直接覆寫掉。

::: warning 警告
如果你在 0.7 版本時曾經使用過允許伺服器轉移的自訂外掛，繼續之前**務必**先刪除或重新命名 `server_transfers` 資料表，不然後續步驟可能會出問題。
:::

```bash
php artisan migrate --force
php artisan db:seed --force
```

## 設定檔案權限

最後一步，是把檔案的擁有者改成執行網頁伺服器的那個使用者。多數情況下是 `www-data`，不過依系統不同也可能是 `nginx`、`apache`，甚至是 `nobody`，請依實際情況選擇。

```bash
# 使用 Nginx 或 Apache（CentOS 除外）
chown -R www-data:www-data *

# 在 CentOS 上使用 Nginx
chown -R nginx:nginx *

# 在 CentOS 上使用 Apache
chown -R apache:apache *
```

## 重新啟動佇列工作程序

每次更新完，都建議重新啟動一下佇列工作程序，確保它載入的是新版本的程式碼，而不是舊的快取版本。

```bash
php artisan queue:restart
```

## 離開維護模式

升級都處理好之後，最後退出維護模式，控制面板就會重新開放給使用者使用：

```bash
# 重新啟動控制面板以接受連線
php artisan up
```

## 切換至 Wings

到這裡順帶提醒一件重要的事：舊版的 Node.js Daemon 已經被棄用，取而代之的是用 Go 語言重新打造的 [Wings](https://github.com/Pterodactyl-TW/wings)。新系統不只速度更快，安裝也更簡單，佔用的資源也更小，你只需要在系統上放一個執行檔，並設定成開機自動執行即可。這裡要特別提醒：**Pterodactyl 控制面板 1.0 已經無法搭配舊版 Node.js Daemon 來執行伺服器了。**

想知道實際怎麼操作，可以參考[遷移至 Wings](/wings/1.0/migrating.md)這份文件。
