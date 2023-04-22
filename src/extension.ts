// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { rejects } from 'assert';
import { promises } from 'dns';
import { resolve } from 'path';
import * as vscode from 'vscode';
import { window } from 'vscode';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import axios from 'axios';



// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	let disposable = vscode.commands.registerCommand('testcafe-extension.start', () => {

        /** ____Instruktionner____
         * # Input
         *      - Öppna input box
         *      - Mata in en URL
         * 
         * # Parse
         *      - Öppna sida med axios
         *      - Selecta alla grafiska komponenter
         *      - Gå igenom dom var för sig
         *      - Plocka ut datan ifrån deras attribut: data-test
         *      - EX: [ {graphicalDOM: "Button", dataAttr: "knapp1"}, {graphicalDOM: "Button", dataAttr: "knapp2"}, ... ]
         * 
         * # Write
         *      - Skapa en ny fil om det inte finns
         *      - Skriv till filen
         */

        
        /** ____Page model filen struktur____
         * - var1 = button
         * - var2 = "knapp1"
         * class Page {
                readonly button_knapp1;
                
                constructor () {
                    this.button_knapp1 = Selector('button[data-test="knapp1"]');
                }
            }

            export default new Page();  
         */

        const data = fs.readFileSync('C:/Users/anton/Documents/kod mapp/test/testCafé testing/fancy_site.html');
        const $ = cheerio.load(data);
        let element = $("button");
        element.each( (i, el) => {
            let res = $(el).attr("data-test");
            console.log(res);
            console.log("-----------")
        }) 

        // axios
        //     .get("https://devexpress.github.io/testcafe/example/")
        //     .then((response) => {
        //         const $ = cheerio.load(response.data);
        //         $("p").each( (index, element) => {
        //             console.log(index);
        //             console.log(element);
        //         })
        //     })
        //     .catch((err) => console.log("Fetch error " + err));
        
        // IDÉ: Den borde hämta nuvarande Uri som defualt men om nåt annas har angivis i settings
        //      så borde den hämta Uri ifrån setttings.
        /*
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

                let url = input;


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
        */

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
