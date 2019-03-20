import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import './style.less'
/* tslint:disable */
monaco.editor.defineTheme('awk', {
    base: 'vs',
    inherit: true,
    rules: [
        { token: '', foreground: '666666', background: 'f5f5f5' },
        { token: 'strong', fontStyle: 'bold' },
        { token: 'keyword', foreground: '000000', fontStyle: 'bold' },
        { token: 'comment', foreground: '7F848E', fontStyle: 'italic' },
        { token: 'string.link', foreground: '999999' },
        { token: 'decorate', foreground: 'aaaaaa' },
        { token: 'decorate.header', fontStyle: 'bold' },
        { token: 'decorate.strong', foreground: 'e3728c', fontStyle: 'bold' },
        { token: 'decorate.italic', foreground: 'e3728c', fontStyle: 'italic' },
        { token: 'decorate.title', foreground: '3b82d2' },
        { token: 'decorate.quote', foreground: '12cfaf' },
        { token: 'decorate.list', foreground: '12cfaf' },
        { token: 'decorate.codeblock', foreground: 'ab5312' },
        { token: 'decorate.horizrule', foreground: 'e3728c', fontStyle: 'bold' }
    ],
    colors: {
        'editor.background': '#f5f5f5',
        'editor.lineHighlightBackground': '#aabbbb20', // 当前行
        'editor.selectionBackground': '#77ddcc50', // 选中文本
        'editor.selectionHighlightBackground': '#ffcc99',
        'editor.inactiveSelectionBackground': '#aaaaaa50', // 选中为本（未激活）
        'menu.selectionBackground': '#77ddcc',
        'editorLink.activeForeground': '#12cfaf'
    }
})

monaco.languages.register({ id: 'awk-markdown' })
monaco.languages.setLanguageConfiguration('awk-markdown', {
    comments: {
        blockComment: ['<!--', '-->']
    },
    brackets: [['{', '}'], ['[', ']'], ['(', ')']],
    autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '<', close: '>', notIn: ['string'] }
    ],
    surroundingPairs: [
        { open: '(', close: ')' },
        { open: '[', close: ']' },
        { open: '`', close: '`' }
    ],
    folding: {
        markers: {
            start: new RegExp('^\\s*<!--\\s*#?region\\b.*-->'),
            end: new RegExp('^\\s*<!--\\s*#?endregion\\b.*-->')
        }
    }
})

monaco.languages.setMonarchTokensProvider('awk-markdown', {
    defaultToken: '',
    tokenPostfix: '.md',
    // escape codes
    control: /[\\`*_\[\]{}()#+\-\.!]/,
    noncontrol: /[^\\`*_\[\]{}()#+\-\.!]/,
    escapes: /\\(?:@control)/,
    // escape codes for javascript/CSS strings
    jsescapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
    // non matched elements
    empty: [
        'area',
        'base',
        'basefont',
        'br',
        'col',
        'frame',
        'hr',
        'img',
        'input',
        'isindex',
        'link',
        'meta',
        'param'
    ],
    tokenizer: {
        root: [
            // headers (with #)
            [
                /^(\s{0,3})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/,
                [
                    'decorate.header',
                    'decorate.header',
                    'keyword',
                    'decorate.header'
                ]
            ],
            // headers (with =)
            // [/^\s{0,3}(=+|\-+)\s*$/, 'keyword'],
            // headers (with ***)
            // [/^\s{0,3}((\*[ ]?)+)\s*$/, 'meta.separator'],
            // horizrule
            [/^\s{0,3}(=|\-){3,}\s*$/, 'decorate.horizrule'],
            // quote
            [/^\s{0,3}>+/, 'decorate.quote'],
            // todo list
            [
                /^\s{0,3}((?:[\*\-+:]|\d+\.)\s\[)(\s|x)(\])/,
                ['decorate.list', 'decorate.strong', 'decorate.list']
            ],
            // list (starting with * or number)
            [/^\s{0,3}([\*\-+:]|\d+\.)\s/, 'decorate.list'],
            // code block (4 spaces indent)
            [/^(\t|[ ]{4,})[^ ].*$/, 'decorate.codeblock'],
            // code block (3 tilde)
            [
                /^\s*~~~\s*((?:\w|[\/\-#])+)?\s*$/,
                { token: 'decorate.codeblock', next: '@codeblock' }
            ],
            // github style code blocks (with backticks and language)
            [
                /^\s*```\s*((?:\w|[\/\-#])+)\s*$/,
                {
                    token: 'decorate.codeblock',
                    next: '@codeblockgh',
                    nextEmbedded: '$1'
                }
            ],
            // github style code blocks (with backticks but no language)
            [
                /^\s*```\s*$/,
                { token: 'decorate.codeblock', next: '@codeblock' }
            ],
            // markup within lines
            { include: '@linecontent' }
        ],
        codeblock: [
            [/^\s*~~~\s*$/, { token: 'decorate.codeblock', next: '@pop' }],
            [/^\s*```\s*$/, { token: 'decorate.codeblock', next: '@pop' }],
            [/.*$/, 'variable.source']
        ],
        // github style code blocks
        codeblockgh: [
            [
                /```\s*$/,
                { token: 'variable.source', next: '@pop', nextEmbedded: '@pop' }
            ],
            [/[^`]+/, 'variable.source']
        ],
        linecontent: [
            // escapes
            [/&\w+;/, 'string.escape'],
            [/@escapes/, 'escape'],
            // various markup
            [/\b__([^\\_]|@escapes|_(?!_))+__\b/, 'strong'],
            [
                /(\*\*)((?:[^\\*]|@escapes|\*(?!\*))+)(\*\*)/,
                ['decorate.strong', 'strong', 'decorate.strong']
            ],
            [/\b_[^_]+_\b/, 'emphasis'],
            [
                /(\*)((?:[^\\*]|@escapes)+)(\*)/,
                ['decorate.italic', 'emphasis', 'decorate.italic']
            ],
            [/`([^\\`]|@escapes)+`/, 'variable'],
            // links
            [/\{+[^}]+\}+/, 'string.target'],
            [
                /(!?\[)((?:[^\]\\]|@escapes)*)(\]\()([^\)]+)(\))/,
                [
                    'decorate',
                    'decorate.title',
                    'decorate',
                    'string.link',
                    'decorate'
                ]
            ],
            [/(!?\[)((?:[^\]\\]|@escapes)*)(\])/, 'string.link'],
            // or html
            { include: 'html' }
        ],
        // Note: it is tempting to rather switch to the real HTML mode instead of building our own here
        // but currently there is a limitation in Monarch that prevents us from doing it: The opening
        // '<' would start the HTML mode, however there is no way to jump 1 character back to let the
        // HTML mode also tokenize the opening angle bracket. Thus, even though we could jump to HTML,
        // we cannot correctly tokenize it in that mode yet.
        html: [
            // html tags
            [/<(\w+)\/>/, 'tag'],
            [
                /<(\w+)/,
                {
                    cases: {
                        '@empty': { token: 'tag', next: '@tag.$1' },
                        '@default': { token: 'tag', next: '@tag.$1' }
                    }
                }
            ],
            [/<\/(\w+)\s*>/, { token: 'tag' }],
            [/<!--/, 'comment', '@comment']
        ],
        comment: [
            [/[^<\-]+/, 'comment.content'],
            [/-->/, 'comment', '@pop'],
            [/<!--/, 'comment.content.invalid'],
            [/[<\-]/, 'comment.content']
        ],
        // Almost full HTML tag matching, complete with embedded scripts & styles
        tag: [
            [/[ \t\r\n]+/, 'white'],
            [
                /(type)(\s*=\s*)(")([^"]+)(")/,
                [
                    'attribute.name.html',
                    'delimiter.html',
                    'string.html',
                    { token: 'string.html', switchTo: '@tag.$S2.$4' },
                    'string.html'
                ]
            ],
            [
                /(type)(\s*=\s*)(')([^']+)(')/,
                [
                    'attribute.name.html',
                    'delimiter.html',
                    'string.html',
                    { token: 'string.html', switchTo: '@tag.$S2.$4' },
                    'string.html'
                ]
            ],
            [
                /(\w+)(\s*=\s*)("[^"]*"|'[^']*')/,
                ['attribute.name.html', 'delimiter.html', 'string.html']
            ],
            [/\w+/, 'attribute.name.html'],
            [/\/>/, 'tag', '@pop'],
            [
                />/,
                {
                    cases: {
                        '$S2==style': {
                            token: 'tag',
                            switchTo: 'embeddedStyle',
                            nextEmbedded: 'text/css'
                        },
                        '$S2==script': {
                            cases: {
                                $S3: {
                                    token: 'tag',
                                    switchTo: 'embeddedScript',
                                    nextEmbedded: '$S3'
                                },
                                '@default': {
                                    token: 'tag',
                                    switchTo: 'embeddedScript',
                                    nextEmbedded: 'text/javascript'
                                }
                            }
                        },
                        '@default': { token: 'tag', next: '@pop' }
                    }
                }
            ]
        ],
        embeddedStyle: [
            [/[^<]+/, ''],
            [
                /<\/style\s*>/,
                { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }
            ],
            [/</, '']
        ],
        embeddedScript: [
            [/[^<]+/, ''],
            [
                /<\/script\s*>/,
                { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }
            ],
            [/</, '']
        ]
    }
} as monaco.languages.IMonarchLanguage)

export default monaco
