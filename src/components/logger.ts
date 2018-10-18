import * as vscode from "vscode";

export class Logger {
  buildLogPanel: vscode.OutputChannel;

  
  constructor() {
   this.buildLogPanel = vscode.window.createOutputChannel("Niagara Build");
  }


  addBuildLogMessage(message: string) {
    this.buildLogPanel.append(`[${new Date().toLocaleTimeString('de-DE', {hour12: false})}] ${message}`);
  }
}