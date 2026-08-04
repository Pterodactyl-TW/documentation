# 建置 Wings

:::warning
**請勿在正式環境的節點上執行以下步驟。**
:::

Wings 使用 Go 語言編寫，因此您可以輕鬆地自行修改、編譯，並發布自訂的執行檔。本指南將說明自行建置 Wings 所需的步驟。

不過，本指南不會說明 Wings 各項功能的程式碼位置，也不會介紹為了達成特定結果所需進行的修改。如果您想修改 Wings，必須具備 Go 語言的相關知識。

建置 Go 程式相當簡單，Wings 也是如此。Go 支援跨平台，但目前 Wings 僅支援 Linux。要為 Linux 編譯 Wings，最簡單的方法是在 Linux 電腦上執行相關指令。

## 建置需求

編譯 Wings 需要使用最新版本的 Go。最低支援版本可在 [go.mod](https://github.com/pterodactyl/wings/blob/develop/go.mod) 檔案頂部找到。如需安裝 Go 的協助，請參閱[官方安裝說明](https://golang.org/doc/install)。

## 建置

在本機複製的 Wings 儲存庫目錄中執行以下指令，將 Wings 編譯成執行檔：

```bash
go build
```

完成後，您應該會在 Wings 目錄中看到名為 `wings` 的執行檔。

## 安裝新的執行檔

:::tip 需要 Root 權限
以下部分指令需要 Root 權限。如果您目前不是以 Root 身分登入，請在指令前加上 `sudo`。
:::

1. 備份目前安裝的 Wings

```bash
mv /usr/local/bin/wings /usr/local/bin/wings-backup
```

2. 將新的執行檔放置到 `/usr/local/bin`

```bash
cp ./wings /usr/local/bin
```

3. 重新啟動 Wings

```bash
systemctl restart wings
```

## 疑難排解

如果 Wings 服務無法正常啟動，您可以嘗試在主控台中直接啟動 Wings：

```bash
wings --debug
```

請記得先停止系統服務，完成測試後再重新啟用。

```bash
systemctl stop wings

systemctl start wings
```