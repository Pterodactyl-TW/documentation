# 建立自訂 Egg

::: warning
請勿編輯控制面板內建的服務或選項。每次更新時，我們可能會對這些內容進行細微變更，你所做的修改也會因此遺失。
:::

[[toc]]

首先，你需要建立一個新的服務（Nest）。這裡的名稱與描述都很直觀，照字面填寫即可，唯一要注意的是 `Folder Name`：這個名稱**必須是其他服務都沒用過的唯一名稱**，而且只能包含字母、數字、底線與連字號，因為 Daemon 會直接拿它當作資料夾名稱，用來存放這個服務底下的所有選項。

另外，預設啟動指令也是必填欄位，不過別擔心一開始沒想好，之後你還是可以針對個別選項再調整。

## 建立新的選項

建立好服務之後，把畫面往下滑到右下角，你會看到一個 `New Egg` 按鈕，按下去就對了。

![](../../../.vuepress/public/community/config/eggs/Pterodactyl_Create_New_Egg_Select.png)

接下來會進入新的服務選項頁面，大部分的設定都會在這裡完成。第一步，先從 `Associated Nest` 下拉式選單中，選取你剛剛建立的服務。

![](../../../.vuepress/public/community/config/eggs/Pterodactyl_Create_New_Egg_Process_Management.png)

接著輸入一個用來描述這個選項的名稱，這裡示範用 `Widget`。除此之外，你還需要準備兩樣東西：一個**有效的** Docker 映像檔，以及套用到使用此服務選項之伺服器的啟動指令（如果之後有需要，也可以針對個別伺服器再做調整）。

這裡要特別提醒的是，_Docker 映像檔必須經過專門設計，才能與 Pterodactyl 控制面板搭配使用_，不能隨便拿一個現成映像檔就套用。詳細作法請參考[建立 Docker 映像檔](/community/config/eggs/creating_a_custom_image.md)這篇指南。

## 設定程序管理

這一步可以說是整個服務選項設定中最關鍵的部分，因為它會告訴 Daemon 該如何啟動、監控、關閉這個伺服器程序。

![](../../../.vuepress/public/community/config/eggs/Pterodactyl_Create_New_Egg_Process_Management.png)

進入頁面後，你會先看到 `Copy Settings From` 欄位。預設值是 `None`，這是正常且可以接受的設定，先不用理它，這個下拉式選單的用途會在本文最後說明。

### 停止指令

再來是 `Stop Command`，顧名思義就是用來安全停止這個選項的指令。有些遊戲會用 `stop` 或 `end` 之類的字，但也有些程式或遊戲根本沒有內建停止指令，遇到這種情況，你可以填 `^C`，讓 Daemon 送出 `SIGINT` 訊號來結束程序。

### 記錄儲存

記錄（logging）現在完全交給 Daemon 處理，它會透過 Docker 記錄下伺服器的完整輸出內容，所以這個區塊的設定其實很單純：

```json
{}
```

### 設定檔

接下來是比較複雜的一塊，`Configuration Files`。簡單來說，Daemon 會在啟動伺服器前先處理這個區塊，確保所有必要的設定值都已經定義好、也都設定正確，才會真正把伺服器跑起來。

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

在這個範例中，我們告訴 Daemon 去讀取 `/home/container` 目錄下的 `server.properties` 檔案。這個區塊裡的 `parser` 欄位，本例用的是 `properties`。目前[有效的解析器](https://github.com/pterodactyl/wings/blob/develop/parser/parser.go#L25-L30)有以下幾種：

- `file`：這個解析器是根據行首來比對，而不是像其他解析器那樣針對特定屬性比對，建議盡量避免使用。
- `yaml`（支援 `*` 萬用字元）
- `properties`
- `ini`
- `json`（支援 `*` 萬用字元）
- `xml`

定義好解析器之後，接著要設定 `find` 區塊，這裡是用來告訴 Daemon 要在檔案中尋找哪些特定項目、並替換成什麼值。以上面的範例來說，我們指定了 `server.properties` 裡的四個項目，並把它們替換成指定的值；你可以直接寫死一個固定值，也可以引用 `server.json` 檔案中對應的伺服器設定，本例就是把預設連接埠同時指定給 `server-port` 與 `query.port`。**這裡要提醒一下，這些替換字串是區分大小寫的，而且不能包含空格。**

這個區塊可以一次列出多個檔案，Daemon 會在伺服器啟動前平行處理它們。如果使用的是 `yaml` 或 `json` 解析器，還能做更進階的元素搜尋，例如：

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

這個範例是用 `yaml` 解析器來解析 `config.yml`。前三個 `find` 項目，單純是替第一個監聽器區塊指定連接埠與 IP 位址；最後一個項目 `servers.*.address` 則用了萬用字元比對，效果是比對 `servers` 區塊底下所有的項目，然後在每個項目裡找出 `address` 這個欄位。

::: v-pre
這種設定檔的其中一項進階用法，是可以針對同一行比對定義多組尋找與替換陳述式。像本例就是同時尋找 `127.0.0.1` 或 `localhost`，然後把它們都替換成設定檔中定義的 Docker 介面 `{{config.docker.interface}}`。
:::

### 啟動設定

最後一個要設定的區塊，是這個服務選項執行伺服器時所用的 `Start Configuration`。

```json
{
    "done": ")! For help, type "
}
```

以上面這個範例來說，我們把 `done` 定義成一段完整的字串（或是某一行輸出中的片段），用來代表伺服器已經啟動完成、可以讓玩家加入了。當 Daemon 偵測到輸出內容出現這段文字時，就會把伺服器狀態從 `STARTING` 切換成 `ON`。

到這裡，基本的服務選項設定就完成了。

## 複製設定來源

前面提到的 `Copy Settings From` 下拉式選單，其實是個蠻方便的功能，它可以讓你直接從其他選項複製已經定義好的設定，不用每次都重新設定一遍。

![](../../../.vuepress/public/community/config/eggs/Pterodactyl_Create_New_Egg_Copy_Settings_From.png)

在官方控制面板中，這個功能常常用來讓相似的服務選項共用同一套設定，例如許多 Minecraft 相關的選項就是這樣處理的。

以 `Sponge (SpongeVanilla)` 這個服務選項為例：

如你所見，它被設定為從 `Vanilla Minecraft` 複製設定，這代表所有留白沒填的欄位，都會直接繼承自這個父選項。這樣一來，我們就只需要定義 Sponge 與 Vanilla 不同的那幾行 `userInteraction`，其他設定完全不用動。

*這裡有個小提醒，`Copy Settings From` 不支援巢狀複製，也就是你只能從單一父選項複製設定，而且該父選項**本身不能再從其他選項複製設定**。*

## Egg 變數

Egg 變數有個很重要的功能，就是可以定義特定變數，讓使用者或管理員自行調整不同設定，而不需要直接去改動啟動指令。想建立新變數或編輯現有變數，先進入剛才建立的服務選項，然後按下頁面頂端的 `Variables` 分頁。接下來以一個實際可建立的變數為例示範一次。

![](../../../.vuepress/public/community/config/eggs/Pterodactyl_Create_New_Egg_Variables.png)

::: v-pre
名稱與描述欄位相當直觀，這裡直接跳到重點：`Environment Variable` 欄位。這個欄位要用字母、數字與底線組成的名稱，並建議一律使用大寫字母。填好之後，它就會成為環境變數的名稱，你可以在啟動指令中用 `{{WOOZLE_WOO}}` 存取，在檔案修改設定中用 `{{env.WOOZLE_WOO}}` 存取，或者直接在任何 Shell 指令碼中用 `${WOOZLE_WOO}` 存取（因為這個變數會透過環境變數傳入）。本範例也順便設定了這個環境變數的預設值，不過這不是必要項目。
:::

下一個區段是 `Permissions`，這是一個包含兩個選項的下拉式選單：`Users Can View` 與 `Users Can Edit`。

- `Users Can View`：允許使用者在前端看到這個欄位，以及變數目前設定的值；他們也能在啟動指令中看到替換後的實際值。
- `Users Can Edit`：允許使用者自行編輯變數的值，例如執行 Minecraft 時，用來指定 `server.jar` 檔案名稱的那個變數。

這裡要提醒一下，這些權限務必謹慎設定。即使你把某個變數的權限都關掉，也不代表這個值真的完全藏得住，熟悉系統的使用者，還是有辦法拿到自己伺服器的環境變數。所以大多數情況下，這項設定的實際作用只是把變數從使用者介面上隱藏起來，而真正的用途是在 Dockerfile 中拿這個變數做事，使用者看不看得到值，通常沒那麼重要。

最後，你還需要定義一些輸入規則，用來驗證變數值是否合法。以本範例的 `required|string|between:1,10` 來說，意思是這個欄位為 `required`（必填）、必須是 `string`（字串），而且長度要介於 `1` 到 `10` 個字元之間。完整的驗證規則清單可以參考 Laravel 官方文件中的[所有可用驗證規則](https://laravel.com/docs/5.6/validation#available-validation-rules)。除此之外，你也可以用 `regex:` 規則標記做以正規表示式為基礎的驗證，例如 [`required|regex:/^([\w\d._-]+)(\.jar)$/`](https://regex101.com/r/k4oEOn/1)，這條規則會要求欄位必填，並且比對由字母或數字（`\w\d`）、底線（`_`）、句點（`.`）與連字號（`-`）組成，且以 `.jar` 結尾的內容。

設定完成後，這些變數就會同時出現在管理控制面板與前端介面中，供人在管理伺服器啟動設定時使用。

![](../../../.vuepress/public/community/config/eggs/Pterodactyl_Create_New_Egg_Startup.png)

## 預設變數清單

以下這些預設變數，所有 Egg 都可以直接拿來用，不需要另外建立。它們可以用在 Egg 的啟動指令、安裝指令碼，或是設定檔解析器中。

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
