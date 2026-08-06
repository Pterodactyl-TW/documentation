---
meta:
    - name: robots
      content: noindex
---
# 獨立 SFTP 伺服器

::: danger 此軟體已遭棄用
本文件適用於**已遭棄用的軟體**，不再提供任何安全性更新或社群支援。
基於歷史原因，本文件仍保留供查閱。

在正式環境中，你應搭配 [Pterodactyl Panel 1.0](/panel/1.0/getting_started.md) 安裝並使用 [Wings](/wings/1.0/installing.md)。
:::

::: warning
獨立 SFTP 支援是在 `Panel@v0.7.11` 與 `Daemon@v0.6.8` 中才引入的，舊版本並不支援這項功能。
:::

Pterodactyl 現在多了一個新選擇：你可以改用[獨立 SFTP 伺服器](https://github.com/pterodactyl/sftp-server)，不必再依賴 Daemon 內建的 SFTP 功能。
簡單來說，這麼做能帶來更好的 SFTP 用戶端相容性、更快的傳輸速度，以及更接近原生的檔案處理與伺服器運作方式。

由於這項功能相對較新，我們決定採用選擇加入（opt-in）而非選擇退出的方式，也就是說預設不會自動套用。接下來就一步步說明，該怎麼設定這台獨立 SFTP 伺服器。

## 停用 Daemon 的 SFTP 伺服器
第一步，要先關掉 Daemon 內建的 SFTP 伺服器，才不會兩邊互相衝突。做法很簡單，只要在 Daemon 的 `core.json` 檔案裡加入 `sftp.enabled=false` 即可。

```json
{
  ...
  "sftp": {
    ...
    "ip": "0.0.0.0",
    "enabled": false,
    "port": 2022,
    ...
  },
  ...
}
```

改完之後重新啟動 Daemon，變更就會生效，內建伺服器也就不會再啟動了。

## 執行獨立伺服器
接下來輪到獨立伺服器本身。若要下載它，請在 Daemon 的基礎目錄（通常是 `/srv/daemon`）中執行下方命令。

``` sh
curl -Lo sftp-server https://github.com/pterodactyl/sftp-server/releases/download/v1.0.5/sftp-server
chmod +x sftp-server
```

到這裡你就已經取得伺服器執行檔了。這裡有個小知識：這個伺服器是用 [`go`](https://golang.org) 撰寫的，所以不需要再另外安裝其他相依套件，直接就能執行。

### 啟動伺服器
最後一步，啟動 SFTP 伺服器，之後就可以用它來存取檔案了。

``` sh
./sftp-server
```

預設情況下，它會沿用舊版慣用的 `2022` 連接埠來啟動。如果你想改用其他連接埠，可以透過 `--port` 旗標指定。
如果還想了解更多進階用法，可以參閱 [GitHub README](https://github.com/pterodactyl/sftp-server/tree/release/v1.0.4#running)，裡面列出了所有可用旗標與對應的預設值。

## 將伺服器以 Daemon 執行
一般來說，你會希望用 `systemd` 把 SFTP 伺服器變成常駐服務，讓它在背景持續運作，而不用手動每次執行。請將下方內容放入 `/etc/systemd/system` 目錄中，
建立一個名為 `pterosftp.service` 的檔案。

``` text
[Unit]
Description=Pterodactyl Standalone SFTP Server
After=wings.service

[Service]
User=root
WorkingDirectory=/srv/daemon
LimitNOFILE=4096
PIDFile=/var/run/wings/sftp.pid
ExecStart=/srv/daemon/sftp-server
Restart=on-failure
StartLimitInterval=600

[Install]
WantedBy=multi-user.target
```

檔案建好之後，執行下方命令，讓 systemd 啟用並啟動這個 SFTP 伺服器。

``` bash
systemctl enable --now pterosftp
```

### 自訂啟動方式
如果你想在用 systemd 啟動時額外傳入一些引數，只要修改 `ExecStart` 這一行就好。例如：`ExecStart=/srv/daemon/sftp-server --port 2022`。
