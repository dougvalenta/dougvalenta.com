import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';
import * as marked from 'marked';
import { renderSync } from 'node-sass';

marked.use({
    renderer: {
        link: (href, title, text) => {
            if (href.startsWith('https://')) {
                return `<a href="${href}" target="_blank" ${title ? `title="${title}"` : ''}>${text}</a>`
            } else {
                return `<a href="${href}" ${title ? `title="${title}"` : ''}>${text}</a>`
            }
        }
    } as marked.Renderer,
});

const capitalize = (title: string) => {
    return title.charAt(0).toUpperCase() + title.substring(1);
}

const templatesPath = join(__dirname, 'templates');
const templates: Record<string, string> = {};
readdirSync(templatesPath).forEach((templateFilename) => {
    templates[basename(templateFilename, '.html')] = readFileSync(join(templatesPath, templateFilename), 'utf-8');
});

const pagesPath = join(__dirname, 'pages');
const pageFilenames = readdirSync(pagesPath);

const publicPath = join(__dirname, 'public');
if (!existsSync(publicPath)) mkdirSync(publicPath);

pageFilenames.forEach((pageFilename) => {
    const name = basename(pageFilename, '.md');
    const template = templates[name] || templates['page'];
    const title = capitalize(name.replace('-', ' '));
    const content = marked(readFileSync(join(pagesPath, pageFilename), 'utf-8'));
    const outputPath = name === 'index' ? publicPath : join(publicPath, name);
    if (!existsSync(outputPath)) mkdirSync(outputPath);
    const outputFile = join(outputPath, 'index.html');
    writeFileSync(outputFile, template.replace('__PAGE_TITLE__', title).replace('__PAGE_CONTENT__', content));
});

writeFileSync(join(publicPath, 'style.css'), renderSync({
    file: join(__dirname, 'sass', 'style.scss'),
}).css);
