import { Cheerio } from "cheerio";
import * as cheerio from 'cheerio';


export enum relation {
    child = "child",
    parent = "parent"
  }
  
export interface selectConfig {
    attribut: string;
    relation: relation | null;
  }

export interface attrValue{
    attr:string;
    value:string;
    nodeRelation:relation | null;
}

export class elementSelector {
    readonly element;
    readonly attrType;
    readonly attrValue;
    readonly query;

    constructor(element:string, attrType:string, attrValue:string, query:string) {
        this.element = element;
        this.attrType = attrType;
        this.attrValue =  attrValue;
        this.query = query;
    }
}


export function createQuery(element:string, attrData:attrValue) {
    if (attrData.nodeRelation === relation.parent) {
        return "[" + attrData.attr + "='" +  attrData.value + "'] > " + element
        
    } else if (attrData.nodeRelation === relation.child) {
        return element + ":has([" + attrData.attr + "='" +  attrData.value + "'])"
    } else {
        return element + "[" + attrData.attr + "='" +  attrData.value + "']"

    }
}

export function checkValidSelector($:cheerio.CheerioAPI, element:cheerio.Element, attrQuery:attrValue[]) {
    for (let q of attrQuery) {
        let selectorQuery = createQuery(element.tagName, q);
        // console.log(selectorQuery);
        let selectorResult = $(selectorQuery);
        // console.log(selectorResult.length)
        if( selectorResult.length == 1 ) {
            
            // console.log(q);
            // console.log(selectorQuery);

            return new elementSelector(element.tagName, q.attr, q.value, selectorQuery)
        }
    }

    return null;
}

export function getValidAttributeSelector($:cheerio.CheerioAPI, element:cheerio.Element, selectorConfig:selectConfig[]) {

    let attributeData = parseAttribute($, element, selectorConfig);

    return checkValidSelector($, element, attributeData);

}

export function parseAttribute($:cheerio.CheerioAPI, element:cheerio.Element, selectorConfig:selectConfig[]) {
    var attrQuery:attrValue[] = [];

    for(let config of selectorConfig) {

        // console.log("////////////////////////")
        // console.log(config.attribut)
        // console.log(config.relation)
        // console.log("////////////////////////")

        // console.log("-------------------");
        // console.log(element.tagName);
        // console.log($(element).attr());

        if (config.relation === relation.child) {

            // Letar bara i direkta barn
            // var attrValue = $(element).children('[' + config.attribut + ']').attr(config.attribut);

            // Letar efter alla ättligar till element
            var attrValue = $(element).find('[' + config.attribut + ']').attr(config.attribut);

            if (attrValue) {
                attrQuery.push( { 
                    attr:config.attribut,
                    value:attrValue,
                    nodeRelation:relation.child
                })
            }
        
        } else if (config.relation === relation.parent) {
            var attrValue = $(element).parent('[' + config.attribut + ']').attr(config.attribut);
            
            if (attrValue) {
                attrQuery.push( { 
                    attr:config.attribut,
                    value:attrValue,
                    nodeRelation:relation.parent
                })
            }
            
        } else {
            var attrValue = $(element).attr(config.attribut);
            
            if (attrValue) {
                    attrQuery.push( { 
                        attr:config.attribut,
                        value:attrValue,
                        nodeRelation: null
                    })
                }
        
            }

            
        }
        
        return attrQuery;
}