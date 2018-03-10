const axios = require('axios');

// below funcs taken from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String

const ab2str = buf => String.fromCharCode.apply(null, new Uint16Array(buf));

const str2ab = str => {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};

const fireSound = (buffer, cb) => {
  const baseAudioContext = new (window.AudioContext ||
    window.webkitAudioContext)();
  const source = baseAudioContext.createBufferSource();

  if (!buffer) {
    axios
      .get(
        'http://mvp-demo.s3-website-us-east-1.amazonaws.com/assets/hey-hey.mp3',
        { responseType: 'arraybuffer' }
      )
      .then(({ data }) => {
        const dataAsBuffer = ab2str(data);
        cb(dataAsBuffer);
        baseAudioContext.decodeAudioData(
          data,
          buffer => {
            source.buffer = buffer;
            source.connect(baseAudioContext.destination);
            source.start();
          },
          err => console.log('issue with audio api: ', err)
        );
      });
  } else {
    baseAudioContext.decodeAudioData(
      str2ab(buffer),
      buffer => {
        source.buffer = buffer;
        source.connect(baseAudioContext.destination);
        source.start();
      },
      err => console.log('issue with audio api: ', err)
    );
  }
};

export default fireSound;
