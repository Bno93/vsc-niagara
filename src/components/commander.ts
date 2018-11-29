import * as vscode from 'vscode';
import { exec} from 'child_process';
import { Manager } from './manager';
import { Logger } from './logger';


export class Commander {
  manager: Manager;
  statusItem: vscode.StatusBarItem;
  logger: Logger;
  constructor(logger: Logger) {
    this.manager = new Manager();
    this.statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    this.logger = logger;
  }

  saveTextDocuments() {
    let openTextDocs = vscode.workspace.textDocuments;

    openTextDocs.forEach(element => {
      if (element.isDirty) {
        element.save();
      }
    });
  }

  checkIfAutoSaveIsActive() {
    const configuration = vscode.workspace.getConfiguration("vsc-niagara");
    const autoSave = configuration.get("autoSave") as boolean;
    console.log("is autosave on? " + autoSave);
    if (autoSave) {
      this.saveTextDocuments();
    }
    else {
      vscode.window.showWarningMessage('WARNING: Some files may have to be merged!!');
    }

  }


  async buildNX() {
    let rootFolder = await this.manager.findProjectRoot() + "\\";
    let isSuccessful = false;
    this.logger.addBuildLogMessage("build Project ...");
    this.checkIfAutoSaveIsActive();

    if(rootFolder) {
      this.statusItem.text = "$(sync~spin) build...";
      this.statusItem.show();
      const cmd = "gradle build";
      console.log("execute: " + cmd + " in " + rootFolder);
      let process = exec(cmd, {cwd: rootFolder});

      process.stdout.on('data', newStdOut => {

        let trimmedData = newStdOut.toString().trim();
        if (trimmedData.length !== 0) {
          if (trimmedData.match('.*BUILD SUCCESSFUL.*')) {
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
        // process output
        // console.log("Out: " + stdOut);
        // console.log("Err: " + stdErr);
        if (isSuccessful) {
          this.statusItem.hide();
          this.statusItem.text = "$(check) build successful";
          this.statusItem.show();
        }
        else if(!isSuccessful){
          this.statusItem.hide();
          this.statusItem.text = "$(x) build failed";
          this.statusItem.show();
        }
      });
    }
    else{
      this.logger.addBuildLogMessage("root folder not found");
      this.statusItem.text = "error...";
      this.statusItem.show();
      vscode.window.showErrorMessage("root folder not found");
    }
  }

  async slotomatic() {
    let rootFolder = await this.manager.findProjectRoot() + "\\";
    let isSuccessful = false;
    this.logger.addBuildLogMessage("run slot-o-matic ...");
    this.checkIfAutoSaveIsActive();

    if(rootFolder) {
      this.statusItem.text = "$(sync~spin) slot-o-matic...";
      this.statusItem.show();
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
          this.statusItem.hide();
          this.statusItem.text = "$(check) slot-o-matic successful";
          this.statusItem.show();
        }
        else if(!isSuccessful){
          this.statusItem.hide();
          this.statusItem.text = "$(x) slot-o-matic failed";
          this.statusItem.show();
        }
      });
    }
    else{
      this.logger.addBuildLogMessage("root folder not found");
      this.statusItem.text = "error...";
      this.statusItem.show();
      vscode.window.showErrorMessage("root folder not found");
    }

  }


    async clean() {
      let rootFolder = await this.manager.findProjectRoot() + "\\";
    let isSuccessful = false;
    this.logger.addBuildLogMessage("clean project ...");
    this.checkIfAutoSaveIsActive();

    if(rootFolder) {
      this.statusItem.text = "$(sync~spin) clean...";
      this.statusItem.show();
      const cmd = "gradle clean";
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
          this.statusItem.hide();
          this.statusItem.text = "$(check) clean successful";
          this.statusItem.show();
        }
        else if(!isSuccessful){
          this.statusItem.hide();
          this.statusItem.text = "$(x) clean failed";
          this.statusItem.show();
        }
      });
    }
    else{
      this.logger.addBuildLogMessage("root folder not found");
      this.statusItem.text = "error...";
      this.statusItem.show();
      vscode.window.showErrorMessage("root folder not found");
    }

    }


  async moduleTestJar() {

    let rootFolder = await this.manager.findProjectRoot() + "\\";
    let isSuccessful = false;
    this.logger.addBuildLogMessage("run moduleTestJar ...");
    this.checkIfAutoSaveIsActive();

    if(rootFolder) {
      this.statusItem.text = "$(sync~spin) build TestJar...";
      this.statusItem.show();
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
          this.statusItem.hide();
          this.statusItem.text = "$(check) build TestJar successful";
          this.statusItem.show();
        }
        else if(!isSuccessful){
          this.statusItem.hide();
          this.statusItem.text = "$(x) build TestJar failed";
          this.statusItem.show();
        }
      });
    }
    else{
      this.logger.addBuildLogMessage("root folder not found");
      this.statusItem.text = "error...";
      this.statusItem.show();
      vscode.window.showErrorMessage("root folder not found");
    }
  }



  //moduleTestJar
}