# gatsby-remark-toc

[![Build Status](https://travis-ci.org/DSchau/gatsby-remark-toc.svg?branch=master)](https://travis-ci.org/DSchau/gatsby-remark-toc)
![NPM Version](https://img.shields.io/npm/v/gatsby-remark-toc.svg)

Adds a table of contents to Markdown files using [mdast-util-toc][mdast-util-toc]

## Install

`npm install gatsby-remark-toc --save`

## How to use

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

[mdast-util-toc]: https://www.npmjs.com/package/mdast-util-toc
