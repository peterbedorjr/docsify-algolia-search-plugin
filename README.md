# Docsify Algolia Search Plugin

This plugin is a modification of the [full text search plugin](https://docsify.js.org/#/plugins?id=full-text-search) with many of the same settings that leverages algolia search.

| Parameter    | Type                | Description                                                                                                                                                                                                                                                               | Default                                  | Required |
|--------------|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|----------|
| token        | string              | Public API token                                                                                                                                                                                                                                                          | -                                        | ✓        |
| appId        | string              | The application ID                                                                                                                                                                                                                                                        | -                                        | ✓        |
| defaultIndex | string              |  If multiple indexes are provided, you can specify the default index to use, otherwise the first index provided will be the default                                                                                                                                       | The first provided index                 |          |
| multi        | boolean|array       | Display the results from multiple indexes                                                                                                                                                                                                                                 | -                                        |          |
| indexes      | string|object|array | The indexes to be searched                                                                                                                                                                                                                                                | A list of indexes with optional settings | ✓        |
| currentIndex | function            |  If you need to specify the current index based on certain conditions, i.e. a slug in your url for different versions of documentation you can do it here.  This function must return the name of the index.  This function passes the `indexMap` as it's only parameter. |  -                                       |          |

## Options

A full list of configurable options is below.

```html
<script>
    window.$docsify = {
        // complete configuration parameters
        search: {
            placeholder: 'Type to search',

            // Localization
            placeholder: {
                '/zh-cn/': '搜索',
                '/': 'Type to search'
            },

            noData: 'No Results!',

            // Localization
            noData: {
                '/zh-cn/': '找不到结果',
                '/': 'No Results'
            },

            hideOtherSidebarContent: false, // whether or not to hide other sidebar content

            // template overrides
            templates: {
                base: options => '',
                style: options => '',
                resultItem: (result, response, options) => '',
                resultSet: (result, response, options) => '',
            },

            // algolia options
            algolia: {
                token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // https://www.algolia.com/doc/guides/security/api-keys/
                appId: 'XXXXXXXXXX', // Your app id,
                defaultIndex: 'v4',

                // single index
                indexes: 'v4',

                // default multi settings
                multi: true,

                // overriding section labels
                // NOTE: The key name MUST match the index names
                multi: {
                    v3: 'Version 3',
                    v4: 'Version 4',
                },

                // single index with settings
                indexes: {
                    index: 'v4',
                    settings: {
                        // ...
                    }
                },

                // multiple indexes
                indexes: ['v3', 'v4'],

                // multiple indexes with settings
                indexes: [{
                    index: 'v3',
                    settings: {
                        // ...
                    },
                }, {
                    index: 'v4',
                        settings: {
                        // ..
                    },
                }],

                defaultIndex: (indexMap) => {
                    const pathArray = window.location.pathname.replace(/^\//, '').split('/');
                    const index = pathArray[0] === 'v3' ? 'v3' : 'v4';

                    return index;
                }
            }
        }
    }
</script>
```

## Overriding Templates/Styles

To override any of the rendered HTML you can provided your own render functions.  There are four render functions:
- `base` - renders the search box and necessary structure for the results
- `style` - renders the required styles for default templates
- `resultItem` - renders a single result item
- `resultSet` - renders a set of results, this function uses the `resultItem` function

Each function is passed the following arguments:

- `base`
  - `defaultValue` - the search query string
  - `options` - the configuration options object
- `style`
  - `options` - the configuration options object
- `resultItem`
  - `result` - the individual result object
  - `response` - the entire response returned from the algolia client
  - `options` - the configuration options object
- `resultsSet`
  - `results` - the results array
  - `response` - the entire response returned from the algolia client
  - `noData` - The text set if no results are returned
  - `options` - the configuration options object

For more details custom templates, refer to the [default functions](src/render.js).


## Methods

You may clear the results programatically by calling `DocsifyAlgoliaSearchPlugin.clearResults();`.