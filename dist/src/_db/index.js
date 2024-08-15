"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = exports.sequelize = void 0;
exports.initDB = initDB;
const sequelize_1 = require("sequelize");
const config_1 = require("./config");
const model_1 = require("../examples/model");
const model_2 = require("../definitions/model");
const model_3 = require("../meanings/model");
const model_4 = require("../part-of-speech/model");
const model_5 = require("../words/model");
const model_6 = require("../users/model");
const model_7 = require("../favorites/model");
const model_8 = require("../idioms/model");
const model_9 = require("../comments/model");
const model_10 = require("../phonetics/model");
exports.sequelize = new sequelize_1.Sequelize(config_1.options);
exports.models = {
    User: (0, model_6.UserModel)(exports.sequelize),
    PartOfSpeech: (0, model_4.PartOfSpeechesModel)(exports.sequelize),
    Example: (0, model_1.ExamplesModel)(exports.sequelize),
    Definition: (0, model_2.DefinitionsModel)(exports.sequelize),
    Meaning: (0, model_3.MeaningsModel)(exports.sequelize),
    Word: (0, model_5.WordsModel)(exports.sequelize),
    Favorite: (0, model_7.FavoritesModel)(exports.sequelize),
    Idiom: (0, model_8.IdiomsModel)(exports.sequelize),
    Comment: (0, model_9.CommentsModel)(exports.sequelize),
    Phonetic: (0, model_10.PhoneticsModel)(exports.sequelize),
};
function initDB() {
    exports.sequelize
        .authenticate()
        .then(() => {
        console.log('Connection has been established successfully.');
    })
        .catch((error) => {
        console.error('Unable to connect to the database: ', error);
    });
    exports.models.PartOfSpeech.belongsTo(exports.models.User, { as: 'createdBy' });
    exports.models.Word.belongsTo(exports.models.User, { as: 'createdBy' });
    exports.models.Phonetic.belongsTo(exports.models.User, { as: 'createdBy' });
    exports.models.Idiom.belongsTo(exports.models.User, { as: 'createdBy' });
    exports.models.Meaning.belongsTo(exports.models.User, { as: 'createdBy' });
    exports.models.Definition.belongsTo(exports.models.User, { as: 'createdBy' });
    exports.models.Example.belongsTo(exports.models.User, { as: 'createdBy' });
    exports.models.Comment.belongsTo(exports.models.User, { as: 'createdBy' });
    exports.models.Phonetic.belongsTo(exports.models.Word, { as: 'word' });
    exports.models.Idiom.belongsTo(exports.models.Word, { as: 'word' });
    exports.models.Meaning.belongsTo(exports.models.Word, { as: 'word' });
    exports.models.Definition.belongsTo(exports.models.Word, { as: 'word' });
    exports.models.Example.belongsTo(exports.models.Word, { as: 'word' });
    exports.models.Comment.belongsTo(exports.models.Word, { as: 'word' });
    exports.models.Comment.hasMany(exports.models.Comment, { as: 'children' });
    exports.models.Idiom.hasMany(exports.models.Example, { as: 'examples' });
    exports.models.Definition.hasMany(exports.models.Example, { as: 'examples' });
    exports.models.Meaning.belongsTo(exports.models.PartOfSpeech, { as: 'partOfSpeech' });
    exports.models.Meaning.hasMany(exports.models.Definition, { as: 'definitions' });
    exports.models.Word.hasMany(exports.models.Phonetic, { as: 'phonetics' });
    exports.models.Word.hasMany(exports.models.Meaning, { as: 'meanings' });
    exports.models.Word.hasMany(exports.models.Idiom, { as: 'idioms' });
    exports.models.Favorite.belongsTo(exports.models.User);
    exports.models.Favorite.belongsTo(exports.models.Word);
    exports.sequelize
        .sync({
        force: false,
        // force: true,
        // alter: true,
    })
        .then(() => {
        exports.models.User.findByPk(1).then((res) => {
            if (!res) {
                exports.models.User.create({
                    id: 1,
                    name: 'Lại Đài',
                    email: 'laidai9966@gmail.com',
                    image: 'default',
                    role: 'admin',
                    active: true,
                    provider: 'credentials',
                    password: '$2a$10$hOcJBqQOWPJxhGpDjeIdjuhiYB1gPTn/GVNINwtWT2/y7jhDvn36m',
                });
            }
        });
    });
}
