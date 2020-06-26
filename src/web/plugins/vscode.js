export default {
  install(Vue) {
    const vscode = acquireVsCodeApi();

    Vue.prototype.$vscode = vscode;

    Vue.prototype.$vsemit = (type, body) => {
      vscode.postMessage({
        type,
        body,
      });
    };

    Vue.prototype.$vson = (type, callback) => {
      window.addEventListener('message', (event) => {
        const message = event.data;

        if (message.type === type) {
          callback(message.body);
        }
      });
    };
  },
};
