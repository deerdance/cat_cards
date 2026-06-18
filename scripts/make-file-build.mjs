import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const assetsDir = path.join(distDir, "assets");
const indexPath = path.join(distDir, "index.html");

const files = await readdir(assetsDir);
const jsFile = files.find((file) => /^index-.*\.js$/.test(file));

if (!jsFile) {
  throw new Error("Could not find built app JavaScript in dist/assets.");
}

const jsPath = path.join(assetsDir, jsFile);
const fileSafeJsFile = "app-file-safe.js";
const fileSafeJsPath = path.join(assetsDir, fileSafeJsFile);

let js = await readFile(jsPath, "utf8");

js = js.replace(
  /""\+new URL\("([^"]+)",import\.meta\.url\)\.href/g,
  (_match, assetName) => JSON.stringify(`./assets/${assetName}`),
);

await writeFile(fileSafeJsPath, js);

let html = await readFile(indexPath, "utf8");

html = html.replace(
  /<script type="module" crossorigin src="\.\/assets\/index-[^"]+\.js"><\/script>/,
  `<script defer src="./assets/${fileSafeJsFile}"></script>`,
);

await writeFile(indexPath, html);

console.log("Created file-safe build at dist/index.html");
