import { useEffect, useId, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateWizardSpellbook } from "@/firebase/characters";
import { useCharacterById } from "@/hooks/useCharacterById";
import { PageRoute } from "./PageRoute";

export function EditSpellbookPage() {
  const { characterId, spellbookId } = useParams();
  const { character, isLoading } = useCharacterById(characterId);
  const navigate = useNavigate();
  const nameId = useId();
  const pagesId = useId();
  const [name, setName] = useState("");
  const [pages, setPages] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const spellbooksById = character?.class.wizard?.spellbooksById ?? {};
  const spellbook =
    (spellbookId && spellbooksById[spellbookId]) ||
    Object.values(spellbooksById).find((entry) => entry.id === spellbookId);

  useEffect(() => {
    if (!spellbook) return;
    setName(spellbook.name);
    setPages(String(spellbook.numberOfPages));
    setError(null);
  }, [spellbook]);

  if (isLoading) return <div>Loading spellbook...</div>;
  if (!character) return <div>No character with id {characterId}</div>;

  const wizardProgression = character.class.wizard;
  if (!wizardProgression) {
    return <div>This character has no wizard progression.</div>;
  }

  if (!spellbook) {
    return <div>No spellbook with id {spellbookId}</div>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const trimmedName = name.trim();
      const numberOfPages = Number(pages);

      if (!trimmedName) {
        throw new Error("Name is required");
      }

      if (!Number.isFinite(numberOfPages) || numberOfPages <= 0) {
        throw new Error("Number of pages must be greater than 0");
      }

      await updateWizardSpellbook(character.id, spellbook.id, {
        name: trimmedName,
        numberOfPages,
      });

      navigate(PageRoute.WIZARD_SPELLBOOKS(character.id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update spellbook",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Edit Spellbook</h1>
          <p className="text-muted-foreground text-sm">
            Update the name and page count for {spellbook.name}.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor={nameId}>
                Name
              </label>
              <Input
                id={nameId}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g., Grimorium Arcana"
                required
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor={pagesId}>
                Pages
              </label>
              <Input
                id={pagesId}
                type="number"
                min={1}
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="50"
                required
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(PageRoute.WIZARD_SPELLBOOKS(character.id))
                }
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
