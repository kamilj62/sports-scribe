module.exports = (api) => {
  const isTest = api.env('test');
  
  return {
    presets: [
      [
        'next/babel',
        {
          'preset-react': {
            runtime: 'automatic',
            importSource: '@emotion/react',
          },
        },
      ],
    ],
    plugins: [
      'babel-plugin-macros',
      // Only add these plugins for test environment if needed
      ...(isTest ? [
        ['@babel/plugin-transform-class-properties', { loose: true }],
        '@babel/plugin-transform-optional-chaining',
      ] : []),
    ],
  };
};
