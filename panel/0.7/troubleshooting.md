---
meta:
    - name: robots
      content: noindex
---
# 疑難排解

[[toc]]

## 查看錯誤記錄

如果你在使用控制面板時遇到未預期的錯誤，通常第一步就是被要求提供記錄檔內容。執行以下指令，就能顯示控制面板記錄檔
最後 100 行的內容：

```bash
tail -n 100 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log
```

### 解析錯誤

跑完上面的指令後，你可能會看到一大串看起來很嚇人的文字，不過不用緊張，這其實只是指向錯誤原因的堆疊追蹤，真正要找
錯誤原因時，大部分內容都可以直接略過。以下是一段經過刪減的範例輸出，方便說明怎麼看：

```text
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

看這種堆疊追蹤有個訣竅：從編號**由下往上**看，一路找到 `#0`，這就是真正觸發例外的那個函式。在 `#0` 上方，你會看到
一行帶有日期與時間的內容，例如上面的 `[2018-07-19 00:50:24]`。這一行通常會用比較口語的方式描述發生了什麼問題，
所以是最值得先看的部分。

### 理解錯誤

以上面這個範例來說，真正的錯誤內容其實就是：

```text
local.ERROR: ErrorException: file_put_contents(...): failed to open stream: Permission denied in /srv/www/vendor/laravel/framework/src/Illuminate/Filesystem/Filesystem.php:122
```

由此可以看出，程式在呼叫 [`file_put_contents()`](http://php.net/manual/en/function.file-put-contents.php) 時出了問題，
原因是權限不足，無法開啟檔案。

就算完全看不懂錯誤內容也沒關係，不用太擔心。不過如果你能附上這些記錄，並且至少大概指出錯誤發生在哪裡，通常可以
更快得到協助。有些錯誤其實蠻直接的，訊息會明確告訴你問題出在哪，例如控制面板連不上 Wings 時，常常會看到
`ConnectionException` 這類錯誤。

### 使用 GREP

如果只是想快速掃過大量錯誤，不想看完整的堆疊追蹤，可以用下面這道指令，它只會列出實際的錯誤行：

```bash
tail -n 1000 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log | grep "\[$(date +%Y)"
```

## TransferException／XHR 輪詢錯誤

如果你看到類似下面這些錯誤訊息，通常代表網路相關設定出了狀況，或者有某個必要的服務目前沒有在執行。

### 錯誤範例

- 「我們無法連線至主要的 Socket.IO 伺服器，目前可能存在網路問題。控制面板可能無法正常運作。」
- 「聯絡 Wings 時發生 TransferException，請確認 Wings 已啟動且可以連線。此錯誤已記錄。」

### 基本除錯步驟

遇到這類問題時，可以先照下面的順序一項一項檢查：

- 確認已停用 AdBlock，或是把控制面板與 Wings 的網域加進允許清單。

- 在瀏覽器中按下 `Ctrl + Shift + J`（Chrome）或 `Cmd + Alt + I`（Safari）打開開發者主控台。如果裡面出現紅色的錯誤訊息，
  通常能幫你快速縮小問題範圍。

- 確認 Wings 已經正確安裝，而且目前使用的設定，跟控制面板 `Admin -> Node -> Configuration` 頁面顯示的設定一致。

- 確認 Wings 正在執行，而且沒有回報任何錯誤，可以用 `service wings status` 檢查目前的程序狀態。

- 確認防火牆已經開放 Wings 需要用到的連接埠。Wings 會用 `8080` 或 `8443` 傳輸 HTTP 流量，並用 `2022` 傳輸 SFTP 流量。

- 確認控制面板能透過面板中設定的網域連線到 Wings。可以在控制面板伺服器上執行 `curl https://domain.com:8080`，
  看看能不能順利連上 Wings。

- 確認控制面板與 Wings 使用的是同一種 HTTP 通訊協定。如果控制面板走 HTTPS，Wings 也一定要跟著走 HTTPS。

### 進階除錯步驟

如果基本步驟都排查過還是沒頭緒，可以再往下試試這些進階做法：

- 先停止 Wings，然後執行 `cd /srv/daemon; sudo npm start`，看看 Wings 有沒有直接跳出錯誤訊息。如果有，可以先嘗試
  自行排查，或是到 Discord 尋求進一步協助。

- 檢查 DNS 設定，用 `nslookup` 或 `dig` 這類工具，確認收到的回應是否符合預期。

- 如果你有使用 Cloudflare，記得確認 Wings 或控制面板的 `A` 記錄已經關閉黃色雲朵（也就是停用 Cloudflare 的 Proxy）。

- 如果 Wings 是架在防火牆（例如 pfSense、OpenSwitch 等）後方，記得確認 NAT 設定正確，這樣外部網路才能連到 Wings
  的連接埠。

- 如果以上方法都試過還是沒解決，可以檢查一下自己的 DNS 設定，甚至考慮換一個 DNS 伺服器試試看。

- 如果控制面板與 Wings 是架在同一台伺服器上，有時候可以在 `/etc/hosts` 中加一筆記錄，把公開 IP 位址指向這台伺服器。
  有時候也需要反過來設定，所以你可能還要在伺服器的 `/etc/hosts` 檔案中，把控制面板的網域指向正確的 IP 位址。

- 如果 Wings 與控制面板是分別跑在使用相同網路介面的不同虛擬機器上，記得確認這兩台虛擬機器彼此連得到，
  有時候可能還需要開啟混雜模式才行。

## Invalid MAC 例外

::: warning
如果你有確實照著我們的安裝與升級指南操作，理論上不應該遇到這個錯誤。這個錯誤通常只會在用備份還原控制面板資料庫，
卻搭配一套全新安裝的控制面板時才會出現。

也就是說，還原備份時，你應該**連 `.env` 檔案也一併還原**！
:::

有時候使用控制面板時，可能會突然發現頁面壞掉了。查看記錄檔後，你可能會看到解密時發生 Invalid MAC 的例外，
這其實是因為加密與解密資料時，使用的 `.env` 檔案中的 `APP_KEY` 前後不一致所造成的。

如果遇到這個錯誤，唯一的解法就是把原本的 `.env` 檔案中的 `APP_KEY` 還原回去。如果原始金鑰已經遺失，很遺憾，
遺失的資料就沒辦法救回來了。

## SELinux 問題

在有安裝 SELinux 的系統上，執行 Redis 或嘗試連線到 Wings 時，可能會遇到一些未預期的錯誤。這時通常可以執行以下指令，
讓這些程式能正常跟 SELinux 相處。

### Redis 權限錯誤

```bash
audit2allow -a -M redis_t
semodule -i redis_t.pp
```

### 控制面板部分功能異常時

```bash
restorecon -R /var/www/pterodactyl/
```

### Wings 連線錯誤

```bash
audit2allow -a -M http_port_t
semodule -i http_port_t.pp
```

## FirewallD 問題

如果你用的是裝了 firewalld 的 RHEL／CentOS 伺服器，可能會遇到 DNS 異常的狀況。

```bash
firewall-cmd --permanent --zone=trusted --change-interface=pterodactyl0
firewall-cmd --reload
```

執行完上面的指令後，記得重新啟動 Docker 與 Wings，確保規則真的有套用上去。

## 資料庫錯誤

### DatabaseController.php:142

```text
production.ERROR: ErrorException: Undefined variable: host in /var/www/pterodactyl/app/Http/Controllers/Admin/DatabaseController.php:142
```

看到這個錯誤，代表你用來連線的資料庫使用者權限不夠，或者密碼打錯了。
