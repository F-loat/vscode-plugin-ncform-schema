<template>
  <draggable
    class="nested-draggable"
    group="nested-draggable"
    :list="properties"
    @end="handleDrag"
    @contextmenu.native.prevent="!properties.length && handleMenu($event, paths)"
  >
    <div
      v-for="(item, index) of properties"
      :key="item.key"
      :class="['col-' + (item.ui ? (item.ui.columns || 12) : 12)]"
    >
      <div
        class="inner-wrap"
        :class="{
          hidden: item.ui && item.ui.hidden === true,
          readonly: item.ui && item.ui.readonly === true
        }"
      >
        <div
          class="inner-item"
          @click="handleCheck(`${paths}[${index}]`)"
          @contextmenu.prevent="handleMenu($event, `${paths}[${index}]`)"
        >
          <span class="inner-item-label">{{ item.ui && item.ui.label }}</span> <!-- label -->
          <span class="inner-item-key">{{item.key}}</span>
        </div>
        <nested-draggable
          v-if="item.type === 'object' || item.type === 'array'"
          :paths="getPaths(item, index)"
          :properties="getProperties(item)"
          @check="handleCheck"
          @dragend="handleDrag"
          @contextmenu="handleMenu"
        />
      </div>
    </div>
  </draggable>
</template>

<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';

export default Vue.extend({
  name: 'nestedDraggable',
  components: {
    draggable,
  },
  props: {
    paths: {
      type: String,
      default: '',
    },
    properties: {
      type: Array,
    },
  },
  methods: {
    getPaths(item: any, index: number) {
      const { paths } = this;
      if (item.type === 'object') {
        return `${paths}[${index}].properties`;
      }
      if (item.items.type === 'array' && item.items.items) {
        return `${paths}[${index}].items.items`;
      }
      if (item.items.type === 'object' && item.items.properties) {
        return `${paths}[${index}].items.properties`;
      }
      return '';
    },
    getProperties(item: any) {
      if (item.type === 'object') {
        return item.properties;
      }
      if (item.items.type === 'array' && item.items.items) {
        return item.items.items;
      }
      if (item.items.type === 'object' && item.items.properties) {
        return item.items.properties;
      }
      return [];
    },
    handleCheck(paths: string) {
      this.$emit('check', paths);
    },
    handleDrag(e: MouseEvent) {
      this.$emit('end', e);
    },
    handleMenu(e: MouseEvent, paths: string) {
      this.$emit('contextmenu', e, paths);
    },
  },
});
</script>

<style lang="scss" scoped>
.nested-draggable {
  min-height: 50px;
  display: flex;
  flex-wrap: wrap;
  & > div {
    padding: 4px;
    box-sizing: border-box;
  }
}

.inner-wrap {
  height: 100%;
  cursor: default;
  outline: 1px solid var(--vscode-editorGutter-commentRangeForeground);
  position: relative;
  padding: 4px;
  box-sizing: border-box;
}

.inner-wrap:hover {
  outline: 1px solid var(--vscode-editorWarning-foreground);
}

.inner-item {
  overflow: hidden;
  white-space: nowrap;
  padding-left: 8px;
  line-height: 36px;
  font-size: var(--vscode-font-size);
}

.inner-item-label {
  font-size: var(--vscode-editor-font-size);
}

.inner-item-key {
  color: var(--vscode-editorWarning-foreground);
}

.nested-draggable .readonly::after {
  content: '只读';
  position: absolute;
  top: 6px;
  right: 8px;
  color: var(--vscode-editorCodeLens-foreground);
  font-size: 12px;
  transform: scale(.9)
}

.nested-draggable .hidden::after {
  content: '隐藏';
  position: absolute;
  top: 6px;
  right: 8px;
  color: var(--vscode-editorCodeLens-foreground);
  font-size: 12px;
  transform: scale(.9)
}

.col-1 {
  width: 8.333%!important;
}

.col-2 {
  width: 16.666%!important;
}

.col-3 {
  width: 25%!important;
}

.col-4 {
  width: 33.333%!important;
}

.col-5 {
  width: 41.666%!important;
}

.col-6 {
  width: 50%!important;
}

.col-7 {
  width: 58.333%!important;
}

.col-8 {
  width: 66.666%!important;
}

.col-9 {
  width: 75%!important;
}

.col-10 {
  width: 83.333%!important;
}

.col-11 {
  width: 91.666%!important;
}

.col-12 {
  width: 100%!important;
}
</style>
