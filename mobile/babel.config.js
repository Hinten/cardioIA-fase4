// Configuração de Babel exigida pelo Expo para transpilar o app React Native.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
