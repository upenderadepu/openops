import assert from 'node:assert'
import { argv } from 'node:process'
import { exec } from '../utils/exec'
import { readPackageJson, readProjectJson } from '../utils/files'
import { findAllBlocksDirectoryInSource } from '../utils/block-script-utils'
import { isNil } from '../../../packages/shared/src'
import chalk from 'chalk'

export const publishBlock = async (name: string): Promise<void> => {
  assert(name, '[publishBlock] parameter "name" is required')

  const distPaths = await findAllBlocksDirectoryInSource()
  const directory = distPaths.find(path => {
    if (path.endsWith(`/${name}`)) {
      return true;
    }
    return false
  })
  if (isNil(directory)) {
    console.error(chalk.red(`[publishBlock] can't find the directory with name ${name}`))
    return
  }
  const { version } = await readPackageJson(directory)
  const { name: nxProjectName } = await readProjectJson(directory)

  await exec(`npx nx build ${nxProjectName}`)


  const nxPublishProjectCommand = `
    node tools/scripts/publish.mjs \
      ${nxProjectName} \
      ${version} \
      latest
  `


  await exec(nxPublishProjectCommand)

  console.info(chalk.green.bold(`[publishBlock] success, name=${name}, version=${version}`))

}

const main = async (): Promise<void> => {
  const blockName = argv[2]
  await publishBlock(blockName)
}

/*
 * module is entrypoint, not imported i.e. invoked directly
 * see https://nodejs.org/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main()
}
