const generateTOC = require('mdast-util-toc');
const mm = require('micromatch');
var visit = require(`unist-util-visit`);

module.exports = function generateTOCNodes(
  { markdownNode, markdownAST },
  { include = [], header = 'Table of Contents', mdastUtilTocOptions = {} }
) {
  const filePath = markdownNode.fileAbsolutePath
    .split(process.cwd())
    .pop()
    .replace(/^\//, '');
  const isIncluded = mm.isMatch(filePath, include);

  if (!isIncluded) {
    return;
  }

  const toc = generateTOC(markdownAST, mdastUtilTocOptions).map;
  const index = markdownAST.children.findIndex(node => node.type !== 'yaml');

  if (!toc || index < 0) {
    return;
  }

  // Add id to heading nodes
  visit(markdownAST, `heading`, function (node) {
    node.type = `html`;
    node.children[0].type = `html`;
    node.value = `<h${node.depth} id="${node.children[0].value}">${node.children[0].value}</h${node.depth}>`;
  });
 
  const nodes = [
    header && {
      type: 'heading',
      depth: 2,
      children: [
        {
          type: 'text',
          value: header
        }
      ]
    },
    toc
  ].filter(Boolean);

  markdownAST.children = [].concat(
    markdownAST.children.slice(0, index),
    ...nodes,
    markdownAST.children.slice(index)
  );
};
