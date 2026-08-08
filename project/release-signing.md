# 發行簽署

[[toc]]

::: tip 與官方簽署金鑰無關
本頁說明的是 **Pterodactyl-TW 繁體中文化服務團隊** 自己發行版本的簽署與驗證方式，與 [關於頁面](/project/about.md#發行簽署) 中官方（Pterodactyl 原版）的 SSH 簽署金鑰是兩套完全獨立的機制，請不要混用。若你下載的是官方原版程式，請改用關於頁面上的官方簽署金鑰進行驗證。
:::

## 快速開始

裝好 [cosign](https://docs.sigstore.dev/system_config/installation/) 後，三行指令搞定（以 Panel 為例，Wings 把檔名和 repo 網址換掉即可）：

```bash
curl -LO https://github.com/Pterodactyl-TW/panel/releases/latest/download/panel.tar.gz
curl -LO https://github.com/Pterodactyl-TW/panel/releases/latest/download/panel.tar.gz.cosign.bundle
cosign verify-blob \
  --bundle panel.tar.gz.cosign.bundle \
  --certificate-identity-regexp "^https://github\.com/Pterodactyl-TW/panel/" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  panel.tar.gz
```

顯示 `Verified OK` 就代表檔案沒問題，可以繼續安裝。想知道這是在驗證什麼，往下看。

## 為什麼要驗證

Panel 和 Wings 掌管你伺服器的完整權限。如果安裝到的是被動過手腳的版本，等於把伺服器直接交給別人控制。簽署跟驗證就是讓你在安裝前，先確認手上這個檔案跟我們發布的一模一樣，沒有人在中間偷偷改過內容。

## 怎麼確保沒有人能偽造

比較舊式的做法是開發者自己保管一把私鑰，每次發布就用這把鑰匙簽名，大家再用對應的公鑰驗證。問題是這把私鑰一旦外洩或被偷，別人就能冒充我們簽出「看起來合法」的假檔案。

我們用的 [Sigstore/cosign](https://www.sigstore.dev/) 換了一種做法：**每次發布都用一張用完即丟的臨時憑證**，而不是一把長期保管的鑰匙。GitHub Actions 在建置的當下，會拿 GitHub 核發的身分證明去跟 Sigstore 換一張只有幾分鐘效期的憑證，簽完名這張憑證就失效了，沒有東西可以外洩或被偷。每一次簽署也都會公開留下紀錄在 [Rekor 透明日誌](https://docs.sigstore.dev/logging/overview/)，任何人都能上 [search.sigstore.dev](https://search.sigstore.dev/) 查證某個版本是不是真的出自我們的 GitHub Actions。

Panel 和 Wings 的發行版本都是用這套方式簽署的。

## 如何驗證

### 1. 安裝 cosign

```bash
# macOS
brew install cosign

# Linux（amd64）
curl -LO https://github.com/sigstore/cosign/releases/latest/download/cosign-linux-amd64
sudo install -m 0755 cosign-linux-amd64 /usr/local/bin/cosign
```

其他系統／架構請參考 [cosign 官方安裝說明](https://docs.sigstore.dev/system_config/installation/)。

### 2. 下載檔案

除了主檔案，記得把同名、副檔名為 `.cosign.bundle` 的簽章檔也一起下載——這張憑證就是拿來證明檔案沒被改過的：

| 專案 | 檔案 | 簽章檔 |
|---|---|---|
| Wings | `wings_linux_amd64` | `wings_linux_amd64.cosign.bundle` |
| Wings | `wings_linux_arm64` | `wings_linux_arm64.cosign.bundle` |
| Panel | `panel.tar.gz` | `panel.tar.gz.cosign.bundle` |

### 3. 執行驗證

```bash
# Wings
cosign verify-blob \
  --bundle wings_linux_amd64.cosign.bundle \
  --certificate-identity-regexp "^https://github\.com/Pterodactyl-TW/wings/" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  wings_linux_amd64

# Panel
cosign verify-blob \
  --bundle panel.tar.gz.cosign.bundle \
  --certificate-identity-regexp "^https://github\.com/Pterodactyl-TW/panel/" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  panel.tar.gz
```

指令裡的兩個網址是拿來確認「這張憑證是不是真的來自 Pterodactyl-TW，而且是 GitHub Actions 發的」，避免有人拿別人 repo 簽出來的憑證來魚目混珠。

看到 `Verified OK` 就代表這個檔案沒被改過，也確實是我們自己建置發布的。

## 驗證失敗怎麼辦

如果沒看到 `Verified OK`，**先不要安裝**，照這個順序檢查：

1. 檔案是不是沒下載完整？重新下載一次。
2. 主檔案跟 `.cosign.bundle` 是不是同一個 Release 版本下載的？兩個必須配對。
3. 是不是從論壇、第三方鏡像站下載的？請一律只從 [Pterodactyl-TW 的官方 GitHub Releases](https://github.com/Pterodactyl-TW) 下載。

以上都排除了還是驗證失敗，代表可能真的有問題，麻煩到 [Discord](https://pterodactyl.tw/discord) 跟我們說一聲。

## 透過 go install 安裝

用 `go install github.com/Pterodactyl-TW/wings@latest` 安裝 Wings 的話不需要另外驗證——Go 內建的[模組總和資料庫](https://sum.golang.org/)已經會自動驗證原始碼有沒有被竄改。
