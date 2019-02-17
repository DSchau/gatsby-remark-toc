/**
 * @jest-environment node
 */

const Remark = require('remark');
const mdastUtil = require('mdast-util-toc');
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

describe('basic functionality', () => {
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
});

describe('custom behavior', () => {
  test('it allows for maxDepth', () => {
    let markdownNode = getMarkdownNode(
      `
# hello world

## Test

### Another

#### Hi
  `,
      'content/example.md'
    );

    const header = 'Sup hello TOC';

    const maxDepth = 1;

    addToc(markdownNode, {
      include: ['content/*.md'],
      header,
      mdastUtilTocOptions: {
        maxDepth
      }
    });

    const [heading, toc] = markdownNode.markdownAST.children;

    const children = toc.children[0].children;

    expect(children).toHaveLength(maxDepth);
  });

  test('it allows for reusing an existing header', () => {
    let markdownNode = getMarkdownNode(
      `
## One
## ToC
## Two
## Three
  `,
      'content/example.md'
    );

    const header = 'ToC';

    addToc(markdownNode, {
      include: ['content/*.md'],
      header,
      useExistingHeader: true
    });

    const toc = markdownNode.markdownAST.children[2];

    expect(hasTOCHeading(markdownNode.markdownAST, header)).toBe(true);

    expect(markdownNode.markdownAST.children[0].type).toBe('heading');
    expect(markdownNode.markdownAST.children[1].type).toBe('heading');
    expect(toc.type).toBe('list');
    expect(markdownNode.markdownAST.children[3].type).toBe('heading');
    expect(markdownNode.markdownAST.children[4].type).toBe('heading');

    expect(toc.children).toHaveLength(3);
  });

  test('it allows for adding a wrapper container of toc', () => {
    let markdownNode = getMarkdownNode(
      `
# hello world
## Test
### Another
#### Hi
  `,
      'content/example.md'
    );

    addToc(markdownNode, {
      include: ['content/*.md'],
      wrapper: 'aside'
    });

    const [wrapper] = markdownNode.markdownAST.children;

    expect(wrapper.type).toBe('section');
    expect(wrapper.data.hName).toBe('aside');
  });

  test('it allows for a wrapper with rich options', () => {
    let markdownNode = getMarkdownNode(
      `
# hello world
## Test
### Another
#### Hi
  `,
      'content/example.md'
    );

    addToc(markdownNode, {
      include: ['content/*.md'],
      wrapper: {
        name: 'aside',
        properties: {
          class: 'custom-class'
        }
      }
    });

    const [wrapper] = markdownNode.markdownAST.children;

    expect(wrapper.type).toBe('section');
    expect(wrapper.data.hName).toBe('aside');
    expect(wrapper.data.hProperties.class).toBe('custom-class');
  });

  test('it allows for customizing depth of header', () => {
    let markdownNode = getMarkdownNode(
      `
# hello world
## Test
### Another
#### Hi
  `,
      'content/example.md'
    );

    addToc(markdownNode, {
      include: ['content/*.md'],
      header: {
        text: 'Table of Contents',
        depth: 3
      }
    });

    const [heading] = markdownNode.markdownAST.children;

    expect(heading.depth).toBe(3);
  });
});
