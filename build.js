const aws = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const shelljs = require('shelljs');
const globby = require('globby');

const secrets = require('./config.js');

const S3 = new aws.S3();
const CF = new aws.CloudFront();
const stdin = process.stdin;
const css = [];
const mimeTypes = {
  '.png': 'image/png',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
};

stdin.on('data', data => css.push(data));

stdin.on('end', () => {
  const html = fs.readFileSync('./index.html').toString();
  const $ = cheerio.load(html);
  const processed = css.map(x => x.toString()).join('');
  $('link').remove();
  $('style').empty().html(processed);

  S3.putObject(
    {
      Body: $.html(),
      Key: 'index.html',
      Bucket: 'mvp-demo',
      ContentType: 'text/html',
      ACL: 'public-read',
    },
    (err, data) => {
      console.log(err, data);
      if (!err) {
        shelljs.exec('git checkout index.html');
      }
    }
  );
});

const upload = (file, i) =>
  new Promise((resolve, reject) => {
    S3.putObject(
      {
        Body: fs.readFileSync(file),
        Key: file.split('./')[1],
        Bucket: 'mvp-demo',
        ContentType: mimeTypes[path.parse(file).ext],
        ACL: 'public-read',
      },
      (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });

const clear = () => {
  const cfParams = {
    DistributionId: secrets.cf,
    InvalidationBatch: {
      CallerReference: `${Date.now()}`,
      Paths: {
        Quantity: 1,
        Items: ['/*'],
      },
    },
  };

  CF.createInvalidation(cfParams, (err, data) => {
    if (err) {
      console.log(`🔥 Error running: ${err}`);
    } else {
      console.log(`✅ Done: ${JSON.stringify(data)}`);
    }
  });
};

const assets = globby.sync('./assets/*');
const dist = globby.sync('./dist/*');

Promise.all([
  assets.filter(x => path.parse(x).ext !== '.css').forEach(upload),
  dist.forEach(upload),
]).then(() => clear());
