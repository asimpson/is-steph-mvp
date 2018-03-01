const cheerio = require('cheerio');
const axios = require('axios');
const htmlparser = require('htmlparser2');
const aws = require('aws-sdk');

const s3 = new aws.S3({ region: 'us-east-1' });

const playerLambda = (event, context, callback) => {
  const playerMap = {
    steph: 'curryst01',
    harden: 'hardeja01',
    davis: 'davisan02',
  };
  const url = `https://www.basketball-reference.com/players/c/${playerMap[
    event.player
  ]}/gamelog/2018`;

  perGame(url).then(x => {
    const params = {
      Bucket: process.env.bucket,
      Body: x,
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
      resolve(JSON.stringify(games));
    });
  });
}

exports.handler = playerLambda;
