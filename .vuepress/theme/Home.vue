<template>
    <div class="home">
        <div class="header section bg-blue text-grey-lightest less-padding emphasize">
            <div class="container z-10">
                <div class="text-center">
                    <div>
                        <img class="max-w-xl w-full inline-block" src="https://cdn.pterodactyl.io/logos/new/pterodactyl_logo_transparent.png" alt="Pterodactyl">
                    </div>
                    <div class="mt-4">
                        <!-- <a class="btn hidden md:inline-block" href="https://demo.pterodactyl.io" target="_blank" rel="nofollow noopener">Demo</a> -->
                        <router-link class="btn inline-block" to="/panel/1.0/getting_started.html">開始使用！</router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="section bg-white">
            <div class="container text-center">
                <h1 class="text-blue mb-4">Pterodactyl 面板</h1>
                <p class="text-sm text-grey mb-2">
                    本站由 <strong>Pterodactyl 台灣翻譯團隊</strong> 維護，提供 Pterodactyl 官方文件的繁體中文化版本。
                </p>
                <h3 class="border-0 font-normal leading-normal mx-auto" style="max-width: 50rem">
                    Pterodactyl&reg; 是一款免費、開放原始碼的遊戲伺服器管理面板，採用 PHP、React 與 Go 建置。
                    Pterodactyl 以安全性為設計核心，將所有遊戲伺服器執行於隔離的 Docker 容器中，
                    同時為終端使用者提供美觀且直覺的使用介面。
                </h3>
                <h3 class="border-0 leading-normal mx-auto mt-4" style="max-width: 50rem">
                    別再接受次等方案，讓遊戲伺服器成為你平台上的核心服務。
                </h3>
                <img class="max-w-lg w-full m-4 inline-block" src="https://cdn.pterodactyl.io/site-assets/mockup-macbook-grey-1.0.png">
            </div>
        </div>
        <div class="section bg-blue text-grey-lightest">
            <div class="container text-center">
                <h1 class="mb-4">為什麼選擇 Pterodactyl&reg;？</h1>
                <div class="flex flex-wrap">
                    <div class="feature">
                        <span><i class="icon icon-lock"></i></span>
                        <h3>安全至上</h3>
                        <p>安全性是打從一開始就寫進設計核心的，而不是事後補上去的。bcrypt 雜湊、AES-256-CBC 加密、HTTPS 通通內建，你不用另外操心。</p>
                    </div>
                    <div class="feature">
                        <span><i class="icon icon-beaker"></i></span>
                        <h3>現代化工具</h3>
                        <p>用的是現代技術堆疊，架構也照著業界最佳實務打造，不管是上手還是日後客製化，都不會讓你卡關。</p>
                    </div>
                    <div class="feature">
                        <span><i class="icon icon-anchor"></i></span>
                        <h3>以 Docker 為核心</h3>
                        <p>每個伺服器都跑在各自獨立的 Docker 容器裡，攻擊面小、資源限制抓得緊，還能替不同遊戲量身打造專屬環境。</p>
                    </div>
                    <div class="feature">
                        <span><i class="icon icon-wallet"></i></span>
                        <h3>免費且開放原始碼</h3>
                        <p>不收費、不藏私。Pterodactyl 採用 MIT 授權條款，程式碼完全公開，你可以自由查看、修改，甚至拿去二次開發。</p>
                    </div>
                    <div class="feature">
                        <span><i class="icon icon-browser"></i></span>
                        <h3>易於使用</h3>
                        <p>介面該有的都有，不該有的複雜通通拿掉。就算你完全沒管理過伺服器，也能很快摸清楚怎麼操作。</p>
                    </div>
                    <div class="feature">
                        <span><i class="icon icon-expand"></i></span>
                        <h3>可擴充</h3>
                        <p>不管你是要開代管服務、經營大型社群，還是單純想跟朋友一起玩，Pterodactyl 都能跟著你的規模一起長大。</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="section bg-white">
            <div class="text-center">
                <h1>螢幕截圖</h1>
                <div class="screenshots">
                    <slick ref="slick" :options="slickOptions">
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-1.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-1.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-2.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-2.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-3.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-3.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-4.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-4.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-5.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-5.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-6.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-6.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-7.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-7.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-8.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-8.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-9.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-9.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-10.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-10.png">
                        </a>
                        <a href="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-11.png">
                            <img src="https://cdn.pterodactyl.io/site-assets/carousel/screenshot-11.png">
                        </a>
                    </slick>
                </div>
            </div>
        </div>
        <div class="section bg-blue text-grey-lightest">
            <div class="container text-center">
                <h1>開始使用</h1>
                <p class="m-4">準備好搭乘 Pterodactyl 起飛了嗎？</p>
                <div class="mt-4">
                    <router-link class="btn inline-block" to="/project/introduction.html">關於本專案</router-link>
                    <a class="btn inline-block" href="https://pterodactyl.tw/discord">Discord</a>
                </div>
            </div>
        </div>
        <div class="section bg-black text-grey-lighter text-sm less-padding">
            <div class="container text-center">
                <div>
                    <img class="h-20" :src="$withBase('logos/banner_logo.png')" alt="pterodactyl banner logo">
                </div>
                <div class="text-left md:flex">
                    <div class="flex-none w-full md:w-1/2 md:pr-12">
                        <p class="my-4">
                            自 2015 年起，Pterodactyl&reg; 便持續提供強大、高效能且安全的軟體，
                            讓個人、網路社群與代管公司都能輕鬆大規模執行遊戲伺服器。
                            最棒的是？完全沒有高昂的月費負擔。
                        </p>
                        <p class="my-4">
                            現在就踏出這一步，了解為什麼有數千名使用者信賴 Pterodactyl&reg;
                            來管理他們的遊戲伺服器。
                        </p>
                    </div>
                    <div class="hidden md:block md:flex-1 md:pr-12">
                        <p><a class="text-grey-lightest" href="https://github.com/Pterodactyl-TW">GitHub</a></p>
                        <p><a class="text-grey-lightest" href="https://github.com/sponsors/pterodactyl">贊助</a></p>
                        <p><a class="text-grey-lightest" href="https://github.com/sponsors/pterodactyl">捐款</a></p>
                        <p><a class="text-grey-lightest" href="/panel/1.0/troubleshooting.html">疑難排解</a></p>
                        <p><a class="text-grey-lightest" href="https://eggs.pterodactyl.tw">其他遊戲設定</a></p>
                    </div>
                    <div class="text-center mt-8 md:flex-1 md:mt-0">
                        <a href="https://pterodactyl.tw/discord" target="_blank" rel="nofollow noopener">
                            <img src="https://cdn.pterodactyl.io/site-assets/discord.png" class="w-3/4">
                        </a>
                    </div>
                </div>
                <div class="footer">採用 MIT 授權條款 | Pterodactyl&reg; 版權所有 &copy; Dane Everitt 與貢獻者</div>
            </div>
        </div>
    </div>
</template>

<script>
    import Swal from 'sweetalert2';
    import 'sweetalert2/dist/sweetalert2.min.css';
    import NavLink from './NavLink.vue';
    import Slick from './SlickCarousel.vue';

    export default {
        components: { NavLink, Slick },
        mounted() {
            Swal.fire({
                title: 'Pterodactyl TW',
                text: '你現在看到的是 Pterodactyl TW，由 Pterodactyl 台灣翻譯團隊維護的非官方繁體中文化專案，裡面的內容可能會與官方的最新版有衝突，請以官方所描述的為主。',
                icon: 'info',
                allowOutsideClick: false,
                showDenyButton: true,
                confirmButtonText: '我知道了',
                denyButtonText: '我要看官方的'
            }).then(result => {
                if (result.isDenied) {
                    window.location.href = 'https://pterodactyl.io';
                }
            });
        },
        data() {
            return {
                slickOptions: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: '0',
                    speed: 1000,
                    autoplay: true,
                    variableWidth: true,
                    arrows: false,
                    dots: true,
                    pauseOnHover: false,
                    pauseOnDotsHover: true,
                },
            }
        },
        computed: {
            data() {
                return this.$page.frontmatter;
            },
            actionLink() {
                return {
                    link: this.data.actionLink,
                    text: this.data.actionText
                };
            }
        },
    };
</script>

<style>
    .swal2-title {
        border-bottom: 0 !important;
    }
</style>
