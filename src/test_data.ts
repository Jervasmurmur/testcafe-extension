import * as parser from './selector_parser';

var config_data_self:parser.selectConfig = { attribut:"data-testid", relation: null }
var config_data_parent:parser.selectConfig = { attribut:"data-testid", relation: parser.relation.parent }
var config_data_child:parser.selectConfig = { attribut:"data-testid", relation: parser.relation.child }

var config4:parser.selectConfig = { attribut:"id", relation: null }
var config5:parser.selectConfig = { attribut:"id", relation: parser.relation.parent }
var config6:parser.selectConfig = { attribut:"id", relation: parser.relation.child }

var config_class_self:parser.selectConfig = { attribut:"class", relation: null }
var config_class_parent:parser.selectConfig = { attribut:"class", relation: parser.relation.parent }
var config_class_child:parser.selectConfig = { attribut:"class", relation: parser.relation.child }

var config_href_self:parser.selectConfig = { attribut:"href", relation: null }
var config_href_parent:parser.selectConfig = { attribut:"href", relation: parser.relation.parent }
var config_href_child:parser.selectConfig = { attribut:"href", relation: parser.relation.child }
// export var selectorConfig:parser.selectConfig[] = [config1, config2, config3, config4, config5, config6];
export var selectorConfig:parser.selectConfig[] = [
    config_data_child, config_data_parent, config_data_self    
];
// export var selectorConfig:parser.selectConfig[] = [
//     config_class_child, config_class_parent, config_class_self, 
//     config_href_child, config_href_parent, config_href_self
// ];
