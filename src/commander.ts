import * as vscode from 'vscode';
import * as childProcess from 'child_process';

export class Commander {
  constructor() {
    
  }

  async buildAX() {
    const extConfig = vscode.workspace.getConfiguration("vsc-niagara");
    const niagaraHome = extConfig.get("niagara.home") as {name: string }[];
    if(!niagaraHome) {
      vscode.window.showWarningMessage("nigara.home isn't configured");
    }
    const buildCmd = niagaraHome + "\\bin\\build.exe";

    const buildParams = "";

    let build = childProcess.spawn(buildCmd + " " + buildParams);

    build.stdout.on("data", newStdout => {
      console.log(newStdout.toString());
    });
  }

  async buildNX() {
    
  }



  async openConsole() {
    const extConfig = vscode.workspace.getConfiguration("vsc-niagara");
    const niagaraHome = extConfig.get("niagara.home") as { name: string }[];
    console.log(niagaraHome);
    if (!niagaraHome) {
      vscode.window.showWarningMessage("nigara.home isn't configured");
    }
    else{
      const consoleCmd = niagaraHome + "\\bin\\console.exe";
      let process = childProcess.spawn(consoleCmd);
    }
  }
}