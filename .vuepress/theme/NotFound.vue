<template>
    <div class="theme-container">
        <div class="content error-page">
            <h1>404</h1>
            <blockquote>{{ getMsg() }}</blockquote>
            <router-link to="/">帶我回首頁</router-link>
        </div>
    </div>
</template>

<script>
    const msgs = [
        `這裡什麼都沒有。`,
        `我們是怎麼到這裡的？`,
        `這是 404 頁面。`,
        `看來有些連結已經失效了。`,
        `到底是誰又讓 Dogmeat 動了文件？`,
        `有人又把網路線拔掉了……`,
        `找不到那位船長，要不要重新開始？`,
        `我已經不想再玩躲貓貓了。`
    ];

    export default {
        methods: {
            getMsg() {
                return msgs[Math.floor(Math.random() * msgs.length)];
            }
        }
    };
</script>
