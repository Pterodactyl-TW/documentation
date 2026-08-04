# 升級 Wings

升級 Wings 的流程很簡單，通常不到一分鐘即可完成。

## Wings 版本需求

每個版本的 Pterodactyl Panel 都有相對應的 Wings 最低版本需求。請參考下表了解版本的對應關係。
在大多數情況下，Wings 的主要版本應與 Panel 版本一致。

| Panel Version | Wings Version | Supported |
| ------------- | ------------- | --------- |
| 1.0.x         | 1.0.x         |           |
| 1.1.x         | 1.1.x         |           |
| 1.2.x         | 1.2.x         |           |
| 1.3.x         | 1.3.x         |           |
| 1.4.x         | 1.4.x         |           |
| 1.5.x         | 1.4.x         |           |
| 1.6.x         | 1.4.x         |           |
| 1.7.x         | 1.5.x         |           |
| 1.8.x         | 1.6.x         |           |
| 1.9.x         | 1.6.x         |           |
| 1.10.x        | 1.7.x         |           |
| **1.11.x**    | **1.11.x**    |           |
| **1.12.x**    | **1.12.x**    | ✅         |

*注意：Wings 沒有 1.8.x、1.9.x 或 1.10.x 發行版本。*

## 下載更新後的執行檔

首先，將更新後的 Wings 執行檔下載至 `/usr/local/bin`。你需要暫時停止 Wings，但_不會_影響正在執行的伺服器。

``` bash
systemctl stop wings
curl -L -o /usr/local/bin/wings "https://github.com/pterodactyl/wings/releases/latest/download/wings_linux_$([[ "$(uname -m)" == "x86_64" ]] && echo "amd64" || echo "arm64")"
chmod u+x /usr/local/bin/wings
```

## 重新啟動程序

最後，重新啟動 Wings 程序。正在執行的伺服器不會受到影響，與該執行個體的現有連線也會自動重新連線。

``` bash
systemctl restart wings
```
