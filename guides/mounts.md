---
meta:
- property: og:title
  content: 使用掛載 | Pterodactyl 繁體中文文件
- property: og:description
  content: 掛載功能讓管理員可以把主機檔案系統上的其他目錄，掛載進伺服器的容器裡使用。
- property: og:image
  content: https://pterodactyl.tw/og/guides_mounts.png
- property: og:image:width
  content: '1200'
- property: og:image:height
  content: '630'
- name: twitter:title
  content: 使用掛載 | Pterodactyl 繁體中文文件
- name: twitter:description
  content: 掛載功能讓管理員可以把主機檔案系統上的其他目錄，掛載進伺服器的容器裡使用。
- name: twitter:image
  content: https://pterodactyl.tw/og/guides_mounts.png
---
# 使用掛載

掛載功能讓管理員可以把主機檔案系統上的其他目錄，掛載進伺服器的容器裡使用。

## Wings 設定

出於安全性考量，節點預設是不允許掛載任何目錄的,想要開放掛載某個目錄，一定要在 Wings 設定裡明確指定才行。

做法是打開 Wings 的設定檔（`/etc/pterodactyl/config.yml`），在 `allowed_mounts` 欄位裡列出允許掛載的目錄。這裡列出的目錄，連同它底下的所有子目錄都會一併開放掛載。

```yml
allowed_mounts:
- /example
```

改完設定檔後別忘了重新啟動 Wings，這樣變更才會生效。

## Panel 設定

光是在 Wings 允許還不夠，你還得在管理用 Panel 裡把掛載設定好，伺服器才能真正用上它。一個掛載，簡單來說就是由「節點上的來源路徑」和「容器內的目標路徑」這兩者組合而成。

::: tip 容器中的路徑
掛載可以放在 `/home/container` 底下的任意子目錄，也可以直接掛載到這個目錄本身。甚至你還能跨伺服器掛載，例如把伺服器 A 的目錄掛給伺服器 B 用。這裡要注意的是，目標資料夾必須事先存在，掛載才會正常運作。
:::

### 建立掛載

1. 在管理用 Panel 中前往 **Mounts**。
2. 建立新的掛載。
3. 依需求填寫詳細資料。
  - **Name（名稱）**：掛載名稱。
  - **Description（描述）**：掛載描述。
  - **Source（來源）**：節點機器上資料夾或檔案的絕對路徑。
  - **Target（目標）**：掛載至伺服器內的絕對路徑。如果路徑包含 `/home/container`，請事先確認資料夾已存在。
  - **Read Only（唯讀）**：使用此掛載的伺服器是否只能讀取。
  - **User Mountable（使用者可掛載）**：是否允許使用者自行掛載此掛載。
4. 建立掛載後，必須新增可使用此掛載的 **Eggs** 與 **Nodes**。

:::warning 多台伺服器使用的掛載
小提醒：使用同一個掛載的伺服器，只有彼此位在同一個節點上時，內容才會**共享**。掛載並不會跨節點自動同步。
:::

### 將掛載指派給伺服器

1. 在管理用 Panel 中前往要使用掛載的伺服器。
2. 前往掛載頁面。
3. 點選 **+** 按鈕。
4. 重新啟動伺服器。

設定完成後，掛載裡的檔案就會出現在容器的目標路徑下。想確認有沒有掛好，可以把伺服器的啟動指令暫時改成 `ls <mount target>`；如果一切設定正確，執行結果應該會列出掛載內容。

:::warning 無法存取掛載
這裡要留意，掛載不會顯示在 Panel 的檔案管理器裡，也沒辦法透過 SFTP 存取到。不過不用擔心，伺服器本身仍然可以正常讀取並使用掛載的內容,只是管理介面看不到而已。
:::

### 掛載範例

下面舉個實際的例子：掛載內容存放在 `/var/lib/pterodactyl/mounts` 這個路徑，我們把它加進 Wings 的 `config.yml` 裡。

```yml
allowed_mounts:
  - /var/lib/pterodactyl/mounts
```

![](./../.vuepress/public/gmod_mount_example.png)
