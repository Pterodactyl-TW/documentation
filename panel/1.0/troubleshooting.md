# 疑難排解

[[toc]]

## 讀取錯誤記錄
如果 Panel 遇到意外錯誤，通常首先會請你提供記錄。請執行下方命令，輸出 Panel 記錄檔的最後 100 行。

``` bash
tail -n 100 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log
```

### 解析錯誤
執行上方命令後，你可能會看到大量令人不知所措的文字。別擔心，這只是指向錯誤原因的堆疊追蹤；尋找錯誤原因時，
其實幾乎可以忽略其中大部分內容。以下是經過截短的範例輸出，方便閱讀。

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

首先，沿著數字鏈結向上尋找，直到找到 `#0`；這就是觸發例外的函式。在第 0 行上方，你會看到一行包含方括號日期與時間的內容，
例如上方的 `[2018-07-19 00:50:24]`。這一行是人類可讀的例外訊息，可用來了解發生了什麼問題。

### 了解錯誤
從上方範例可以看出，實際錯誤是：

```
local.ERROR: ErrorException: file_put_contents(...): failed to open stream: Permission denied in /srv/www/vendor/laravel/framework/src/Illuminate/Filesystem/Filesystem.php:122
```

從這個錯誤可以判斷，[file_put_contents()](http://php.net/manual/en/function.file-put-contents.php) 呼叫執行失敗，原因是權限不足，無法開啟檔案。
即使完全看不懂錯誤也沒關係，但如果你能提供這些記錄，並至少找出錯誤來源，就能更快獲得支援。有些錯誤相當直接，
會明確告訴你發生了什麼，例如 Panel 無法連線到 Daemon 時拋出的 `ConnectionException`。

### 使用 GREP
如果想快速瀏覽大量錯誤，可以使用下方命令，將結果限制為實際的錯誤行，不顯示完整堆疊追蹤。

``` bash
tail -n 1000 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log | grep "\[$(date +%Y)"
```

## 無法連線至伺服器
### 基本除錯步驟
* 確認 Wings 正在執行且沒有回報錯誤。使用 `systemctl status wings` 檢查程序目前狀態。
* 按下 `Ctrl + Shift + J`（Chrome）或 `Cmd + Alt + I`（Safari）查看瀏覽器主控台。如果看到紅色錯誤，通常能縮小問題範圍。
* 確認 Wings 已正確安裝，且目前設定符合 Panel 中 `Admin -> Node -> Configuration` 顯示的設定。
* 確認防火牆已開放 Wings 連接埠。Wings 使用 `8080` 或 `8443` 傳輸 HTTP(S)，並使用 `2022` 傳輸 SFTP。
* 確認已對 Panel 與 Wings 網域停用 AdBlock，或將這些網域加入允許清單。
* 確認 Panel 能透過 Panel 設定的網域連線到 Wings。在 Panel 伺服器上執行 `curl https://domain.com:8080`，確認能成功連線。
* 確認 Panel 與 Wings 使用正確的 HTTP 通訊協定。如果 Panel 使用 HTTPS，Wings 也必須使用 HTTPS。
* 如果 Wings 使用 HTTPS，請確認憑證尚未過期。

### 進階除錯步驟
* Stop Wings and run `wings --debug` to see if there are any errors being output. If so, try resolving them manually,
  or reach out on [Discord](https://discord.gg/pterodactyl) for more assistance.
* Check your DNS and ensure that the response you receive is the one you expect using a tool such as `nslookup` or `dig`.
* If you use CloudFlare make sure that the orange cloud is disabled for your Wings or Panel `A` records.
* Make sure when using Wings behind a firewall — pfSense, OpenSwitch, etc. — that the correct NAT settings to access
the Wing's ports from the outside network are setup.
* If nothing is working so far, check your own DNS settings and consider switching DNS servers.
* When running the Panel and Wings on one server it can sometimes help if to add an entry in `/etc/hosts` that directs
the public IP back to the server. Sometimes the reverse path is also needed, so you may need to add an entry to your
servers `/etc/hosts` file that points the Panel's domain to the correct IP.
* When running Wings and the Panel on separate VM's using the same adapter make sure the VM's can connect to each
other. Promiscuous mode might be needed.

## Invalid MAC Exception
::: warning
This error should never happen if you correctly follow our installation and upgrade guides. The only time we have
ever seen this error occur is when you blindly restore the Panel database from a backup and try to use a fresh
installation of the Panel.

When restoring backups you should _always_ restore the `.env` file!
:::

Sometimes when using the Panel you'll unexpectedly encounter a broken page, and upon checking the logs you'll see
an exception mentioning an invalid MAC when decrypting. This error is caused by mismatched `APP_KEY`s in your `.env` file
when the data was encrypted versus decrypted.

If you are seeing this error the only solution is to restore the `APP_KEY` from your `.env` file. If you have lost that
original key there is no way to recover the lost data.

## SELinux Issues
On systems with SELinux installed you might encounter unexpected errors when running redis or attempting to connect
to the daemon to perform actions. These issues can generally be resolved by executing the commands below to allow
these programs to work with SELinux.
 
### Redis Permissions Errors
``` bash
audit2allow -a -M redis_t
semodule -i redis_t.pp
```

### Wings Connection Errors
``` bash
audit2allow -a -M http_port_t
semodule -i http_port_t.pp
```

## Containers don't have internet? Probably a DNS issue!
Now that Wings has run successfully and you have gotten the green heart on your Nodes page, the wings config at '/etc/pterodactyl/config.yml' will have new values.
One of those values is DNS, which by default will be 1.1.1.1 and 1.0.0.1
If you are using a host that blocks Cloudflare DNS, you will have to use different DNS Servers; typically the same ones your host system is using.
You can view what DNS Servers your host uses through a number of ways depending on how your operating system handles networking. If one of these doesn't work, try another one.
```bash
# Network Manager (This will show both your IPV4 DNS and IPV6 DNS Servers in case you want to add the IPV6 DNS Server(s) from your host to your Wings Config as well.
nmcli -g ip4.dns,ip6.dns dev show
# Resolve-CTL (Newer Versions of Ubuntu)
resolvectl status
# Raw file locations that may have your host system's DNS Servers for various distributions
/etc/resolv.conf
/etc/network/interfaces
```
If this returns different DNS Servers than 1.1.1.1 and 1.0.0.1 you'll need to edit the wings 'config.yml' file to use the DNS servers that were returned from the command. If you see output that looks like an IPV6 address in addition to your IPV4 DNS Servers, make sure you put that in the IPV6 section and not the IPV4 section. To be clear, if you have to use different DNS Servers than the default, make sure to REMOVE 1.1.1.1 and 1.0.0.1 from the wings config; don't just add the new servers, replace the old servers.

## Schedule Troubleshooting
- Check logs from your queue manager ``journalctl -xeu pteroq``
- Restart pteroq ``systemctl restart pteroq``
- Clear schedule cache ``php /var/www/pterodactyl/artisan schedule:clear-cache``
- Check your php version ``php -v`` - [this page](https://pterodactyl.io/panel/1.0/updating.html#panel-version-requirements) will tell you what versions of php are supported by what versions of the panel
- Check your crontab syntax using https://crontab.guru - make sure it's what you intended
- Verify the problem is with the schedule and not with the tasks you have set up (Set the first task in your schedule to something you know prints a message in the console, ie. run ``say test`` in the console for a Minecraft server, if the text "test" shows up in the console successfully, set the first task to ``say test`` so you know if it runs
- Are your tasks off by a bit? Make sure you on the latest version of the panel? In version 1.11.5 there was a fix for schedules running at the wrong time. Alternatively, you may have the wrong timezone set. Make sure your timezones all match.
 - System Timezone ``timedatectl``
 - Panel Timezone ``nano /var/www/pterodactyl/.env``
 - Wings Timezone (Passed to containers as the TZ environmental variable, unrelated to schedules but while you're checking timezones you may as well set this too) ``nano /etc/pterodactyl/config.yml``
- Check your database where schedules are stored - MariaDB by default
 - ``systemctl status mariadb`` - if it's not active, ``journalctl -xeu mariadb``
- Check queue handler - Redis by default
 - ``systemctl status redis`` - if it's not active, ``journalctl -xeu redis`` (On some distributions the service will be named ``redis-server`` instead)
- Check for panel errors ``tail -n 150 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log | nc pteropaste.com 99``

## FirewallD issues
If you are on a RHEL/CentOS server with `firewalld` installed you may have broken DNS.

```
firewall-cmd --permanent --zone=trusted --change-interface=pterodactyl0
firewall-cmd --reload
```

Restart `docker` and `wings` after running these to be sure the rules are applied.
