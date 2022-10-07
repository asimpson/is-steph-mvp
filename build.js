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
  shelljs.exec("cp -r data dist/data");
});

const copyFiles = (file, i) =>
  new Promise((resolve, reject) => {
    const filePath = file.slice(2);
    const dir = path.dirname(filePath);
    shelljs.mkdir("-p", `dist/${dir}`);
    resolve(shelljs.exec(`cp ${filePath} dist/${filePath}`));
  });

const assets = globby.sync(["./assets/*"]);

Promise.all([assets.forEach(copyFiles)]).then(console.log("done"));
