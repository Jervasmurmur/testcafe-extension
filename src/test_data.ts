import * as parser from './selector_parser';

var config1:parser.selectConfig = { attribut:"data-testid", relation: null }
var config2:parser.selectConfig = { attribut:"data-testid", relation: parser.relation.parent }
var config3:parser.selectConfig = { attribut:"data-testid", relation: parser.relation.child }

var config4:parser.selectConfig = { attribut:"id", relation: null }
var config5:parser.selectConfig = { attribut:"id", relation: parser.relation.parent }
var config6:parser.selectConfig = { attribut:"id", relation: parser.relation.child }
export var selectorConfig:parser.selectConfig[] = [config1, config2, config3, config4, config5, config6];
