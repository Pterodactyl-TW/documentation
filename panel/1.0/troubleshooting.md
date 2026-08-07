---
meta:
- property: og:title
  content: 疑難排解 | Pterodactyl 繁體中文文件
- property: og:description
  content: Panel 遇到意外錯誤時，通常第一件事就是請你提供記錄檔內容。執行下方命令，就能看到 Panel 記錄檔最後 100 行的內容。
- property: og:image
  content: https://pterodactyl.tw/og/panel_1.0_troubleshooting.png
- property: og:image:width
  content: '1200'
- property: og:image:height
  content: '630'
- name: twitter:title
  content: 疑難排解 | Pterodactyl 繁體中文文件
- name: twitter:description
  content: Panel 遇到意外錯誤時，通常第一件事就是請你提供記錄檔內容。執行下方命令，就能看到 Panel 記錄檔最後 100 行的內容。
- name: twitter:image
  content: https://pterodactyl.tw/og/panel_1.0_troubleshooting.png
---
# 疑難排解

[[toc]]

## 讀取錯誤記錄
Panel 遇到意外錯誤時，通常第一件事就是請你提供記錄檔內容。執行下方命令，就能看到 Panel 記錄檔最後 100 行的內容。

``` bash
tail -n 100 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log
```

### 解析錯誤
執行完上面的命令，你可能會看到一大串看起來很嚇人的文字，別緊張，這其實只是指向錯誤原因的堆疊追蹤（stack trace），真正要找錯誤原因時，其中大部分內容都可以直接忽略。以下是一段經過截短的範例輸出，方便你對照閱讀。

```
#70 /srv/www/vendor/laravel/framework/src/Illuminate/Foundation/Http/Kernel.php(116): Illuminate\Foundation\Http\Kernel->sendRequestThroughRouter(Object(Illuminate\Http\Request))
#71 /srv/www/public/index.php(53): Illuminate\Foundation\Http\Kernel->handle(Object(Illuminate\Http\Request))
#72 {main}
[2018-07-19 00:50:24] local.ERROR: ErrorException: file_put_contents(/srv/www/storage/framework/views/c9c05d1357df1ce4ec8fc5df78c16c493b0d4f48.php): failed to open stream: Permission denied in /srv/www/vendor/laravel/framework/src/Illuminate/Filesystem/Filesystem.php:122
Stack trace:
#0 [internal function]: Illuminate\Foundation\Bootstrap\HandleExceptions->handleError(2, 'file_put_conten...', '/srv/www/vendor...', 122, Array)
#1 /srv/www/vendor/laravel/framework/src/Illuminate/Filesystem/Filesystem.php(122): file_put_contents('/srv/www/storag...', '<?php $__env->s...', 0)
#2 /srv/www/vendor/laravel/framework/src/Illuminate/View/Compilers/BladeCompiler.php(122): Illuminate\Filesystem\Filesystem->put('/srv/www/storag...', '<?php $__env->s...')
#3 /srv/www/vendor/laravel/framework/src/Illuminate/View/Engines/CompilerEngine.php(51): Illuminate\View\Compilers\BladeCompiler->compile('/srv/www/resour...')
#4 /srv/www/vendor/laravel/framework/src/Illuminate/View/View.php(142): Illuminate\View\Engines\CompilerEngine->get('/srv/www/resour...', Array)
#5 /srv/www/vendor/laravel/framework/src/Illuminate/View/View.php(125): Illuminate\View\View->getContents()
```

看這類記錄時，有個小技巧：沿著數字往上找，直到找到 `#0`，這一行就是實際觸發例外的函式。在 `#0` 這一行的上方，你會看到一行帶有方括號日期時間的內容，例如上面範例中的 `[2018-07-19 00:50:24]`，這一行才是人類看得懂的例外訊息，能幫助你了解到底發生了什麼問題。

### 了解錯誤
以上面的範例來說，真正的錯誤內容是：

```
local.ERROR: ErrorException: file_put_contents(...): failed to open stream: Permission denied in /srv/www/vendor/laravel/framework/src/Illuminate/Filesystem/Filesystem.php:122
```

從這行可以判斷出，[file_put_contents()](http://php.net/manual/en/function.file-put-contents.php) 這個呼叫執行失敗了，原因是權限不足，導致無法開啟檔案。就算你完全看不懂錯誤內容也沒關係，只要你能把記錄提供出來，並盡量找出錯誤大概發生在哪裡，就能讓別人更快幫上忙。有些錯誤其實相當直白，會直接告訴你問題出在哪，例如 Panel 連不上 Daemon 時拋出的 `ConnectionException` 就是一個例子。

### 使用 GREP
如果記錄太長，想快速抓出重點，可以用下面這個命令，把結果限縮成實際的錯誤行，不顯示完整的堆疊追蹤。

``` bash
tail -n 1000 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log | grep "\[$(date +%Y)"
```

## 無法連線至伺服器
### 基本除錯步驟
遇到連線問題時，可以先按照下面的順序逐一排查：
* 確認 Wings 正在執行，而且沒有回報錯誤。用 `systemctl status wings` 就能看到目前的程序狀態。
* 按下 `Ctrl + Shift + J`（Chrome）或 `Cmd + Alt + I`（Safari）打開瀏覽器主控台看看，如果看到紅色的錯誤訊息，通常能幫你快速縮小問題範圍。
* 確認 Wings 安裝正確，而且目前的設定與 Panel 中 `Admin -> Node -> Configuration` 顯示的內容一致。
* 確認防火牆有開放 Wings 需要用到的連接埠：`8080` 或 `8443` 用來傳輸 HTTP(S)，`2022` 用來傳輸 SFTP。
* 確認 Panel 與 Wings 的網域都沒被 AdBlock 擋掉，或是已經把它們加進允許清單。
* 確認 Panel 真的能透過設定的網域連到 Wings。可以在 Panel 伺服器上執行 `curl https://domain.com:8080`，看看是否能成功連線。
* 確認 Panel 與 Wings 使用的 HTTP 通訊協定一致，例如 Panel 用 HTTPS，Wings 也一定要用 HTTPS。
* 如果 Wings 用的是 HTTPS，記得檢查憑證是不是已經過期了。

### 進階除錯步驟
如果基本排查都沒問題，可以再往下試試這些方法：
* 先停止 Wings，改用 `wings --debug` 執行，看看有沒有輸出任何錯誤訊息。如果有，可以嘗試自行排除，或到 [Discord](https://pterodactyl.tw/discord) 找我們幫忙。
* 用 `nslookup` 或 `dig` 之類的工具檢查你的 DNS，確認回應的結果跟你預期的一致。
* 如果你用的是 Cloudflare，記得確認 Wings 或 Panel 的 `A` 紀錄已經關閉橘色雲朵，改成僅限 DNS 的模式。
* 如果 Wings 是架在防火牆（pfSense、OpenSwitch 等）後方，記得確認 NAT 設定正確，這樣外部網路才能存取到 Wings 的連接埠。
* 如果上面這些方法都試過還是沒用，可以檢查一下自己的 DNS 設定，甚至考慮換一個 DNS 伺服器試試。
* 如果 Panel 跟 Wings 是架在同一台伺服器上，有時在 `/etc/hosts` 加一筆把公開 IP 指回這台伺服器的紀錄會有幫助；反過來也可能需要在同一份 `/etc/hosts` 裡，加一筆把 Panel 網域指向正確 IP 的紀錄。
* 如果 Wings 跟 Panel 是分別跑在使用相同網卡的不同虛擬機上，記得確認這些虛擬機彼此能互相連線，有時候需要開啟混雜模式（Promiscuous mode）才行。

## Invalid MAC 例外狀況
::: warning 警告
只要有按照我們的安裝與升級指南操作，理論上不會遇到這個錯誤。我們目前唯一看過這個錯誤出現的情況，是使用者直接拿舊備份還原 Panel 資料庫，卻搭配一份全新安裝的 Panel。

這裡提醒一下：還原備份時，`.env` 檔案也要 _一併_ 還原才行！
:::

有時候使用 Panel 時，你可能會突然發現頁面壞掉了，查記錄才發現有個提到解密時 MAC 無效的例外狀況。這個錯誤的根本原因，是加密與解密資料時所用的 `.env` 檔案中 `APP_KEY` 前後不一致所造成的。

如果你遇到這個錯誤，目前唯一的解法就是把 `.env` 檔案中原本的 `APP_KEY` 還原回去。如果原本的金鑰已經找不回來了，那很遺憾，被加密過的資料也就無法復原了。

## SELinux 相關問題
在裝了 SELinux 的系統上，執行 redis 或嘗試連線至 daemon 時，有時會遇到一些莫名其妙的錯誤。這類問題通常執行下面的命令就能解決，讓這些程式能跟 SELinux 好好相處。

### Redis 權限錯誤
``` bash
audit2allow -a -M redis_t
semodule -i redis_t.pp
```

### Wings 連線錯誤
``` bash
audit2allow -a -M http_port_t
semodule -i http_port_t.pp
```

## 容器無法連線到網際網路？可能是 DNS 問題！
當 Wings 順利執行起來，而且你在節點頁面看到綠色的心形圖示之後，`/etc/pterodactyl/config.yml` 這份 wings 設定檔裡會出現一些新的數值，其中一項就是 DNS，預設是 1.1.1.1 與 1.0.0.1。

這裡要提醒的是：如果你用的主機服務商會封鎖 Cloudflare DNS，就必須改用其他 DNS 伺服器，通常直接跟你主機系統本身使用的 DNS 伺服器保持一致就行。依你作業系統處理網路的方式不同，查看主機實際使用的 DNS 伺服器也有好幾種方法，如果其中一種查不到，可以換另一種試試看。
```bash
# Network Manager（這裡會同時顯示 IPv4 與 IPv6 的 DNS 伺服器，方便你順便把 IPv6 DNS 伺服器也加進 Wings 設定）
nmcli -g ip4.dns,ip6.dns dev show
# Resolve-CTL（較新版本的 Ubuntu）
resolvectl status
# 各發行版中可能存放主機系統 DNS 伺服器設定的原始檔案位置
/etc/resolv.conf
/etc/network/interfaces
```
如果查出來的 DNS 伺服器跟 1.1.1.1、1.0.0.1 不一樣，就需要編輯 wings 的 `config.yml` 檔案，改成命令回傳的那組 DNS 伺服器。另外，如果輸出結果除了 IPv4 DNS 伺服器之外，還看到類似 IPv6 位址的內容，務必把它填到 IPv6 區塊，而不是誤填進 IPv4 區塊裡。這裡特別提醒一點：如果你必須換成跟預設不同的 DNS 伺服器，記得要把 1.1.1.1 與 1.0.0.1 從 wings 設定中 **移除**，不要只是把新的伺服器加進去，而是要讓新伺服器完全取代舊的。

## 排程疑難排解
排程跑不動的時候，可以照這個順序一項一項排查：
- 檢查佇列管理程式的記錄 ``journalctl -xeu pteroq``
- 重新啟動 pteroq ``systemctl restart pteroq``
- 清除排程快取 ``php /var/www/pterodactyl/artisan schedule:clear-cache``
- 檢查你的 PHP 版本 ``php -v``，[這個頁面](https://pterodactyl.tw/panel/1.0/updating.html#panel-version-requirements)會告訴你不同版本的 panel 支援哪些 PHP 版本
- 用 https://crontab.guru 檢查一下你的 crontab 語法，確認跟你原本預期的一致
- 確認問題出在排程本身，而不是你設定的工作內容（可以把排程中的第一個工作，換成一個你確定會在主控台輸出訊息的內容，例如針對 Minecraft 伺服器在主控台執行 ``say test``；如果主控台真的顯示出「test」文字，代表排程本身有正常執行，接下來再回頭檢查工作內容本身的問題）
- 工作執行的時間是否有些微偏差？先確認你用的是最新版本的 panel，1.11.5 版曾經修正過排程在錯誤時間執行的問題；另外也有可能是時區設定不一致，記得確認以下三個地方的時區都對得上：
 - 系統時區 ``timedatectl``
 - Panel 時區 ``nano /var/www/pterodactyl/.env``
 - Wings 時區（會以 TZ 環境變數傳遞給容器，雖然跟排程沒有直接關係，但既然都在檢查時區了，不妨一併確認）``nano /etc/pterodactyl/config.yml``
- 檢查儲存排程資料的資料庫，預設是 MariaDB
 - ``systemctl status mariadb``，如果沒有啟用，執行 ``journalctl -xeu mariadb`` 查看原因
- 檢查佇列處理程式，預設是 Redis
 - ``systemctl status redis``，如果沒有啟用，執行 ``journalctl -xeu redis``（部分發行版的服務名稱可能是 ``redis-server``）
- 檢查 panel 錯誤 ``tail -n 150 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log | nc pteropaste.com 99``

## FirewallD 相關問題
如果你的伺服器是 RHEL/CentOS，而且裝了 `firewalld`，這可能會導致 DNS 出現異常狀況。

```
firewall-cmd --permanent --zone=trusted --change-interface=pterodactyl0
firewall-cmd --reload
```

執行完以上命令後，記得重新啟動 `docker` 與 `wings`，確保新規則真的套用生效。
