const cheerio = require('cheerio');
const axios = require('axios');
const htmlparser = require('htmlparser2');
const aws = require('aws-sdk');

const s3 = new aws.S3({ region: 'us-east-1' });

const playerMap = {
  steph: 'c/curryst01',
  harden: 'h/hardeja01',
  davis: 'd/davisan02',
};

const playerLambda = (event, context, callback) => {
  const gameLog = `https://www.basketball-reference.com/players/${playerMap[
    event.player
  ]}/gamelog/2018`;

  const avg = `https://www.basketball-reference.com/players/${playerMap[
    event.player
  ]}.html`;

  Promise.all([perGame(gameLog), currentAvgs(avg)]).then(x => {
    const data = {
      perGame: x[0],
      avgs: x[1],
    };
    const params = {
      Bucket: process.env.bucket,
      Body: JSON.stringify(data),
      ACL: 'public-read',
      ContentType: 'application/json',
      Key: `data/${event.player}.json`,
    };
    s3.putObject(params, (err, uploadData) => {
      if (err) {
        callback(err);
      }

      if (uploadData) {
        callback(null, uploadData);
      }
    });
  });
};

const request = url =>
  new Promise((resolve, reject) =>
    axios.get(url).then(res => resolve(res.data))
  );

function perGame(url) {
  return new Promise(function(resolve, reject) {
    request(url).then(html => {
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
      resolve(games);
    });
  });
}

const currentAvgs = url =>
  new Promise((resolve, reject) => {
    let advanced;
    request(url).then(html => {
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
      resolve({
        PER,
        TS,
        WS,
      });
    });
  });

exports.handler = playerLambda;
