---
meta:
    - name: robots
      content: noindex
---
# 疑難排解

[[toc]]

## 查看錯誤記錄

如果您在使用控制面板時遇到未預期的錯誤，通常首先會被要求提供記錄檔。執行以下指令，即可顯示控制面板記錄檔的最後 100 行：

```bash
tail -n 100 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log
```

### 解析錯誤

執行上述指令後，您可能會看到一大段看似嚇人的文字。不用擔心，這只是指向錯誤原因的堆疊追蹤。尋找錯誤原因時，實際上可以忽略其中大部分內容。以下是一個經過截斷的範例輸出，方便說明：

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

首先，請沿著編號**往上**查看，直到找到 `#0`。這就是觸發例外的函式。在 `#0` 上方，您會看到一行包含日期與時間的內容，例如上方的 `[2018-07-19 00:50:24]`。這一行會顯示可讀性較高的例外訊息，您可以藉此了解發生了什麼問題。

### 理解錯誤

從上述範例可以看出，實際錯誤是：

```text
local.ERROR: ErrorException: file_put_contents(...): failed to open stream: Permission denied in /srv/www/vendor/laravel/framework/src/Illuminate/Filesystem/Filesystem.php:122
```

由此可知，程式在執行 [`file_put_contents()`](http://php.net/manual/en/function.file-put-contents.php) 時發生錯誤，原因是沒有足夠的權限開啟檔案。

即使您完全看不懂錯誤內容，也不用擔心。不過，如果您能提供這些記錄，並至少找出錯誤來源，通常能讓您更快取得支援。有些錯誤相當直接，會明確告訴您問題所在，例如控制面板無法連線至 Daemon 時，可能會出現 `ConnectionException`。

### 使用 GREP

如果您想快速查看大量錯誤，可以使用以下指令。此指令只會顯示實際的錯誤行，不會顯示完整的堆疊追蹤：

```bash
tail -n 1000 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log | grep "\[$(date +%Y)"
```

## TransferException／XHR 輪詢錯誤

如果您看到類似以下範例的錯誤，通常表示網路相關設定有問題，或某個必要的服務尚未執行。

### 錯誤範例

- 「我們無法連線至主要的 Socket.IO 伺服器，目前可能存在網路問題。控制面板可能無法正常運作。」
- 「聯絡 Daemon 時發生 TransferException，請確認 Daemon 已啟動且可以連線。此錯誤已記錄。」

### 基本除錯步驟

- 確認已停用 AdBlock，或將控制面板與 Daemon 的網域加入允許清單。

- 在瀏覽器中按下 `Ctrl + Shift + J`（Chrome）或 `Cmd + Alt + I`（Safari）開啟主控台。如果其中出現紅色錯誤，通常可以協助縮小問題範圍。

- 確認 Daemon 已正確安裝，且目前使用的設定與控制面板中 `Admin -> Node -> Configuration` 顯示的設定一致。

- 確認 Daemon 正在執行，且沒有回報錯誤。使用 `service wings status` 檢查目前程序狀態。

- 確認防火牆已開放 Daemon 使用的連接埠。Daemon 使用 `8080` 或 `8443` 傳輸 HTTP 流量，並使用 `2022` 傳輸 SFTP 流量。

- 確認控制面板可以透過面板中設定的網域連線至 Daemon。在控制面板伺服器上執行 `curl https://domain.com:8080`，確認是否能連線至 Daemon。

- 確認控制面板與 Daemon 使用正確的 HTTP 通訊協定。如果控制面板使用 HTTPS，Daemon 也必須使用 HTTPS。

### 進階除錯步驟

- 停止 Daemon，然後執行 `cd /srv/daemon; sudo npm start`，查看 Daemon 是否輸出錯誤。如果有錯誤，請嘗試手動解決，或前往 Discord 尋求進一步協助。

- 檢查 DNS，並使用 `nslookup` 或 `dig` 等工具確認收到的回應是否符合預期。

- 如果您使用 Cloudflare，請確認 Daemon 或控制面板的 `A` 記錄已停用黃色雲朵 Proxy。

- 如果 Daemon 位於防火牆（例如 pfSense、OpenSwitch 等）後方，請確認已正確設定 NAT，讓外部網路可以存取 Daemon 的連接埠。

- 如果上述方法都無法解決問題，請檢查您自己的 DNS 設定，並考慮更換 DNS 伺服器。

- 如果控制面板與 Daemon 位於同一台伺服器上，有時可以在 `/etc/hosts` 中加入一筆記錄，將公開 IP 位址指向該伺服器。有時也需要反向設定，因此您可能需要在伺服器的 `/etc/hosts` 檔案中，將控制面板網域指向正確的 IP 位址。

- 如果 Daemon 與控制面板分別執行於使用相同網路介面的不同虛擬機器上，請確認兩台虛擬機器可以互相連線。您可能需要啟用混雜模式。

## Invalid MAC 例外

::: warning
如果您正確遵循我們的安裝與升級指南，理論上不應該發生此錯誤。此錯誤通常只會在使用備份還原控制面板資料庫，卻搭配全新安裝的控制面板時出現。

還原備份時，您應該**一併還原 `.env` 檔案**！
:::

有時在使用控制面板時，您可能會突然遇到頁面損壞的情況。查看記錄後，可能會看到解密時發生 Invalid MAC 的例外。這是因為資料加密與解密時使用的 `.env` 檔案中的 `APP_KEY` 不一致所造成。

如果遇到此錯誤，唯一的解決方法是從原本的 `.env` 檔案還原 `APP_KEY`。如果您已遺失原始金鑰，便無法復原遺失的資料。

## SELinux 問題

在安裝 SELinux 的系統上，執行 Redis 或嘗試連線至 Daemon 以執行操作時，可能會遇到未預期的錯誤。通常可以執行以下指令，允許這些程式與 SELinux 正常運作。

### Redis 權限錯誤

```bash
audit2allow -a -M redis_t
semodule -i redis_t.pp
```

### 控制面板部分功能異常時

```bash
restorecon -R /var/www/pterodactyl/
```

### Daemon 連線錯誤

```bash
audit2allow -a -M http_port_t
semodule -i http_port_t.pp
```

## FirewallD 問題

如果您使用的是安裝了 firewalld 的 RHEL／CentOS 伺服器，可能會遇到 DNS 異常。

```bash
firewall-cmd --permanent --zone=trusted --change-interface=pterodactyl0
firewall-cmd --reload
```

執行上述指令後，請重新啟動 Docker 與 Wings，以確保規則已套用。

## 資料庫錯誤

### DatabaseController.php:142

```text
production.ERROR: ErrorException: Undefined variable: host in /var/www/pterodactyl/app/Http/Controllers/Admin/DatabaseController.php:142
```

您嘗試使用的資料庫使用者沒有適當的權限，或使用了錯誤的密碼。