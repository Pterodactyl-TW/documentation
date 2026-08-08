# 發行簽署

[[toc]]

::: tip 與官方簽署金鑰無關
本頁說明的是 **Pterodactyl-TW 繁體中文化服務團隊** 自己發行版本的簽署與驗證方式，與 [關於頁面](/project/about.md#發行簽署) 中官方（Pterodactyl 原版）的 SSH 簽署金鑰是兩套完全獨立的機制，請不要混用。若你下載的是官方原版程式，請改用關於頁面上的官方簽署金鑰進行驗證。
:::

## 快速開始

已經裝好 [cosign](https://docs.sigstore.dev/system_config/installation/) 的話，三個指令就能驗證完畢（以 Panel 為例，Wings 只要把檔名跟 repo 網址換掉）：

```bash
curl -LO https://github.com/Pterodactyl-TW/panel/releases/latest/download/panel.tar.gz
curl -LO https://github.com/Pterodactyl-TW/panel/releases/latest/download/panel.tar.gz.cosign.bundle
cosign verify-blob \
  --bundle panel.tar.gz.cosign.bundle \
  --certificate-identity-regexp "^https://github\.com/Pterodactyl-TW/panel/" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  panel.tar.gz
```

看到 `Verified OK` 就代表沒問題，可以繼續安裝。看不懂上面在做什麼，或想知道背後的原理，往下看。

## 為什麼要另外簽署

我們在 [Pterodactyl-TW](https://github.com/Pterodactyl-TW) 底下維護 Panel、Wings 的繁體中文化版本，並會在各自的 GitHub Releases 上發布編譯好的執行檔。伺服器管理面板跟守護程式握有你伺服器的完整控制權，如果下載到的檔案在傳輸過程中被竄改、或來源根本不是我們，後果會很嚴重。數位簽署讓你能在安裝前，用一行指令自行確認：

* 這個檔案的位元組**完全沒有被修改過**（雜湊比對）。
* 這個檔案**真的是由 Pterodactyl-TW 官方的 GitHub Actions** 建置出來的，而不是別人冒充上傳的。

## 簽署技術：Sigstore/cosign

我們採用 [Sigstore/cosign](https://www.sigstore.dev/) 的 **keyless（無金鑰）**簽署機制，這跟傳統 GPG/SSH 簽署有一個關鍵差異：**沒有一把長期存在、需要被保管好的私鑰**。

運作方式簡單說是這樣：

1. 每次發行版本建置時，GitHub Actions 會用 GitHub 本身核發的一次性 OIDC 身分憑證去跟 Sigstore 换一張**短效憑證**（通常幾分鐘就過期）。
2. 用這張短效憑證對發行檔案簽名，簽完憑證跟金鑰就直接丟棄，不會有人（包含我們自己）持有任何長期私鑰。
3. 這次簽署的憑證與簽章會被公開寫入 [Rekor 透明日誌](https://docs.sigstore.dev/logging/overview/)，任何人都可以到 [search.sigstore.dev](https://search.sigstore.dev/) 公開查詢、比對每個發行版本是不是真的出自我們的 GitHub Actions 工作流程，無法被事後竄改或抵賴。

好處是：不存在「私鑰外洩」這種風險——因為根本沒有私鑰需要保護；驗證時你只需要相信 GitHub 的身分認證機制，而不用另外想辦法安全地取得、保管我們的公鑰。

這套機制目前已套用在 **Wings** 與 **Panel**，兩者的發行版本都採用相同方式簽署與發布。

## 如何驗證

### 1. 安裝 cosign

依你的作業系統選一種：

```bash
# macOS (Homebrew)
brew install cosign

# Linux（下載官方預編譯執行檔，以 amd64 為例）
curl -LO https://github.com/sigstore/cosign/releases/latest/download/cosign-linux-amd64
sudo install -m 0755 cosign-linux-amd64 /usr/local/bin/cosign

# 其他系統／架構請參考官方安裝說明
```
完整選項請參考 [cosign 官方安裝說明](https://docs.sigstore.dev/system_config/installation/)。

### 2. 下載檔案與對應的簽章綑綁檔

從 GitHub Releases 下載你要的檔案，**以及與它同名、副檔名為 `.cosign.bundle` 的簽章綑綁檔案**：

| 專案 | 執行檔／發行檔 | 對應的簽章檔 |
|---|---|---|
| Wings | `wings_linux_amd64` | `wings_linux_amd64.cosign.bundle` |
| Wings | `wings_linux_arm64` | `wings_linux_arm64.cosign.bundle` |
| Panel | `panel.tar.gz` | `panel.tar.gz.cosign.bundle` |

兩個檔案缺一不可——只有簽章檔沒有意義，沒有簽章檔就沒辦法驗證。

### 3. 執行驗證指令

```bash
# 以 Wings 為例
cosign verify-blob \
  --bundle wings_linux_amd64.cosign.bundle \
  --certificate-identity-regexp "^https://github\.com/Pterodactyl-TW/wings/" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  wings_linux_amd64

# 以 Panel 為例
cosign verify-blob \
  --bundle panel.tar.gz.cosign.bundle \
  --certificate-identity-regexp "^https://github\.com/Pterodactyl-TW/panel/" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  panel.tar.gz
```

三個參數分別代表什麼：

* `--bundle`：這次簽署產生的憑證＋簽章綑綁檔，就是上一步下載的 `.cosign.bundle`。
* `--certificate-identity-regexp`：驗證這份簽署的身分**確實來自** `Pterodactyl-TW` 底下對應的 repo（而不是任何隨便一個 GitHub Actions），防止有人拿別的 repo 簽出來的憑證魚目混珠。
* `--certificate-oidc-issuer`：限定簽署身分必須是由 GitHub Actions 核發，排除其他來源冒充的憑證。

### 4. 確認結果

驗證通過會顯示：

```text
Verified OK
```

代表這個檔案**位元組完全沒被動過**，而且**確實由 Pterodactyl-TW 的 GitHub Actions 建置與發布**，可以放心繼續安裝流程。

## 驗證失敗怎麼辦

如果指令回報錯誤（沒有出現 `Verified OK`，或直接顯示 `error: no matching signatures` 之類的訊息），**請不要執行或安裝這個檔案**。常見原因：

* 下載到一半沒下載完整（檔案不完整），重新下載一次再試。
* `.cosign.bundle` 跟主檔案的版本對不上（例如用舊版的簽章檔去驗證新版檔案），確認兩個檔案是**同一次 Release** 下載的。
* 檔案來源不是 GitHub Releases 本身（例如從第三方鏡像站、論壇附件下載），請一律只從 [Pterodactyl-TW 的官方 GitHub Releases](https://github.com/Pterodactyl-TW) 下載。

如果從官方 Release 頁面下載、檔案也是同一版本配對，卻依然驗證失敗，代表可能真的有問題，歡迎到 [Discord](https://pterodactyl.tw/discord) 回報給我們。

## 透過 go install 安裝

若你是透過 `go install github.com/Pterodactyl-TW/wings@latest` 安裝 Wings，則不需要另外驗證簽章：Go 內建的[模組總和資料庫](https://sum.golang.org/)已經會獨立驗證原始碼的完整性。
