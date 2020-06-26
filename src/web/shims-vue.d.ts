import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    $vson: (type: string, callback: Function) => void;
    $vsemit: (type: string, body?: string) => void;
  }
}
