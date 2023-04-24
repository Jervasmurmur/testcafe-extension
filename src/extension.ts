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

const PAGE_MODEL_IMPORT = "import { Selector } from 'testcafe';"
const PAGE_MODEL_NAME = "class Page {"
const PAGE_MODEL_CTOR_START = "constructor() {"
const PAGE_MODEL_DEFAULT = "export default new Page();";

function PropertyText(element:string, attrData:string) {
    return "readonly " + element + "_" + attrData + ";";
}

function propertyAssignmentText(element:string, attrData:string) {
    var text = "this.ELE_ATTR = Selector(\"ELE[data-test='ATTR']\");"
    text = text.replace(/ELE/g, element);
    return text.replace(/ATTR/g, attrData);
}

function writePageModel(pageModelElements:graphicalDOM[]) {
    var pageModel = "";
                        
    pageModel += PAGE_MODEL_IMPORT + "\n";
    pageModel += "\n";
    pageModel += PAGE_MODEL_NAME + "\n";
    for (var model of pageModelElements) {
        pageModel += "\t" + PropertyText(model.element, model.dataAttr) + "\n";
    }
    pageModel += "\n";
    pageModel += "\t" + PAGE_MODEL_CTOR_START + "\n";
    for (var model of pageModelElements) {
        pageModel += "\t\t" + propertyAssignmentText(model.element, model.dataAttr) + "\n";
    }
    pageModel += "\t}\n";       // Close CTOR
    pageModel += "}\n";     // Close class
    pageModel += "\n";
    pageModel += PAGE_MODEL_DEFAULT;
    return pageModel;
}


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

        // const data = fs.readFileSync('C:/Users/anton/Documents/kod mapp/test/testCafé testing/fancy_site.html');
        // const $ = cheerio.load(data);
        // let element = $("button");
        // element.each( (i, el) => {
        //     let res = $(el).attr("data-test");
        //     console.log(res);
        //     console.log("-----------")
        // }) 

        
        // IDÉ: Den borde hämta nuvarande Uri som defualt men om nåt annas har angivis i settings
        //      så borde den hämta Uri ifrån setttings.
        if(vscode.workspace.workspaceFolders !== undefined) {
            
            var workingDictPath = vscode.workspace.workspaceFolders[0].uri;            
            var currentPath = workingDictPath.fsPath;
            var newFile = "\\pageModelExempel.ts";
            var newFileUri = vscode.Uri.file(currentPath + newFile);
            
            
            // TODO: Lägg till cache för förslag till input boxen
            vscode.window.showInputBox().then( (input) => {
                axios
                    .get("https://devexpress.github.io/testcafe/example/")
                    .then((response) => {
                        // const $ = cheerio.load(input);
                        
                        const testFile = fs.readFileSync('C:/Users/anton/Documents/kod mapp/test/testCafé testing/fancy_site.html');    // TEST
                        const $ = cheerio.load(testFile);   // TEST

                        var pageModelElements: graphicalDOM[] = [];

                        // ******** getElement() ********
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
                        // ******** getElement() ******** 
                        
                        var edit = new vscode.WorkspaceEdit();

                        // TODO: Behöver en bättre check om filen finns och man gör cancelled så finns det en chans att den skriver över
                        //       den nuvarande filen med ingenting.
                        edit.createFile(newFileUri, {overwrite : true, ignoreIfExists : false});
        
                        var pageModel = writePageModel(pageModelElements);
        
                        edit.insert(newFileUri, new vscode.Position(0, 0), pageModel);
                        
        
                        vscode.workspace.applyEdit( edit ).then((applyRes) =>  {
                            if (!applyRes) { console.log("Apply failed") }  // ERROR LOG
            
                        }).then( () => {
                            // Sparar filen
                            vscode.workspace.openTextDocument(newFileUri).then( (doc) => {
                                doc.save();
                            } )
                        })

                    }) .catch((err) => console.log("Fetch error " + err));  // ERROR LOG
            })

        } else {
            console.log("Didnt find any working directory");
        }

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
