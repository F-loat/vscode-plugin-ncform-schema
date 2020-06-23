<template>
  <div>
    <div class="drag-schema-header">
      <h3 @click="handleCheck(dragSchema)">根组件</h3>
    </div>
    <nested-draggable
      :properties="dragSchema.properties"
      paths="properties"
      @check="handleCheck"
      @end="handleUpdate(dragSchema)"
    />
    <el-drawer
      :visible.sync="drawer"
      :show-close="false"
      :with-header="false"
      modal
      append-to-body
    >
      <textarea
        v-if="drawer"
        :value="drawerValue"
        @input="handleInput"
      />
    </el-drawer>
  </div>
</template>

<script>
import _get from 'lodash-es/get';
import _set from 'lodash-es/set';
import _cloneDeep from 'lodash-es/cloneDeep';
import { form2drag, drag2form } from '../utils';
import nestedDraggable from './nested-draggable.vue';

export default {
  name: 'App',
  components: {
    nestedDraggable
  },
  data() {
    return {
      drawer: false,
      copiedItem: {},
      checkedItem: {},
      dragSchema: {}
    };
  },
  computed: {
    drawerValue() {
      return JSON.stringify(this.checkedItem, null, 2);
    }
  },
  mounted() {
    this.initSyncSchmea();
  },
  methods: {
    initSyncSchmea() {
      this.$vsemit('init');
      this.$vson('update', (data) => {
        const formSchema = JSON.parse(data);
        this.dragSchema = {
          ...formSchema,
          properties: form2drag(formSchema.properties)
        };
      });
    },
    handleCheck(item, paths) {
      this.drawer = true;
      this.checkedItem = {
        ...item,
        items: undefined,
        properties: undefined
      };
      this.checkedPaths = paths;
    },
    handleAdd(paths, index, item) {
      _get(this.dragSchema, paths).splice(index, 0, item || {});
    },
    handleCopy(item) {
      this.copiedItem = { ...item, key: Date.now() };
    },
    handlePaste(paths, index) {
      this.handleAdd(paths, index, this.copiedItem);
    },
    handleRemove(paths, index) {
      _get(this.dragSchema, paths).splice(index, 1);
    },
    handleInput(e) {
      try {
        const { dragSchema, checkedPaths } = this;
        const oldItem = _get(dragSchema, checkedPaths);
        const newItem = JSON.parse(e.target.value);
        const newSchema = _cloneDeep(dragSchema);
        this.checkedItem = newItem;
        _set(newSchema, checkedPaths, { ...oldItem, ...newItem });
        this.handleUpdate(newSchema);
      } catch {
        // do-nothing
      }
    },
    handleUpdate(dragSchema) {
      this.$vsemit('update', JSON.stringify({
        ...dragSchema,
        properties: drag2form(dragSchema.properties)
      }, null, 2));
    }
  }
};
</script>

<style lang="scss">
div {
  outline: none;
}

.el-drawer {
  min-width: 280px;
  background-color: var(--vscode-editor-background) !important;
  padding: 16px;
  font-size: var(--vscode-editor-font-size);
  line-height: 1.5;
  textarea {
    width: 100%;
    height: 100%;
    color: inherit;
    background-color: transparent;
    border: none;
    outline: none;
    line-height: 1.5;
    font-size: var(--vscode-editor-font-size);
  }
}
</style>

<style lang="scss" scoped>
.drag-schema {
  margin: 8px 0;
  padding: 4px;
  overflow: scroll;
  overflow-x: hidden;
  outline: 1px solid var(--vscode-editorGutter-commentRangeForeground);
}

.drag-schema::-webkit-scrollbar {
  width: 0 !important;
}

.drag-schema-header {
  display: flex;
  h3 {
    margin: 8px;
  }
}

.drag-schema-header h3 {
  flex: 1;
  cursor: pointer;
}

.drag-schema-header button {
  height: 44px;
  margin-top: 12px;
}
</style>
