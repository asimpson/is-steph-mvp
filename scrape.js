const cheerio = require('cheerio');
const axios = require('axios');
const htmlparser = require('htmlparser2');

const steph = 'https://www.basketball-reference.com/players/c/curryst01.html';

const request = url =>
  new Promise((resolve, reject) =>
    axios.get(url).then(res => resolve(res.data))
  );

async function ghost() {
  let advanced;
  const html = await request(steph);
  const parser = new htmlparser.Parser(
    {
      oncomment: function(data) {
        const $ = cheerio.load(data);
        if ($('#div_advanced').length) {
          advanced = data;
        }
      },
    },
    { decodeEntities: true }
  );
  parser.write(html);
  parser.end();
  const $ = cheerio.load(html);
  const $a = cheerio.load(advanced);

  const PER = $a('#advanced\\.2016 [data-stat="per"]').text();
  const TS = $a('#advanced\\.2016 [data-stat="ts_pct"]').text();
  const WS = $a('#advanced\\.2016 [data-stat="ws_per_48"]').text();
  const PTS = $('#per_game\\.2016 [data-stat="pts_per_g"]').text();
  const AST = $('#per_game\\.2016 [data-stat="ast_per_g"]').text();

  return {
    PTS,
    AST,
    WS,
    TS,
    PER,
  };
}

async function perGame(url) {
  const html = await request(url);
  const $ = cheerio.load(html);
  const games = $('#pgl_basic tbody tr').not('.thead').toArray().map(e => {
    return {
      points: $("[data-stat='pts']", e).text() === ''
        ? 'NA'
        : $("[data-stat='pts']", e).text(),
      opp: $("[data-stat='opp_id']", e).text() === ''
        ? 'NA'
        : $("[data-stat='opp_id']", e).text(),
      assists: $("[data-stat='ast']", e).text() === ''
        ? 'NA'
        : $("[data-stat='ast']", e).text(),
      rebounds: $("[data-stat='trb']", e).text() === ''
        ? 'NA'
        : $("[data-stat='trb']", e).text(),
    };
  });
  return games;
}

async function stephCurrentAvgs() {
  let advanced;
  const html = await request(steph);
  const parser = new htmlparser.Parser(
    {
      oncomment: function(data) {
        const $ = cheerio.load(data);
        if ($('#div_advanced').length) {
          advanced = data;
        }
      },
    },
    { decodeEntities: true }
  );
  parser.write(html);
  parser.end();
  const $ = cheerio.load(advanced);
  const PER = $('tbody [data-stat="per"]').last().text();
  const TS = $('tbody [data-stat="ts_pct"]').last().text();
  const WS = $('tbody [data-stat="ws_per_48"]').last().text();
  return {
    PER,
    TS,
    WS,
  };
}

perGame(
  'https://www.basketball-reference.com/players/c/curryst01/gamelog/2018'
).then(x => console.log(x));
// ghost().then(x => console.log(x));
// stephCurrentAvgs().then(x => console.log(x));
// perGame(
//   'https://www.basketball-reference.com/players/c/curryst01/gamelog/2016'
// ).then(x => console.log(x));
