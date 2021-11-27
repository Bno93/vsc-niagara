import { Logger } from "./logger";
import { exec } from 'child_process';
import * as vscode from 'vscode';
import path = require("path");

export namespace CommandHandler {
    const formatText = (text: string) => `\r${text.split(/(\r?\n)/g).join("\r")}`;
    export function runCommand(command: string, rootFolder: string, logger: Logger) {
        let isSuccessful = false;
        const project = path.basename(rootFolder);

        let process = exec(command, { encoding: "utf8", cwd: rootFolder });

        if (process) {

            if (process.stdout) {
                process.stdout.on('data', newStdOut => {

                    let trimmedData = newStdOut.toString().trim();
                    let data = formatText(trimmedData)
                    if (data.match('.*BUILD SUCCESSFUL.*')) {
                        isSuccessful = true;
                    }
                    logger.addBuildLogMessage(trimmedData);
                });
            }

            if (process.stderr) {
                process.stderr.on('data', newStdErr => {
                    let trimmedData = newStdErr.toString().trim();
                    let data = formatText(trimmedData)
                    logger.addBuildLogMessage(data);
                });

                process.on('error', err => {
                    logger.addExtensionMessage("build command failed: " + err.message);
                    isSuccessful = false;
                    vscode.window.showErrorMessage("root folder not found");
                });
            }

            process.on('exit', (exitCode, signal) => {
                // process output

                let build_time = new Date().toLocaleTimeString('de-DE', { hour12: false });
                if (isSuccessful) {
                    logger.showSuccessStatusItem(`build ${project}`, build_time);
                }
                else if (!isSuccessful) {
                    logger.showFailedStatusItem(`build ${project}`);
                }
            });

        }

    }
}
