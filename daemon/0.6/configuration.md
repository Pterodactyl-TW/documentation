---
meta:
    - name: robots
      content: noindex
---
# 額外設定

::: danger 此軟體已停止維護
本文件適用於**已停止維護的軟體**，該軟體不再取得任何安全性更新，也不再獲得社群支援。本文件僅因歷史原因而繼續保留。

在正式環境中，您應安裝並使用 [Wings](/wings/1.0/installing.md) 以及 [Pterodactyl 控制面板 1.0](/panel/1.0/getting_started.md)。
:::

[[toc]]

::: warning
以下是 Daemon 的進階設定。如果修改錯誤，可能會導致 Daemon 損壞，使容器無法使用。請自行承擔操作風險，並且只有在您了解每個設定值用途的情況下才進行修改。
:::

以下文件使用帶有點號的 JSON 表示法，說明每個設定應放置的位置。將設定加入 Daemon 的 `core.json` 檔案時，您需要手動將此表示法展開。例如，`internals.throttle.enabled` 應展開為以下 JSON：

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

Daemon 內建數項節流限制，用於避免使用者造成資料量與 CPU 使用量方面的問題。在正常情況下，使用者不應該遇到這些限制。在啟動伺服器時，或輸出資料突然大量增加時，您可能偶爾會看到資料節流警告。

如果您發現有比預期更多的伺服器因 Daemon 節流機制而被終止，可以調整以下設定。請注意，以下設定使用 JSON 點號表示法，必須展開成一般的 JSON 物件。

| 設定路徑            | 預設值 | 說明 |
| ------------------- | ------ | ---- |
| `enabled`           | `true` | 決定是否啟用節流機制，以及是否使用以下相關設定。 |
| `kill_at_count`     | `5`    | 特定執行個體在伺服器程序被終止前，可以累積的警告次數。以下的衰減時間會影響此數值降低的速度。 |
| `decay`             | `10`   | 伺服器程序在不觸發資料節流警告後，必須經過的秒數。超過此秒數仍未觸發資料節流時，節流計數便會開始降低。此迴圈每 5 秒處理一次，每當程序超過指定秒數未觸發資料節流時，節流計數會減少 1。 |
| `bytes`             | `30720` | :warning: _（已於 v0.5.5 移除）_ 在指定時間間隔內可輸出的最大資料量（單位為位元組），超過後便會觸發警告。 |
| `lines`             | `1000` | :warning: _（於 v0.5.6 新增）_ 伺服器程序在指定檢查間隔內可輸出的行數。預設情況下，約 500 毫秒內輸出 5,000 行會導致伺服器程序被終止。 |
| `check_interval_ms` | `100`  | 節流機制重設已使用位元組數或行數的間隔時間，單位為毫秒。 |

請注意，上述所有設定都位於 `internals.throttle.X` 路徑下。因此，`enabled` 的完整路徑實際上是 `internals.throttle.enabled`。

## 自訂網路介面

如果您因任何原因需要修改 Pterodactyl 本機 Docker 網路所使用的網路介面，可以修改 Daemon 的 `core.json` 檔案。在大多數情況下，您只需要修改網路名稱，讓伺服器使用主機的網路堆疊。請依照以下範例，將 `docker.network.name` 從 `pterodactyl_nw` 變更為 `host`。

::: warning
變更為主機網路堆疊後，Pterodactyl 上執行的伺服器可以直接存取本機網路介面，並繫結至指定的 IP 位址（部分 Steam 遊戲需要此功能）。但不建議在公開的 Pterodactyl 安裝環境中使用此設定，尤其是該環境中有其他使用者執行伺服器時。

使用 `host` 網路堆疊會移除 Docker 提供的許多網路層級防護，並允許伺服器程序存取主機上的任何內容，以及繫結至其想要使用的任何 IP 位址或連接埠。
:::

::: danger
Daemon 啟動後對網路進行任何變更，都需要移除 Docker 網路並重新啟動 Daemon。主機上的所有伺服器都必須先停止，而且很可能還需要重新建置。

以下指令會停止 Daemon、移除網路，然後再次啟動 Daemon。請自行承擔執行風險。

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
| `key`           | _無_   | 預先產生、經 Base64 編碼的驗證字串。如果提供此設定，則不需要設定上述其他選項。 |

請注意，上述所有設定都位於 `docker.registry.X` 路徑下。因此，`username` 的完整路徑實際上是 `docker.registry.username`。

## 安全性原則

此 Daemon 預設使用非常嚴格的安全性設定，用於限制對主機系統的存取，並降低大量潛在攻擊向量的風險。不過，部分使用者可能需要調整這些設定，或是在私有環境中執行，因此願意降低部分安全性措施。

| 設定路徑              | 預設值 | 說明 |
| --------------------- | ------ | ---- |
| `ipv6`                | `true` | 設為 `false` 可停用 `pterodactyl0` 介面上的 IPv6 網路功能。 |
| `internal`            | `false` | 設為 `true` 可防止 `pterodactyl0` 介面上的所有容器存取外部網路。 |
| `enable_icc`          | `true` | 設為 `false` 可禁止容器存取主機系統上執行服務的非公開 IP 位址。設為 `false` 後，容器將無法透過主機的公開 IP 位址以外的方式連線至主機上的 MySQL、Redis 等服務。 |
| `enable_ip_masquerade` | `true` | 設為 `false` 可停用 `pterodactyl0` 介面上的 IP 偽裝。 |

請注意，上述所有設定都位於 `docker.policy.network.X` 路徑下。因此，`ipv6` 的完整路徑實際上是 `docker.policy.network.ipv6`。

## 容器原則

| 設定路徑           | 預設值                    | 說明 |
| ------------------ | ------------------------- | ---- |
| `tmpfs`            | `rw,exec,nosuid,size=50M` | 用於將 `tmpfs` 目錄掛載至容器的參數，讓特定程式可以正常執行。 |
| `log_driver`       | `none`                    | :warning: 此選項已於 `v0.6` **移除**，並強制設定為 `json-file`。容器使用的記錄驅動程式。預設為 `none`，以降低伺服器大量輸出記錄時可能造成的 DoS 攻擊風險。 |
| `log_opts`         | 陣列                      |      |
| `log_opts.max_size` | `5m`                     | Docker 建立的伺服器輸出記錄檔大小上限。 |
| `log_opts.max_files` | `1`                     | Docker 為伺服器輸出建立的記錄檔數量上限。 |
| `readonly_root`    | `true`                    | 決定容器的根檔案系統是否應設為唯讀。 |
| `securityopts`     | 陣列                      | 套用至容器的安全性選項陣列。以下提供預設陣列。 |
| `cap_drop`         | 陣列                      | 要從容器移除的 Linux 能力陣列（除此之外，Docker 也會[預先移除部分能力](https://docs.docker.com/engine/security/security/#linux-kernel-capabilities)）。以下提供預設陣列。 |

請注意，上述所有設定都位於 `docker.policy.container.X` 路徑下。因此，`tmpfs` 的完整路徑實際上是 `docker.policy.container.tmpfs`。

### 預設安全性選項陣列

```json
[
    'no-new-privileges',
]
```

### 預設移除能力陣列

::: warning
從 Daemon `v0.6` 開始，以下先前會被移除的能力可在容器中使用：`chown`、`kill`、`setgid` 與 `setuid`。
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

在 Daemon 上啟用 Cloudflare 通常沒有太大用途，因為使用者不會直接連線至 Daemon 連接埠，而且使用者需要未經 Proxy 的主機名稱，才能存取節點上的任何伺服器。因此，您無法藉此隱藏節點主機的 IP 位址，但部分使用者仍可能希望啟用此功能。

使用 HTTP 時，Cloudflare 只會 Proxy 預設的 Daemon 連接埠（8080）。若要在啟用 HTTPS 的情況下讓 Daemon 與 Cloudflare 正常運作，您必須將 Daemon 連接埠變更為 Cloudflare 會 Proxy 的連接埠，例如 `8443`。由於 Cloudflare 只有在非企業方案中 Proxy HTTP／HTTPS 流量，因此無法 Proxy SFTP 連接埠。