---
meta:
- property: og:title
  content: 建立新的節點 | Pterodactyl 繁體中文文件
- property: og:description
  content: 首先前往管理控制面板，點選左側側邊欄中的 Nodes 分頁，接著點選右上角的 Create New，就會開啟新增節點的頁面。
- property: og:image
  content: https://pterodactyl.tw/og/community_config_nodes_add_node.png
- property: og:image:width
  content: '1200'
- property: og:image:height
  content: '630'
- name: twitter:title
  content: 建立新的節點 | Pterodactyl 繁體中文文件
- name: twitter:description
  content: 首先前往管理控制面板，點選左側側邊欄中的 Nodes 分頁，接著點選右上角的 Create New，就會開啟新增節點的頁面。
- name: twitter:image
  content: https://pterodactyl.tw/og/community_config_nodes_add_node.png
---
# 建立新的節點

[[toc]]

## 位置

首先前往管理控制面板，點選左側側邊欄中的 `Nodes` 分頁，接著點選右上角的 `Create New`，就會開啟新增節點的頁面。

![](../../../.vuepress/public/community/config/nodes/pterodactyl_add_node_create_button.png)

## 必要資訊

進入頁面後，你會看到一堆欄位要填，這裡逐一說明每個欄位的意思。

![](../../../.vuepress/public/community/config/nodes/pterodactyl_add_node_new_page.png)

- **Name**：用來快速識別這個節點的名稱。
- **Description**：更詳細的描述，方便之後管理時辨識用。
- **Location**：節點所在的地區。這裡要注意的是，地區是在控制面板的 `Locations` 區段中另外設定的，所以你必須先建立好地區，才能接著建立節點。目前地區只是拿來分類節點，暫時沒有其他實際功能。
- **FQDN**：節點的完整網域名稱，例如：`node.pterodactyl.tw`
- **Communicate over SSL**：如果你的控制面板本身有啟用 SSL，那 Wings 這邊也必須一併使用 SSL，兩邊要一致。
- **Behind Proxy**：如果 Wings 是架設在反向代理後方，而且 SSL 連線會在抵達 Wings 之前就先被代理終止掉，才需要勾選這個選項。簡單說，如果你看到這裡不太確定自己的架構是不是這樣，通常代表你不需要啟用它。
- **Server File Directory**：實體伺服器上用來儲存伺服器產生檔案的位置，預設是 `/var/lib/pterodactyl/volumes`。

::: tip OVH 使用者
小提醒，部分 OVH 使用者的 `/home` 資料夾通常才是容量最大的檔案系統。如果你用的是預設的 OVH 伺服器環境，可以考慮改用 `/home/pterodactyl/volumes` 這個路徑。
:::

- **Total Memory**：這個節點可以自動配置出去的總記憶體容量。
- **Memory Overallocate**：節點記憶體超額配置的百分比。舉例來說，如果你設定記憶體上限為 10 GB，再加上 20% 的超額配置，控制面板最多就會在這個節點上配置出總共 12 GB 的記憶體。
- **Total Disk Space**：節點可自動配置的總磁碟空間。
- **Disk Overallocate**：運作邏輯和記憶體超額配置一樣。

::: danger 危險
這裡要特別提醒，千萬別忘了把作業系統本身，以及其他軟體所需要用到的資源也一併考慮進去，不要把節點資源整個配好配滿。
:::

- **Daemon Port**：Wings 監聽連線時使用的連接埠。
- **Daemon SFTP Port**：Wings 內建的 SFTP 伺服器，或是獨立 SFTP 伺服器監聽連線時使用的連接埠。

## 安裝 Wings

填完上面這些資訊後，接下來要做的是在這台伺服器上實際安裝 Wings。如果需要更完整的步驟，可以參考[相關文件](/wings/installing.html)，或者直接照著社群提供的 [CentOS](/community/installation-guides/wings/centos7.html) 或 [Debian](/community/installation-guides/wings/debian.html) 安裝指南操作，會比較好上手。

## 設定節點

安裝好之後，回到節點的設定頁面。

![](../../../.vuepress/public/community/config/nodes/pterodactyl_add_node_config.png)

把畫面上顯示的設定內容複製起來，貼到 `config.yml` 檔案中即可（預設位置在 `/etc/pterodactyl/config.yml`）。

### 自動部署

這裡還有一個更省事的做法：自動部署功能會直接產生一組指令，你只要拿去節點伺服器上執行，就能自動完成 Wings 的設定，不用自己手動貼檔案。
