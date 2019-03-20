<script lang="ts">
import VV from 'vue'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { server, ossServer } from '@/config'
import marked from 'marked'

const renderer = new marked.Renderer()
renderer.heading = function(
    text: string,
    level: number,
    raw: any,
    slugger: any
) {
    return marked.Renderer.prototype.heading.call(
        this,
        text,
        3,
        raw,
        slugger
    )
}

renderer.link = function(href: string, title: string, text: string) {
    const link = marked.Renderer.prototype.link.call(this, href, title, text)
    return link.replace('<a', '<a target="_blank" ')
}

renderer.image = function(href: string, title: string, text: string) {
    if (!/^(https?:)?\/\//.test(href)) {
        href = `${ossServer.baseUrl}/${ossServer.name}/${href}`
    }
    let out = `<img src="${href}" alt="${text ||
        title ||
        href}" data-src="${href}"`
    if (title || text) {
        out += ` title="${title || text}"`
    }
    out += this.options.xhtml ? '/>' : '>'
    return out
}

marked.setOptions({
    baseUrl: server.baseRouteUrl,
    renderer
})

@Component
export default class Marked extends Vue {
    @Prop()
    value!: string

    marked(...args: any[]) {
        return marked(...args)
    }
}
</script>

<template>
    <div class="cmpt-marked" ref="el" v-if="this.value" v-html="marked(this.value)" v-preview></div>
</template>

<style lang="scss">
@import '../style';
.cmpt-marked {
    p,
    blockquote,
    pre,
    ul,
    ol,
    dl {
        margin: 0.6em 0;
        line-height: 1.5;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        margin: 1.2em 0 0.6em 0;
    }

    h1,
    h2 {
        &::after {
            content: '';
            display: block;
            position: relative;
            top: 0.33em;
            border-bottom: 1px solid $c-ccc;
        }
    }

    ol ul,
    ul ol,
    ul ul,
    ol ol {
        margin: 0;
    }

    dt {
        font-weight: bold;
    }

    a {
        color: $c-primary-font;
        text-decoration: underline;
        &:hover,
        &:focus {
            text-decoration: none;
        }
    }

    code,
    pre,
    samp {
        * {
            font-size: inherit;
        }
    }

    blockquote {
        color: rgba(0, 0, 0, 0.5);
        padding-left: 1.5em;
        border-left: 5px solid rgba(0, 0, 0, 0.075);

        .app--dark .layout__panel--editor &,
        .app--dark .layout__panel--preview & {
            color: rgba(255, 255, 255, 0.4);
            border-left-color: rgba(255, 255, 255, 0.075);
        }
    }

    code {
        background-color: rgba(0, 0, 0, 0.05);
        padding: 2px 4px;
    }

    hr {
        border: 0;
        border-top: 1px solid $c-ccc;
        margin: 1em 0;
    }

    pre > code {
        background-color: rgba(0, 0, 0, 0.03);
        display: block;
        padding: 0.5em;
        -webkit-text-size-adjust: none;
        overflow-x: auto;
        white-space: pre;
    }

    .toc ul {
        list-style-type: none;
        padding-left: 20px;
    }

    table {
        background-color: transparent;
        border-collapse: collapse;
        border-spacing: 0;
        border: 1px solid #ddd;
        border-collapse: separate;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        margin: 12px 0;
    }

    td,
    th {
        border-right: 1px solid #dcdcdc;
        padding: 8px 12px;

        &:last-child {
            border-right: 0;
        }
    }

    td {
        border-top: 1px solid #dcdcdc;
    }
    tbody > tr:nth-child(2n + 1) > td,
    tbody > tr:nth-child(2n + 1) > th {
        background-color: rgba(102, 128, 153, 0.05);
    }

    mark {
        background-color: #f8f840;
    }

    kbd {
        background-color: #fff;
        border: 1px solid rgba(63, 63, 63, 0.25);
        border-radius: 3px;
        box-shadow: 0 1px 0 rgba(63, 63, 63, 0.25);
        color: #333;
        display: inline-block;
        font-size: 0.8em;
        margin: 0 0.1em;
        padding: 0.1em 0.6em;
        white-space: nowrap;
    }

    abbr {
        &[title] {
            border-bottom: 1px dotted #777;
            cursor: help;
        }
    }

    img {
        max-width: 100%;
        line-height: 1;
    }
}
</style>
