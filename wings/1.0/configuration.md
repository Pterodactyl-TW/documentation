# 進階設定

[[toc]]

::: warning 警告
以下都是 Wings 的進階設定項目，動到這些等於是在動核心行為，設錯了很容易讓 Wings 整個壞掉，甚至讓容器完全無法使用。
所以這裡有個原則：不確定某個設定值實際的作用之前，先不要動它。
:::

這些設定都放在 `/etc/pterodactyl` 目錄下的 Wings `config.yml` 檔案裡，改完之後記得重新啟動 Wings 才會生效。如果重啟時跳出 YAML 解析錯誤，通常是縮排或格式打錯了，可以先丟到 [Yaml Lint](http://www.yamllint.com/) 檢查一下再重試。

## 私有 Registry

如果你的映像檔是放在私有的 Docker Registry 上，Wings 在拉取映像檔前需要先驗證身分，這時就可以用下面的設定告訴 Wings 該用哪組帳號密碼登入。

### 可用金鑰

| 設定金鑰    | 預設值        | 說明               |
| ----------- | :-----------: | ----------------- |
| name        |     null      | Registry 位址      |
| username    |     null      | Registry 使用者名稱 |
| password    |     null      | Registry 密碼      |

### 使用範例

```yml
docker:
  registries:
    registry.example.com:
      username: "registryusername"
      password: "registrypassword"
```

## 自訂網路介面

Wings 預設會用一個叫做 `pterodactyl_nw` 的網路介面來管理所有容器，如果有需要，你可以直接編輯這個名稱來改變網路模式。舉例來說，想啟用 Docker 的主機模式，只要把網路名稱改成 `host` 就可以了。

::: warning 警告
這裡要特別注意：把網路模式改成 `host` 之後，Pterodactyl 就能直接存取這台機器上的所有網路介面，代表 Panel 的使用者甚至可以繫結到任何 IP 或連接埠,包括那些根本沒有配置給他們容器的位址。換句話說，Docker 網路隔離帶來的保護會完全消失。因此，如果你的環境是給多個不同使用者共用的公開安裝環境，並不建議使用這個模式。
:::

### 使用範例

```yml
docker:
  network:
    name: host
    network_mode: host
```

設定改完之後，下面這行指令會依序停止 Wings、移除 Pterodactyl 的網路，再重新啟動 Wings，讓新設定套用進去。執行前請自行評估風險。

`systemctl stop wings && docker network rm pterodactyl_nw && systemctl start wings`

## 啟用 Cloudflare Proxy

先說結論：幫 Wings 套上 Cloudflare Proxy 其實沒有太大意義，因為玩家終究是直接連到你的機器，並不會經過 Cloudflare，所以節點的真實 IP 還是暴露在外。

如果你還是想啟用，前提是要把 Wings 的連接埠改成 Cloudflare 支援快取的 HTTPS 連接埠之一（完整清單可以參考[這裡](https://developers.cloudflare.com/fundamentals/get-started/reference/network-ports/)），例如 8443，因為 Cloudflare 對 HTTP 只支援 8080 這個連接埠。接下來，到 Admin Panel 選取你的節點，在設定分頁把連接埠改掉。如果你在 Cloudflare 是使用 Full SSL 設定，記得把這台節點標記為「Not Behind Proxy」。最後回到 Cloudflare 儀表板，確認你的網域（FQDN）旁邊的雲朵圖示是橘色（啟用代理）狀態。

小提醒：除非你用的是 Cloudflare Enterprise 方案，否則 SFTP 連接埠沒辦法透過 Cloudflare Proxy 代理。

## 容器 PID 限制

`container_pid_limit` 用來限制容器在同一時間最多能執行多少個程序，預設值是 `512`。如果把它設成 `0`，就等於完全解除限制,但這裡不建議這麼做，因為這個限制其實是在保護節點,避免某個惡意或失控的程序無限產生子程序，把整台機器的資源吃光。改完設定後，記得重新啟動 Wings 與該遊戲伺服器，新的限制才會生效。

### 使用範例

```yml
docker:
  ...
  container_pid_limit: 512
  ...
```

## 節流限制

節流（Throttle）機制是用來防止伺服器主控台被大量輸出洗版，拖垮效能。以下這些設定可以讓你調整節流的敏感度，或是乾脆整個關掉。

| 設定金鑰              | 預設值        | 說明                                                                                                                 |
| :-------------------- | :-----------: | -------------------------------------------------------------------------------------------------------------------- |
| enabled               |     true      | 是否啟用節流功能                                                                                                     |
| lines                 |     2000      | 在一個 line_reset_interval 週期內可輸出的總行數                                                                      |
| maximum_trigger_count |       5       | 節流限制可被觸發的次數上限，超過後伺服器將被停止                                                                     |
| line_reset_interval   |      100      | 已處理行數重設為 0 所間隔的時間                                                                                       |
| decay_interval        |     10000     | 未再次觸發節流限制多久（毫秒）後，觸發次數會遞減                                                                     |
| stop_grace_period     |      15       | 觸發輸出節流後，伺服器被允許處於停止中狀態的時間，超過後將被強制終止                                                 |
| write_limit           |       0       | 限制備份寫入磁碟的 I/O 速度，0 表示無限制。大於 0 的值會將寫入速度節流至設定值（MiB/s）                              |
| download_limit        |       0       | 限制壓縮檔的網路 I/O 讀取速度，0 表示無限制。大於 0 的值會將讀取速度節流至設定值（MiB/s）                            |

### 使用範例

```yml
throttles:
  enabled: true
  lines: 2000
  maximum_trigger_count: 5
  line_reset_interval: 100
  decay_interval: 10000
  stop_grace_period: 15
```

## 安裝程式限制

有時候伺服器在安裝過程中，因為某些指令碼寫得不好，會不小心吃掉遠超預期的資源。這組設定就是用來替安裝程式容器設一個上限，避免這種情況拖垮整台機器。它會跟伺服器本身定義的限制一起比較，安裝容器最終會採用兩者之中較高的那個值。

| 設定金鑰    | 預設值        | 說明                                                                             |
| :---------- | :-----------: | ---------------------------------------------------------------------------------- |
| memory      |     1024      | 安裝容器可使用的記憶體上限，除非伺服器的記憶體限制高於此值                         |
| cpu         |      100      | 安裝容器可使用的 CPU 上限，除非伺服器的 CPU 限制高於此值                          |

### 使用範例

```yml
installer_limits:
  memory: 1024
  cpu: 100
```

## 其他值

除了前面提到的項目之外，下面列出幾個比較常被討論到的設定值。如果想看完整的 Wings 設定與說明，可以直接參考[這兩個檔案](https://github.com/Pterodactyl-TW/wings/tree/develop/config)。

| 設定金鑰                   | 預設值        | 說明                                                                                                                     |
| -------------------------- | :-----------: | -------------------------------------------------------------------------------------------------------------------------- |
| debug                      |     false     | 強制 Wings 以除錯模式執行                                                                                               |
| tmpfs_size                 |      100      | 掛載至容器內的 /tmp 目錄大小（MB）                                                                                      |
| websocket_log_count        |      150      | 主控台顯示的行數                                                                                                        |
| detect_clean_exit_as_crash |     true      | 若伺服器並非因使用者操作（例如按下停止按鈕）而停止，則將其標記為當機                                                    |
| (crash detection) timeout  |      60       | 伺服器多次當機之間的時間間隔，在此間隔內不會自動重新啟動伺服器                                                          |
| app_name                   | "Pterodactyl" | 變更 daemon 的名稱，會顯示在 Panel 的遊戲主控台中                                                                       |
| check_permissions_on_boot  |     true      | 每次開機時檢查所有檔案權限。若檔案數量非常龐大導致伺服器啟動時卡在權限檢查上，可停用此選項                              |
