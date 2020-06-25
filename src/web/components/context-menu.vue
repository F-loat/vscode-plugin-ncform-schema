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
    <div class="menu-item" @click="handleCopy">
      复制
    </div>
    <div
      class="menu-item"
      v-if="copiedItem.key"
      @click="handlePaste"
    >
      粘贴
    </div>
    <div class="menu-item" @click="handleRemove">
      删除
    </div>
  </div>
</template>

<script>
import _get from 'lodash-es/get';
import _set from 'lodash-es/set';
import _cloneDeep from 'lodash-es/cloneDeep';

export default {
  props: {
    top: {
      type: Number,
      default: 0
    },
    left: {
      type: Number,
      default: 0
    },
    schema: {
      type: Object
    },
    item: {
      type: Object
    },
    paths: {
      type: String
    }
  },
  data() {
    return {
      copiedItem: {}
    }
  },
  methods: {
    getPaths() {
      return this.paths.match(/(.*)\[(\d+)\]$/);
    },
    handleAdd(item) {
      const paths = this.getPaths();
      const newSchema = _cloneDeep(this.schema);

      _get(newSchema, paths[1]).splice(paths[2], 0, item || {
        key: Date.now(),
        type: 'string',
        ui: {
          widget: 'input',
          widgetConfig: {},
          columns: this.item.ui.columns,
          label: '新增字段'
        },
        rules: {}
      });

      this.$emit('update', newSchema);
    },
    handleCopy() {
      this.copiedItem = _cloneDeep(this.item);
    },
    handlePaste() {
      this.handleAdd({
        ...this.copiedItem,
        key: `${this.copiedItem.key}-${Date.now()}`
      });
    },
    handleRemove() {
      const paths = this.getPaths();
      const newSchema = _cloneDeep(this.schema);
      _get(newSchema, paths[1]).splice(paths[2], 1);
      this.$emit('update', newSchema);
    }
  }
}
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
