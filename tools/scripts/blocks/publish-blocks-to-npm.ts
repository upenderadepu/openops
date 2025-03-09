import { publishNxProject } from '../utils/publish-nx-project'
import { findAllBlocksDirectoryInSource } from '../utils/block-script-utils'

const publishBlock = async (nxProjectPath: string): Promise<void> => {
  console.info(`[publishBlock] nxProjectPath=${nxProjectPath}`)
  await publishNxProject(nxProjectPath)
}

const main = async () => {
  const blocksSource = await findAllBlocksDirectoryInSource()
  const publishResults = blocksSource.map(p => publishBlock(p))
  await Promise.all(publishResults)
}

main()
