# Pterodactyl-TW 繁體中文化版本的發行簽署

[[toc]]

> [!NOTE]
> 本頁說明的是 **Pterodactyl-TW 繁體中文化服務團隊** 自己發行版本的簽署與驗證方式，與 [關於頁面](/project/about.md#發行簽署) 中官方（Pterodactyl 原版）的 SSH 簽署金鑰是兩套完全獨立的機制，請不要混用。若你下載的是官方原版程式，請改用關於頁面上的官方簽署金鑰進行驗證。

## 為什麼要另外簽署

我們在 [Pterodactyl-TW](https://github.com/Pterodactyl-TW) 底下維護 Panel、Wings 的繁體中文化版本，並會在各自的 GitHub Releases 上發布編譯好的執行檔。為了讓大家可以確認下載到的執行檔確實是由我們的 GitHub Actions 建置、未遭第三方竄改，我們對發行的執行檔進行數位簽署。

## 簽署方式：Sigstore/cosign（Keyless 簽署）

我們採用 [Sigstore/cosign](https://www.sigstore.dev/) 的 keyless（無金鑰）簽署機制：

* 簽署流程完全由 GitHub Actions 在發行版本建置時自動執行，透過 GitHub 的 OIDC 身分進行簽署，我們本身不需要保管、也不會保管任何私鑰。
* 每一次簽署都會將憑證與簽章記錄公開發布至 [Rekor 透明日誌](https://docs.sigstore.dev/logging/overview/)，任何人都可以公開查詢、追溯每個發行版本的簽署來源。
* 這套機制目前已套用在 **Wings**，未來 **Panel** 的發行版本也會採用相同方式簽署與發布。

## 如何驗證

1. 先安裝 [cosign](https://docs.sigstore.dev/system_config/installation/)。
2. 從 GitHub Releases 下載執行檔，以及與它同名、副檔名為 `.cosign.bundle` 的簽章綑綁檔案（例如 `wings_linux_amd64` 會附上 `wings_linux_amd64.cosign.bundle`）。
3. 執行以下指令（以 Wings 為例）：

```bash
cosign verify-blob \
  --bundle wings_linux_amd64.cosign.bundle \
  --certificate-identity-regexp "^https://github\.com/Pterodactyl-TW/wings/" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
  wings_linux_amd64
```

若驗證通過，會顯示 `Verified OK`，代表這個檔案確實是由 Pterodactyl-TW 的官方 GitHub Actions 工作流程建置與發布。日後 Panel 發行版本上線後，驗證方式相同，只需將 `--certificate-identity-regexp` 換成對應的 `Pterodactyl-TW/panel` 儲存庫網址即可。

## 透過 go install 安裝

若你是透過 `go install github.com/Pterodactyl-TW/wings@latest` 安裝 Wings，則不需要另外驗證簽章：Go 內建的[模組總和資料庫](https://sum.golang.org/)已經會獨立驗證原始碼的完整性。
