const generateTOC = require('mdast-util-toc');
const mm = require('micromatch');

module.exports = function generateTOCNodes(
  { markdownNode, markdownAST },
  {
    include = [],
    header = 'Table of Contents',
    useExistingHeader = false,
    orderedList = false,
    headerDepth = 2,
    wrapper = undefined,
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
      depth: headerDepth,
      children: [
        {
          type: 'text',
          value: header
        }
      ]
    },
    toc
  ].filter(Boolean);

  const tocSection = wrapper
    ? [
        {
          type: 'section',
          data: {
            hName: typeof wrapper === 'string' ? wrapper : wrapper.name,
            hProperties:
              typeof wrapper === 'string' ? undefined : wrapper.properties
          },
          children: nodes
        }
      ]
    : nodes;

  markdownAST.children = [].concat(
    markdownAST.children.slice(0, index),
    ...tocSection,
    markdownAST.children.slice(index)
  );
};
