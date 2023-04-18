// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('testcafe-extension.start', () => {

        // ANT: Hämtar filen man har i fokus
        var filePath = vscode.window.activeTextEditor?.document;

        // Function: GetPageSite()
        // !! Temporär metod att hämta ut vilken sida testCafe ska köras på
        let text = filePath?.getText();
        var site = text?.substring(
            text.indexOf("page[") + 5, 
            text.lastIndexOf("]page")
        ).trim();
        console.log(site);  // DEBUG: Kollar page som hämtades

        

        

        // ANT: Hämtar alla symboler som finns i filen
        // vscode.commands.executeCommand<vscode.DocumentSymbol[]>("vscode.executeDocumentSymbolProvider", filePath?.uri)
        //     .then( (dsp:vscode.DocumentSymbol[]) => {
        //         for (const x of dsp) {
        //             console.log(x)
        //         }
        //     })

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
