const generateTOC = require('mdast-util-toc');
const mm = require('micromatch');

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
