import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import type { SerializedEditorState } from "lexical";

import { Button } from "@/components/ui/button";
import { SpellNoteEditor } from "@/components/custom/SpellNoteEditor";
import { deleteUserSpellNote, setUserSpellNote } from "@/firebase/userSettings";
import { spellNotesAtom, userAtom } from "@/globalState";
import { findPriestSpellById, findWizardSpellById } from "@/lib/spellLookup";
import { getSpellNotePlainText } from "@/lib/spellNotes";

export function SpellNoteEditPage() {
  const { spellId } = useParams();
  const user = useAtomValue(userAtom);
  const spellNotes = useAtomValue(spellNotesAtom);

  const spell = useMemo(() => {
    const id = Number(spellId);
    if (!Number.isFinite(id)) return null;
    return findWizardSpellById(id) ?? findPriestSpellById(id);
  }, [spellId]);

  const existingNote = spellId ? spellNotes[spellId] : undefined;
  const [noteState, setNoteState] = useState<SerializedEditorState | undefined>(
    existingNote,
  );
  const [noteText, setNoteText] = useState(getSpellNotePlainText(existingNote));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNoteState(existingNote);
    setNoteText(getSpellNotePlainText(existingNote));
  }, [existingNote]);

  if (!spellId) {
    return <div>Missing spell id.</div>;
  }

  if (!user) {
    return <div>You must be logged in to edit spell notes.</div>;
  }

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);

    try {
      if (noteText.trim().length === 0) {
        await deleteUserSpellNote(user.uid, spellId);
      } else if (noteState) {
        await setUserSpellNote(user.uid, spellId, noteState);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save spell note",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Edit Spell Note</h1>
          <p className="text-muted-foreground text-sm">
            {spell
              ? `Spell note for ${spell.name}.`
              : `Spell note for id ${spellId}.`}
          </p>
        </div>
      </div>

      <SpellNoteEditor
        key={existingNote ? JSON.stringify(existingNote) : "empty-note"}
        initialState={existingNote}
        onSerializedChange={(next) => setNoteState(next)}
        onTextChange={setNoteText}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end">
        <Button type="button" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Note"}
        </Button>
      </div>
    </div>
  );
}
