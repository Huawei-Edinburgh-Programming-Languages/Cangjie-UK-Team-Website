import fs from 'fs';
import path from 'path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import { getHighlighter } from 'shiki';
import { visit } from 'unist-util-visit';
import rehypeSlug from 'rehype-slug';

const cangjieGrammar = JSON.parse(
  fs.readFileSync(path.resolve('./CangjieHighlights.json'), 'utf-8')
);

const highlighter = await getHighlighter(
{
    theme: 'light-plus',
    langs: [
        {
            id: 'cangjie',
            scopeName: cangjieGrammar.scopeName,
            grammar: cangjieGrammar
        },
        'javascript',
        'typescript',
        'cpp',
        'python',
        'json',
        'bash',
        'css'
    ]
});

async function convertMdFile(mdFilePath, outputDir) 
{
    const mdContent = fs.readFileSync(mdFilePath, 'utf-8');

    const processed = await remark()
    .use(remarkGfm) // converts ``` fenced code to code nodes
    .use(() => (tree) => {
        visit(tree, 'code', (node) => {
        console.log('found code block:', node.lang);
        const lang = node.lang || "plaintext" ;
        node.type = 'html';
        node.value = highlighter.codeToHtml(node.value.trim(), lang);
        });
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(mdContent);

    const htmlFileName = path.basename(mdFilePath, '.md') + '.html';
    fs.writeFileSync(path.join(outputDir, htmlFileName), processed.toString());
}

const blogsDir = path.resolve('./blogs');
const outputDir = path.resolve('./blogsHTML');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

async function processAllBlogs() 
{
    const files = fs.readdirSync(blogsDir).filter(f => f.endsWith('.md'));
    for (const file of files) 
    {
        try 
        {
            await convertMdFile(path.join(blogsDir, file), outputDir, highlighter);
        } catch (err) 
        {
            console.error(`Error processing ${file}:`, err);
        }
    }
}

await processAllBlogs();