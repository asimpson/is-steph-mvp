const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const shelljs = require("shelljs");
const globby = require("globby");

const stdin = process.stdin;
const css = [];

stdin.on("data", (data) => css.push(data));

stdin.on("end", () => {
  const html = fs.readFileSync("./index.html").toString();
  const $ = cheerio.load(html);
  const processed = css.map((x) => x.toString()).join("");
  $("link").remove();
  $("style").empty().html(processed);
  fs.writeFileSync("dist/index.html", $.html());
});

const copyFiles = (file, i) =>
  new Promise((resolve, reject) => {
    resolve(shelljs.exec(`cp ${file} dist/${file}`));
  });

const assets = globby.sync([
  "./assets/*",
  "!./assets/*.css",
  "!./assets/*.mp3",
]);

Promise.all([assets.forEach(copyFiles)]).then(console.log("done"));
