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


class graphicalDOM {
    readonly element;
    readonly dataAttr;

    constructor(element:string, dataAttr:string) {
        this.element = element;
        this. dataAttr = dataAttr;
    }
}

// { pageProperty: "button_knapp1", pageSelector: "this.button_knapp1 = Selector("button[data-test='knapp1'])" }

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
        if(vscode.workspace.workspaceFolders !== undefined) {
                
            var workingDictPath = vscode.workspace.workspaceFolders[0].uri;            
            var currentPath = workingDictPath.fsPath;
            var newFile = "\\pageModelExempel.ts";
            var newFileUri = vscode.Uri.file(currentPath + newFile);
            

            // ##### Början av inputen #####
            vscode.window.showInputBox().then( (input) => {

                let url = input;
                const testFile = fs.readFileSync('C:/Users/anton/Documents/kod mapp/test/testCafé testing/fancy_site.html');    // TEST
                const $ = cheerio.load(data);


                var pageModelElements: graphicalDOM[] = [];
                // DEV: getElement() : 
                var select = "button";
                let element = $(select);
                element.each( (i, el) => {
                    let res = $(el).attr("data-test");
                    if (res) {
                        pageModelElements.push( new graphicalDOM(select, res) )
                    } else {
                        console.log("element (*visa väg dit) didnt have data-test (*eller annan angiven attribut)");
                    }
                })


                var edit = new vscode.WorkspaceEdit();
                // TODO: Behöver en bättre check om filen finns och man gör cancelled så finns det en chans att den skriver över
                //       den nuvarande filen med ingenting.
                edit.createFile(newFileUri, {overwrite : true, ignoreIfExists : false});

                // TEST =========================
                const PAGE_MODEL_IMPORT = "import { Selector } from 'testcafe';\n"
                const PAGE_MODEL_NAME = "class Page {\n"
                const PAGE_MODEL_CTOR_START = "constructor() {\n"
                const BRACKET_END = "}\n"
                const PAGE_MODEL_DEFAULT = "export default new Page();\n";
                const READONLY = "readonly ";
                const property0 = pageModelElements[0].element + "_" + pageModelElements[0].dataAttr;
                const property1 = pageModelElements[1].element + "_" + pageModelElements[1].dataAttr;
                
                var wholePageModel = 
                PAGE_MODEL_IMPORT + 
                "\n" + 
                PAGE_MODEL_NAME + 
                "\t\t" + READONLY + property0 + ";\n" +
                "\t\t" + READONLY + property1 + ";\n" +
                "\t" + PAGE_MODEL_CTOR_START +
                "\t\t" + "this." + property0 + " = Selector(\"" + pageModelElements[0].element + "[" + "data-test='" + pageModelElements[0].dataAttr + "'" + "]\");\n" + 
                "\t\t" + "this." + property0 + " = Selector(\"" + pageModelElements[1].element + "[" + "data-test='" + pageModelElements[1].dataAttr + "'" + "]\");\n" + 
                "\t" + BRACKET_END +
                BRACKET_END + 
                "\n" +
                PAGE_MODEL_DEFAULT;
                // TEST =========================

                edit.insert(newFileUri, new vscode.Position(0, 0), wholePageModel);
                

                vscode.workspace.applyEdit( edit ).then((applyRes) =>  {
                    if (!applyRes) { console.log("Apply failed") }  // ERROR LOG
    
                }).then( () => {
                    // Sparar filen
                    vscode.workspace.openTextDocument(newFileUri).then( (doc) => {
                        doc.save();
                    } )
    
                })

            })

        }

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
