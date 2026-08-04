# 使用掛載

掛載功能可讓管理員將主機檔案系統中的其他目錄掛載到伺服器的容器中。

## Wings 設定

基於安全性考量，節點預設不允許掛載目錄。若要允許掛載某個目錄，必須在 Wings 設定中明確指定。

在 Wings 設定檔（`/etc/pterodactyl/config.yml`）中，使用 `allowed_mounts` 欄位列出可掛載的目錄。
列出的目錄及其所有子目錄都可以被掛載。

```yml
allowed_mounts:
- /example
```

你必須重新啟動 Wings，才能套用設定檔中的變更。

## Panel 設定

你必須在管理用 Panel 中設定掛載，才能讓伺服器使用這些掛載。掛載由節點上的來源路徑，以及容器中的目標路徑組成。

::: tip 容器中的路徑
掛載可以放在 `/home/container` 或其任意子目錄中，也可以掛載到該目錄本身。你可以跨伺服器掛載，例如將伺服器 A 的目錄掛載到伺服器 B。
請注意，欲掛載到的資料夾必須先存在，掛載才能正常運作。
:::

### 建立掛載

1. 在管理用 Panel 中前往 **Mounts**。
2. 建立新的掛載。
3. 依需求填寫詳細資料。
  - **Name**：掛載名稱。
  - **Description**：掛載描述。
  - **Source**：節點機器上資料夾或檔案的絕對路徑。
  - **Target**：掛載至伺服器內的絕對路徑。如果路徑包含 `/home/container`，請事先確認資料夾已存在。
  - **Read Only**：使用此掛載的伺服器是否只能讀取。
  - **User Mountable**：是否允許使用者自行掛載此掛載。
4. 建立掛載後，必須新增可使用此掛載的 **Eggs** 與 **Nodes**。

:::warning 多台伺服器使用的掛載
使用相同掛載的伺服器，只有在位於同一節點時才會**共享**其內容。掛載不會在節點之間同步。
:::

### 將掛載指派給伺服器

1. 在管理用 Panel 中前往要使用掛載的伺服器。
2. 前往掛載頁面。
3. 點選 **+** 按鈕。
4. 重新啟動伺服器。

掛載中的檔案應該會出現在容器的目標路徑。你可以暫時將伺服器啟動命令改為 `ls <mount target>`；如果設定正確，
該命令應會輸出掛載的內容。

:::warning 無法存取掛載
掛載不會出現在 Panel 的檔案管理器中，也無法透過 SFTP 存取。不過，伺服器本身仍能查看並使用掛載。
:::

### 掛載範例

The example mount below is stored in the path `/var/lib/pterodactyl/mounts`, which we add to the Wings `config.yml`

```yml
allowed_mounts:
  - /var/lib/pterodactyl/mounts
```

![](./../.vuepress/public/gmod_mount_example.png)
