import * as vscode from 'vscode';

const kinds = new Map<vscode.SymbolKind, vscode.ThemeIcon>();
kinds.set(vscode.SymbolKind.File, new vscode.ThemeIcon('symbol-file'));
kinds.set(vscode.SymbolKind.Module, new vscode.ThemeIcon('symbol-module'));
kinds.set(vscode.SymbolKind.Namespace, new vscode.ThemeIcon('symbol-namespace'));
kinds.set(vscode.SymbolKind.Package, new vscode.ThemeIcon('symbol-package'));
kinds.set(vscode.SymbolKind.Class, new vscode.ThemeIcon('symbol-class'));
kinds.set(vscode.SymbolKind.Method, new vscode.ThemeIcon('symbol-method'));
kinds.set(vscode.SymbolKind.Property, new vscode.ThemeIcon('symbol-property'));
kinds.set(vscode.SymbolKind.Field, new vscode.ThemeIcon('symbol-field'));
kinds.set(vscode.SymbolKind.Constructor, new vscode.ThemeIcon('symbol-constructor'));
kinds.set(vscode.SymbolKind.Enum, new vscode.ThemeIcon('symbol-enum'));
kinds.set(vscode.SymbolKind.Interface, new vscode.ThemeIcon('symbol-interface'));
kinds.set(vscode.SymbolKind.Function, new vscode.ThemeIcon('symbol-function'));
kinds.set(vscode.SymbolKind.Variable, new vscode.ThemeIcon('symbol-variable'));
kinds.set(vscode.SymbolKind.Constant, new vscode.ThemeIcon('symbol-constant'));
kinds.set(vscode.SymbolKind.String, new vscode.ThemeIcon('symbol-string'));
kinds.set(vscode.SymbolKind.Number, new vscode.ThemeIcon('symbol-number'));
kinds.set(vscode.SymbolKind.Boolean, new vscode.ThemeIcon('symbol-boolean'));
kinds.set(vscode.SymbolKind.Array, new vscode.ThemeIcon('symbol-array'));
kinds.set(vscode.SymbolKind.Object, new vscode.ThemeIcon('symbol-object'));
kinds.set(vscode.SymbolKind.Key, new vscode.ThemeIcon('symbol-key'));
kinds.set(vscode.SymbolKind.Null, new vscode.ThemeIcon('symbol-null'));
kinds.set(vscode.SymbolKind.EnumMember, new vscode.ThemeIcon('symbol-enum-member'));
kinds.set(vscode.SymbolKind.Struct, new vscode.ThemeIcon('symbol-struct'));
kinds.set(vscode.SymbolKind.Event, new vscode.ThemeIcon('symbol-event'));
kinds.set(vscode.SymbolKind.Operator, new vscode.ThemeIcon('symbol-operator'));
kinds.set(vscode.SymbolKind.TypeParameter, new vscode.ThemeIcon('symbol-type-parameter'));

export const collapsed = new Set<vscode.SymbolKind>([
    vscode.SymbolKind.Class, vscode.SymbolKind.Enum
]);

export function toIcon(kind: vscode.SymbolKind): vscode.ThemeIcon|undefined {
    return kinds.get(kind);
}
