import * as vscode from 'vscode';
import * as glob from 'glob';
import * as tree from './tree';

const symbolProvider = 'vscode.executeDocumentSymbolProvider';

const createNewRoot = function () {
  return new tree.Item({
    name: 'AST Tree',
    children: [undefined, undefined]
  }, undefined);
};

var rootItem = createNewRoot();
const treeView: tree.DataProvider = new tree.DataProvider(rootItem);

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand('ast.display-ast', displayAST);
  context.subscriptions.push(command);

  vscode.window.registerTreeDataProvider('ast-tree', treeView);
}

/**
 * Main entry point into generating the full AST tree. Recursively globs all
 * header/cpp files and computes each file individually.
 * 
 * @param uri directory to generate a AST tree from.
 */
async function displayAST(uri: vscode.Uri) {
  treeView.root = (rootItem = createNewRoot());

  glob(uri.fsPath + '/**/*.*(h|cc)', async (err, files: string[]) => {
    const cppfiles: string[] = [];
    for (const file of files) {
      await computeFile(vscode.Uri.file(file));

      if (file.endsWith('.cc')) {
        cppfiles.push(file);
      }
    }
  });
};

/**
 * Opens the raw file url as a TextDocument and DocumentSymbols. Files can contain 0
 * or more symbols, so for each symbol it builds it into root item.
 * 
 * @param file full path for *.h | *.cc files.
 */
async function computeFile(file: vscode.Uri) {
  const document: vscode.TextDocument = await vscode.workspace.openTextDocument(file);
  const symbols: Array<any> = await vscode.commands.executeCommand(symbolProvider, file);

  // There is a chance that file has errors and vscode can not extract the document symbols.
  if (symbols) {
    for (const symbol of symbols) {
      processItem(rootItem, symbol, document);
      treeView.refresh();
    }
  }
}

/**
 * Recursively processes the symbol and tree item. If there are new children discovered,
 * it will continue going down the tree till it finds a new leaf to populate. 
 * 
 * @param rootItem 
 * @param document 
 * @param symbol 
 */
function processItem(rootItem: tree.Item, symbol: any, document: vscode.TextDocument) {
  if (!rootItem.map.has(symbol.name)) {
    rootItem.map.set(symbol.name, new tree.Item(symbol, document));
  }
  if (symbol.children) {
    var item: tree.Item = rootItem.map.get(symbol.name)!;
    
    for (const child of symbol.children) {
      processItem(item, child, document);
    }
  }
}

// function display2(node: tree.TreeItem, depth: number) {
//   console.log('..'.repeat(depth) + node.label);

//   node.map.forEach((value, key, map) => {
//     display2(value, depth + 1);
//   })
// }

// function fill(root: Node, symbol: vscode.SymbolInformation, document: vscode.TextDocument) {

//   var node: Node | undefined;
//   if (root.childs!.has(symbol.name)) {
//     node = root.childs!.get(symbol.name);
//   } else {

//   }
// }

// function fill_root(root: tree.TreeItem, item: ASTNode, document: vscode.TextDocument) {
//   if (!kinds.has(item.kind)) {
//     return;
//   }

//   if (!root.map.has(item.detail!)) {
//     var toInsert: tree.TreeItem;
//     if (item.kind == 'Namespace') {
//       toInsert = asNamespace(item);
//     }
//     else if (item.kind == 'CXXRecord') {
//       toInsert = asClass(item);
//     }
//     else if (item.kind == 'Enum') {
//       toInsert = asEnum(item);
//     }
//     else if (item.kind == 'CXXMethod') {
//       toInsert = asMethod(item, document);
//     }
//     else {
//       toInsert = new tree.TreeItem(item.detail!);
//     }
//     root.map.set(item.detail!, toInsert);
//   }

//   var node: tree.TreeItem | undefined = root.map.get(item.detail!);

//   item.children?.forEach((child) => {
//     fill_root(node!, child, document)
//   })

// }

// function asNamespace(node: ASTNode): tree.TreeItem {
//   const item = new tree.TreeItem('{ } ' + node.detail!);
//   item.collapsibleState = hasChild(node) ? 2 : 0;
//   item.tooltip = node.arcana

//   return item;
// }

// function asClass(node: ASTNode): tree.TreeItem {
//   const item = new tree.TreeItem(node.detail!);
//   item.collapsibleState = hasChild(node) ? 2 : 0;
//   item.description = 'class'
//   item.tooltip = node.arcana
//   item.iconPath = new vscode.ThemeIcon('symbol-class');

//   return item;
// }

// function asEnum(node: ASTNode): tree.TreeItem {
//   const item = new tree.TreeItem(node.detail!);
//   item.collapsibleState = hasChild(node) ? 2 : 0;
//   item.description = 'enum'
//   item.tooltip = node.arcana
//   item.iconPath = new vscode.ThemeIcon('symbol-enum');

//   return item;
// }

// function asMethod(node: ASTNode, document: vscode.TextDocument): tree.TreeItem {
//   const item = new tree.TreeItem(node.detail!);
//   item.collapsibleState = hasChild(node) ? 2 : 0;
//   //item.description = 'enum'
//   console.log(node.range)
//   var range = new vscode.Range(new vscode.Position(node.range!.start.line, node.range!.start.character),
//     new vscode.Position(node.range!.end.line, node.range!.end.character))
//   item.tooltip = document.getText(range)
//   item.iconPath = new vscode.ThemeIcon('symbol-method');

//   return item;
// }

// function hasChild(root: ASTNode): boolean {
//   for (let node of root.children!) {
//     if (kinds.has(node.kind)) {
//       return true;
//     }
//   }
//   return false;
// }


// // Use the regular Set constructor to transform an Array into a Set
// const kinds = new Set(['Namespace', 'CXXRecord', 'Enum', 'CXXMethod']);

// interface ASTNode {
//   role: string;    // e.g. expression
//   kind: string;    // e.g. BinaryOperator
//   detail?: string; // e.g. ||
//   arcana?: string; // e.g. BinaryOperator <0x12345> <col:12, col:1> 'bool' '||'
//   children?: Array<ASTNode>;
//   range?: vscodelc.Range;
// }

// interface Info {
//   file: vscode.Uri;
//   tooltip: string;
// }

// interface Node {
//   name: string;
//   detail: string;
//   kind: vscode.SymbolKind;
//   range?: vscode.Range;
//   path?: vscode.Uri;

//   info?: Array<Info>;
//   childs?: Map<string, Node>;
// }
