import * as vscode from 'vscode';
import { exec} from 'child_process';
import { Manager } from './components/manager';
import { Logger } from './components/logger';


export class Commander {
  manager: Manager;
  statusItem: vscode.StatusBarItem;
  logger: Logger;
  constructor(logger: Logger) {
    this.manager = new Manager();
    this.statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
    this.logger = logger;
  }


  async buildNX() {
    let rootFolder = await this.manager.findProjectRoot() + "\\";
    if(rootFolder) {
      this.statusItem.text = "$(sync~spin) build...";
      this.statusItem.show();
      const cmd = "gradle build";
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

  async slotomatic() {
    let rootFolder = await this.manager.findProjectRoot() + "\\";
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
    let rootFolder = await this.manager.findProjectRoot() + "\\";
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