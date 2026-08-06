# 建置 Wings

:::warning
**請勿在正式環境的節點上執行以下步驟。**
:::

Wings 是用 Go 語言寫的，這帶來一個好處：你可以輕鬆地自行修改程式碼、重新編譯，甚至發布自己客製化的執行檔。這篇指南會帶你走一遍自行建置 Wings 需要的步驟。

不過先說在前面，這篇指南不會逐一介紹 Wings 各項功能對應的程式碼位置，也不會教你要改哪裡才能達成某個特定效果。換句話說，如果你想動手修改 Wings 的行為，還是得具備一定的 Go 語言基礎才行。

好消息是，建置 Go 程式本身相當簡單，Wings 也不例外。雖然 Go 語言支援跨平台編譯，但目前 Wings 只支援 Linux，所以最省事的做法，就是直接在一台 Linux 電腦上執行編譯指令。

## 建置需求

編譯 Wings 之前，記得先裝好最新版本的 Go。至於最低支援的版本號，可以在 [go.mod](https://github.com/Pterodactyl-TW/wings/blob/develop/go.mod) 檔案最上方找到。如果還不知道怎麼安裝 Go，可以參考[官方安裝說明](https://golang.org/doc/install)。

## 建置

準備好 Go 環境後，切換到本機複製的 Wings 儲存庫目錄，執行以下指令就能把 Wings 編譯成執行檔：

```bash
go build
```

編譯完成後，你應該會在 Wings 目錄底下看到一個叫 `wings` 的執行檔，這就是編譯好的成果。

## 安裝新的執行檔

:::tip 需要 Root 權限
接下來有幾個步驟需要 Root 權限才能執行。如果你目前不是以 Root 身分登入，記得在指令前面加上 `sudo`。
:::

編好執行檔之後，接下來要把它換上去正式生效，建議照順序一步一步來，比較不容易出錯。

1. 先備份目前正在使用的 Wings，這樣萬一新版本有問題，還能隨時退回去

```bash
mv /usr/local/bin/wings /usr/local/bin/wings-backup
```

2. 把剛剛編好的新執行檔放到 `/usr/local/bin`

```bash
cp ./wings /usr/local/bin
```

3. 最後重新啟動 Wings，讓新版本正式上線

```bash
systemctl restart wings
```

## 疑難排解

如果重啟後發現 Wings 服務怎麼樣都起不來，可以試著在主控台中直接手動啟動它，這樣能看到完整的除錯輸出，方便找出問題所在：

```bash
wings --debug
```

這裡有個小提醒，測試前記得先停掉系統服務，免得兩個 Wings 程序互相打架；測試完之後，也別忘了把系統服務重新啟用回去。

```bash
systemctl stop wings

systemctl start wings
```
