---
meta:
    - name: robots
      content: noindex
---
# 核心修改

[[toc]]

::: tip 提示
大多數情況下，只有使用 OVH 提供伺服器的使用者，才需要動手修改核心。
:::

## 更新核心
第一步，先用 apt-get 安裝新核心。下面這個範例會安裝最新版本的核心，如果想看看還有哪些版本可以選，也可以用 `apt-cache search linux-image-extra` 瀏覽所有可安裝的映像版本，不過一般建議直接安裝最新版本就好。

``` bash
apt-get install linux-image-generic linux-image-extra-virtual
```

新核心裝好後，還需要用下方命令更新 grub 開機載入程式，讓系統知道要用新核心開機。完成後記得重新啟動伺服器。

``` bash
sudo mv /etc/grub.d/06_OVHkernel /etc/grub.d/96_OVHkernel
sudo update-grub
sudo reboot
```

## 確認核心
重新啟動之後，先執行 `uname -r` 確認一下核心是否真的換成最新版；以本例來說，應該會輸出 `4.4.0-131-generic` 或類似版本。

::: warning 警告
如果輸出結果仍然包含 `-xxxx-grs-ipv6-64` 或類似字串，就代表這次更新沒有成功套用，這種情況下你需要接著進行下方的步驟。
:::

## 設定預設開機核心
如果最簡單的方法沒有成功也別擔心，還是有辦法可以修正。首先執行下面這個快速命令，列出系統上可能的核心選項，確認輸出中確實有你剛才安裝的新核心。

``` bash
grep "menuentry '" /boot/grub/grub.cfg
```

執行後，你應該會看到類似下方範例的輸出。

``` text
menuentry 'Ubuntu' --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-simple-ad1a8550-963c-4a9f-b922-85827cf44fbe' {
    menuentry 'Ubuntu, with Linux 4.4.0-131-generic' --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-4.4.0-131-generic-advanced-ad1a8550-963c-4a9f-b922-85827cf44fbe' {
    menuentry 'Ubuntu, with Linux 4.4.0-131-generic (recovery mode)' --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-4.4.0-131-generic-recovery-ad1a8550-963c-4a9f-b922-85827cf44fbe' {
    menuentry 'Ubuntu, with Linux 4.4.0-127-generic' --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-4.4.0-127-generic-advanced-ad1a8550-963c-4a9f-b922-85827cf44fbe' {
    menuentry 'Ubuntu, with Linux 4.4.0-127-generic (recovery mode)' --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-4.4.0-127-generic-recovery-ad1a8550-963c-4a9f-b922-85827cf44fbe' {
    menuentry 'Ubuntu, with Linux 4.4.0-116-generic' --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-4.4.0-116-generic-advanced-ad1a8550-963c-4a9f-b922-85827cf44fbe' {
    menuentry 'Ubuntu, with Linux 4.4.0-116-generic (recovery mode)' --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-4.4.0-116-generic-recovery-ad1a8550-963c-4a9f-b922-85827cf44fbe' {
```

仔細看的話會發現，`Ubuntu, with Linux 4.4.0-131-generic` 被列為第一個縮排選項。如果想指定用這個核心開機，就需要動手修改 grub 檔案。

``` bash
sudo nano /etc/default/grub
```

打開檔案後，找到 `GRUB_DEFAULT` 這一項，它很可能目前設定為 `GRUB_DEFAULT=0`。接下來只要稍微修改它，就能讓系統改用新核心開機。

``` text
GRUB_DEFAULT='Advanced options for Ubuntu>Ubuntu, with Linux 4.4.0-131-generic'
```

這裡唯一需要依實際情況調整的部分，是 `4.4.0-131-generic` 這串版本號，你可以依照自己安裝的核心版本填入對應數值。眼尖的話會注意到，這串數字其實就對應到前面 grep menuentry 命令輸出中的第一個縮排項目，也就是我們剛才安裝的核心版本。設定完成後，執行下方命令更新 grub 並重新啟動，就大功告成了。

``` bash
sudo update-grub
sudo reboot
```

## 從硬碟開機
不過要提醒一下，就算已經照上面步驟修改了 GRUB 設定，伺服器仍有可能還是用 OVH 的核心開機。如果遇到這種情況，可以到 OVH 控制面板檢查開機設定，確認伺服器是設定成從硬碟開機，而不是網路開機。
