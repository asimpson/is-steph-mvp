const axios = require('axios');

const fireSound = () => {
  const baseAudioContext = new (window.AudioContext ||
    window.webkitAudioContext)();
  const source = baseAudioContext.createBufferSource();

  axios
    .get(
      'http://mvp-demo.s3-website-us-east-1.amazonaws.com/assets/hey-hey.mp3',
      { responseType: 'arraybuffer' }
    )
    .then(({ data }) =>
      baseAudioContext.decodeAudioData(
        data,
        buffer => {
          source.buffer = buffer;
          source.connect(baseAudioContext.destination);
          source.start();
        },
        err => console.log('issue with audio api: ', err)
      )
    );
};

export default fireSound;
