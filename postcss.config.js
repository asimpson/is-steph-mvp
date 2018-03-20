module.exports = {
  plugins: [
    require('cssnano')({
      preset: [
        'default',
        {
          zindex: false,
        },
      ],
    }),
  ],
};
