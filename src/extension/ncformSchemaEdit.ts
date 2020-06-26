import * as vscode from 'vscode';

export class NcFormSchemaEditProvider {
  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand(NcFormSchemaEditProvider.viewType, (uri: vscode.Uri) => {
      let resource = uri;
      if (!(resource instanceof vscode.Uri)) {
        if (vscode.window.activeTextEditor) {
          resource = vscode.window.activeTextEditor.document.uri;
        }
      }

      const editor = vscode.window.activeTextEditor ? 'ncformSchema.editor' : 'default';

      vscode.commands.executeCommand('vscode.openWith', resource, editor);
    });
  }

  private static readonly viewType = 'ncformSchema.edit';
}
