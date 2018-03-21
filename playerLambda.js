const cheerio = require('cheerio');
const axios = require('axios');
const htmlparser = require('htmlparser2');
const aws = require('aws-sdk');
const secrets = require('./config.js');

const s3 = new aws.S3({ region: 'us-east-1' });
const CF = new aws.CloudFront();

const clear = cb => {
  const cfParams = {
    DistributionId: secrets.cf,
    InvalidationBatch: {
      CallerReference: `${Date.now()}`,
      Paths: {
        Quantity: 1,
        Items: ['/data/*'],
      },
    },
  };

  CF.createInvalidation(cfParams, (err, data) => {
    if (err) {
      cb(`🔥 Error running: ${err}`);
    } else {
      cb(null, `✅ Done: ${JSON.stringify(data)}`);
    }
  });
};

const playerMap = {
  steph: {
    url: 'c/curryst01',
    displayName: 'Steph',
    year: '2018',
  },
  harden: {
    url: 'h/hardeja01',
    displayName: 'Harden',
    year: '2018',
  },
  davis: {
    url: 'd/davisan02',
    displayName: 'AD',
    year: '2018',
  },
  lebron: {
    url: 'j/jamesle01',
    displayName: 'LeBron',
    year: '2018',
  },
  dame: {
    url: 'l/lillada01',
    displayName: 'Dame',
    year: '2018',
  },
  freak: {
    url: 'a/antetgi01',
    displayName: 'Giannis',
    year: '2018',
  },
  ghost: {
    url: 'c/curryst01',
    displayName: 'Ghost',
    year: '2016',
  },
};

const playerLambda = (event, context, callback) => {
  const gameLog = `https://www.basketball-reference.com/players/${playerMap[
    event.player
  ].url}/gamelog/${playerMap[event.player].year}`;

  const avg = `https://www.basketball-reference.com/players/${playerMap[
    event.player
  ].url}.html`;

  Promise.all([perGame(gameLog), currentAvgs(avg, event.player)]).then(x => {
    const date = new Date().toISOString();

    const data = {
      perGame: x[0],
      avgs: x[1],
      displayName: playerMap[event.player].displayName,
      date,
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
        console.log(uploadData);
        clear(callback);
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
      const games = $('#pgl_basic tbody tr')
        .not('.thead')
        .toArray()
        .map(e => {
          if ($("[data-stat='pts']", e).text() === '') {
            return null;
          } else {
            return {
              points: $("[data-stat='pts']", e).text(),
              opp: $("[data-stat='opp_id']", e).text(),
              assists: $("[data-stat='ast']", e).text(),
              rebounds: $("[data-stat='trb']", e).text(),
            };
          }
        })
        .filter(x => x);
      resolve(games);
    });
  });
}

const currentAvgs = (url, player) =>
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
      const PER = player === 'ghost'
        ? $('#advanced\\.2016 [data-stat="per"]').text()
        : $('tbody [data-stat="per"]').last().text();
      const TS = player === 'ghost'
        ? $('#advanced\\.2016 [data-stat="ts_pct"]').text()
        : $('tbody [data-stat="ts_pct"]').last().text();
      const WS = player === 'ghost'
        ? $('#advanced\\.2016 [data-stat="ws_per_48"]').text()
        : $('tbody [data-stat="ws_per_48"]').last().text();

      const reg$ = cheerio.load(html);
      const PTS = reg$(
        `#per_game\\.${playerMap[player].year} [data-stat=pts_per_g]`
      ).text();
      const AST = reg$(
        `#per_game\\.${playerMap[player].year} [data-stat=ast_per_g]`
      ).text();
      const RBD = reg$(
        `#per_game\\.${playerMap[player].year} [data-stat=trb_per_g]`
      ).text();

      resolve({
        PER,
        TS,
        WS,
        points: PTS,
        assists: AST,
        rebounds: RBD,
      });
    });
  });

exports.handler = playerLambda;
