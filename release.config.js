const config = {
  branches: ['main', { name: 'staging', prerelease: true }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/github'
  ]
};

module.exports = config;
