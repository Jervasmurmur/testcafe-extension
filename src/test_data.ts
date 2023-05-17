import * as parser from './selector_parser';

var config1:parser.selectConfig = { attribut:"data-test", relation: null }
var config2:parser.selectConfig = { attribut:"data-test", relation: parser.relation.parent }
var config3:parser.selectConfig = { attribut:"data-test", relation: parser.relation.child }

export var selectorConfig:parser.selectConfig[] = [config1, config2, config3];