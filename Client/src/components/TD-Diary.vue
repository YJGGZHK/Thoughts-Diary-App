<template>
    <div>
        <div id="markdown-container" :style="{ height: height }"></div>
    </div>
</template>

<script>

import "cherry-markdown/dist/cherry-markdown.min.css";
import Cherry from "cherry-markdown";

export default {
    name: 'CherryComponents',
    props: {
        height: {
            type: String,
            default: 'calc(100vh - 100px)'
        },
        editorModel: {
            type: String,
            default: 'edit&preview'
        }
    },
    data() {
        return {
            cherryInstance: null,
            content: ''
        }
    },
    mounted() {
        this.initMarkDown()
    },
    methods: {
        /**
         *
         *   defaultModel 编辑器初始化后的默认模式，一共有三种模式：1、双栏编辑预览模式；2、纯编辑模式；3、预览模式
         *   edit&preview: 双栏编辑预览模式
         *   editOnly: 纯编辑模式（没有预览，可通过toolbar切换成双栏或预览模式）
         *   previewOnly: 预览模式（没有编辑框，toolbar只显示“返回编辑”按钮，可通过toolbar切换成编辑模式）
         */
        initMarkDown() {
            this.cherryInstance = new Cherry({
                id: 'markdown-container',
                value: this.content,
                emoji: { useUnicode: true },
                editor: { defaultModel: this.editorModel },
                toolbars: {
                    // 定义顶部工具栏
                    toolbar: [
                        'undo', 'redo', '|',
                        // 把字体样式类按钮都放在加粗按钮下面
                        { bold: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'ruby'] },
                        'color', 'size', '|', 'header', 'list', 'panel', '|',
                        // 把插入类按钮都放在插入按钮下面
                        { insert: ['image', 'audio', 'video', 'link', 'hr', 'br', 'code', 'formula', 'toc', 'table', 'drawIo'] },
                        'graph'
                    ],
                    // 定义侧边栏，默认为空
                    sidebar: ['theme', 'mobilePreview', 'copy'],
                    // 定义顶部右侧工具栏，默认为空
                    toolbarRight: ['fullScreen', 'export'],
                    // 定义选中文字时弹出的“悬浮工具栏”，默认为 ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'quote', '|', 'size', 'color']
                    bubble: ['bold', 'italic', 'underline', 'strikethrough', 'sub', 'sup', 'ruby', '|', 'color', 'size',],
                    // 定义光标出现在行首位置时出现的“提示工具栏”，默认为 ['h1', 'h2', 'h3', '|', 'checklist', 'quote', 'table', 'code']
                    float: ['table', 'code', 'graph'],
                },
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#markdown-container {
    text-align: left;
}
</style>