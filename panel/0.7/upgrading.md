---
meta:
    - name: robots
      content: noindex
---
# 升級
升級 Panel 的整體流程其實相對簡單。以下依版本列出對應的文件，帶你完成升級。

::: danger 此版本已終止支援
本文件適用於**已終止生命週期的軟體**，不再提供任何安全性更新或社群支援。
基於歷史原因，本文件仍保留供查閱。

在正式環境中，你應安裝並使用 [Pterodactyl Panel 1.0](/panel/1.0/getting_started.md)。
:::

## 維護模式
執行升級的過程中，務必先讓 Panel 進入「維護模式」。這麼做可以避免使用者在升級途中遇到意外錯誤，也能確保所有內容
都升級完成後，才讓使用者看到新功能。

``` bash
# 讓 Panel 進入維護模式，拒絕使用者存取
php artisan down

# 讓 Panel 恢復運作，重新開始接受連線。
php artisan up
```

## 重新啟動佇列工作程序
每次更新完成後，都應該重新啟動佇列工作程序，這樣才能確保載入並使用的是新版程式碼。

``` bash
php artisan queue:restart
```

## 各版本指南

* [0.6.X to 0.7.19](/panel/0.7/upgrade/0.6_to_0.7.md)
* [0.7.X series](/panel/0.7/upgrade/0.7.md)
* [0.7.19 to 1.X.X](/panel/1.0/upgrade/0.7_to_1.0) <Badge text="current" vertical="middle"/>
