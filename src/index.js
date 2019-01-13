const generateTOC = require('mdast-util-toc');
const mm = require('micromatch');

module.exports = function generateTOCNodes(
  { markdownNode, markdownAST },
  {
    include = [],
    header = 'Table of Contents',
    useExistingHeader = false,
    orderedList = false,
    mdastUtilTocOptions = {}
  }
) {
  const filePath = markdownNode.fileAbsolutePath
    .split(process.cwd())
    .pop()
    .replace(/^\//, '');
  const isIncluded = mm.isMatch(filePath, include);

  if (!isIncluded) {
    return;
  }

  const index = markdownAST.children.findIndex(node => {
    if (useExistingHeader) {
      if (node.type === 'heading') {
        return node.children.findIndex(child => child.value === header) + 1;
      }
      return false;
    }
    return node.type !== 'yaml';
  });

  if (index < 0) {
    return;
  }

  if (useExistingHeader) {
    markdownAST.children.splice(index, 1);
  }

  const toc = generateTOC(markdownAST, mdastUtilTocOptions).map;

  if (!toc) {
    return;
  }

  toc.ordered = orderedList;

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
