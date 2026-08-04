# 建立新的節點

[[toc]]

## 位置

前往管理控制面板，點選左側側邊欄中的 `Nodes` 分頁。接著點選右上角的 `Create New`，開啟新增節點的頁面。

![](../../../.vuepress/public/community/config/nodes/pterodactyl_add_node_create_button.png)

## 必要資訊

![](../../../.vuepress/public/community/config/nodes/pterodactyl_add_node_new_page.png)

- **Name**：用於快速識別節點的名稱。
- **Description**：用於協助識別節點的詳細描述。
- **Location**：節點所在的位置。這些位置是在控制面板的 `Locations` 區段中設定，且必須先建立位置，才能建立節點。目前，位置僅用作節點的分類，沒有其他用途。
- **FQDN**：節點的完整網域名稱，例如：`node.pterodactyl.io`
- **Communicate over SSL**：如果控制面板使用 SSL，Daemon 也必須使用 SSL。
- **Behind Proxy**：如果 Daemon 位於 Proxy 後方，且 SSL 連線會在抵達 Daemon 前由 Proxy 終止，則應選取此選項。如果您不了解這段說明，通常不需要啟用此選項。
- **Server File Directory**：實體伺服器上用於儲存伺服器產生檔案的位置。預設為 `/var/lib/pterodactyl/volumes`。

::: tip OVH 使用者
部分 OVH 使用者的 `/home` 資料夾通常是容量最大的檔案系統。如果您使用的是預設的 OVH 伺服器環境，可以考慮改用 `/home/pterodactyl/volumes`。
:::

- **Total Memory**：節點可自動配置的總記憶體容量。
- **Memory Overallocate**：節點記憶體超額配置的百分比。例如，若設定記憶體上限為 10 GB，並設定 20% 的超額配置，控制面板最多會在此節點上配置總共 12 GB 的記憶體。
- **Total Disk Space**：節點可自動配置的總磁碟空間。
- **Disk Overallocate**：運作方式與記憶體超額配置相同。

::: danger
請勿忘記將作業系統本身與其他軟體所需的資源納入考量。
:::

- **Daemon Port**：Daemon 監聽連線時使用的連接埠。
- **Daemon SFTP Port**：Daemon 的 SFTP 伺服器或獨立 SFTP 伺服器監聽連線時使用的連接埠。

## 安裝 Daemon

此時，您需要先在伺服器上安裝 Daemon。如需更多資訊，請參閱[相關文件](/wings/installing.html)，或參考社群提供的 [CentOS](/community/installation-guides/wings/centos7.html) 或 [Debian](/community/installation-guides/wings/debian.html) 安裝指南。

## 設定節點

前往節點的設定頁面。

![](../../../.vuepress/public/community/config/nodes/pterodactyl_add_node_config.png)

將設定內容複製並貼到 `config.yml` 檔案中。（預設位置為 `/etc/pterodactyl/config.yml`。）

### 自動部署

此功能會產生一組指令，供您在節點伺服器上執行，以自動完成 Daemon 的設定。