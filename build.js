"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var path_1 = require("path");
var marked = require("marked");
var capitalize = function (title) {
    return title.charAt(0).toUpperCase() + title.substring(1);
};
var templatesPath = path_1.join(__dirname, 'templates');
var templates = {};
fs_1.readdirSync(templatesPath).forEach(function (templateFilename) {
    templates[path_1.basename(templateFilename, '.html')] = fs_1.readFileSync(path_1.join(templatesPath, templateFilename), 'utf-8');
});
var pagesPath = path_1.join(__dirname, 'pages');
var pageFilenames = fs_1.readdirSync(pagesPath);
var publicPath = path_1.join(__dirname, 'public');
if (!fs_1.existsSync(publicPath))
    fs_1.mkdirSync(publicPath);
pageFilenames.forEach(function (pageFilename) {
    var name = path_1.basename(pageFilename, '.md');
    var template = templates[name] || templates['page'];
    var title = capitalize(name.replace('-', ' '));
    var content = marked(fs_1.readFileSync(path_1.join(pagesPath, pageFilename), 'utf-8'));
    var outputPath = name === 'index' ? publicPath : path_1.join(publicPath, name);
    if (!fs_1.existsSync(outputPath))
        fs_1.mkdirSync(outputPath);
    var outputFile = path_1.join(outputPath, 'index.html');
    fs_1.writeFileSync(outputFile, template.replace('__PAGE_TITLE__', title).replace('__PAGE_CONTENT__', content));
});
