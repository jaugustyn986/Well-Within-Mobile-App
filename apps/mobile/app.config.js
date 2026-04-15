// EAS sets this per build profile; local Metro against a dev client should use the same
// (e.g. EAS_BUILD_PROFILE=development in apps/mobile/.env) so the URL scheme matches the installed app.
const buildProfile = process.env.EAS_BUILD_PROFILE || 'production';

const variant = {
  development: {
    name: 'Well Within Dev',
    bundleIdentifier: 'com.wellwithin.app.dev',
    /** Distinct from production so iOS opens the correct app when both dev + TestFlight are installed. */
    scheme: 'wellwithin-dev',
  },
  preview: {
    name: 'Well Within Preview',
    bundleIdentifier: 'com.wellwithin.app.preview',
    scheme: 'wellwithin-preview',
  },
  production: {
    name: 'Well Within',
    bundleIdentifier: 'com.wellwithin.app',
    scheme: 'wellwithin',
  },
}[buildProfile];

module.exports = {
  expo: {
    name: variant.name,
    slug: 'modern-creighton',
    version: '0.2.0',
    icon: './assets/icon-1024.png',
    orientation: 'portrait',
    platforms: ['ios', 'web'],
    web: {
      bundler: 'metro',
      output: 'single',
    },
    splash: {
      image: './assets/icon-1024.png',
      resizeMode: 'contain',
      backgroundColor: '#F6F3EF',
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: variant.bundleIdentifier,
      // Build number for store builds comes from EAS (eas.json appVersionSource: remote + autoIncrement).
      // Omit static buildNumber to avoid conflicting manifest noise; local dev still works.
      config: {
        usesNonExemptEncryption: false,
      },
    },
    scheme: variant.scheme,
    extra: {
      eas: {
        projectId: '9bec1077-74cd-4054-a6ee-d4a6511a7d0a',
      },
    },
    owner: 'jaugustyn986',
  },
};
