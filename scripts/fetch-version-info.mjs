// 產生 Pterodactyl-TW 自己的版本檢查 JSON（供 Panel / Wings 的「檢查更新」功能讀取）。
// 同時列出「我們翻譯版本的最新版」與「官方原版的最新版」，
// 讓使用者可以知道目前使用的翻譯版本，以及官方目前的最新進度。
//
// 寫入 .vuepress/public/releases/latest.json，部署後可透過
// https://pterodactyl.tw/releases/latest.json 存取。
import { writeFileSync } from "node:fs";

const ORG = "Pterodactyl-TW";

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}：${url}`);
  return res.json();
}

// 取得某個倉庫最新的 release tag（去掉開頭的 v）。若該倉庫還沒有任何 release，回傳 null。
async function latestReleaseTag(owner, repo) {
  try {
    const data = await fetchJson(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
    return (data.tag_name || "").replace(/^v/, "") || null;
  } catch (_) {
    return null;
  }
}

async function main() {
  const [
    ourPanel,
    officialPanel,
    ourWings,
    officialWings,
  ] = await Promise.all([
    latestReleaseTag(ORG, "panel"),
    latestReleaseTag("pterodactyl", "panel"),
    latestReleaseTag(ORG, "wings"),
    latestReleaseTag("pterodactyl", "wings"),
  ]);

  // 我們自己還沒有發行版本時，先以官方版本代替，避免「檢查更新」功能誤判為過舊。
  const result = {
    panel: ourPanel || officialPanel,
    panel_official: officialPanel,
    wings: ourWings || officialWings,
    wings_official: officialWings,
    discord: "https://pterodactyl.tw/discord",
  };

  writeFileSync(".vuepress/public/releases/latest.json", JSON.stringify(result, null, 2) + "\n");
  console.log("已寫入 .vuepress/public/releases/latest.json：", result);
}

main();
