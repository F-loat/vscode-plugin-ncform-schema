<template>
  <div
    class="context-menu"
    :style="{
      top: `${top}px`,
      left: `${left}px`
    }"
  >
    <div class="menu-item" @click="handleAdd()">
      插入
    </div>
    <div
      class="menu-item"
      @click="handleCopy"
      v-if="paths[2]"
    >
      复制
    </div>
    <div
      class="menu-item"
      v-if="copiedItem.key"
      @click="handlePaste"
    >
      粘贴
    </div>
    <div
      class="menu-item"
      @click="handleRemove"
      v-if="paths[2]"
    >
      删除
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import _get from 'lodash-es/get';
import _cloneDeep from 'lodash-es/cloneDeep';

export default Vue.extend({
  props: {
    top: {
      type: Number,
      default: 0,
    },
    left: {
      type: Number,
      default: 0,
    },
    schema: {
      type: Object,
    },
    paths: {
      type: Array as () => string[],
      default() {
        return [''];
      },
    },
  },
  data() {
    return {
      copiedItem: {
        key: '',
      },
    };
  },
  methods: {
    handleAdd(item: any) {
      const schema = _cloneDeep(this.schema);
      const checkedItem = _get(schema, this.paths[0]);

      const addItem = item || {
        key: Date.now(),
        type: 'string',
        ui: {
          widget: 'input',
          widgetConfig: {},
          columns: checkedItem.ui ? checkedItem.ui.columns : 12,
          label: '新增字段',
        },
        rules: {},
      };

      if (this.paths[2]) {
        _get(schema, this.paths[1]).splice(this.paths[2], 0, addItem);
      } else {
        checkedItem.push(addItem);
      }

      this.$emit('update', schema);
    },
    handleCopy() {
      const checkedItem = _get(this.schema, this.paths);
      this.copiedItem = _cloneDeep(checkedItem);
    },
    handlePaste() {
      this.handleAdd({
        ...this.copiedItem,
        key: `${this.copiedItem.key}-${Date.now()}`,
      });
    },
    handleRemove() {
      const schema = _cloneDeep(this.schema);
      _get(schema, this.paths[1]).splice(this.paths[2], 1);
      this.$emit('update', schema);
    },
  },
});
</script>

<style>
.context-menu {
  position: absolute;
  box-shadow: 0px 1px 5px #000;
}

.menu-item {
  padding: 8px 24px;
  cursor: pointer;
  background-color: var(--vscode-editorHoverWidget-background);
}

.menu-item:hover {
  background-color: var(--vscode-editor-background);
}
</style>
