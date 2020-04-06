import * as vscode from 'vscode';
import { Manager } from "../manager";
import { Logger } from "../logger";
import { exec} from 'child_process';
import * as path from 'path';

export class Build {

  manager: Manager;
  logger: Logger;

  constructor(logger: Logger, manager: Manager) {
    this.logger = logger;
    this.manager = manager;
  }

  async n4() {
    let rootFolder = await this.manager.findProjectRoot() + "\\";
    let isSuccessful = false;
    this.logger.addBuildLogMessage("build Project ...");
    this.manager.checkIfAutoSaveIsActive();

    const configuration = vscode.workspace.getConfiguration("vsc-niagara");
    const useGradleW = configuration.get("build.nx.gradlew") as boolean;

    if(rootFolder) {
      this.logger.showSpiningStatusItem("build N4 ...");
      let cmd = "";
      if (useGradleW) {
        cmd = "gradlew build";

      } else {
        cmd = "gradle build";
      }


      this.logger.addBuildLogMessage("execute: " + cmd + " in " + rootFolder);
      let process = exec(cmd, {cwd: rootFolder});

      if (process)  {

        if (process.stdout) {
          process.stdout.on('data', newStdOut => {

            let trimmedData = newStdOut.toString().trim();
            if (trimmedData !== "" || trimmedData) {
              if (trimmedData.match('.*BUILD SUCCESSFUL.*')) {
                isSuccessful = true;
              }
              let match = /\r|\n/.exec(trimmedData);
              if (match) {
                let multLineData = trimmedData.split("\n");
                multLineData.forEach((data: string) => {
                  if (data !== "" || data) {
                    this.logger.addBuildLogMessage(data);
                  }
                });
              }else {
                this.logger.addBuildLogMessage(trimmedData);
              }

            }

          });
        }

        if (process.stderr) {
          // let stdErr = '';
          process.stderr.on('data', newStdErr => {
            console.log("build err: " + newStdErr.toString());
            // stdErr += newStdErr;
            this.logger.addBuildLogMessage(newStdErr.toString());
          });

          process.on('error', err => {
            this.logger.addExtensionMessage("build command failed: " + err.message);
            vscode.window.showErrorMessage("root folder not found");
          });
        }

        process.on('exit', (exitCode, signal) => {
          // process output
          // console.log("Out: " + stdOut);
          // console.log("Err: " + stdErr);
          const now = new Date();
          let build_time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
          if (isSuccessful) {
            this.logger.showSuccessStatusItem("build", build_time);
          }
          else if(!isSuccessful){
            this.logger.showFailedStatusItem("build");
          }
        });

      }

    }
    else{
      this.logger.addBuildLogMessage("root folder not found");
      this.logger.showErrorStatusItem();
      vscode.window.showErrorMessage("root folder not found");
    }
  }

  async ax() {
    this.logger.addBuildLogMessage("build AX Project");
    let rootFolder = await this.manager.findProjectRoot() + "\\";
    const configuration = vscode.workspace.getConfiguration("vsc-niagara");
    const axHome = configuration.get("niagara.ax.home") as string;
    let isSuccessful = false;

    this.logger.addBuildLogMessage("build Project ...");
    this.manager.checkIfAutoSaveIsActive();

    if(rootFolder) {
      this.logger.showSpiningStatusItem("build AX ...");
      let exe = path.join(axHome, "bin\\build.exe");
      let cmd =  exe + " " + rootFolder + "build.xml full";
      this.logger.addBuildLogMessage("build: " + cmd);
      let process = exec(cmd, {cwd: rootFolder});

      if (process) {

        if (process.stdout) {
          process.stdout.on('data', newStdOut => {

            let trimmedData = newStdOut.toString().trim();
            if (trimmedData.length !== 0) {
              if (trimmedData.match('.*Success!.*')) {
                isSuccessful = true;
              }

              console.log("seperated Line: " + trimmedData);
              // stdOut += line + "\n";
              console.log("build out: " + trimmedData);
              this.logger.addBuildLogMessage(trimmedData);

            }

          });
        }

        if (process.stderr) {
          // let stdErr = '';
          process.stderr.on('data', newStdErr => {
            console.log("build err: " + newStdErr.toString());
            // stdErr += newStdErr;
            this.logger.addBuildLogMessage(newStdErr.toString());
          });

          process.on('error', err => {
            this.logger.addExtensionMessage("build command failed: " + err.message);
            vscode.window.showErrorMessage("root folder not found");
          });
        }


        process.on('exit', (exitCode, signal) => {

          const now = new Date();
          let build_time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
          if (isSuccessful) {
            this.logger.showSuccessStatusItem("build", build_time);
          }
          else if(!isSuccessful){
            this.logger.showFailedStatusItem("build");
          }
        });

      }
    } else {
      this.logger.addBuildLogMessage("root folder not found");
      this.logger.showErrorStatusItem();
      vscode.window.showErrorMessage("root folder not found");
    }
  }
}
