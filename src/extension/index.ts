import * as vscode from 'vscode';
import { NcFormSchemaEditProvider } from './ncformSchemaEdit';
import { NcFormSchemaEditorProvider } from './ncformSchemaEditor';

export function activate(context: vscode.ExtensionContext) {
  // Register our custom editor providers
  context.subscriptions.push(NcFormSchemaEditProvider.register());
  context.subscriptions.push(NcFormSchemaEditorProvider.register(context));
}
