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


// TESTING
function wait(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

function parseCheerio(selector:cheerio.Root, selectElement:string, attribut:string) {
    var pageModelElements: graphicalDOM[] = []
    let res = selector(selectElement);
    res.each( (index:number, element:cheerio.Element) => {
        let attrValue = selector(element).attr(attribut)

        if (attrValue) {
            pageModelElements.push( new graphicalDOM(selectElement, attrValue) )
        } else {
            console.log("element (*visa väg dit) didnt have data-test (*eller annan angiven attribut)");
        }
    }) 
    return pageModelElements;
}

function handleInputs() {
    return new Promise( (resolve, reject) => {
        let input = vscode.window.showInputBox().then( (input)=>{
            return input;
        } );

        if (input !== undefined) {
            return resolve(input);
        } else {
            return reject("TOM!")
        } 
    })
}

function validInput(value:string) {
    if (value.trim().length === 0) {
        return "Input cannot be empty";
    }
    return null;
}
    

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    
    let disposable = vscode.commands.registerCommand('testcafe-extension.start', async () => {
        
        try {
            if(vscode.workspace.workspaceFolders) {
                var workingDictPath = vscode.workspace.workspaceFolders[0].uri
                var currentPath = workingDictPath.fsPath;

            } else {
                throw new Error("Didnt find any working directory")
            }
        } catch (error) {
            console.log(error)
            return;
        }
        
        var inputUrl = await vscode.window.showInputBox({
            title: "Give an url",
            placeHolder: "www.ssg/exempel.com",
            prompt: "Choose a site to scan",
            validateInput: (input) => { return validInput(input); }
        })
        if (inputUrl === undefined) { return; }
        
        var inputName = await vscode.window.showInputBox({
            title: "Name page model",
            placeHolder: "user input",
            value: "test exempel", valueSelection: [-1, -1],   // TEST
            prompt: "Give name for file and page model",
            validateInput: (input) => { return validInput(input); }
        })
        if (inputName === undefined) { return; }

        // user input -> user-input-page-model.ts
        // user input -> userInputPageModel
        // 
        // USER input -> USER-input-page-model.ts
        // USER-input -> USER-input-page-model.ts
        // USER input -> userInputPageModel
        
        
        // var fileName = "";
        // for (let part of fileNameParts) {
            //     fileName += part.toLowerCase() + "-";
            //     fileName += part[0].toUpperCase();
            // }
            
        // var fileName = "\\exempel-page-model.ts";

        // NOTE: Användaren kan ange en väg med namnet, gör nånting åt?
        var fileName = "\\" + inputName.trim().replace(/\s+/, "-") + "-page-model.ts";
        var newFileUri = vscode.Uri.file(currentPath + fileName);

        var className = "";
        // - Gör allt till små bokstäver?
        // - leta efter en pattern där det är whitespace innan
        // - ta gör förta bokstaven där till storbokstav och resten till små bokstäver
        // - check med att göra första bokstaven i strängen till liten bokstav?

        // - whitespace ska tas bort
        // - varje del mellan whitespace ska få stor bokstav
        // - dock ska inte första bokstaven ha en stor bosktav

        // const myString = 'user input';
        // const camelCaseString = myString.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match: string, index: number) => {
        // if (+match === 0) {
        //     return ''; // or "-" or "_" or whatever separator you want to use
        // }
        // return index === 0 ? match.toLowerCase() : match.toUpperCase();
        // });

        // console.log(camelCaseString); // Output: "userInput"


        axios
            .get("https://devexpress.github.io/testcafe/example/")
            .then((response) => {
                // const $ = cheerio.load(response.data);
                console.log(inputUrl);
                
                const testFile = fs.readFileSync('C:/Users/anton/Documents/kod mapp/test/testCafé testing/fancy_site.html');    // TEST
                const $ = cheerio.load(testFile);   // TEST

                var pageModelElements: graphicalDOM[] = [];

                pageModelElements.push.apply(pageModelElements, parseCheerio($, "button", "data-test"));
                pageModelElements.push.apply(pageModelElements, parseCheerio($, "input", "data-test"));
                
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

        // - parse DOM-element
        // - write/create file och namn
        // - skriv klass
        // - insert klass i fil
        // - apply
        // - Spara


        /*
        if(vscode.workspace.workspaceFolders !== undefined) {
            
            var workingDictPath = vscode.workspace.workspaceFolders[0].uri;            
            var currentPath = workingDictPath.fsPath;
            var newFile = "\\pageModelExempel.ts";
            var newFileUri = vscode.Uri.file(currentPath + newFile);
            
            
            // TODO: Lägg till cache för förslag till input boxen
            vscode.window.showInputBox({
                prompt: "www.ssg/exempel.com",
                validateInput: (input) => { return validInput(input); }
            }
            ).then( (input) => {
                axios
                    .get("https://devexpress.github.io/testcafe/example/")
                    .then((response) => {
                        const $ = cheerio.load(response.data);
                        console.log(input);
                        
                        const testFile = fs.readFileSync('C:/Users/anton/Documents/kod mapp/test/testCafé testing/fancy_site.html');    // TEST
                        // const $ = cheerio.load(testFile);   // TEST

                        var pageModelElements: graphicalDOM[] = [];

                        pageModelElements.push.apply(pageModelElements, parseCheerio($, "button", "data-test"));
                        pageModelElements.push.apply(pageModelElements, parseCheerio($, "input", "data-test"));
                        
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
        */

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
