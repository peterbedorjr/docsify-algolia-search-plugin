import { isString, isArray } from './utils';

let NO_DATA_TEXT = '';
let options;

function renderBase(defaultValue = '') {
    const html = options.templates.base(defaultValue, options);
    const el = Docsify.dom.create('div', html);
    const aside = Docsify.dom.find('aside');

    Docsify.dom.toggleClass(el, 'search');
    Docsify.dom.before(aside, el);
}

function renderResponse(response) {
    const { algolia } = options;
    const { resultSet, resultItem } = options.templates;

    if (algolia.multi) {
        const { results } = response;

        return results.map(results => resultSet(results, response, NO_DATA_TEXT, options)).join('');
    } else {
        const { hits } = response;

        return hits.map(result => resultItem(result, response, options)).join('');
    }
}

function doSearch(value, clearInput = false) {
    const $search = Docsify.dom.find('div.search');
    const $input = Docsify.dom.find($search, 'input');
    const $panel = Docsify.dom.find($search, '.results-panel');
    const $clearBtn = Docsify.dom.find($search, '.clear-button');
    const $sidebarNav = Docsify.dom.find('.sidebar-nav');
    const $appName = Docsify.dom.find('.app-name');
    let query;

    if (! value) {
        $panel.classList.remove('show');
        $clearBtn.classList.remove('show');
        $panel.innerHTML = '';

        if (options.hideOtherSidebarContent) {
            $sidebarNav.classList.remove('hide');
            $appName.classList.remove('hide');
        }

        if (clearInput) {
            $input.value = '';
        }

        return;
    }

    const { algolia } = options;
    const searchClient = algolia.multi
        ? algolia.client
        : algolia.indexMap[algolia.currentIndex(algolia.indexMap)];

    if (! isArray(algolia.indexes) && algolia.multi) {
        console.error('Algolia Search Plugin: When multi search is enabled, you must provided more than one index');
        return;
    }

    if (algolia.multi) {
        query = algolia.indexes.map(({ index }) => ({
            indexName: index,
            query: value,
        }));
    } else {
        query = value;
    }

    searchClient.search(query)
        .then(renderResponse)
        .then((html) => {
            $panel.classList.add('show');
            $clearBtn.classList.add('show');
            $panel.innerHTML = html || `<p class="empty">${NO_DATA_TEXT}</p>`;

            if (options.hideOtherSidebarContent) {
                $sidebarNav.classList.add('hide');
                $appName.classList.add('hide');
            }
        });
}

function bindEvents(indexMap) {
    const $search = Docsify.dom.find('div.search');
    const $input = Docsify.dom.find($search, 'input');
    const $inputWrap = Docsify.dom.find($search, '.input-wrap');

    let timeId;
    // Prevent to Fold sidebar
    Docsify.dom.on(
        $search,
        'click',
        e => e.target.tagName !== 'A' && e.stopPropagation(),
    );

    Docsify.dom.on($input, 'input', e => {
        clearTimeout(timeId),
        timeId = setTimeout(() => doSearch(e.target.value.trim(), indexMap), 100);
    });

    Docsify.dom.on($inputWrap, 'click', e => {
        // Click input outside
        if (e.target.tagName !== 'INPUT') {
            $input.value = '';
            doSearch();
        }
    });

    window.DocsifyAlgoliaSearchPlugin.clearResults = function(clearResults = true) {
        doSearch(null, clearResults);
    };
}

function updatePlaceholder(text, path) {
    const $input = Docsify.dom.getNode('.search input[type="search"]');

    if (! $input) {
        return;
    }

    if (isString(text)) {
        $input.placeholder = text;
    } else {
        const match = Object.keys(text).filter(key => path.indexOf(key) > -1)[0];
        $input.placeholder = text[match];
    }
}

function updateNoData(text, path) {
    if (isString(text)) {
        NO_DATA_TEXT = text;
    } else {
        const match = Object.keys(text).filter(key => path.indexOf(key) > -1)[0];
        NO_DATA_TEXT = text[match];
    }
}

function updateOptions(opts) {
    options = opts;
}

export function init(opts, vm) {
    const keywords = vm.router.parse().query.s;

    updateOptions(opts);
    Docsify.dom.style(options.templates.style(options));
    renderBase(keywords);
    bindEvents();
    keywords && setTimeout(() => doSearch(keywords), 500);
}

export function update(opts, vm) {
    updatePlaceholder(opts.placeholder, vm.route.path);
    updateNoData(opts.noData, vm.route.path);
}
