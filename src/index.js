const generateTOC = require('mdast-util-toc');
const mm = require('micromatch');

module.exports = function generateTOCNodes(
  { markdownNode, markdownAST },
  {
    include = [],
    header = 'Table of Contents',
    headerDepth = 2,
    wrappingWithSection = false,
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

  const toc = generateTOC(markdownAST, mdastUtilTocOptions).map;
  const index = markdownAST.children.findIndex(node => node.type !== 'yaml');

  if (!toc || index < 0) {
    return;
  }

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

  const tocSection = wrappingWithSection
    ? [
        {
          type: 'section',
          data: {
            hProperties: {
              'aria-hidden': true,
              class: 'gatsby-remark-toc'
            }
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
