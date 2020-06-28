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
      @contextmenu="handleMenu"
    />
    <context-menu
      v-show="menu.show"
      :top="menu.top"
      :left="menu.left"
      :paths="menu.paths"
      :schema="dragSchema"
      @update="handleUpdate"
    />
    <el-drawer
      :visible.sync="drawer.show"
      :show-close="false"
      :with-header="false"
      modal
      append-to-body
    >
      <textarea
        v-if="drawer.show"
        v-model="drawer.value"
      />
    </el-drawer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import _get from 'lodash-es/get';
import _set from 'lodash-es/set';
import _cloneDeep from 'lodash-es/cloneDeep';
import _isEqual from 'lodash-es/isEqual';
import contextMenu from './context-menu.vue';
import nestedDraggable from './nested-draggable.vue';
import { form2drag, drag2form } from '../utils';

export default Vue.extend({
  name: 'App',
  components: {
    contextMenu,
    nestedDraggable,
  },
  data() {
    return {
      menu: {
        show: false,
        top: 0,
        left: 0,
        paths: [''],
      },
      drawer: {
        show: false,
        value: '',
        paths: '',
      },
      dragSchema: {},
    };
  },
  mounted() {
    this.initSyncSchmea();
  },
  methods: {
    initSyncSchmea() {
      this.$vsemit('init');
      this.$vson('update', (data: string) => {
        const formSchema = JSON.parse(data);
        this.dragSchema = {
          ...formSchema,
          properties: form2drag(formSchema.properties),
        };
      });
    },
    handleCheck(paths: string) {
      const schema = _cloneDeep(this.dragSchema);
      const item = _get(schema, paths);

      if (item.items) item.items.properties = undefined;
      if (item.properties) item.properties = undefined;
      const value = JSON.stringify(item, null, 2);

      this.drawer = { show: true, value, paths };
    },
    handleMenu(e: MouseEvent, paths: string) {
      this.menu = {
        top: e.pageY,
        left: e.pageX,
        show: true,
        paths: paths.match(/(.*)\[(\d+)\]?$/) || [paths],
      };
      window.addEventListener('click', () => {
        this.menu.show = false;
      }, { once: true });
    },
    handleItemChange(value: string) {
      try {
        const { dragSchema, drawer } = this;
        const oldItem = _get(dragSchema, drawer.paths);
        const { items, properties } = oldItem;

        const item = JSON.parse(value);
        if (item.items) {
          item.items.properties = items.properties;
        }
        if (properties) item.properties = properties;

        const isEqual = _isEqual(item, oldItem);

        if (isEqual) return;

        const schema = _cloneDeep(dragSchema);
        _set(schema, drawer.paths, item);
        this.handleUpdate(schema);
      } catch {
        // do-nothing
      }
    },
    handleUpdate(dragSchema: any) {
      this.$vsemit('update', JSON.stringify({
        ...dragSchema,
        properties: drag2form(dragSchema.properties),
      }, null, 2));
    },
  },
  watch: {
    'drawer.value': function handler(value: string) {
      clearTimeout(this.$options.timer);
      this.$options.timer = setTimeout(() => {
        this.handleItemChange(value);
      }, 300);
    },
  },
});
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
