import { isObject } from './utils';

const base = (defaultValue = '', options) => `
    <div class="input-wrap">
        <input type="search" value="${defaultValue}" />
        <div class="clear-button">
            <svg width="26" height="24">
                <circle cx="12" cy="12" r="11" fill="#ccc" />
                <path stroke="white" stroke-width="2" d="M8.25,8.25,15.75,15.75" />
                <path stroke="white" stroke-width="2"d="M8.25,15.75,15.75,8.25" />
            </svg>
        </div>
    </div>
    <div class="results-panel"></div>
    </div>
`;

const style = (options) =>  `
    .sidebar {
        --search-link-hover-color: #fff;
        padding-top: 0;
    }

    .search {
        margin-bottom: 20px;
        padding: 6px;
        border-bottom: 1px solid #eee;
    }

    .search .input-wrap {
        display: flex;
        align-items: center;
    }

    .search .results-panel {
        display: none;
    }

    .search .results-panel.show {
        display: block;
    }

    .search a:hover {
        color: var(--search-link-hover-color);
    }

    .search input {
        outline: none;
        border: none;
        width: 100%;
        padding: 0 7px;
        line-height: 36px;
        font-size: 14px;
    }

    .search input::-webkit-search-decoration,
    .search input::-webkit-search-cancel-button,
    .search input {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }
    .search .clear-button {
        width: 36px;
        text-align: right;
        display: none;
    }

    .search .clear-button.show {
        display: block;
    }

    .search .clear-button svg {
        transform: scale(.5);
    }

    .search h2 {
        font-size: 17px;
        margin: 10px 0;
    }

    .search a {
        text-decoration: none;
        color: inherit;
    }

    .search .matching-post {
        border-bottom: 1px solid #eee;
    }

    .search .matching-post:last-child {
        border-bottom: 0;
    }

    .search p {
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .search p.empty {
        text-align: center;
    }

    .app-name.hide, .sidebar-nav.hide {
        display: none;
    }
`;

const resultItem = result => {
    const { title } = result._highlightResult;
    const { body } = result._snippetResult;

    return `
        <div class="matching-post">
            <a href="${result.slug}">
                <h2>${title.value}</h2>
                <p>${body.value}</p>
            </a>
        </div>
    `;
}

const resultSet = (set, response, options) => {
    const { hits, index } = set;
    const { noData, templates, algolia: { multi } } = options;
    let innerHTML = `<p>${noData}</p>`;
    let label = index;

    if (hits.length) {
        innerHTML = hits.map(result =>
            templates.resultItem(result, response, options)).join('');
    }

    if (isObject(multi)) {
        label = multi[index];
    }

    return `
        <div class="matching-set">
            <h2 class="matching-set-heading">${label}</h2>
            ${innerHTML}
        </div>
    `
}

export default {
    base,
    style,
    resultItem,
    resultSet,
};