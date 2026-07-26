import assert from 'node:assert'
import { argv } from 'node:process'
import { exec } from '../utils/exec'
import { readPackageJson } from '../utils/files'
import { findAllConnectorsDirectoryInSource } from '../utils/connector-script-utils'
import { isNil } from '@wippa/shared'
import chalk from 'chalk'
import path from 'node:path'
import { publishNpmPackage } from '../utils/publish-npm-package'

export const publishConnector = async (name: string): Promise<void> => {
  assert(name, '[publishConnector] parameter "name" is required')

  const distPaths = await findAllConnectorsDirectoryInSource()
  const directory = distPaths.find(p => path.basename(p) === name)
  if (isNil(directory)) {
    console.error(chalk.red(`[publishConnector] can't find the directory with name ${name}`))
    return
  }

  const { name: packageName, version } = await readPackageJson(directory)
  await exec(`turbo run build --filter=${packageName}`)

  await publishNpmPackage(directory)

  console.info(chalk.green.bold(`[publishConnector] success, name=${name}, version=${version}`))
}

const main = async (): Promise<void> => {
  const connectorName = argv[2]
  await publishConnector(connectorName)
}

/*
 * module is entrypoint, not imported i.e. invoked directly
 * see https://nodejs.org/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main()
}
