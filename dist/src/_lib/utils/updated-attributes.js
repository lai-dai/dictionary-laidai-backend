"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatedAttributes = updatedAttributes;
function updatedAttributes(initAttributes, attributes) {
    let result = {};
    switch (true) {
        case Array.isArray(initAttributes):
            switch (true) {
                case Array.isArray(attributes):
                    result = initAttributes.concat(attributes);
                    break;
                case typeof attributes === 'object':
                    result = {
                        exclude: attributes.exclude,
                        include: initAttributes.concat(attributes.include),
                    };
                    break;
                default:
                    result = initAttributes;
                    break;
            }
            break;
        case typeof initAttributes === 'object':
            switch (true) {
                case Array.isArray(attributes):
                    result = {
                        exclude: initAttributes.exclude,
                        include: initAttributes.include.concat(attributes),
                    };
                    break;
                case typeof attributes === 'object':
                    result = {
                        exclude: initAttributes.exclude.concat(attributes.exclude),
                        include: initAttributes.include.concat(attributes.include),
                    };
                    break;
                default:
                    result = {
                        exclude: initAttributes.exclude,
                        include: initAttributes.include,
                    };
                    break;
            }
            break;
    }
    return result;
}
