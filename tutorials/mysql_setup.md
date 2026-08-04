# 設定 MySQL
[[toc]]


## 為 Pterodactyl 建立資料庫
MySQL 是 Pterodactyl Panel 的核心元件，但如果你從未使用過 MySQL，設定與使用方式可能會令人困惑。
本教學只涵蓋讓 MySQL 與 Panel 運作所需的基本內容。如果你想深入了解，網路上有許多優質教學可供參考。

### 登入
第一步是登入 MySQL 命令列，接著我們會在其中執行一些語句完成設定。請執行下方命令，並輸入你安裝 MySQL 時
設定的 Root MySQL 帳戶密碼。如果你不記得曾設定過密碼，很可能只要直接按 Enter，因為系統尚未設定密碼。

```sql
# If using MariaDB (v11.0.0+)
mariadb -u root -p

# If using MySQL
mysql -u root -p
```

### 建立使用者
基於安全考量，以及 MySQL 5.7 的變更，你需要為 Panel 建立新的使用者。首先，我們要讓 MySQL 使用儲存這類資訊的
mysql 資料庫。

接著建立名為 `pterodactyl` 的使用者，並只允許從 localhost 登入，以防止外部連線到資料庫。你也可以使用 `%` 作為
萬用字元，或輸入數值 IP。我們也會將帳戶密碼設定為 `somePassword`。

``` sql
# Remember to change 'somePassword' below to be a unique password specific to this account.
CREATE USER 'pterodactyl'@'127.0.0.1' IDENTIFIED BY 'somePassword';
```

### 建立資料庫
接著需要為 Panel 建立資料庫。本教學會將資料庫命名為 `panel`，但你可以替換成任何想使用的名稱。

``` sql
CREATE DATABASE panel;
```

### 指派權限
最後，我們要告訴 MySQL `pterodactyl` 使用者可以存取 Panel 資料庫。請執行下方命令即可。

``` sql
GRANT ALL PRIVILEGES ON panel.* TO 'pterodactyl'@'127.0.0.1';
```

## 為節點建立資料庫主機
:::tip
本節說明如何建立具有建立與修改使用者權限的 MySQL 使用者。這能讓 Panel 在指定主機上為每台伺服器建立資料庫。
:::

### 建立使用者
如果資料庫所在主機與 Panel 或 Daemon 安裝所在主機不同，請務必使用執行 Panel 的機器 IP 位址。如果使用 `127.0.0.1`
並嘗試從外部連線，將會收到連線被拒絕的錯誤。

```sql
# You should change the username and password below to something unique.
CREATE USER 'pterodactyluser'@'127.0.0.1' IDENTIFIED BY 'somepassword';
```

### 指派權限
下方命令會讓新建立的使用者能夠建立其他使用者，以及建立和刪除資料庫。同樣地，請確認 `127.0.0.1` 與上一個命令
使用的 IP 位址一致。

```sql
GRANT ALL PRIVILEGES ON *.* TO 'pterodactyluser'@'127.0.0.1' WITH GRANT OPTION;
```

### 允許外部存取資料庫
你很可能需要允許外部存取此 MySQL 執行個體，讓伺服器可以連線。請開啟 `my.cnf`；它的位置會依作業系統與 MySQL
的安裝方式而異。你可以輸入 `find /etc -iname my.cnf` 找出檔案位置。

開啟 `my.cnf`，將下方內容加入檔案底部並儲存：
```
[mysqld]
bind-address=0.0.0.0
```
重新啟動 MySQL/MariaDB 以套用變更。這會覆寫預設的 MySQL 設定；預設設定只接受來自 localhost 的要求。更新後將允許
所有介面連線，也就能接受外部連線。請確認防火牆已允許 MySQL 連接埠（預設為 3306）。

如果資料庫與 Wings 位於同一台機器，且不需要外部存取，你也可以使用 `docker0` 介面的 IP 位址取代 `127.0.0.1`。
執行 `ip addr | grep docker0` 即可找出此 IP 位址，其格式通常類似 `172.x.x.x`。

從 MySQL 8.0.13／MariaDB 10.11 起，`bind_address` 也接受以逗號分隔的介面清單，讓你更精確地控制要監聽與不監聽哪些介面。
