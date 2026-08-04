# 建立自訂 Egg

::: warning
請勿編輯控制面板內建的服務或選項。每次更新時，我們可能會對這些內容進行細微變更，而您所做的修改也會因此遺失。
:::

[[toc]]

首先，您需要建立新的服務。在此情況下，名稱與描述的用途相當直觀。`Folder Name` **必須是未被其他服務使用的唯一名稱**，且只能包含字母、數字、底線與連字號。這個名稱會作為 Daemon 儲存該服務選項的資料夾名稱。

預設啟動指令也是必填項目，但您可以針對個別選項進行變更。

## 建立新的選項

建立服務後，您應該會在頁面右下角看到一個名為 `New Egg` 的按鈕，請按下該按鈕。

![](../../../.vuepress/public/community/config/eggs/Pterodactyl_Create_New_Egg_Select.png)

接著您會進入新的服務選項頁面，大部分的設定都會在此完成。首先，請從 `Associated Nest` 下拉式選單中選取先前建立的服務。

![](../../../.vuepress/public/community/config/eggs/Pterodactyl_Create_New_Egg_Process_Management.png)

接著輸入用於描述此選項的名稱，本例使用 `Widget`。您也需要提供一個**有效的** Docker 映像檔，以及要套用到使用此服務選項之伺服器的啟動指令（如有需要，也可以針對個別伺服器進行調整）。

_Docker 映像檔必須經過專門設計，才能與 Pterodactyl 控制面板搭配使用。_ 詳細資訊請參閱[建立 Docker 映像檔](/community/config/eggs/creating_a_custom_image.md)指南。

## 設定程序管理

這可能是服務選項設定中最重要的步驟，因為此處會告訴 Daemon 如何執行所有操作。

![](../../../.vuepress/public/community/config/eggs/Pterodactyl_Create_New_Egg_Process_Management.png)

您首先會看到的欄位是 `Copy Settings From`。預設選項為 `None`，這是正常且可接受的設定。此下拉式選單會在本文最後說明。

### 停止指令

接著是 `Stop Command`。顧名思義，此欄位應填入用於安全停止該選項的指令。某些遊戲使用 `stop` 或 `end`。部分程式與遊戲沒有指定的停止指令，此時您可以輸入 `^C`，讓 Daemon 傳送 `SIGINT` 以結束程序。

### 記錄儲存

記錄現在完全由 Daemon 處理，並使用 Docker 記錄輸出伺服器的完整輸出內容。設定方式如下：

```json
{}
```

### 設定檔

下一個區塊是較複雜的 `Configuration Files` 設定。Daemon 會在啟動伺服器前處理此區塊，以確保所有必要的設定都已定義並正確設定。

```json
{
    "server.properties": {
        "parser": "properties",
        "find": {
            "server-ip": "0.0.0.0",
            "enable-query": "true",
            "server-port": "{{server.build.default.port}}",
            "query.port": "{{server.build.default.port}}"
        }
    }
}
```

在此範例中，我們告訴 Daemon 讀取 `/home/container` 中的 `server.properties`。在這個區塊內，我們定義了 `parser`，本例使用 `properties`。以下是[有效的解析器](https://github.com/pterodactyl/wings/blob/develop/parser/parser.go#L25-L30)：

- `file`：此解析器會根據行首進行比對，而不是像其他五種解析器一樣比對特定屬性。請盡可能避免使用此解析器。
- `yaml`（支援 `*` 萬用字元）
- `properties`
- `ini`
- `json`（支援 `*` 萬用字元）
- `xml`

定義解析器後，接著定義 `find` 區塊，用來告訴 Daemon 要尋找並替換哪些特定元素。在此範例中，我們提供了 `server.properties` 檔案中的四個項目，並將其替換為指定的值。您可以使用精確值，也可以指定 `server.json` 檔案中的特定伺服器設定。在本例中，我們將預設伺服器連接埠指定給 `server-port` 與 `query.port`。**這些替換字串區分大小寫，且不應包含空格。**

您可以在此列出多個檔案，Daemon 會在啟動伺服器前平行處理這些檔案。使用 `yaml` 或 `json` 時，您可以對元素進行更進階的搜尋。

```json
{
    "config.yml": {
        "parser": "yaml",
        "find": {
            "listeners[0].query_enabled": true,
            "listeners[0].query_port": "{{server.build.default.port}}",
            "listeners[0].host": "0.0.0.0:{{server.build.default.port}}",
            "servers.*.address": {
                "127.0.0.1": "{{config.docker.interface}}",
                "localhost": "{{config.docker.interface}}"
            }
        }
    }
}
```

在此範例中，我們使用 `yaml` 解析器解析 `config.yml`。前面三個 `find` 項目只是為第一個監聽器區塊指定連接埠與 IP 位址。最後一個項目 `servers.*.address` 使用萬用字元比對，會比對 `servers` 區塊中的所有項目，然後尋找這些項目中的每個 `address` 區塊。

::: v-pre
此檔案設定的進階功能之一，是可以針對單一比對行定義多個尋找與替換陳述式。在本例中，我們會尋找 `127.0.0.1` 或 `localhost`，並將其替換為設定檔中定義的 Docker 介面 `{{config.docker.interface}}`。
:::

### 啟動設定

最後要設定的區塊，是使用此服務選項執行之伺服器的 `Start Configuration`。

```json
{
    "done": ")! For help, type "
}
```

在上述範例中，我們將 `done` 定義為完整的一行，或表示伺服器已完成啟動並準備好讓玩家加入的部分行內容。當 Daemon 偵測到此輸出時，就會將伺服器狀態從 `STARTING` 標記為 `ON`。

基本的服務選項設定到此完成。

## 複製設定來源

如上所述，新增選項時會看到獨特的 `Copy Settings From` 下拉式選單。顧名思義，此功能可以讓您從其他選項複製已定義的設定。

![](../../../.vuepress/public/community/config/eggs/Pterodactyl_Create_New_Egg_Copy_Settings_From.png)

在控制面板中，我們會利用此功能複製相似服務選項之間相同的設定，例如許多 Minecraft 選項。

以 `Sponge (SpongeVanilla)` 服務選項為例。

如您所見，它被設定為從 `Vanilla Minecraft` 複製設定。這表示所有留白的欄位都會繼承指定父選項的設定。接著，我們可以定義 Sponge 與 Vanilla 不同的特定 `userInteraction` 行，同時讓其他設定維持不變。

*請注意，`Copy Settings From` 不支援巢狀複製。您只能從單一父選項複製設定，而且該父選項**不得再從其他選項複製設定**。*

## Egg 變數

Egg 變數的一項重要功能，是可以定義特定變數，讓使用者及／或管理員調整不同設定，而無需讓使用者修改啟動指令。若要建立新的變數或編輯現有變數，請前往剛建立的服務選項，然後按下頁面頂端的 `Variables` 分頁。以下將以一個可建立的變數作為範例。

![](../../../.vuepress/public/community/config/eggs/Pterodactyl_Create_New_Egg_Variables.png)

::: v-pre
名稱與描述相當直觀，因此我們直接說明 `Environment Variable` 欄位。此欄位應使用由字母、數字與底線組成的名稱，並且應使用大寫字母。這會成為環境變數的名稱，可在啟動指令中以 `{{WOOZLE_WOO}}` 存取，在檔案修改設定中以 `{{env.WOOZLE_WOO}}` 存取，或在任何 Shell 指令碼中直接使用 `${WOOZLE_WOO}`（此變數會透過環境傳入）。本範例也為此環境變數定義了預設值，但並非必要。
:::

下一個區段是 `Permissions`，這是一個包含兩個選項的下拉式選單：`Users Can View` 與 `Users Can Edit`。

- `Users Can View`：允許使用者在前端查看此欄位，以及該變數目前指定的值。他們也能在啟動指令中看到替換後的值。
- `Users Can Edit`：允許使用者編輯變數值，例如執行 Minecraft 時，用於指定 `server.jar` 檔案名稱的變數。

請謹慎設定這些權限。即使您不指定任何權限，也不代表該值會真正隱藏。熟悉系統的使用者仍然可以取得其伺服器的環境變數。在大多數情況下，這項設定只是將變數從使用者介面中隱藏，然後在 Dockerfile 中使用該變數執行操作，因此使用者是否能看見該值通常並不重要。

最後，您需要定義一些輸入規則，以驗證變數值。在此範例中，我們使用 `required|string|between:1,10`，這表示欄位為 `required`（必填）、必須是 `string`（字串），且長度必須介於 `1` 到 `10` 個字元之間。您可以在 Laravel 網站上查看[所有可用的驗證規則](https://laravel.com/docs/5.6/validation#available-validation-rules)。您也可以使用 `regex:` 規則標記進行以正規表示式為基礎的驗證。例如，[`required|regex:/^([\w\d._-]+)(\.jar)$/`](https://regex101.com/r/k4oEOn/1) 會要求此欄位必填，並比對由字母或數字（`\w\d`）、底線（`_`）、句點（`.`）與連字號（`-`）組成，且以 `.jar` 結尾的內容。

之後，這些變數會在管理伺服器啟動設定時，同時顯示於管理控制面板與前端介面。

![](../../../.vuepress/public/community/config/eggs/Pterodactyl_Create_New_Egg_Startup.png)

## 預設變數清單

預設變數一律可供所有 Egg 使用，無需另外建立。它們可以用於 Egg 啟動指令、安裝指令碼或設定檔解析器。

| 變數                      | 描述                         | 範例                                                        |
| ------------------------- | ---------------------------- | ----------------------------------------------------------- |
| TZ                        | 時區                         | `Etc/UTC`                                                   |
| STARTUP                   | Egg 的啟動指令                | `java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}` |
| SERVER_MEMORY             | 伺服器可用的記憶體，單位為 MB | `512`                                                       |
| SERVER_IP                 | 伺服器的預設 IP 位址          | `127.0.0.1`                                                 |
| SERVER_PORT               | 主要伺服器連接埠              | `27015`                                                     |
| P_SERVER_LOCATION         | 伺服器的位置                  | `Example City`                                              |
| P_SERVER_UUID             | 伺服器的 UUID                 | `539fdca8-4a08-4551-a8d2-8ee5475b50d9`                      |
| P_SERVER_ALLOCATION_LIMIT | 伺服器允許使用的配置數量上限   | `0`                                                         |