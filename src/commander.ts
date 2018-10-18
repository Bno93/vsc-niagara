import * as vscode from 'vscode';
import { exec} from 'child_process';
import { Manager } from './components/manager';

export class Commander {
  manager: Manager;
  statusItem: vscode.StatusBarItem;
  
  constructor() {
    this.manager = new Manager();
    this.statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
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
        console.log(stdout);
        console.log(stderr);
        this.statusItem.hide();
      });
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
        console.log(stdout);
        console.log(stderr);
        this.statusItem.hide();
      });
    }
  }





  async openConsole() {
    const extConfig = vscode.workspace.getConfiguration("vsc-niagara");
    const niagaraHome = extConfig.get("niagara.home") as { name: string }[];
    console.log(niagaraHome);
    if (!niagaraHome) {
      vscode.window.showWarningMessage("nigara.home isn't configured");
    }
    else{
      // const consoleCmd = niagaraHome + "\\bin\\console.exe";
      // let process = childProcess.spawn(consoleCmd);
    }
  }
}