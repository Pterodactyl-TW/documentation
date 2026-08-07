---
meta:
- property: og:title
  content: 建立自訂 Docker 映像檔 | Pterodactyl 繁體中文文件
- property: og:description
  content: 本教學使用我們的 core:java Docker 映像檔作為範例，你可以在 GitHub 上找到它。另外也提醒一下，本教學預設你已經具…
- property: og:image
  content: https://pterodactyl.tw/og/community_config_eggs_creating_a_custom_image.png
- property: og:image:width
  content: '1200'
- property: og:image:height
  content: '630'
- name: twitter:title
  content: 建立自訂 Docker 映像檔 | Pterodactyl 繁體中文文件
- name: twitter:description
  content: 本教學使用我們的 core:java Docker 映像檔作為範例，你可以在 GitHub 上找到它。另外也提醒一下，本教學預設你已經具…
- name: twitter:image
  content: https://pterodactyl.tw/og/community_config_eggs_creating_a_custom_image.png
---
# 建立自訂 Docker 映像檔

[[toc]]

::: warning 警告
本教學使用我們的 [`core:java`](https://github.com/pterodactyl/images/tree/java) Docker 映像檔作為範例，你可以在 GitHub 上找到它。另外也提醒一下，本教學預設你已經具備一些 [Docker](https://docker.io/) 的基本知識，如果你對 Docker 還不熟悉，建議先花點時間讀一下官方文件，之後再回來看會比較好懂。
:::

## 建立 Dockerfile

整個流程中最關鍵的一步，就是建立 Daemon 會用到的 [`Dockerfile`](https://docs.docker.com/engine/reference/builder/)。這裡要特別注意的是，伺服器容器本身受到相當嚴格的限制，所以這個檔案不能隨便寫，必須照特定方式設定才行。

另外，為了讓映像檔體積盡量小一點，我們會盡可能選用 [Alpine Linux](https://alpinelinux.org) 來建立映像檔。

```bash
# ----------------------------------
# Pterodactyl Core Dockerfile
# 環境：Java
# 最低控制面板版本：0.6.0
# ----------------------------------
FROM openjdk:8-jdk-alpine

MAINTAINER Pterodactyl Software, <support@pterodactyl.io>

RUN apk add --no-cache --update curl ca-certificates openssl git tar bash sqlite fontconfig \
    && adduser --disabled-password --home /home/container container

USER container
ENV  USER=container HOME=/home/container

WORKDIR /home/container

COPY ./entrypoint.sh /entrypoint.sh

CMD ["/bin/bash", "/entrypoint.sh"]
```

接下來我們逐段拆解這個 `Dockerfile`，看看每一部分實際在做什麼。第一眼會注意到的，是最上面的 [`FROM`](https://docs.docker.com/engine/reference/builder/#from) 宣告：

```bash
FROM openjdk:8-jdk-alpine
```

這裡選用的是 [`openjdk:8-jdk-alpine`](https://github.com/docker-library/openjdk)，簡單來說，它提供了一個現成的 Java 8 執行環境，不用自己再從頭裝一遍。

## 安裝相依套件

接著，我們用 Alpine 內建的套件管理工具 `apk` 來安裝需要的相依套件。你會發現這裡有幾個用來縮小容器體積的小技巧，例如加上 `--no-cache` 參數，而且所有安裝動作都塞在同一個 [`RUN`](https://docs.docker.com/engine/reference/builder/#run) 區塊裡完成，這樣可以減少 Docker 產生的中間層數量。

## 建立容器使用者

在同一個 `RUN` 區塊中，你會看到這一行 `useradd` 指令：

```bash
adduser -D -h /home/container container
```

::: warning 警告
這裡要特別提醒，所有 Pterodactyl 容器都必須有一個名為 `container` 的使用者，而且這個使用者的家目錄**必須**是 `/home/container`，這是硬性規定，不能省略或改名。
:::

建立好使用者之後，接下來要做兩件事：定義容器預設要用哪個使用者身分執行，也就是 [`USER`](https://docs.docker.com/engine/reference/builder/#user)；再加上幾個要套用到容器內程式的 [`ENV`](https://docs.docker.com/engine/reference/builder/#env) 環境變數設定。

## 工作目錄與 Entrypoint

再來要定義的是 [`WORKDIR`](https://docs.docker.com/engine/reference/builder/#workdir)，之後所有操作都會在這個目錄底下執行，所以 `WORKDIR` 這裡固定要設成 `/home/container`。

最後一步，是把 [`ENTRYPOINT`](https://docs.docker.com/engine/reference/builder/#entrypoint) 指令碼複製到 Docker 映像檔的根目錄，這是靠 [`COPY`](https://docs.docker.com/engine/reference/builder/#copy) 完成的；接著再用 [`CMD`](https://docs.docker.com/engine/reference/builder/#cmd) 定義容器啟動時要跑的指令。

這裡有個規則要記住，`CMD` 這一行一律要指向 `entrypoint.sh` 檔案：

```bash
COPY ./entrypoint.sh /entrypoint.sh
CMD ["/bin/bash", "/entrypoint.sh"]
```

## Entrypoint 指令碼

要完成這個 `Dockerfile`，最後還缺一個 `entrypoint.sh` 檔案，它的作用是告訴 Docker 該怎麼執行這種特定類型的伺服器。

這些 Entrypoint 檔案其實已經幫你做了不少抽象化的處理。簡單來說，Daemon 會先把啟動指令包裝成環境變數傳進容器，再由這個指令碼負責解析並執行它。

```bash
#!/bin/bash
cd /home/container

# 顯示目前的 Java 版本
java -version ## 這主要用於顯示目前使用的版本。若用於其他應用程式，應改成相應的指令

# 替換啟動變數
MODIFIED_STARTUP=`eval echo $(echo ${STARTUP} | sed -e 's/{{/${/g' -e 's/}}/}/g')`
echo ":/home/container$ ${MODIFIED_STARTUP}"

# 啟動伺服器
${MODIFIED_STARTUP}
```

其中 `cd /home/container` 這一行，只是確保接下來執行其他指令時，目前所在的目錄是對的。接下來的 `java -version` 是拿來顯示 Java 版本給終端使用者看，方便除錯用，但這步驟並非必要，可以省略。

## 修改啟動指令

這個檔案裡最核心的部分，其實是 `MODIFIED_STARTUP` 這個環境變數。這裡要做的事情，是把 Daemon 傳進容器的 `STARTUP` 環境變數解析出來。一般來說，這個變數看起來會像這樣：

```bash
STARTUP="java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}"
```

::: v-pre
仔細看你會發現裡面有幾個用雙大括號包住的替換字串，特別是 `{{SERVER_MEMORY}}` 與 `{{SERVER_JARFILE}}`。這兩個其實各自對應到另外兩個獨立傳入的環境變數，格式大概是這樣：
:::

```bash
SERVER_MEMORY=1024
SERVER_JARFILE=server.jar
```

環境變數的種類其實蠻多的，會依照不同服務選項的設定而有所差異，不過這部分通常不需要你特別去處理。

```bash
MODIFIED_STARTUP=`eval echo $(echo ${STARTUP} | sed -e 's/{{/${/g' -e 's/}}/}/g')`
```

::: v-pre
這一行指令做的事情，就是先解析 `STARTUP` 環境變數，接著把裡面用雙大括號 `{{EXAMPLE}}` 包住的部分，替換成對應的環境變數 `EXAMPLE`。也就是說，我們原本的 `STARTUP` 指令：
:::

```bash
java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}
```

經過這一步處理後，就會變成：

```bash
java -Xms128M -Xmx1024M -jar server.jar
```

## 執行指令

最後一步很簡單，就是把處理好的啟動指令真正執行起來，靠的就是 `${MODIFIED_STARTUP}` 這一行。

### 注意事項

有時候你可能會發現 `entrypoint.sh` 檔案的執行權限不對，需要手動調整。在 Linux 上，先切換到該檔案所在的目錄，然後執行：

```bash
chmod +x entrypoint.sh
```
