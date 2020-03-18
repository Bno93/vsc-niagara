import * as vscode from 'vscode';
import { exec} from 'child_process';
import { Manager } from './manager';
import { Logger } from './logger';
import { Build } from './commands/build';
import { SlotomaticWrapper } from "./commands/slotomatic";
import { Project } from './project';


export class Commander {
  logger : Logger;
  manager : Manager;
  builder : Build;
  slotomaticWrapper : SlotomaticWrapper;
  project : Project;



  constructor(logger : Logger, project : Project) {
    this.logger = logger;
    this.manager = new Manager();
    this.builder = new Build(this.logger, this.manager);
    this.slotomaticWrapper = new SlotomaticWrapper(this.logger, this.manager);
    this.project = project;
  }


  async build() {
    this.manager.checkProjectVersion().then((projVersion) => {
      this.logger.addExtensionMessage("build as a N "+ projVersion);
      if(this.manager.nxProject) {
        this.builder.n4();
      }
      else if(this.manager.axProject) {
        this.builder.ax();
      }
      else {
        this.logger.addBuildLogMessage("fail to build is ether no N3 or N4 project");
      }
    });
  }


  async slotomatic() {
    this.manager.checkProjectVersion().then((projVersion) => {


      this.logger.addExtensionMessage("build as a N "+ projVersion);
      if(this.manager.nxProject) {
        this.slotomaticWrapper.n4();
      }
      else if(this.manager.axProject) {
        this.slotomaticWrapper.ax();
      }
      else {
        this.logger.addBuildLogMessage("fail to build is ether no N3 or N4 project");
      }
    });
  }

    async clean() {
      let rootFolder = await this.manager.findProjectRoot() + "\\";
      let isSuccessful = false;
      this.logger.addBuildLogMessage("clean project ...");
      this.manager.checkIfAutoSaveIsActive();

      if(rootFolder) {
        this.logger.showSpiningStatusItem("clean...");
        const cmd = "gradle clean";
        this.logger.addExtensionMessage("execute: " + cmd + " in " + rootFolder);
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
          console.log("clean out: " + trimmedData);
          this.logger.addBuildLogMessage(trimmedData);

        });

        process.stderr.on('data', newStdErr => {
          console.log("clean err: " + newStdErr.toString());
          // stdErr += newStdErr;
          this.logger.addBuildLogMessage(newStdErr.toString());
        });

        process.on('error', err => {
          this.logger.addExtensionMessage("clean command failed: " + err.message);
          vscode.window.showErrorMessage("root folder not found");
        });

        process.on('exit', (exitCode, signal) => {
          // process output
          // console.log("Out: " + stdOut);
          // console.log("Err: " + stdErr);
          if (isSuccessful) {
            this.logger.showSuccessStatusItem("clean");
          }
          else if(!isSuccessful){
            this.logger.showFailedStatusItem("clean");
          }
        });
      }
      else{
        this.logger.addBuildLogMessage("root folder not found");
        this.logger.showErrorStatusItem();
        vscode.window.showErrorMessage("root folder not found");
      }

    }


  async moduleTestJar() {

    let rootFolder = await this.manager.findProjectRoot() + "\\";
    let isSuccessful = false;
    this.logger.addBuildLogMessage("run moduleTestJar ...");
    this.manager.checkIfAutoSaveIsActive();

    if(rootFolder) {
      this.logger.showSpiningStatusItem("build TestJar...");
      const cmd = "gradle moduleTestJar";
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
        console.log("build TestJar out: " + trimmedData);
        this.logger.addBuildLogMessage(trimmedData);

      });

      process.stderr.on('data', newStdErr => {
        console.log("build TestJar err: " + newStdErr.toString());
        // stdErr += newStdErr;
        this.logger.addBuildLogMessage(newStdErr.toString());
      });

      process.on('error', err => {
        this.logger.addExtensionMessage("build TestJar command failed: " + err.message);
        vscode.window.showErrorMessage("root folder not found");
      });

      process.on('exit', (exitCode, signal) => {
        // process output
        // console.log("Out: " + stdOut);
        // console.log("Err: " + stdErr);
        if (isSuccessful) {
          this.logger.showSuccessStatusItem("build TestJar");
        }
        else if(!isSuccessful){
          this.logger.showFailedStatusItem("build TestJar");
        }
      });
    }
    else{
      this.logger.addBuildLogMessage("root folder not found");
      this.logger.showErrorStatusItem();
      vscode.window.showErrorMessage("root folder not found");
    }
  }



  //moduleTestJar
}
