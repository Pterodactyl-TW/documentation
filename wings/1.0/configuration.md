# 進階設定

[[toc]]

::: warning
以下是 Wings 的進階設定。如果設定錯誤，可能會導致 Wings 損壞並使容器無法使用。
只有在你了解每個設定值的用途時，才能繼續操作。
:::

你必須將所有變更套用至 `/etc/pterodactyl` 中的 Wings `config.yml`，並重新啟動 Wings。如果收到 YAML 解析相關錯誤，
請使用 [Yaml Lint](http://www.yamllint.com/) 驗證設定檔。

## 私有 Registry

拉取映像檔時，可以使用以下設定向（私有）Docker Registry 進行驗證。

### 可用金鑰

| Setting Key | Default Value | Notes             |
| ----------- | :-----------: | ----------------- |
| name        |     null      | Registry address  |
| username    |     null      | Registry username |
| password    |     null      | Registry password |

### 使用範例

```yml
docker:
  registries:
    registry.example.com:
      username: "registryusername"
      password: "registrypassword"
```

## 自訂網路介面

你可以編輯網路名稱，變更 Wings 用於所有容器的網路介面；預設值為 `pterodactyl_nw`。例如，要啟用 Docker 主機模式，
請將網路名稱改為 `host`。

::: warning
將網路模式改為 `host` 會讓 Pterodactyl 直接存取機器上的所有介面，Panel 使用者也能繫結至任何 IP 或連接埠，
即使該位址沒有配置給其容器。你將失去 Docker 網路隔離的所有優點。不建議在託管其他使用者伺服器的公開安裝環境中使用。
:::

### 使用範例

```yml
docker:
  network:
    name: host
    network_mode: host
```

完成變更後，以下命令會停止 Wings、移除 Pterodactyl 網路，並重新啟動 Wings。請自行承擔執行風險。
`systemctl stop wings && docker network rm pterodactyl_nw && systemctl start wings`

## 啟用 Cloudflare Proxy

Wings 使用 Cloudflare Proxy 並沒有好處，因為使用者會直接連線到機器並繞過 Cloudflare 的保護。因此節點機器的 IP 仍會暴露。

To enable Cloudflare proxy, you must change the Wings port to one of the Cloudflare HTTPS ports with caching enabled (more info [here](https://developers.cloudflare.com/fundamentals/get-started/reference/network-ports/)), such as 8443, because Cloudflare only supports HTTP on port 8080. Select your Node in the Admin Panel, and on the settings tab, change the port. Make sure that you set "Not Behind Proxy" when using Full SSL settings in Cloudflare. Then on Cloudflare dashboard, your FQDN must have an orange cloud enabled beside it.

除非使用 Cloudflare Enterprise 方案，否則無法透過 Cloudflare Proxy 代理 SFTP 連接埠。

## 容器 PID 限制

你可以變更 `container_pid_limit` 值，調整容器在任一時間可執行的程序總數。預設值為 `512`。
將其設為 `0` 可完全停用限制，但_不建議_這麼做，因為此限制能防止惡意程序使節點超載。
重新啟動 Wings 與遊戲伺服器以套用新限制。

### 使用範例

```yml
docker:
  ...
  container_pid_limit: 512
  ...
```

## 節流限制

你可以使用以下設定調整或完全停用節流功能。

| 設定金鑰              | 預設值        | 說明                                                                                                                               |
| :-------------------- | :-----------: | ----------------------------------------------------------------------------------------------------------------------------------- |
| enabled               |     true      | Whether or not the throttler is enabled                                                                                             |
| lines                 |     2000      | Total lines that can be output in a given line_reset_interval period                                                                |
| maximum_trigger_count |       5       | Amount of times throttle limit can be triggered before the server will be stopped                                                   |
| line_reset_interval   |      100      | The amount of time after which the number of lines processed is reset to 0                                                          |
| decay_interval        |     10000     | Time in milliseconds that must pass without triggering throttle limit before trigger count is decremented                           |
| stop_grace_period     |      15       | Time that a server is allowed to be stopping for before it is terminated forcefully if it triggers output throttle                  |
| write_limit           |       0       | Impose I/O write limit for backups to the disk, 0 = unlimited. Value greater than 0 throttles write speed to the set value in MiB/s |
| download_limit        |       0       | Impose a Network I/O read limit for archives, 0 = unlimited. Value greater than 0 throttles read speed to the set value in MiB/s    |

### Example of usage

```yml
throttles:
  enabled: true
  lines: 2000
  maximum_trigger_count: 5
  line_reset_interval: 100
  decay_interval: 10000
  stop_grace_period: 15
```

## 安裝程式限制

定義安裝程式容器的限制，防止伺服器安裝程序意外消耗超出預期的資源。此設定會與伺服器定義的限制一起使用，
較高的值會在安裝容器中優先採用。

| 設定金鑰    | 預設值        | 說明                                                                                                       |
| :---------- | :-----------: | ----------------------------------------------------------------------------------------------------------- |
| memory      |     1024      | The maximum amount of memory install container can use unless server memory limit is higher than this value |
| cpu         |      100      | The maximum amount of cpu install container can use unless server cpu limit is higher than this value       |

### Example of usage

```yml
installer_limits:
  memory: 1024
  cpu: 100
```

## 其他值

以下是較常討論的設定值。所有 Wings 設定值與說明，請參閱[這兩個檔案](https://github.com/pterodactyl/wings/tree/develop/config)。

| 設定金鑰                   | 預設值        | 說明                                                                                                                                                       |
| -------------------------- | :-----------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| debug                      |     false     | Force Wings to run in debug mode                                                                                                                           |
| tmpfs_size                 |      100      | The size of the /tmp directory in MB when mounted into a container                                                                                         |
| websocket_log_count        |      150      | The number of lines to display in the console                                                                                                              |
| detect_clean_exit_as_crash |     true      | Mark server as crashed if it's stopped without user interaction, e.g., not pressing stop button                                                            |
| (crash detection) timeout  |      60       | Timeout between server crashes that will not cause the server to be automatically restarted                                                                |
| app_name                   | "Pterodactyl" | Changes the name of the daemon, shown in the panel's game console                                                                                          |
| check_permissions_on_boot  |     true      | Check all file permissions on each boot. Disable this when you have a very large amount of files and the server startup is hanging on checking permissions |
