const env = process.env.BABEL_ENV;
let targets = {};

if(env === 'test') {
  targets = { node: 'current' };
} else {
  targets = {
    browsers: ['last 2 versions'],
    node: 4
  };
}

var settings = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { node: 'current' },
        shippedProposals: true,
        modules: env === 'test' ? 'commonjs' : false,
        useBuiltIns: 'usage'
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        pragma: 'h'
      }
    ],
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties'
  ]
};

module.exports = settings;