import * as vscode from 'vscode';
import { XMLParser } from 'fast-xml-parser';
import { Logger } from '../components/logger';


export function checkDocument(document: vscode.TextDocument, collection: vscode.DiagnosticCollection) {

    console.log("check if " + document.fileName + " has to be parsed");
    if (document && document.fileName.endsWith('.palette')) {
        checkPaletteDocument(document, collection);
    }
    else {
        console.log("nothing to parse here.");
    }
}




function checkPaletteDocument(document: vscode.TextDocument, collection: vscode.DiagnosticCollection) {
    if (!document) {
        return;
    }

    console.log("parse document");

    const parser = new XMLParser({
        // ignoreDeclaration: true,
        ignoreAttributes: false,
        // attributeNamePrefix: "attr_",
        preserveOrder: true
    });

    const palette_document = parser.parse(document.getText());

    console.log(palette_document);



    // palette_document.

    // collection.set(
    //     document.uri,
    //     [{
    //         code: '',
    //         message: "here is something wrong",
    //         range: new vscode.Range(new vscode.Position(2, 0), new vscode.Position(2, 5)),
    //         severity: vscode.DiagnosticSeverity.Warning,
    //         source: ''
    //     }]
    // )


}
