import * as vscode from 'vscode';

export class NcFormSchemaEditorProvider implements vscode.CustomTextEditorProvider {

	public static register(context: vscode.ExtensionContext): vscode.Disposable {
		const provider = new NcFormSchemaEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(
      NcFormSchemaEditorProvider.viewType,
      provider,
      {
        webviewOptions: {
          retainContextWhenHidden: true,
          enableFindWidget: true
        }
      }
    );
		return providerRegistration;
	}

  private static readonly viewType = 'ncformSchema.editor';

  private static readonly isDev = false;

	constructor(
		private readonly context: vscode.ExtensionContext
	) { }

	/**
	 * Called when our custom editor is opened.
	 */
	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {
    // Setup initial content for the webview
		webviewPanel.webview.options = {
      enableScripts: true
		};
		webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

		function updateWebview() {
			webviewPanel.webview.postMessage({
				type: 'update',
				body: document.getText(),
			});
		}

		// Hook up event handlers so that we can synchronize the webview with the text document.
		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				updateWebview();
			}
		});

		// Make sure we get rid of the listener when our editor is closed.
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
		});

		// Receive message from the webview.
		webviewPanel.webview.onDidReceiveMessage(e => {
      switch (e.type) {
        case 'init':
          updateWebview();
          break;
        case 'update':
          this.updateTextDocument(document, e.body);
          break;
        case 'warning':
          vscode.window.showWarningMessage(e.body);
          break;
        case 'error':
          vscode.window.showErrorMessage(e.body);
          break;
			}
		});
	}

	/**
	 * Get the static html used for the editor webviews.
	 */
	private getHtmlForWebview(webview: vscode.Webview): string {
    const extDirname = webview.asWebviewUri(vscode.Uri.file(this.context.extensionPath)).toString();
    const template = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset=utf-8>
          <meta http-equiv=X-UA-Compatible content="IE=edge">
          <meta name=viewport content="width=device-width,initial-scale=1">
          <title>ncfrom schema editor</title>
          <link href=vscode://js/app.js rel=preload as=script>
          <link href=vscode://js/chunk-vendors.js rel=preload as=script>
          <style>
            .dev-tip {
              position: fixed;
              right: 0;
              bottom: 0;
              color: var(--vscode-editor-background);
              background-color: var(--vscode-editor-foreground);
              padding: 4px 8px;
            }
          </style>
        </head>
        <body>
          <div id=app></div>
          ${NcFormSchemaEditorProvider.isDev
            ? '<div class=dev-tip>DEV</div'
            : ''
          }
          <script src=vscode://js/chunk-vendors.js></script>
          <script src=vscode://js/app.js></script>
        </body>
      </html>`;
    const baseUri = NcFormSchemaEditorProvider.isDev ? 'http://localhost:8080/' : `${extDirname}/out/web/`;
    return template.replace(/vscode:\/\//g, baseUri);
  }

	/**
	 * Write out the json to a given document.
	 */
	private updateTextDocument(document: vscode.TextDocument, json: any) {
		const edit = new vscode.WorkspaceEdit();

		// Just replace the entire document every time for this example extension.
		// TODO: compute minimal edits instead.
		edit.replace(
			document.uri,
			new vscode.Range(0, 0, document.lineCount, 0),
			json);

		return vscode.workspace.applyEdit(edit);
  }

}
