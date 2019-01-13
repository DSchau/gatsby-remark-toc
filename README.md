<p align="center">
  <a href="https://next.gatsbyjs.org">
    <img alt="Gatsby" src="https://www.gatsbyjs.org/monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  gatsby-remark-toc
</h1>

<h3 align="center">
  ⚛️ 📄 :rocket:
</h3>
<p align="center">
  <strong>Adds a table of contents to Markdown files using <a href="https://www.npmjs.com/package/mdast-util-toc">mdast-util-toc</a></strong>
</p>
<p align="center">
  <a href="https://travis-ci.org/DSchau/gatsby-remark-toc">
    <img src="https://travis-ci.org/DSchau/gatsby-remark-toc.svg?branch=master" alt="Current TravisCI build status." />
  </a>
  <a href="https://www.npmjs.org/package/gatsby">
    <img src="https://img.shields.io/npm/v/gatsby-remark-toc.svg?style=flat-square" alt="Current npm package version." />
  </a>
  <a href="https://npmcharts.com/compare/gatsby-remark-toc?minimal=true">
    <img src="https://img.shields.io/npm/dm/gatsby-remark-toc.svg" alt="Downloads per month on npm." />
  </a>
</p>

## 🚀 Install

`npm install gatsby-remark-toc --save`

## 🎓 How to use

```js
// in your gatsby-config.js
plugins: [
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        {
          resolve: 'gatsby-remark-toc',
          options: {
            header: 'Table of Contents', // the custom header text
            include: [
              'content/**/*.md' // an include glob to match against
            ]
          }
        }
      ]
    }
  }
];
```

If you want your table of contents to appear at a specific place in your Markdown file, use the `reuseExistingHeader` option:

```js
// in your gatsby-config.js
plugins: [
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        {
          resolve: 'gatsby-remark-toc',
          options: {
            header: 'Table of Contents', // the custom header text
            reuseExistingHeader: true, // searches for `Table of Contents` in your Markdown file and adds the list right after it
            include: [
              'content/**/*.md' // an include glob to match against
            ]
          }
        }
      ]
    }
  }
];
```

Use the `orderedList` option if you want to change the list type from `<ul>` to `<ol>`.

Additionally, you can pass custom options directly to [mdast-util-toc][mdast-util-toc] like so:

```js
// in your gatsby-config.js
plugins: [
  {
    resolve: 'gatsby-transformer-remark',
    options: {
      plugins: [
        {
          resolve: 'gatsby-remark-toc',
          options: {
            header: 'Table of Contents', // the custom header text
            include: [
              'content/**/*.md' // an include glob to match against
            ],
            mdastUtilTocOptions: {
              maxDepth: 2
            }
          }
        }
      ]
    }
  }
];
```

[mdast-util-toc]: https://www.npmjs.com/package/mdast-util-toc
