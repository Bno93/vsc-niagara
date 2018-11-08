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
          this.statusItem.text = "$(check) successful";
          this.statusItem.show();
        }
        else if(!isSuccessful){
          this.statusItem.hide();
          this.statusItem.text = "$(x) failed";
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
    this.logger.addBuildLogMessage("run slotomatic ...");
    this.checkIfAutoSaveIsActive();
    
    if(rootFolder) {
      this.statusItem.text = "$(sync~spin) slotomatic...";
      this.statusItem.show();
      const cmd = "gradle slotomatic";
      console.log("execute: " + cmd + " in " + rootFolder);
      exec(cmd, {cwd: rootFolder}, (error, stdout, stderr) => {
        if(error) {
          console.error(error);
          this.statusItem.text = "error";
          return;
        }
        this.logger.addBuildLogMessage(stdout);
        console.log(stdout);
        console.log(stderr);
        this.statusItem.hide();
      });
    }
    else{
      this.logger.addBuildLogMessage("root folder not found");
      this.statusItem.text = "error...";
      this.statusItem.show();
    }

  }
    
    
    async clean() {
      this.logger.addBuildLogMessage("clean Project ...");
      let rootFolder = await this.manager.findProjectRoot() + "\\";
      if(rootFolder) {
        this.statusItem.text = "$(sync~spin) clean...";
        this.statusItem.show();
        const cmd = "gradle clean";
        console.log("execute: " + cmd + " in " + rootFolder);
        exec(cmd, {cwd: rootFolder}, (error, stdout, stderr) => {
          if(error) {
            console.error(error);
            this.statusItem.text = "error";
            return;
          }
          this.logger.addBuildLogMessage(stdout);
          console.log(stdout);
          console.log(stderr);
          this.statusItem.hide();
        });
      }
      else{
        this.logger.addBuildLogMessage("root folder not found");
        this.statusItem.text = "error...";
        this.statusItem.show();
      }
    }
  
  
  async moduleTestJar() {
    this.logger.addBuildLogMessage("build Project Test Jar ...");
    let rootFolder = await this.manager.findProjectRoot() + "\\";
    
    this.checkIfAutoSaveIsActive();
    
    if(rootFolder) {
      this.statusItem.text = "$(sync~spin) moduleTestJar...";
      this.statusItem.show();
      const cmd = "gradle moduleTestJar";
      console.log("execute: " + cmd + " in " + rootFolder);
      exec(cmd, {cwd: rootFolder}, (error, stdout, stderr) => {
        if(error) {
          console.error(error);
          this.statusItem.text = "error";
          return;
        }
        this.logger.addBuildLogMessage(stdout);
        console.log(stdout);
        console.log(stderr);
        this.statusItem.hide();
      });
    }
    else{
      this.logger.addBuildLogMessage("root folder not found");
      this.statusItem.text = "error...";
      this.statusItem.show();
    }
  }



  //moduleTestJar
}