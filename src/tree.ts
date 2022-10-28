import * as vscode from 'vscode';
import * as vscodelc from 'vscode-languageclient/node';
import * as utils from './utils';

export class Item extends vscode.TreeItem {
  label: string;

  kind: vscode.SymbolKind;

  range: vscodelc.Range | undefined;
  arcana: string | undefined;

  map: Map<string, Item>;

  constructor(symbol: any, document?: vscode.TextDocument) {
    super(symbol.name, symbol.children && symbol.children.length > 0 ? 2 : 0);

    this.label = symbol.name;
    this.kind = symbol.kind;

    this.description = symbol.detail;

    if (document && this.kind !== vscode.SymbolKind.Namespace) {
      this.tooltip = new vscode.MarkdownString()
        .appendMarkdown(`${document.uri.fsPath}`)
        .appendCodeblock(document.getText(symbol.range), document.languageId);
    }

    this.iconPath = utils.toIcon(symbol.kind);

    this.map = new Map<string, Item>;
  }

}

export class DataProvider implements vscode.TreeDataProvider<Item> {

  private _onDidChangeTreeData: vscode.EventEmitter<Item | undefined | null | void> =
    new vscode.EventEmitter<Item | undefined | null | void>();

  readonly onDidChangeTreeData: vscode.Event<Item | undefined | null | void> =
    this._onDidChangeTreeData.event;

  root: Item;

  constructor(root: Item) {
    this.root = root;
  }

  getTreeItem(element: Item): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: Item | undefined): vscode.ProviderResult<Item[]> {
    if (element === undefined) {
      return Array.from(this.root.map.values()).sort();
    }
    return Array.from(element.map.values()).sort();
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}
