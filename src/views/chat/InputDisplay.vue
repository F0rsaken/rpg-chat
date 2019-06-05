<script>
import Vue from 'vue';

class DisplayParser {
    fullState = [];

    addState(startIndex, endIndex, string, type, moduleId) {
        let prevObj = this.fullState.length > 0 ? this.fullState[this.fullState.length - 1] : { end: -1 };
        let start = prevObj.end + 1;
        let text;
        if (endIndex === -1 || null) {
            text = string.substring(startIndex);
        } else {
            text = string.substring(startIndex, endIndex);
        }

        if (moduleId) {
            this.fullState.push({ type, text, start, end: start + text.length - 1, moduleId });
        } else {
            this.fullState.push({ type, text, start, end: start + text.length - 1 });
        }
    }

    concatRepeatingTexts() {
        let prevObj, currObj;
        for (let i = 1; i < this.fullState.length; i++) {
            currObj = this.fullState[i];
            prevObj = this.fullState[i-1];
            if (currObj.type === PARSED_TYPES.text && prevObj.type === PARSED_TYPES.text) {
                prevObj.text += currObj.text;
                prevObj.end = currObj.end;
                this.fullState.splice(i, 1);
                i--;
            }
        }

        let last = this.fullState[this.fullState.length - 1];
        if (last.type === PARSED_TYPES.module) {
            this.fullState.push({ type: PARSED_TYPES.text, text: '\xa0', start: last.end + 1, end: last.end + 1 })
        }
    }

    /** @param {NodeListOf<ChildNode>} childNodes */
    updateState(childNodes, fullString) {
        this.fullState = [];
        let index = 0;
        for (let node of childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                this.addState(index, index + node.length, fullString, PARSED_TYPES.text);
                index += node.length
            } else {
                this.addState(index, index + node.innerText.length, fullString, PARSED_TYPES.module, node.dataset.moduleId);
                index += node.innerText.length;
            }
        }
        console.log(this.fullState);
    }

    newModule(startIndex, endIndex, moduleId) {
        let currObj, from, to, i;
        let text = '';
        let startFound = false;
        for (i = 0; i < this.fullState.length; i++) {
            currObj = this.fullState[i];
            if (startIndex >= currObj.start && startIndex <= currObj.end) {
                from = startIndex - currObj.start;
                if (endIndex <= currObj.end + 1) {
                    to = endIndex - currObj.start;
                    let tmp = this.cutTextFragment(i, from, to, startIndex, endIndex);
                    text += tmp.text;
                    i = tmp.index;
                    break;
                } else {
                    startFound = true;
                    to = currObj.end - currObj.start + 1;
                    let tmp = this.cutTextFragment(i, from, to, startIndex, endIndex);
                    text += tmp.text;
                }
            } else if (endIndex > currObj.start && endIndex <= currObj.end + 1) {
                from = 0;
                to = endIndex - currObj.start;
                let tmp = this.cutTextFragment(i, from, to, startIndex, endIndex);
                text += tmp.text;
                break;
            } else if (startFound) {
                let tmp = this.cutTextFragment(i, 0, currObj.text.length, startIndex, endIndex);
                text += tmp.text;
                i--;
            }
        }

        this.fullState.splice(i, 0, {
            type: PARSED_TYPES.module,
            text,
            start: startIndex,
            end: endIndex - 1,
            moduleId
        })

        console.log(this.fullState);
    }

    cutTextFragment(i, from, to, startIndex, endIndex) {
        let obj = this.fullState[i];
        let textLength = obj.text.length;
        let retVal = '';
        
        if (from === 0) {
            if (textLength === to) {
                retVal = obj.text;
                this.fullState.splice(i, 1);
            } else {
                retVal = obj.text.substring(from, to)
                obj.text = obj.text.substring(to);
                obj.start = obj.start + to;
            }
        } else if (textLength === to) {
            retVal = obj.text.substring(from, to);
            obj.text = obj.text.substring(0, from);
            obj.end = obj.end - (to - from);
            i++;
        } else {
            let leftObj = { type: PARSED_TYPES.text, text: obj.text.substring(0, from), start: obj.start, end: obj.start + from - 1 };
            let rightObj = { type: PARSED_TYPES.text, text: obj.text.substring(to), start: obj.end - (obj.text.length - to - 1), end: obj.end };
            retVal = obj.text.substring(from, to);
            this.fullState[i] = leftObj;
            i++;
            this.fullState.splice(i, 0, rightObj);
        }

        return { index: i, text: retVal };
    }

    getFullState() {
        return [...this.fullState];
    }

    getHTMLDisplay() {
        let retHTML = '';
        for (let el of this.fullState) {
            if (el.type === PARSED_TYPES.text) {
                retHTML += el.text;
            } else {
                retHTML += `<span class="selected-text" data-module-id="${el.moduleId}">${el.text}</span>`
            }
        }
        return retHTML;
    }
}

const displayParser = new DisplayParser();

const data = {
    parsed: [],
    innerContent: ''
}

let counter = 0;

export default {
    name: 'InputDisplay',
    render(createElement) {
        return createElement('div', {
            class: 'renderer-wrapper',
            attrs: { contenteditable: true },
            ref: 'textarea',
            domProps: { innerHTML: this.innerContent }
        });
    },
    data: () => data,
    methods: {
        createModule(moduleId) {
            let { startPos, endPos } = this.getCursorPosition();
            if (startPos === endPos) return;

            displayParser.updateState(this.$refs.textarea.childNodes, this.$refs.textarea.innerText);
            displayParser.newModule(startPos, endPos, moduleId);
            this.innerContent = displayParser.getHTMLDisplay();
        },
        getCursorPosition() {
            let offset = 0, startPos = 0, endPos = 0;
            let range = window.getSelection().getRangeAt(0);

            // FIXME: check node type
            for (let node of this.$refs.textarea.childNodes) {
                if (node === range.startContainer) {
                    startPos = offset + range.startOffset;
                }

                if (node === range.endContainer) {
                    endPos = offset + range.endOffset;
                    break;
                } else {
                    offset += node.textContent.length;
                }
            }
            return { startPos, endPos };
        },
        getMessage() {
            displayParser.updateState(this.$refs.textarea.childNodes, this.$refs.textarea.innerText);
            return displayParser.getFullState();
        },
        clear() {
            this.innerContent = '';
            if (displayParser.fullState.length === 1) this.$refs.textarea.removeChild(this.$refs.textarea.firstChild);
        }
    }
}


const PARSED_TYPES = {
    text: 0,
    module: 1
}

</script>

<style lang="scss">
    @import '@/assets/styles/consts.scss';

    .renderer-wrapper {
        box-sizing: border-box;
        font-size: 15px; padding: 10px 15px;
        border-radius: 10px;
        color: $color-2;
        border: 1px solid $color-2;
        background-color: $background-color-1;
        display: inline-block;
        width: 100%;
        height: 100%;
        max-height: 74px;
        overflow-y: scroll;

        &:focus { outline: none; }

        .selected-text {
            background-color: rgba(137, 139, 8, 0.527);
            border-left: 1px dotted #ffffff;
            border-right: 1px dotted #ffffff;
            padding: 0 3px;
        }
    }

</style>
