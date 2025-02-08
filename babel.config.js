module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
    ['@babel/plugin-transform-class-properties', { loose: true }], // Ensure consistency
    ['@babel/plugin-transform-private-methods', { loose: true }], // Ensure consistency
    ['@babel/plugin-transform-private-property-in-object', { loose: true }], // Ensure consistency
    'react-native-reanimated/plugin', // Always keep this as the last plugin
  ],
};
