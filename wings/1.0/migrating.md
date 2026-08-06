# 遷移至 Wings

這篇指南是寫給想從舊版 Node.JS Daemon 遷移到 Wings 的使用者看的。如果你是要在全新的節點上第一次安裝 Wings，直接看[安裝指南](/wings/1.0/installing.md)就好，不需要參考這篇。

::: danger Panel 版本需求
這裡務必注意：你**必須**先把 Pterodactyl Panel 升級到 1.X 版本，才能使用 Wings。
:::

進行這個遷移流程時會有一小段離線時間，不過不用擔心，正在跑的遊戲程序不會受到影響。而且通常這段期間 Panel 本身也會處於離線或維護模式，所以對使用者來說基本上不會有感覺。

## 安裝 Wings

安裝 Wings 的第一步，是先把需要的目錄結構建起來。執行下面的指令，建立基礎目錄並下載 Wings 執行檔。

> [!NOTE]
> 我們目前只翻譯最新版本的文件，所以一般來說，只有照著這份文件操作，或是使用我們的一鍵安裝程式，才會裝到繁體中文化版本。如果你選擇安裝的是舊版本，那就代表你裝的是官方英文版，我們沒辦法在翻譯內容上提供支援；不過技術層面的問題，還是歡迎到 [Discord](https://pterodactyl.tw/discord) 找我們，或跟其他使用者一起討論。

``` bash
mkdir -p /etc/pterodactyl
curl -L -o /usr/local/bin/wings https://github.com/pterodactyl/wings/releases/latest/download/wings_linux_amd64
chmod u+x /usr/local/bin/wings
```

## 複製新的設定檔

裝好 Wings 之後，接下來要從 Panel 那邊複製一份新的設定檔過來。這份設定採用了全新的格式，之後管理跟編輯起來都會更輕鬆。

把下面這個程式碼區塊的內容複製起來，貼到 `/etc/pterodactyl` 目錄下新建的 `config.yml` 檔案裡，存檔即可。

![](./../../.vuepress/public/wings_configuration_example.png)

::: warning
這裡要注意一下：你先前對舊設定做的任何修改，這次都不會被帶過來，會直接遺失。如果你以前有調整過預設設定，比較保險的做法是先用複製來的新設定啟動一次 Wings，讓它自動把其他設定值補齊。

等 Wings 順利跑起來之後，再回頭依需求慢慢調整就好。
:::

## 移除舊 Daemon

Wings 裝好之後，伺服器上舊的 Daemon 程式碼就用不到了，接下來要把它清乾淨。假設你的舊 Daemon 是裝在預設的 `/srv/daemon` 目錄，執行下面的指令即可完成移除。

```bash
# 停止舊的 daemon
systemctl stop wings

# 刪除整個目錄。這裡面存的東西對這次遷移來說都用不到了。
# 記得，伺服器實際的資料是存放在 /srv/daemon-data，不會受影響。
rm -rf /srv/daemon

# 如果這台機器上的 NodeJS 沒有其他用途，也可以順手一併移除
apt -y remove nodejs # 或者：yum remove nodejs
```

### 移除獨立 SFTP

如果你的舊 Daemon 有另外開過[獨立 SFTP 伺服器](/daemon/0.6/standalone_sftp.html)，這個功能在新版裡已經用不到了，所以也要把它的 systemd 服務一併移除。執行下面的指令：

```bash
# 停止並停用獨立 SFTP 服務
systemctl disable --now pterosftp

# 刪除這個 systemd 服務檔案
rm /etc/systemd/system/pterosftp.service
```

## 將 Wings 以 Daemon 執行

接下來要編輯現有的 Wings `systemd` 服務檔案，讓它改成指向新的控制軟體。打開 `/etc/systemd/system/wings.service`，把裡面全部的內容替換成下面這樣。

```
[Unit]
Description=Pterodactyl Wings Daemon
After=docker.service

[Service]
User=root
WorkingDirectory=/etc/pterodactyl
LimitNOFILE=4096
PIDFile=/var/run/wings/daemon.pid
ExecStart=/usr/local/bin/wings
Restart=on-failure
StartLimitInterval=600

[Install]
WantedBy=multi-user.target
```

設定檔換好之後，就可以啟動 Wings 了。

```
systemctl daemon-reload
systemctl enable --now wings
```

::: warning 如果 Wings 無法啟動怎麼辦？
萬一這時候發現 Wings 怎麼樣都啟動不了，可以直接執行下面的指令，用前景模式啟動並觀察實際的錯誤訊息，通常就能看出問題出在哪。

```
sudo wings --debug
```
:::
