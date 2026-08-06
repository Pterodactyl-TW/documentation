# 升級 Wings

好消息是，升級 Wings 其實非常簡單，整個流程通常一分鐘內就能搞定。

## Wings 版本需求

每一個 Pterodactyl Panel 版本，都對應著一個 Wings 的最低需求版本，可以參考下表確認兩者的對應關係。一般來說，Wings 的主要版本號會跟 Panel 保持一致。

| Panel 版本     | Wings 版本     | 是否支援   |
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

*小提醒：Wings 並沒有發行過 1.8.x、1.9.x 或 1.10.x 這幾個版本。*

## 下載更新後的執行檔

第一步，先把新版的 Wings 執行檔下載到 `/usr/local/bin`。這個過程需要暫時把 Wings 停下來，不過放心，_不會_影響到正在執行中的伺服器。

> [!NOTE]
> 我們目前只翻譯最新版本的文件，所以一般來說，只有照著這份文件操作，或是使用我們的一鍵安裝程式，才會裝到繁體中文化版本。如果你選擇安裝的是舊版本，那就代表你裝的是官方英文版，我們沒辦法在翻譯內容上提供支援；不過技術層面的問題，還是歡迎到 [Discord](https://pterodactyl.tw/discord) 找我們，或跟其他使用者一起討論。

``` bash
systemctl stop wings
curl -L -o /usr/local/bin/wings "https://github.com/pterodactyl/wings/releases/latest/download/wings_linux_$([[ "$(uname -m)" == "x86_64" ]] && echo "amd64" || echo "arm64")"
chmod u+x /usr/local/bin/wings
```

## 重新啟動程序

最後一步，把 Wings 程序重新啟動起來就完成了。正在執行的伺服器不會受到影響，跟它們的現有連線也會自動重新連上。

``` bash
systemctl restart wings
```
