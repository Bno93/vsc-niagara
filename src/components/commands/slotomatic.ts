import * as vscode from 'vscode';
import { Manager } from "../manager";
import { Logger } from "../logger";
import { exec} from 'child_process';
import * as path from 'path';

export class SlotomaticWrapper {

  manager: Manager;
  logger: Logger;

  constructor(logger: Logger, manager: Manager) {
    this.logger = logger;
    this.manager = manager;
  }


  async nx() {
    let rootFolder = await this.manager.findProjectRoot() + "\\";
    let isSuccessful = false;
    this.logger.addBuildLogMessage("run slot-o-matic ...");
    this.manager.checkIfAutoSaveIsActive();

    if(rootFolder) {
      this.logger.showSpiningStatusItem("slotomatic");
      const cmd = "gradle slotomatic";
      console.log("execute: " + cmd + " in " + rootFolder);
      let process =exec(cmd, {cwd: rootFolder});
      process.stdout.on('data', newStdOut => {

        let trimmedData = newStdOut.toString().trim();
        if(trimmedData.length !== 0) {
          if (trimmedData.match('.*BUILD SUCCESSFUL.*')) {
            isSuccessful = true;
          }
        }
        console.log("seperated Line: " + trimmedData);
        // stdOut += line + "\n";
        console.log("slot-o-matic out: " + trimmedData);
        this.logger.addBuildLogMessage(trimmedData);

      });

      process.stderr.on('data', newStdErr => {
        console.log("slot-o-matic err: " + newStdErr.toString());
        // stdErr += newStdErr;
        this.logger.addBuildLogMessage(newStdErr.toString());
      });

      process.on('error', err => {
        this.logger.addExtensionMessage("slot-o-matic command failed: " + err.message);
        vscode.window.showErrorMessage("root folder not found");
      });

      process.on('exit', (exitCode, signal) => {
        // process output
        // console.log("Out: " + stdOut);
        // console.log("Err: " + stdErr);
        if (isSuccessful) {
          this.logger.showSuccessStatusItem("slotomatic");
        }
        else if(!isSuccessful){
          this.logger.showFailedStatusItem("slotomatic");
        }
      });
    }
    else{
      this.logger.addBuildLogMessage("root folder not found");
      this.logger.showErrorStatusItem();
      vscode.window.showErrorMessage("root folder not found");
    }

  }


  async ax() {
    let rootFolder = await this.manager.findProjectRoot() + "\\";
    const configuration = vscode.workspace.getConfiguration("vsc-niagara");
    const axHome = configuration.get("niagara.ax.home") as string;
    let isSuccessful = false;


    this.manager.checkIfAutoSaveIsActive();

    if(rootFolder) {
      this.logger.showSpiningStatusItem("run slot-o-matic ...");
      let exe = path.join(axHome, "bin\\slot.exe");
      let cmd =  exe + " " + rootFolder + " -mi";
      this.logger.addBuildLogMessage("build: " + cmd);
      let process = exec(cmd, {cwd: rootFolder});

      process.stdout.on('data', newStdOut => {

        let trimmedData = newStdOut.toString().trim();
        if (trimmedData.length !== 0) {
          if (trimmedData.match('.*Compiled.*')) {
            isSuccessful = true;
          }

          console.log("seperated Line: " + trimmedData);
          // stdOut += line + "\n";
          console.log("build out: " + trimmedData);
          this.logger.addBuildLogMessage(trimmedData);

        }

      });
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

    } else{
      this.logger.addBuildLogMessage("root folder not found");
      this.logger.showErrorStatusItem();
      vscode.window.showErrorMessage("root folder not found");
    }
  }


}
