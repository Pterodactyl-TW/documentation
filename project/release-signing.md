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

顯示 `Verified OK` 就沒問題，可以繼續安裝。想知道背後在幹嘛，往下看。

## 為什麼要簽署

Panel 和 Wings 掌控你伺服器的完整權限，下載到被竄改過的版本會是很嚴重的事。我們在建置每一個發行版本時都會簽署，讓你能在安裝前先確認這個檔案真的是我們發布的，而不是被誰動過手腳。

## 用的是 Sigstore/cosign

我們用 [Sigstore/cosign](https://www.sigstore.dev/) 做 keyless 簽署，跟傳統 GPG/SSH 簽署最大的不同是不需要管理金鑰：GitHub Actions 建置時，用 GitHub 本身核發的身分憑證跟 Sigstore 換一張幾分鐘就會過期的憑證，簽完就丟，沒有金鑰可以外洩或被偷。每次簽署都會公開記錄到 [Rekor 透明日誌](https://docs.sigstore.dev/logging/overview/)，你可以到 [search.sigstore.dev](https://search.sigstore.dev/) 查到每個版本的簽署紀錄。

Panel 和 Wings 的發行版本都用這套機制簽署。

## 如何驗證

### 1. 安裝 cosign

```bash
# macOS
brew install cosign

# Linux（amd64）
curl -LO https://github.com/sigstore/cosign/releases/latest/download/cosign-linux-amd64
sudo install -m 0755 cosign-linux-amd64 /usr/local/bin/cosign
```

其他系統／架構參考 [cosign 官方安裝說明](https://docs.sigstore.dev/system_config/installation/)。

### 2. 下載檔案

除了主檔案，記得連同 `.cosign.bundle` 一起下載：

| 專案 | 檔案 | 簽章檔 |
|---|---|---|
| Wings | `wings_linux_amd64` | `wings_linux_amd64.cosign.bundle` |
| Wings | `wings_linux_arm64` | `wings_linux_arm64.cosign.bundle` |
| Panel | `panel.tar.gz` | `panel.tar.gz.cosign.bundle` |

### 3. 驗證

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

`--certificate-identity-regexp` 限定簽署身分要來自 Pterodactyl-TW 對應的 repo，`--certificate-oidc-issuer` 限定要由 GitHub Actions 核發，兩個都是為了防止有人拿別處簽出來的憑證冒充。

顯示 `Verified OK` 就代表檔案沒被動過，也確實是我們的 GitHub Actions 建置發布的。

## 驗證失敗怎麼辦

沒有出現 `Verified OK` 的話先別安裝，檢查看看：

* 檔案是不是沒下載完整，重新下載一次
* 主檔案跟 `.cosign.bundle` 是不是同一個 Release 版本
* 是不是從第三方鏡像或論壇附件下載的——請只從 [Pterodactyl-TW 的 GitHub Releases](https://github.com/Pterodactyl-TW) 下載

排除以上狀況還是驗證失敗，麻煩到 [Discord](https://pterodactyl.tw/discord) 跟我們說一聲。

## 透過 go install 安裝

用 `go install github.com/Pterodactyl-TW/wings@latest` 安裝 Wings 的話不需要另外驗證，Go 內建的[模組總和資料庫](https://sum.golang.org/)已經會驗證原始碼完整性。
