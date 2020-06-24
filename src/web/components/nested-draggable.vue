<template>
  <draggable
    class="nested-draggable"
    group="nested-draggable"
    :list="properties"
    @end="handleDrag"
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
        <div class="inner-item" @click="handleCheck(item, `${paths}[${index}]`)">
          <span class="inner-item-label">{{ item.ui && item.ui.label }}</span> <!-- label -->
          <span class="inner-item-key">{{item.key}}</span>
        </div>
        <nested-draggable
          @check="handleCheck"
          @dragend="handleDrag"
          v-if="item.type === 'object'"
          :properties="item.properties"
          :paths="`${paths}[${index}].properties`"
        />
        <template v-else-if="item.type === 'array' && item.items">
          <nested-draggable
            @check="handleCheck"
            @dragend="handleDrag"
            v-if="item.items.type === 'array' && item.items.items"
            :properties="item.items.items"
            :paths="`${paths}[${index}].items.items`"
          />
          <nested-draggable
            @check="handleCheck"
            @dragend="handleDrag"
            v-else-if="item.items.type === 'object' && item.items.properties"
            :properties="item.items.properties"
            :paths="`${paths}[${index}].items.properties`"
          />
        </template>
      </div>
    </div>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'nestedDraggable',
  components: {
    draggable
  },
  props: {
    paths: {
      type: String,
      default: ''
    },
    properties: {
      type: Array
    }
  },
  methods: {
    handleCheck(item, paths) {
      this.$emit('check', item, paths);
    },
    handleDrag(e) {
      this.$emit('end', e);
    }
  }
};
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
