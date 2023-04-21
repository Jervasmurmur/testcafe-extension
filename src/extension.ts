// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('testcafe-extension.start', () => {

        // // ANT: Hämtar filen man har i fokus
        // var filePath = vscode.window.activeTextEditor.document;

        // // Function: GetPageSite()
        // // !! Temporär metod att hämta ut vilken sida testCafe ska köras på
        // let text = filePath?.getText();
        // var site = text?.substring(
        //     text.indexOf("page[") + 5, 
        //     text.lastIndexOf("]page")
        // ).trim();
        // console.log(site);  // DEBUG: Kollar page som hämtades

        // ANT: Den borde hämta nuvarande Uri som defualt men om nåt annas har angivis i settings
        //      så borde den hämta Uri ifrån setttings.
        if(vscode.workspace.workspaceFolders !== undefined) {
            var workingDictPath = vscode.workspace.workspaceFolders[0].uri;

            var currentPath = workingDictPath.fsPath;
            var newFile = "\\extTestFile.js";
            var newFileUri = vscode.Uri.file(currentPath + newFile);
            
            var edit = new vscode.WorkspaceEdit();
            edit.createFile(newFileUri);
            edit.insert(newFileUri, new vscode.Position(0, 0), "Tjenixen");
            vscode.workspace.applyEdit( edit ).then((value) =>  {
                // NOTE: Om filen redan finns så blir det false

                console.log(value);

            }).then( () => {

                vscode.workspace.openTextDocument(newFileUri).then( (value) => {
                    value.save();
                } )

            })

        }


        // NOTE: input kan vara undifiend så ha 'if(input)' för att plocka upp den
        // ANT: Öppnar en ny ruta för att ta in data
        // let input = vscode.window.showInputBox().then( (value) => {
        //     console.log(value);
        // });
        

        

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
