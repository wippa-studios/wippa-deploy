import { Command } from "commander";
import { buildConnector, findPiece } from '../utils/piece-utils';
import chalk from "chalk";
import inquirer from "inquirer";

async function buildPieces(connectorName: string) {
    const pieceFolder = await findPiece(connectorName);
    const { outputFolder } = await buildConnector(pieceFolder);
    console.info(chalk.green(`Piece '${connectorName}' built and packed successfully at ${outputFolder}.`));
}

export const buildPieceCommand = new Command('build')
    .description('Build pieces without publishing')
    .argument('[name]', 'name of the piece to build')
    .option('--name <connectorName>', 'name of the piece to build')
    .action(async (positionalName, options) => {
        const connectorName = positionalName ?? options.name;
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter the piece folder name',
                placeholder: 'google-drive',
                when() {
                    return !connectorName
                }
            },
        ];
        const answers = await inquirer.prompt(questions);
        await buildPieces(connectorName ?? answers.name);
    });
