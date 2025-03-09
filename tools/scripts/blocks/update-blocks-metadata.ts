import assert from 'node:assert';
import { BlockMetadata } from '../../../packages/blocks/framework/src';
import { StatusCodes } from 'http-status-codes';
import { HttpHeader } from '../../../packages/blocks/common/src';
import { findAllBlocks } from '../utils/block-script-utils';

assert(process.env['OPS_CLOUD_API_KEY'], 'API Key is not defined');

const { OPS_CLOUD_API_KEY } = process.env;
const OPS_CLOUD_API_BASE = 'https://dev.openops.com/api/v1';

const insertBlockMetadata = async (
  blockMetadata: BlockMetadata
): Promise<void> => {
  const body = JSON.stringify(blockMetadata);

  const headers = {
    [HttpHeader.API_KEY]: OPS_CLOUD_API_KEY,
    [HttpHeader.CONTENT_TYPE]: 'application/json'
  };

  const cloudResponse = await fetch(`${OPS_CLOUD_API_BASE}/admin/blocks`, {
    method: 'POST',
    headers,
    body
  });

  if (cloudResponse.status !== StatusCodes.OK) {
    throw new Error(await cloudResponse.text());
  }
};

const blockMetadataExists = async (
  blockName: string,
  blockVersion: string
): Promise<boolean> => {
  const cloudResponse = await fetch(
    `${OPS_CLOUD_API_BASE}/blocks/${blockName}?version=${blockVersion}`
  );

  const blockExist: Record<number, boolean> = {
    [StatusCodes.OK]: true,
    [StatusCodes.NOT_FOUND]: false
  };

  if (
    blockExist[cloudResponse.status] === null ||
    blockExist[cloudResponse.status] === undefined
  ) {
    throw new Error(await cloudResponse.text());
  }

  return blockExist[cloudResponse.status];
};

const insertMetadataIfNotExist = async (blockMetadata: BlockMetadata) => {
  console.info(
    `insertMetadataIfNotExist, name: ${blockMetadata.name}, version: ${blockMetadata.version}`
  );

  const metadataAlreadyExist = await blockMetadataExists(
    blockMetadata.name,
    blockMetadata.version
  );

  if (metadataAlreadyExist) {
    console.info(`insertMetadataIfNotExist, block metadata already inserted`);
    return;
  }

  await insertBlockMetadata(blockMetadata);
};

const insertMetadata = async (blocksMetadata: BlockMetadata[]) => {
  for (const blockMetadata of blocksMetadata) {
    await insertMetadataIfNotExist(blockMetadata);
  }
};


const main = async () => {
  console.log('update blocks metadata: started')

  const blocksMetadata = await findAllBlocks()
  await insertMetadata(blocksMetadata)

  console.log('update blocks metadata: completed')
  process.exit()
}

main()
