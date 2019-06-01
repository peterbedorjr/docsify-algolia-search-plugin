# Docsify Algolia Search Plugin

This plugin is a modification of the [full text search plugin](https://docsify.js.org/#/plugins?id=full-text-search) with many of the same settings that leverages algolia search.

| Option       | Type                | Description                                                                                                                                                                                                                                                               | Default                                  | Required |
|--------------|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------|----------|
| token        | string              | Public API token                                                                                                                                                                                                                                                          | -                                        | ✓        |
| appId        | string              | The application ID                                                                                                                                                                                                                                                        | -                                        | ✓        |
| defaultIndex | string              |  If multiple indexes are provided, you can specify the default index to use, otherwise the first index provided will be the default                                                                                                                                       | The first provided index                 |          |
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

            // algolia options
            algolia: {
                token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // https://www.algolia.com/doc/guides/security/api-keys/
                appId: 'XXXXXXXXXX', // Your app id,
                defaultIndex: 'v4',

                // single index
                indexes: 'v4',

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