import * as vscode from 'vscode';

export class NcFormSchemaGenProvider {
  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand(NcFormSchemaGenProvider.viewType, (uri: vscode.Uri) => {
      let resource = uri;
      if (!(resource instanceof vscode.Uri)) {
        if (vscode.window.activeTextEditor) {
          resource = vscode.window.activeTextEditor.document.uri;
        }
      }

      NcFormSchemaGenProvider.generate(resource);
    });
  }

  private static readonly viewType = 'ncformSchema.gen';

  public static async generate(uri: vscode.Uri) {
    try {
      const document = await vscode.workspace.openTextDocument(uri);
      const editor = await vscode.window.showTextDocument(document);
      const val = JSON.parse(document.getText());
      const schema = NcFormSchemaGenProvider.recurseTree({ val });

      editor.edit((editBuilder) => {
        editBuilder.replace(
          new vscode.Range(0, 0, document.lineCount, 0),
          JSON.stringify(schema, null, 2),
        );
      });
    } catch (err) {
      vscode.window.showWarningMessage(err.message);
    }
  }

  public static recurseTree({ key, val = null }: { key?: string; val: any }) {
    interface Item {
      type?: string;
      ui?: {
        label: string | undefined;
      };
      items?: any;
      properties?: any;
    }
    const item: Item = {};
    const type = Object.prototype.toString
      .call(val)
      .slice(8, -1)
      .toLowerCase();
    switch (type) {
      case 'null':
      case 'undefined':
        return { type };
      case 'number':
      case 'string':
      case 'boolean':
        item.type = type;
        item.ui = { label: key };
        break;
      case 'array':
        item.type = type;
        item.items = NcFormSchemaGenProvider.recurseTree({ key, val: val[0] });
        item.ui = { label: key };
        break;
      case 'object': {
        item.type = type;
        Object.keys(val).forEach((subkey) => {
          const subval = val[subkey];
          const result = NcFormSchemaGenProvider.recurseTree({ key: subkey, val: subval });
          item.properties = { ...item.properties, [subkey]: result };
        });
        if (key) item.ui = { label: key };
        break;
      }
      default: {
        vscode.window.showWarningMessage(`The existed type ${type} is no allowed.`);
      }
    }
    return item;
  }
}
