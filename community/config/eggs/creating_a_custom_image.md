# 建立自訂 Docker 映像檔

[[toc]]

::: warning
本教學使用我們的 [`core:java`](https://github.com/pterodactyl/images/tree/java) Docker 映像檔作為範例，您可以在 GitHub 上找到該映像檔。本教學也預設您具備一些 [Docker](https://docker.io/) 相關知識。如果您對這些內容感到陌生，建議先閱讀相關文件。
:::

## 建立 Dockerfile

此流程中最重要的部分，是建立 Daemon 將使用的 [`Dockerfile`](https://docs.docker.com/engine/reference/builder/)。由於伺服器容器受到嚴格限制，因此必須以特定方式設定此檔案。

為了縮減映像檔大小，我們會盡可能使用 [Alpine Linux](https://alpinelinux.org) 建立映像檔。

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

接下來逐步說明上述 `Dockerfile`。首先會注意到的是 [`FROM`](https://docs.docker.com/engine/reference/builder/#from) 宣告：

```bash
FROM openjdk:8-jdk-alpine
```

在此範例中，我們使用 [`openjdk:8-jdk-alpine`](https://github.com/docker-library/openjdk)，它提供 Java 8 執行環境。

## 安裝相依套件

接著，我們使用 Alpine 的套件管理工具 `apk` 安裝所需的相依套件。您會注意到其中包含一些可縮減容器大小的特定參數，例如 `--no-cache`，而且所有操作都放在單一個 [`RUN`](https://docs.docker.com/engine/reference/builder/#run) 區塊中。

## 建立容器使用者

在這個 `RUN` 區塊中，您會看到 `useradd` 指令：

```bash
adduser -D -h /home/container container
```

::: warning
所有 Pterodactyl 容器都必須擁有名為 `container` 的使用者，而且該使用者的家目錄**必須**是 `/home/container`。
:::

建立使用者後，我們會定義容器預設使用的 [`USER`](https://docs.docker.com/engine/reference/builder/#user)，以及幾個套用到容器內程式的 [`ENV`](https://docs.docker.com/engine/reference/builder/#env) 設定。

## 工作目錄與 Entrypoint

接下來其中一個步驟，是定義 [`WORKDIR`](https://docs.docker.com/engine/reference/builder/#workdir)。其他所有操作都會在這個目錄中執行。`WORKDIR` 必須設定為 `/home/container`。

最後，我們需要將 [`ENTRYPOINT`](https://docs.docker.com/engine/reference/builder/#entrypoint) 指令碼複製到 Docker 映像檔的根目錄。這是透過 [`COPY`](https://docs.docker.com/engine/reference/builder/#copy) 完成的，接著再使用 [`CMD`](https://docs.docker.com/engine/reference/builder/#cmd) 定義容器啟動時要執行的指令。

`CMD` 行一律應指向 `entrypoint.sh` 檔案：

```bash
COPY ./entrypoint.sh /entrypoint.sh
CMD ["/bin/bash", "/entrypoint.sh"]
```

## Entrypoint 指令碼

若要完成這個 `Dockerfile`，我們需要建立 `entrypoint.sh` 檔案，用來告訴 Docker 如何執行這種特定類型的伺服器。

這些 Entrypoint 檔案其實已經具備相當程度的抽象化。Daemon 會在處理並執行啟動指令前，將該指令以環境變數的形式傳入。

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

第二個指令 `cd /home/container` 只是在執行其餘指令時，確保目前位於正確的目錄。接著使用 `java -version` 顯示 Java 版本給終端使用者查看，但這並非必要步驟。

## 修改啟動指令

此檔案中最重要的部分，是 `MODIFIED_STARTUP` 環境變數。在這個範例中，我們會解析 Daemon 傳入容器的 `STARTUP` 環境變數。通常，此變數看起來如下：

```bash
STARTUP="java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}"
```

::: v-pre
您會注意到其中有幾個替換字串，特別是 `{{SERVER_MEMORY}}` 與 `{{SERVER_JARFILE}}`。這兩者分別指向其他傳入的環境變數，其形式如下：
:::

```bash
SERVER_MEMORY=1024
SERVER_JARFILE=server.jar
```

環境變數有許多種，並且會依據特定服務選項的設定而有所不同。不過，這通常不需要特別處理。

```bash
MODIFIED_STARTUP=`eval echo $(echo ${STARTUP} | sed -e 's/{{/${/g' -e 's/}}/}/g')`
```

::: v-pre
上述指令會先解析 `STARTUP` 環境變數，接著將大括號 `{{EXAMPLE}}` 包住的內容替換成相符的環境變數，例如 `EXAMPLE`。因此，我們的 `STARTUP` 指令：
:::

```bash
java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}
```

會變成：

```bash
java -Xms128M -Xmx1024M -jar server.jar
```

## 執行指令

最後一步是執行修改後的啟動指令，這是透過 `${MODIFIED_STARTUP}` 這一行完成的。

### 注意事項

有時候可能需要變更 `entrypoint.sh` 檔案的權限。在 Linux 上，您可以先切換到該檔案所在的目錄，然後執行以下指令：

```bash
chmod +x entrypoint.sh
```