const { join } = require('path');
const baseConfig = require('./tailwind.base.config.cjs');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    ...(baseConfig?.content || []),
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    join(__dirname, '.storybook/**/*.{js,jsx,ts,tsx}'),
  ],
  ...baseConfig,
};
