import algoliasearch from 'algoliasearch';
import { init, update } from './component';
import { isObject, isArray, isString } from './utils';

const CONFIG = {
    placeholder: 'Type to search',
    noData: 'No Results!',
    hideOtherSidebarContent: false,
    namespace: undefined,
    algolia: {
        token: undefined,
        appId: undefined,
        indexes: undefined,
        defaultIndex: undefined,
        currentIndex() {
            return this.defaultIndex;
        }
    },
};

const install = function(hook, vm) {
    const opts = vm.config.search || CONFIG

    if (isObject(opts)) {
        CONFIG.placeholder = opts.placeholder || CONFIG.placeholder;
        CONFIG.noData = opts.noData || CONFIG.noData;
        CONFIG.hideOtherSidebarContent = opts.hideOtherSidebarContent || CONFIG.hideOtherSidebarContent;
        CONFIG.algolia = Object.assign(CONFIG.algolia, opts.algolia);
        CONFIG.algolia.indexMap = {};
    }

    CONFIG.algolia.client = algoliasearch(CONFIG.algolia.appId, CONFIG.algolia.token);

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
