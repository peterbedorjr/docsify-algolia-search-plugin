import algoliasearch from 'algoliasearch';
import deepmerge from 'deepmerge';
import { init, update } from './component';
import { isObject, isArray, isString } from './utils';
import render from './render';

const DEFAULT_CONFIG = {
    placeholder: 'Type to search',
    noData: 'No Results!',
    hideOtherSidebarContent: false,
    namespace: undefined,
    templates: {
        base: render.base,
        style: render.style,
        resultItem: render.resultItem,
        resultSet: render.resultSet,
    },
    algolia: {
        multi: undefined,
        token: undefined,
        appId: undefined,
        indexes: undefined,
        defaultIndex: undefined,
        indexMap: {},
        currentIndex() {
            return this.defaultIndex;
        }
    },
};

let CONFIG;

const install = function(hook, vm) {
    const opts = vm.config.search;

    // Merge user options with default
    if (isObject(opts)) {
        CONFIG = deepmerge(DEFAULT_CONFIG, opts);
    } else {
        CONFIG = DEFAUlT_CONFIG;
    }

    // Set up algolia client
    CONFIG.algolia.client = algoliasearch(
        CONFIG.algolia.appId,
        CONFIG.algolia.token
    );

    // Create search client and configure indexes if necessary
    if (isArray(CONFIG.algolia.indexes)) {
        CONFIG.algolia.indexes.forEach(index => {
            if (isObject(index)) {
                const client = CONFIG.algolia.client.initIndex(index.index);

                client.setSettings(index.settings);

                CONFIG.algolia.indexMap[index.index] = client;
            } else {
                const client = CONFIG.algolia.client.initIndex(index);

                CONFIG.algolia.indexMap[index] = client;
            }
        });
    } else if (isObject(CONFIG.algolia.indexes)) {
        const index = CONFIG.algolia.indexes;
        const client = CONFIG.algolia.client.initIndex(index.index);

        client.setSettings(index.settings);

        CONFIG.algolia.indexMap[index.index] = client;
    } else if (isString(CONFIG.algolia.indexes)) {
        const index = CONFIG.algolia.indexes;
        const client = CONFIG.algolia.client.initIndex(index);

        CONFIG.algolia.indexMap[index] = client;
    } else {
        console.error('Invalid configuration');

        return;
    }

    hook.mounted(() => {
        init(CONFIG, vm);
    });

    hook.doneEach(() => {
        update(CONFIG, vm);
    });

    window.DocsifyAlgoliaSearchPlugin = {
        config: CONFIG,
    };
}

$docsify.plugins = [].concat(install, $docsify.plugins)
