import chalk from 'chalk';
import { Command } from 'commander';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import {
  generateActions,
  generateAuth,
  getJsonFromUrl,
  isUrl,
} from '../utils/scale';
import { extractBaseURL } from '../utils/scale/openai-utils';
import { createBlock } from './create-block';

const convertOpenAPIToBlock = async (openAPISpec) => {
  const blockName = openAPISpec.info.title.replace(/\s+/g, '-').toLowerCase();
  const packageName = `@openops/block-${blockName}`;
  const blockNameCamelCase = blockName
    .split('-')
    .map((s, i) => (i === 0 ? s : s[0].toUpperCase() + s.substring(1)))
    .join('');

  const blockDir = path.join('packages', 'blocks', blockName, 'src');
  const actionsDir = path.join(blockDir, 'lib', 'action');
  await createBlock(blockName, packageName);

  console.log(chalk.green(`Generating authentication for ${blockName}...`));
  const authCode = await generateAuth(openAPISpec);
  const authDisplayName = authCode.split('\n')[1].trim().split(' ')[2];
  console.log(chalk.green(`Getting server url for ${blockName}...`));
  const baseURL = await extractBaseURL(openAPISpec);

  console.log(
    chalk.green(`Generating ${blockName} actions, please be patient...`),
  );

  const actions = await generateActions(openAPISpec, authDisplayName, baseURL);

  if (actions.length > 0 && !existsSync(actionsDir)) {
    mkdirSync(actionsDir, { recursive: true });
  }

  actions.forEach((action) => {
    writeFileSync(path.join(actionsDir, `${action.name}.ts`), action.code);
  });

  const actionImports = actions
    .map(
      (action) =>
        `import { ${action.name} } from './lib/action/${action.name}';`,
    )
    .join('\n');
  const actionExports = actions.map((action) => `${action.name}`).join(', ');

  const blockDefinition = `
    import { OAuth2PropertyValue, BlockAuth, createBlock } from '@openops/blocks-framework';
    import { createCustomApiCallAction } from '@openops/blocks-common';

    ${actionImports}

    ${authCode}

    export const ${blockNameCamelCase} = createBlock({
      displayName: '${openAPISpec.info.title}',
      auth: ${authDisplayName},
      minimumSupportedRelease: '0.20.0',
      logoUrl: 'https://static.openops.com/blocks/${blockName}.png',
      authors: [],
      actions: [
        ${actionExports},
        createCustomApiCallAction({
          baseUrl: () => {
            return '${baseURL}';
          },
          auth: ${authDisplayName},
          authMapping: async (auth) => {
            return {
              Authorization: \`Bearer \${(auth as OAuth2PropertyValue).access_token}\`,
            };
          },
        }),
      ],
      triggers: [],
    });
  `;

  writeFileSync(path.join(blockDir, 'index.ts'), blockDefinition);
  console.log(chalk.green(`Enjoy ${blockName} at ${blockDir}. ❤️`));
};

const handleAPIConversion = async (pathOrUrl) => {
  let openAPISpec;

  if (isUrl(pathOrUrl)) {
    try {
      openAPISpec = await getJsonFromUrl(pathOrUrl);
      console.log('API spec downloaded successfully.');
    } catch (error) {
      console.error('Failed to download API spec:', error.message);
      return;
    }
  } else {
    try {
      openAPISpec = yaml.load(readFileSync(pathOrUrl, 'utf8'));
      console.log('API spec read from file successfully.');
    } catch (error) {
      console.error('Failed to read API spec from file:', error.message);
      return;
    }
  }

  try {
    await convertOpenAPIToBlock(openAPISpec);
  } catch (error) {
    console.error('Failed to convert block:', error.message);
  }
};

export const scaleBlocksCommand = new Command('scale')
  .description('Scale blocks in a certain way')
  .argument('<path>', 'Path to the OpenAPI spec file')
  .action(handleAPIConversion);
