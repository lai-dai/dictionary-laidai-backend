"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
const model_1 = require("../examples/model");
const model_2 = require("../definitions/model");
const model_3 = require("../meanings/model");
const model_4 = require("../part-of-speech/model");
const model_5 = require("../words/model");
const model_6 = require("../users/model");
const model_7 = require("../favorites/model");
exports.sequelize = new sequelize_1.Sequelize(config_1.options);
exports.models = {
    User: (0, model_6.UserModel)(exports.sequelize),
    PartOfSpeech: (0, model_4.PartOfSpeechesModel)(exports.sequelize),
    Example: (0, model_1.ExamplesModel)(exports.sequelize),
    Definition: (0, model_2.DefinitionsModel)(exports.sequelize),
    Meaning: (0, model_3.MeaningsModel)(exports.sequelize),
    Word: (0, model_5.WordsModel)(exports.sequelize),
    Favorite: (0, model_7.FavoritesModel)(exports.sequelize),
};
exports.models.PartOfSpeech.belongsTo(exports.models.User, { as: 'createdBy' });
exports.models.Example.belongsTo(exports.models.User, { as: 'createdBy' });
exports.models.Definition.belongsTo(exports.models.User, { as: 'createdBy' });
exports.models.Meaning.belongsTo(exports.models.User, { as: 'createdBy' });
exports.models.Word.belongsTo(exports.models.User, { as: 'createdBy' });
exports.models.Definition.hasMany(exports.models.Example, { as: 'examples' });
exports.models.Meaning.belongsTo(exports.models.PartOfSpeech, { as: 'partOfSpeech' });
exports.models.Meaning.hasMany(exports.models.Definition, { as: 'definitions' });
exports.models.Word.hasMany(exports.models.Meaning, { as: 'meanings' });
exports.models.Favorite.belongsTo(exports.models.User);
exports.models.Favorite.belongsTo(exports.models.Word);
exports.sequelize
    .sync({
    // force: true,
    force: false,
    alter: true,
})
    .then(() => {
    console.log('🚀 Database sync done');
});
