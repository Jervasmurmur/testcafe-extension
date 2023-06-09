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
import * as parser from './selector_parser';
import * as testAttr from './test_data';
import * as pre from './predefined_setup';




// TESTING
function wait(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const PAGE_MODEL_IMPORT = "import { Selector } from 'testcafe';"
const PAGE_MODEL_CTOR_START = "constructor() {"
const PAGE_MODEL_DEFAULT = "export default new";

function createValidVariableName(value:string) {
    return value.replace(/^[0-9]+|[^a-zA-Z0-9$-\s]/g, '').replace(/[-\s]/g, '_');
}

function propertyName(element:string, attrData:string) {
    return "readonly " + element + "_" + createValidVariableName(attrData) + ";";
}

function propertyAssignmentText(model:parser.elementSelector) {
    return "this." + model.element + "_" + createValidVariableName(model.attrValue) + " = Selector(\"" + model.query + "\");"
    // var text = "this.ELE_ATTR = Selector(\"SELECTQUERY\");"
    // text = text.replace(/ELE/g, model.element);
    // text = text.replace(/ATTR/g, model.attrValue);
    // return text.replace(/SELECTQUERY/g, model.query);
}

function writePageModel(pageModelElements:parser.elementSelector[], pageModelName:string) {
    var pageModel = "";


    pageModel += PAGE_MODEL_IMPORT + "\n";
    pageModel += "\n";
    pageModel += "class " + pageModelName + " {\n";
    for (var model of pageModelElements) {
        pageModel += "\t" + propertyName(model.element, model.attrValue) + "\n";
    }
    pageModel += "\n";
    pageModel += "\t" + PAGE_MODEL_CTOR_START + "\n";
    for (var model of pageModelElements) {
        // console.log("The current query: " + model.query)
        pageModel += "\t\t" + propertyAssignmentText(model) + "\n";
    }
    pageModel += "\t}\n";       // Close CTOR
    pageModel += "}\n";     // Close class
    pageModel += "\n";
    pageModel += PAGE_MODEL_DEFAULT + " " + pageModelName + ";";
    return pageModel;
}

function testExt_getAttr($:cheerio.CheerioAPI, selectElement:cheerio.Cheerio<cheerio.Element>) {
    if (selectElement.length > 0) {
        selectElement.each((index, element) => {
            console.log($(element).attr());
        })

    }
}

function testExt_getLenght($:cheerio.CheerioAPI, selectElement:cheerio.Cheerio<cheerio.Element>) {
    if (selectElement.length > 0) {
        let element_in_question = selectElement[0].tagName;
        console.log("Antal element av: ", element_in_question, " - ", selectElement.length);
    }
}

function getSelector($:cheerio.CheerioAPI, selectElement:cheerio.Cheerio<cheerio.Element>, attribut:parser.selectConfig[]) {
    var pageModelElements: parser.elementSelector[] = []

    // testExt_getAttr($, selectElement);
    
    selectElement.each((index, element) => {
        // let attrValue = $(element).attr(attribut)

        let attrValue = parser.getValidAttributeSelector($, element, attribut)
        
        if (attrValue) {
            console.log("Created selector for:", element.name);
            console.log($(element).attr())
            console.log("Selector: " + attrValue.query);
            console.log(getPath($, element))
            pageModelElements.push( attrValue )
        } else {
            console.error("Couldnt find selector:" , element.name)
            console.log($(element).attr())
            console.log(getPath($, element))
            }
            console.log("- - - - - - - - - - - - -")
            })

    testExt_getLenght($, selectElement);
    console.log("Antal selectors: " + pageModelElements.length);
    console.log("=========================")
    return pageModelElements;
}

// Hanterar inte åäö eller andra special bokstäver
function camalize(str:string) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

function getPath($:cheerio.CheerioAPI, selectElement: cheerio.Element) {
    const path: string[] = [];
    
    while ( !($(selectElement).is($("root"))) && !($(selectElement).is($("html"))) )  {

        let elementName = selectElement.name;
        let index = $(selectElement).index(); 
        let id = selectElement.attribs['id'];
        let classes = selectElement.attribs["class"];

        let elementSelector = elementName;

        if (($(selectElement).is($("body")))) {
            path.push(elementSelector);
            break;
        }
        
        if (id) {
            elementSelector += `#${id}`;

        } else if ( $("[class= '" + classes + "']").length < 2 && classes) {
            elementSelector += `.${classes.replace(/\s+/g, '.')}`;

        } else if ($(selectElement).siblings().length){
            elementSelector += `:nth-child(${index + 1})`;
        }
      
        // selector = `${elementSelector} ${selector}`;
        path.push(elementSelector);
        let parent = ($(selectElement).parent())[0];
        selectElement = parent;
    }

    return path.reverse().join(' > ').trim();
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
            value: "temp", valueSelection: [-1, -1],   // TEST
            prompt: "Give name for file and page model",
            validateInput: (input) => { return validInput(input); }
        })
        if (inputName === undefined) { return; }


        // NOTE: Användaren kan ange en väg med namnet, gör det nånting åt?
        var fileName = "\\" + inputName.trim().replace(/\s+/, "-") + "-page-model.ts";
        var className = camalize(inputName) + "PageModel";
        var newFileUri = vscode.Uri.file(currentPath + fileName);

        // TEST
        // await pre.setup(inputUrl).then( (htmlDocument) => {
        //     const $ = cheerio.load(htmlDocument);
        //     console.log( $("div").length);

        // }).catch((err) => {
        //     console.log(err);
        //     return;
        // })
        // TEST


        await pre.setup_2(inputUrl).then( (htmlDocument) => {
            const $ = cheerio.load(htmlDocument);
            var pageModelElements: parser.elementSelector[] = [];

            pageModelElements.push.apply(pageModelElements, getSelector($, $("button"), testAttr.selectorConfig));
            pageModelElements.push.apply(pageModelElements, getSelector($, $("input"), testAttr.selectorConfig));
            pageModelElements.push.apply(pageModelElements, getSelector($, $("a"), testAttr.selectorConfig));
            pageModelElements.push.apply(pageModelElements, getSelector($, $("textarea"), testAttr.selectorConfig));

            var edit = new vscode.WorkspaceEdit();

            // TODO: Behöver en bättre check om filen finns och man gör cancelled så finns det en chans att den skriver över
            //       den nuvarande filen med ingenting.
            edit.createFile(newFileUri, {overwrite : true, ignoreIfExists : false});

            var pageModel = writePageModel(pageModelElements, className);

            edit.insert(newFileUri, new vscode.Position(0, 0), pageModel);

            vscode.workspace.applyEdit( edit ).then((applyRes) =>  {
                if (!applyRes) { console.log("Apply failed") }  // ERROR LOG

            }).then( () => {
                // Sparar filen
                vscode.workspace.openTextDocument(newFileUri).then( (doc) => {
                    doc.save();
                })
            })


        }).catch((err) => {
            console.log(err);
            return;
        })

	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
