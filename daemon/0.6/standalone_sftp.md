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
獨立 SFTP 支援在 `Panel@v0.7.11` 與 `Daemon@v0.6.8` 中引入，舊版無法使用。
:::

Pterodactyl 現在提供使用[獨立 SFTP 伺服器](https://github.com/pterodactyl/sftp-server)的選項，不必使用 Daemon 內建的 SFTP。
這能提供更好的 SFTP 用戶端相容性、更快的傳輸速度，以及更原生的檔案處理與伺服器運作方式。

由於此功能相對新，我們決定採用選擇加入，而不是選擇退出。本頁將說明如何設定獨立 SFTP 伺服器。

## 停用 Daemon 的 SFTP 伺服器
若要停用 Daemon SFTP 伺服器，只需在 Daemon 的 `core.json` 檔案加入 `sftp.enabled=false`。

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

完成後重新啟動 Daemon 即可套用變更，且不會啟動內建伺服器。

## 執行獨立伺服器
若要下載獨立伺服器，請在 Daemon 的基礎目錄（通常是 `/srv/daemon`）中執行下方命令。

``` sh
curl -Lo sftp-server https://github.com/pterodactyl/sftp-server/releases/download/v1.0.5/sftp-server
chmod +x sftp-server
```

現在你已取得伺服器執行檔。由於此伺服器使用 [`go`](https://golang.org) 撰寫，不需要安裝其他相依套件。

### 啟動伺服器
最後啟動 SFTP 伺服器，之後即可使用它存取檔案。

``` sh
./sftp-server
```

預設會在舊的 `2022` 連接埠啟動 SFTP 伺服器。如果要使用其他連接埠，可以透過 `--port` 旗標指定。
如需進階用法，請參閱 [GitHub README](https://github.com/pterodactyl/sftp-server/tree/release/v1.0.4#running)，其中包含所有旗標與預設值。

## 將伺服器以 Daemon 執行
你很可能會想使用 `systemd` 將 SFTP 伺服器作為 Daemon 執行，讓它在背景運作。將下方內容放入 `/etc/systemd/system` 目錄中
名為 `pterosftp.service` 的檔案。

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

接著執行下方命令，在 systemd 中啟用並啟動 SFTP 伺服器。

``` bash
systemctl enable --now pterosftp
```

### 自訂啟動方式
如果使用 systemd 啟動時要傳入額外引數，請修改 `ExecStart` 行。例如：`ExecStart=/srv/daemon/sftp-server --port 2022`。
