const Remark = require('remark');
const addToc = require('../src');

const getAst = content => {
  const remark = new Remark().data(`settings`, {
    commonmark: true,
    footnotes: true,
    pedantic: true
  });

  return remark.parse(content);
};

const getMarkdownNode = (content, filePath) => {
  const ast = getAst(content);
  return {
    markdownAST: ast,
    markdownNode: {
      fileAbsolutePath: filePath
    }
  };
};

const toHtml = ast => {
  return hastToHTML(toHAST(ast));
};

const hasNode = (ast, getNode) => {
  return (ast.children || ast).some(node => getNode(node));
};

const hasTOCHeading = (ast, value = 'Table of Contents') => {
  return hasNode(ast, node => {
    if (node.type === 'heading') {
      return hasNode(node.children, nested => {
        return nested.value === value;
      });
    }
  });
};

test('it adds a header', () => {
  let markdownNode = getMarkdownNode(
    `
---
title: hello world
---

# Content


## Other Content
  `.trim(),
    'content/example.md'
  );

  addToc(markdownNode, { include: ['content/*.md'] });

  const hasTableOfContents = hasNode(markdownNode.markdownAST, node => {
    return node.type === 'list';
  });

  expect(hasTableOfContents).toBe(true);
});

test('it adds a header', () => {
  let markdownNode = getMarkdownNode(
    `
---
title: hello world
---

# Content


## Other Content
  `.trim(),
    'content/example.md'
  );

  addToc(markdownNode, { include: ['content/*.md'] });

  expect(hasTOCHeading(markdownNode.markdownAST)).toBe(true);
});

test('it ignores when include does not match', () => {
  let markdownNode = getMarkdownNode(
    `
# hello world
  `,
    'asdf/no-match.md'
  );

  const len = markdownNode.markdownAST.length;

  addToc(markdownNode, { include: ['content/*.md'] });

  expect(markdownNode.markdownAST.length).toBe(len);
});

test('it does not add header element if set to falsy', () => {
  let markdownNode = getMarkdownNode(
    `
# hello world
  `,
    'content/example.md'
  );

  addToc(markdownNode, { include: ['content/*.md'], header: false });

  expect(hasTOCHeading(markdownNode.markdownAST)).toBe(false);
});

test('it uses custom header if defined', () => {
  let markdownNode = getMarkdownNode(
    `
# Hello World
  `,
    'content/example.md'
  );

  const header = 'Sup hello TOC';

  addToc(markdownNode, { include: ['content/*.md'], header });

  expect(hasTOCHeading(markdownNode.markdownAST, header)).toBe(true);
});
