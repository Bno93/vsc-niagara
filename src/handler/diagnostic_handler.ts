import * as vscode from 'vscode';
import { XMLParser } from 'fast-xml-parser';


export function checkDocument(document: vscode.TextDocument, collection: vscode.DiagnosticCollection) {

    if (document && document.fileName.endsWith('.palette')) {
        checkPaletteDocument(document, collection);
    }
}




function checkPaletteDocument(document: vscode.TextDocument, collection: vscode.DiagnosticCollection) {
    if (!document) {
        return;
    }
    const parser = new XMLParser({
        ignoreDeclaration: true,
        ignoreAttributes: false,
        attributeNamePrefix: "attr_",
        preserveOrder: true
    });

    const parsed_document = parser.parse(document.getText());

    collection.set(
        document.uri,
        [{
            code: '',
            message: "here is something wrong",
            range: new vscode.Range(new vscode.Position(12, 23), new vscode.Position(12, 36)),
            severity: vscode.DiagnosticSeverity.Warning,
            source: ''
        }]
    )

    console.log(parsed_document);
}
