import { useMemo } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import type { SerializedEditorState } from "lexical";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { nodes } from "@/components/editor/nodes";

export function SpellNotePreview({ note }: { note: SerializedEditorState }) {
  const initialConfig = useMemo(
    () => ({
      namespace: "SpellNotePreview",
      theme: editorTheme,
      nodes,
      editable: false,
      onError: (error: Error) => {
        console.error(error);
      },
      editorState: JSON.stringify(note),
    }),
    [note],
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            placeholder=""
            className="min-h-0 px-0 py-0 focus:outline-none"
            placeholderClassName="hidden"
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
}
