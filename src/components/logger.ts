import * as vscode from "vscode";

export class Logger {
  buildLogPanel: vscode.OutputChannel;
  extLogPanel: vscode.OutputChannel;

  
  constructor() {
   this.buildLogPanel = vscode.window.createOutputChannel("Niagara Build");
   this.extLogPanel = vscode.window.createOutputChannel("Niagara Ext");
  }

  addExtensionMessage(message: string) {
    this.extLogPanel.append(`[${new Date().toLocaleTimeString('de-DE', {hour12: false})}] ${message}\n`);
  } 

  addBuildLogMessage(message: string) {
    this.buildLogPanel.append(`[${new Date().toLocaleTimeString('de-DE', {hour12: false})}] ${message}\n`);
  }
}