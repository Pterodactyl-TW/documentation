---
meta:
    - name: robots
      content: noindex
---
# 核心修改

[[toc]]

::: tip
大多數情況下，只有使用 OVH 提供伺服器的使用者需要修改核心。
:::

## 更新核心
使用 apt-get 安裝新核心。本例會安裝最新版本的核心，也可以使用 `apt-cache search linux-image-extra` 瀏覽所有可安裝的映像版本。
建議安裝最新版本。

``` bash
apt-get install linux-image-generic linux-image-extra-virtual
```

After you've installed the new kernel you'll need to update the grub loader using the command below. After that, a
server reboot is in order.

``` bash
sudo mv /etc/grub.d/06_OVHkernel /etc/grub.d/96_OVHkernel
sudo update-grub
sudo reboot
```

## 確認核心
重新啟動後，使用 `uname -r` 確認已安裝最新核心；本例應輸出 `4.4.0-131-generic` 或類似版本。

::: warning
If it still includes `-xxxx-grs-ipv6-64` or similar, it didn't work and you should move on top the steps below.
:::

## 設定預設開機核心
很遺憾，最簡單的方法沒有成功，但仍然可以修正。首先執行快速命令列出可能的核心，確認輸出中有新安裝的核心。

``` bash
grep "menuentry '" /boot/grub/grub.cfg
```

After running that you should see output similar to the example below.

``` text
menuentry 'Ubuntu' --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-simple-ad1a8550-963c-4a9f-b922-85827cf44fbe' {
    menuentry 'Ubuntu, with Linux 4.4.0-131-generic' --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-4.4.0-131-generic-advanced-ad1a8550-963c-4a9f-b922-85827cf44fbe' {
    menuentry 'Ubuntu, with Linux 4.4.0-131-generic (recovery mode)' --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-4.4.0-131-generic-recovery-ad1a8550-963c-4a9f-b922-85827cf44fbe' {
    menuentry 'Ubuntu, with Linux 4.4.0-127-generic' --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-4.4.0-127-generic-advanced-ad1a8550-963c-4a9f-b922-85827cf44fbe' {
    menuentry 'Ubuntu, with Linux 4.4.0-127-generic (recovery mode)' --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-4.4.0-127-generic-recovery-ad1a8550-963c-4a9f-b922-85827cf44fbe' {
    menuentry 'Ubuntu, with Linux 4.4.0-116-generic' --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-4.4.0-116-generic-advanced-ad1a8550-963c-4a9f-b922-85827cf44fbe' {
    menuentry 'Ubuntu, with Linux 4.4.0-116-generic (recovery mode)' --class ubuntu --class gnu-linux --class gnu --class os $menuentry_id_option 'gnulinux-4.4.0-116-generic-recovery-ad1a8550-963c-4a9f-b922-85827cf44fbe' {
```

As you can see, we have `Ubuntu, with Linux 4.4.0-131-generic` listed as the first indented option. To boot using this
specific kernel, we will need to modify our grub file.

``` bash
sudo nano /etc/default/grub
```

Find `GRUB_DEFAULT`, it is most likely set to `GRUB_DEFAULT=0`. We're going to modify it a bit to boot our new kernel.

``` text
GRUB_DEFAULT='Advanced options for Ubuntu>Ubuntu, with Linux 4.4.0-131-generic'
```

The only part of the code above that you might need to change is the `4.4.0-131-generic`, which you can find based on
the kernel version you install. You might also notice that it matches the first indented entry from the grep menuentry
command and also the version of the kernel that we installed above. Once you've done that, run the commands below to
update grub and reboot, and you should be set.

``` bash
sudo update-grub
sudo reboot
```

## 從硬碟開機
即使修改 GRUB 設定，伺服器仍可能使用 OVH 核心開機。如果發生此情況，請前往 OVH 控制面板檢查開機設定，
確認使用硬碟開機，而不是網路開機。
