---
meta:
- name: robots
  content: noindex
- property: og:title
  content: 額外設定 | Pterodactyl 繁體中文文件
- property: og:description
  content: 本文件適用於已停止維護的軟體，該軟體不再取得任何安全性更新，也不再獲得社群支援。本文件僅因歷史原因而繼續保留。
- property: og:image
  content: https://pterodactyl.tw/og/daemon_0.6_configuration.png
- property: og:image:width
  content: '1200'
- property: og:image:height
  content: '630'
- name: twitter:title
  content: 額外設定 | Pterodactyl 繁體中文文件
- name: twitter:description
  content: 本文件適用於已停止維護的軟體，該軟體不再取得任何安全性更新，也不再獲得社群支援。本文件僅因歷史原因而繼續保留。
- name: twitter:image
  content: https://pterodactyl.tw/og/daemon_0.6_configuration.png
---
# 額外設定

::: danger 此軟體已停止維護
本文件適用於**已停止維護的軟體**，該軟體不再取得任何安全性更新，也不再獲得社群支援。本文件僅因歷史原因而繼續保留。

在正式環境中，你應安裝並使用 [Wings](/wings/1.0/installing.md) 以及 [Pterodactyl 控制面板 1.0](/panel/1.0/getting_started.md)。
:::

[[toc]]

::: warning 警告
接下來要介紹的都是 Daemon 的進階設定，如果修改錯誤，可能會導致 Daemon 損壞，使容器無法使用。請自行承擔操作風險，並且只有在你了解每個設定值用途的情況下才進行修改。
:::

在往下看之前，先說明一下本文件的表示方式：以下內容使用帶有點號的 JSON 表示法，來說明每個設定應放置的位置。當你要把設定寫進 Daemon 的 `core.json` 檔案時，需要手動把這種點號表示法展開成真正的 JSON 結構。舉例來說，`internals.throttle.enabled` 展開後就會變成這樣：

```json
{
  "internals": {
    "throttle": {
      "enabled": true
    }
  }
}
```

## 輸出節流

Daemon 內建了數項節流限制，用來避免使用者造成資料量與 CPU 使用量方面的問題。在正常情況下，你不太會遇到這些限制，只有在伺服器剛啟動、或輸出資料突然大量增加時，才可能偶爾看到資料節流的警告。

如果你發現有比預期更多的伺服器因為 Daemon 的節流機制而被終止，可以試著調整以下設定。這裡要注意的是，下面的設定同樣使用 JSON 點號表示法，套用時必須展開成一般的 JSON 物件。

| 設定路徑            | 預設值 | 說明 |
| ------------------- | ------ | ---- |
| `enabled`           | `true` | 決定是否啟用節流機制，以及是否套用以下相關設定。 |
| `kill_at_count`     | `5`    | 特定執行個體在伺服器程序被終止前，可以累積的警告次數。下面的衰減時間會影響這個數值下降的速度。 |
| `decay`             | `10`   | 伺服器程序在不觸發資料節流警告的情況下，必須經過的秒數；一旦超過這個秒數仍未觸發節流，累積的節流計數就會開始下降。這個檢查迴圈每 5 秒執行一次，每當程序超過指定秒數未觸發節流，計數就會減少 1。 |
| `bytes`             | `30720` | :warning: _（已於 v0.5.5 移除）_ 在指定時間間隔內可輸出的最大資料量（單位為位元組），超過就會觸發警告。 |
| `lines`             | `1000` | :warning: _（於 v0.5.6 新增）_ 伺服器程序在指定檢查間隔內可輸出的行數。預設情況下，大約 500 毫秒內輸出 5,000 行，就會導致伺服器程序被終止。 |
| `check_interval_ms` | `100`  | 節流機制重設已使用位元組數或行數的間隔時間，單位為毫秒。 |

小提醒：上述所有設定其實都位於 `internals.throttle.X` 路徑下，因此 `enabled` 的完整路徑實際上是 `internals.throttle.enabled`。

## 自訂網路介面

如果你因為某些原因，需要修改 Pterodactyl 本機 Docker 網路所使用的網路介面，可以透過修改 Daemon 的 `core.json` 檔案來達成。大多數情況下，你只需要調整網路名稱，讓伺服器直接使用主機的網路堆疊即可。做法很簡單，只要照著下面的範例，把 `docker.network.name` 從 `pterodactyl_nw` 改成 `host` 就好。

::: warning 警告
不過要注意，一旦改成主機網路堆疊，Pterodactyl 上執行的伺服器就能直接存取本機網路介面，並繫結至指定的 IP 位址（部分 Steam 遊戲確實需要這個功能）。但並不建議在公開的 Pterodactyl 安裝環境中使用這項設定，尤其當環境中還有其他使用者一起執行伺服器時更是如此。

原因在於，使用 `host` 網路堆疊會移除 Docker 原本提供的許多網路層級防護，讓伺服器程序可以存取主機上的任何內容，也能繫結至它想要使用的任何 IP 位址或連接埠。
:::

::: danger 危險
還有一點必須留意：Daemon 啟動後如果對網路做任何變更，都需要先移除 Docker 網路，再重新啟動 Daemon 才會生效。這代表主機上的所有伺服器都必須先停止，而且很可能還需要重新建置。

以下指令會依序停止 Daemon、移除網路，然後再次啟動 Daemon。請自行承擔執行風險。

`systemctl stop wings && docker network rm pterodactyl_nw && systemctl start wings`
:::

```json{5}
"docker": {
    "socket": "/var/run/docker.sock",
    "autoupdate_images": true,
    "network": {
      "name": "pterodactyl_nw",
      "interfaces": {
        "v4": {
          "subnet": "172.18.0.0/16",
          "gateway": "172.18.0.1"
        }
      }
    },
    "interface": "172.18.0.1"
},
```

## 私有套件庫

| 設定路徑        | 預設值 | 說明 |
| --------------- | ------ | ---- |
| `username`      | _無_   | 連線至套件庫時使用的使用者名稱。 |
| `password`      | _無_   | 與該帳戶相關聯的密碼。 |
| `images`        | _無_   | 與私有套件庫相關聯的映像檔陣列。 |
| `auth`          | _無_   |      |
| `email`         | _無_   |      |
| `serveraddress` | _無_   | 套件庫所在伺服器的位址。 |
| `key`           | _無_   | 預先產生、經 Base64 編碼的驗證字串。如果你提供了這個設定，就不需要再設定上述其他選項。 |

同樣地，上述所有設定都位於 `docker.registry.X` 路徑下，所以 `username` 的完整路徑實際上是 `docker.registry.username`。

## 安全性原則

這個 Daemon 預設採用相當嚴格的安全性設定，用來限制對主機系統的存取，並降低大量潛在攻擊向量的風險。不過，有些使用者可能會需要調整這些設定，例如在私有環境中執行時，就可能願意放寬部分安全性措施來換取彈性。

| 設定路徑              | 預設值 | 說明 |
| --------------------- | ------ | ---- |
| `ipv6`                | `true` | 設為 `false` 可停用 `pterodactyl0` 介面上的 IPv6 網路功能。 |
| `internal`            | `false` | 設為 `true` 可防止 `pterodactyl0` 介面上的所有容器存取外部網路。 |
| `enable_icc`          | `true` | 設為 `false` 可禁止容器存取主機系統上執行服務的非公開 IP 位址；一旦設為 `false`，容器就只能透過主機的公開 IP 位址連線至主機上的 MySQL、Redis 等服務，而無法透過其他方式存取。 |
| `enable_ip_masquerade` | `true` | 設為 `false` 可停用 `pterodactyl0` 介面上的 IP 偽裝。 |

小提醒：上述所有設定都位於 `docker.policy.network.X` 路徑下，因此 `ipv6` 的完整路徑實際上是 `docker.policy.network.ipv6`。

## 容器原則

| 設定路徑           | 預設值                    | 說明 |
| ------------------ | ------------------------- | ---- |
| `tmpfs`            | `rw,exec,nosuid,size=50M` | 用於將 `tmpfs` 目錄掛載至容器的參數，讓特定程式可以正常執行。 |
| `log_driver`       | `none`                    | :warning: 此選項已於 `v0.6` **移除**，並強制設定為 `json-file`。這是容器使用的記錄驅動程式，預設為 `none`，目的是降低伺服器大量輸出記錄時可能造成的 DoS 攻擊風險。 |
| `log_opts`         | 陣列                      |      |
| `log_opts.max_size` | `5m`                     | Docker 建立的伺服器輸出記錄檔大小上限。 |
| `log_opts.max_files` | `1`                     | Docker 為伺服器輸出建立的記錄檔數量上限。 |
| `readonly_root`    | `true`                    | 決定容器的根檔案系統是否應設為唯讀。 |
| `securityopts`     | 陣列                      | 套用至容器的安全性選項陣列，下方提供預設陣列供你參考。 |
| `cap_drop`         | 陣列                      | 要從容器移除的 Linux 能力陣列（除此之外，Docker 也會[預先移除部分能力](https://docs.docker.com/engine/security/security/#linux-kernel-capabilities)）。下方同樣提供預設陣列。 |

小提醒：上述所有設定都位於 `docker.policy.container.X` 路徑下，因此 `tmpfs` 的完整路徑實際上是 `docker.policy.container.tmpfs`。

### 預設安全性選項陣列

```json
[
    'no-new-privileges',
]
```

### 預設移除能力陣列

::: warning 警告
從 Daemon `v0.6` 開始，以下先前會被移除的能力已可在容器中使用：`chown`、`kill`、`setgid` 與 `setuid`。
:::

```json
[
    'setpcap',
    'mknod',
    'audit_write',
    'net_raw',
    'dac_override',
    'fowner',
    'fsetid',
    'net_bind_service',
    'sys_chroot',
    'setfcap',
]
```

## 啟用 Cloudflare

其實在 Daemon 上啟用 Cloudflare，通常沒有太大的實質用途，因為使用者本來就不會直接連線至 Daemon 連接埠，而且他們還是需要一個未經 Proxy 的主機名稱，才能存取節點上的任何伺服器。也就是說，你並無法藉此隱藏節點主機的 IP 位址，但即便如此，仍有部分使用者希望啟用這項功能。

這裡有個小細節要注意：使用 HTTP 時，Cloudflare 只會 Proxy 預設的 Daemon 連接埠（8080）。如果你想在啟用 HTTPS 的情況下，讓 Daemon 與 Cloudflare 正常搭配運作，就必須把 Daemon 連接埠改成 Cloudflare 會 Proxy 的連接埠，例如 `8443`。另外，由於 Cloudflare 只有在非企業方案中才會 Proxy HTTP／HTTPS 流量，所以無論如何都無法用它來 Proxy SFTP 連接埠。
