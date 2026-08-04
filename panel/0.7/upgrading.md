---
meta:
    - name: robots
      content: noindex
---
# 升級
升級 Panel 的流程相對簡單。以下列出各版本的文件，將引導你完成對應的軟體升級流程。

::: danger 此版本已終止支援
本文件適用於**已終止生命週期的軟體**，不再提供任何安全性更新或社群支援。
基於歷史原因，本文件仍保留供查閱。

在正式環境中，你應安裝並使用 [Pterodactyl Panel 1.0](/panel/1.0/getting_started.md)。
:::

## 維護模式
執行升級時，務必讓 Panel 進入「維護模式」。這能避免使用者遇到意外錯誤，並確保所有內容在使用者看到新功能前完成升級。

``` bash
# Put the Panel into maintenance mode and deny user access
php artisan down

# Bring the Panel back up to receive connections.
php artisan up
```

## 重新啟動佇列工作程序
每次更新後都應重新啟動佇列工作程序，確保載入並使用新程式碼。

``` bash
php artisan queue:restart
```

## 各版本指南

* [0.6.X to 0.7.19](/panel/0.7/upgrade/0.6_to_0.7.md)
* [0.7.X series](/panel/0.7/upgrade/0.7.md)
* [0.7.19 to 1.X.X](/panel/1.0/upgrade/0.7_to_1.0) <Badge text="current" vertical="middle"/>
