// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { rejects } from 'assert';
import { promises } from 'dns';
import { resolve } from 'path';
import * as vscode from 'vscode';
import { window } from 'vscode';


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
        
        
        // NOTE: input kan vara undifiend så ha 'if(input)' för att plocka upp den
        // ANT: Öppnar en ny ruta för att ta in data
        
        
        // ANT: Den borde hämta nuvarande Uri som defualt men om nåt annas har angivis i settings
        //      så borde den hämta Uri ifrån setttings.
        if(vscode.workspace.workspaceFolders !== undefined) {
              

            // async function getInputText() {
            //     // *Så vscode.window.showInputBox ger tillbaka ett promise där resolve är strängen och reject är undefined
            //     console.log("getInputText : 1");
            //     let inputRes = vscode.window.showInputBox();
            //     return inputRes;
            // }
            // async function writeInputText() {
            //     console.log("writeInputText : 1");
            //     let text = await getInputText()
            //     console.log(text);
            //     if (text) {
            //         edit.insert(newFileUri, new vscode.Position(0, 0), text);
            //     } else {
            //         console.log("Could not get text")
            //     }
            // }

            // - Öppna inputBox
            // - Ta emot URL input
            // - används axios för att koppa till hemsdian
            //      * Ska den klara av filer?
            // - Använd cheerio för att plocka ut DOM element
            // - Skapa ny fil om det inte finns
            // - skriv till filen 
                
                
            var workingDictPath = vscode.workspace.workspaceFolders[0].uri;
            
            var currentPath = workingDictPath.fsPath;
            var newFile = "\\extTestFile.js";
            var newFileUri = vscode.Uri.file(currentPath + newFile);
            
            var edit = new vscode.WorkspaceEdit();
            // TODO: Behöver en bättre check om filen finns och man gör cancelled så finns det en chans att den skriver över
            //       den nuvarande filen med ingenting.
            edit.createFile(newFileUri, {overwrite : true, ignoreIfExists : false});
            
            // ##### Början av inputen #####
            vscode.window.showInputBox().then( (input) => {

                if (input) {
                    edit.insert(newFileUri, new vscode.Position(0, 0), input);
                }
                
                vscode.workspace.applyEdit( edit ).then((applyRes) =>  {
                    if (!applyRes) { console.log("Apply failed") }  // LOG
    
                }).then( () => {
                    vscode.workspace.openTextDocument(newFileUri).then( (doc) => {
                        console.log(doc.getText());
                        doc.save();
                    } )
    
                })

            })

        }


        

        

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
