import type { SerializedEditorState } from "lexical";

type SerializedNode = {
  text?: string;
  children?: SerializedNode[];
};

type SerializedRoot = {
  root?: SerializedNode;
};

function collectText(node: SerializedNode | undefined, parts: string[]) {
  if (!node) return;
  if (typeof node.text === "string") {
    parts.push(node.text);
  }
  if (Array.isArray(node.children)) {
    node.children.forEach((child) => collectText(child, parts));
  }
}

export function getSpellNotePlainText(
  note: SerializedEditorState | undefined,
): string {
  if (!note || typeof note !== "object") return "";
  const root = (note as SerializedRoot).root;
  if (!root) return "";
  const parts: string[] = [];
  collectText(root, parts);
  return parts.join("");
}

export function isSpellNoteEmpty(
  note: SerializedEditorState | undefined,
): boolean {
  return getSpellNotePlainText(note).trim().length === 0;
}
