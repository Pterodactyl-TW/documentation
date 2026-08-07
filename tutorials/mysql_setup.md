# 設定 MySQL
[[toc]]


## 為 Pterodactyl 建立資料庫
MySQL 是 Pterodactyl Panel 的核心元件，但如果你從沒接觸過 MySQL，光是要搞懂怎麼設定跟使用，可能就會覺得有點頭痛。
別擔心，這篇教學只會帶你完成讓 MySQL 跟 Panel 順利運作所需的最基本設定；如果你之後想深入研究 MySQL 本身，網路上有非常多優質教學可以參考。

### 登入
第一步，我們要先登入 MySQL 命令列，接下來所有的設定都會在這裡執行。請執行下方命令，並輸入你安裝 MySQL 時
設定的 Root 帳戶密碼。如果你不記得自己有設定過密碼，通常直接按 Enter 就能過關，因為系統當下可能根本還沒設密碼。

```sql
# 若使用 MariaDB（v11.0.0+）
mariadb -u root -p

# 若使用 MySQL
mysql -u root -p
```

### 建立使用者
基於安全考量，加上 MySQL 5.7 之後的行為變更，你需要另外幫 Panel 建立一個專用的使用者，而不是讓它直接用 root。這裡我們會先切換到儲存這類帳號資訊的
mysql 系統資料庫。

接著建立一個名為 `pterodactyl` 的使用者，並限制只能從 localhost 登入，避免有人從外部直接連進資料庫。如果之後有需要，你也可以改用 `%` 這個萬用字元，或是指定特定的 IP 位址。下面的範例會把帳戶密碼設定為 `somePassword`，記得之後要換成你自己的密碼。

``` sql
# 記得把下方的 'somePassword' 換成這個帳戶專用的獨一無二密碼。
CREATE USER 'pterodactyl'@'127.0.0.1' IDENTIFIED BY 'somePassword';
```

### 建立資料庫
使用者建立好之後，接下來要幫 Panel 建立一個專屬的資料庫。這篇教學把它命名為 `panel`，你也可以換成自己喜歡的名稱，只要之後設定 Panel 時記得對應改掉即可。

``` sql
CREATE DATABASE panel;
```

### 指派權限
最後一步，我們要告訴 MySQL：`pterodactyl` 這個使用者可以存取剛剛建立的 Panel 資料庫。執行下方命令即可完成。

``` sql
GRANT ALL PRIVILEGES ON panel.* TO 'pterodactyl'@'127.0.0.1';
```

## 為節點建立資料庫主機
:::tip
這一節要說明的是，如何建立一個擁有「建立與修改使用者」權限的 MySQL 使用者，這樣 Panel 就能在指定的資料庫主機上，替每一台伺服器自動建立專屬的資料庫。
:::

### 建立使用者
如果你的資料庫主機跟 Panel 或 Daemon 安裝的機器不是同一台，這裡請務必填入實際執行 Panel 的機器 IP 位址。要是不小心用了 `127.0.0.1`，
卻又想從外部連線進來，就一定會收到連線被拒絕的錯誤，這點很容易忽略。

```sql
# 記得把下方的使用者名稱與密碼換成獨一無二的內容。
CREATE USER 'pterodactyluser'@'127.0.0.1' IDENTIFIED BY 'somepassword';
```

### 指派權限
下方命令會讓這個新建立的使用者，擁有建立其他使用者、以及建立與刪除資料庫的權限。這裡也要再提醒一次：`127.0.0.1` 要跟上一步
使用的 IP 位址保持一致，才不會出問題。

```sql
GRANT ALL PRIVILEGES ON *.* TO 'pterodactyluser'@'127.0.0.1' WITH GRANT OPTION;
```

### 允許外部存取資料庫
如果你希望其他伺服器能連到這台 MySQL 執行個體，就需要開放外部存取。做法是開啟 `my.cnf` 這個設定檔；它實際的位置會依作業系統與 MySQL
的安裝方式而不同，如果找不到，可以執行 `find /etc -iname my.cnf` 幫你定位。

找到 `my.cnf` 之後，把下面這段內容加到檔案最底下並存檔：
```
[mysqld]
bind-address=0.0.0.0
```
改完之後記得重新啟動 MySQL/MariaDB 才會生效。這個設定會覆蓋掉預設值，原本預設只接受來自 localhost 的連線請求，改完之後就會開放所有網路介面連入，也就是允許外部連線了。別忘了同時確認防火牆有開放 MySQL 使用的連接埠（預設是 3306），不然改了設定也連不進來。

如果資料庫跟 Wings 是裝在同一台機器上、而且你根本不需要外部存取，其實也可以不用開這麼大，改用 `docker0` 這個介面的 IP 位址取代 `127.0.0.1` 就好。
執行 `ip addr | grep docker0` 就能查到這個 IP，格式通常長得像 `172.x.x.x`。

另外補充一點：從 MySQL 8.0.13／MariaDB 10.11 開始，`bind_address` 也支援用逗號分隔多個介面，這樣你就能更精細地控制要監聽哪些介面、不監聽哪些介面。
