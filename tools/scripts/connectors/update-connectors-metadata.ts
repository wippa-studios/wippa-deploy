import assert from 'node:assert';
import { ConnectorMetadata } from '../../../packages/pieces/framework/src';
import { StatusCodes } from 'http-status-codes';
import { HttpHeader } from '../../../packages/pieces/common/src';
import { AP_CLOUD_API_BASE, findNewConnectors, connectorMetadataExists } from '../utils/connector-script-utils';
import { chunk } from '@wippa/core-utils';
assert(process.env['AP_CLOUD_API_KEY'], 'API Key is not defined');

const { AP_CLOUD_API_KEY } = process.env;

const insertPieceMetadata = async (
  connectorMetadata: ConnectorMetadata
): Promise<void> => {
  const body = JSON.stringify(connectorMetadata);

  const headers = {
    ['api-key']: AP_CLOUD_API_KEY,
    [HttpHeader.CONTENT_TYPE]: 'application/json'
  };

  const cloudResponse = await fetch(`${AP_CLOUD_API_BASE}/admin/pieces`, {
    method: 'POST',
    headers,
    body
  });

  if (cloudResponse.status !== StatusCodes.OK && cloudResponse.status !== StatusCodes.CONFLICT) {
    throw new Error(await cloudResponse.text());
  }
};



const insertMetadataIfNotExist = async (connectorMetadata: ConnectorMetadata) => {
  console.info(
    `insertMetadataIfNotExist, name: ${connectorMetadata.name}, version: ${connectorMetadata.version}`
  );

  const metadataAlreadyExist = await connectorMetadataExists(
    connectorMetadata.name,
    connectorMetadata.version
  );

  if (metadataAlreadyExist) {
    console.info(`insertMetadataIfNotExist, piece metadata already inserted`);
    return;
  }

  await insertPieceMetadata(connectorMetadata);
};

const insertMetadata = async (piecesMetadata: ConnectorMetadata[]) => {
  const batches = chunk(piecesMetadata, 30)
  for (const batch of batches) {
    await Promise.all(batch.map(insertMetadataIfNotExist))
    await new Promise(resolve => setTimeout(resolve, 5000))
  }
};

const main = async () => {
  console.log('update pieces metadata: started')

  const piecesMetadata = await findNewConnectors()
  await insertMetadata(piecesMetadata)

  console.log('update pieces metadata: completed')
  process.exit()
}

main()
