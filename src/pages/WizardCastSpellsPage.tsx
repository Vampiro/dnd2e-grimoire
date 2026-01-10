import { WizardPreparedSpells } from "@/components/custom/WizardPreparedSpells";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCharacterById } from "@/hooks/useCharacterById";
import { getWizardProgressionSpellSlots } from "@/lib/spellSlots";
import { PageRoute } from "@/pages/PageRoute";
import { useParams, useNavigate } from "react-router-dom";

/**
 * Page for casting/preparing wizard spells.
 * Surfaces prepared spells grouped by level with remaining cast tracking.
 */
export function WizardCastSpellsPage() {
  const { characterId } = useParams();
  const { character, isLoading } = useCharacterById(characterId);
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading prepared spells...</div>;
  }

  if (!character) {
    return <div>No character with id {characterId}</div>;
  }

  const wizard = character.class.wizard;

  if (!wizard) {
    return <div>This character has no wizard progression.</div>;
  }

  const slotMap = getWizardProgressionSpellSlots(wizard);
  const availableLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
    (lvl) => (slotMap[lvl] ?? 0) > 0,
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Cast Spells</h1>
          <p className="text-muted-foreground">
            Prepared spells for {character.name}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prepared Spells</CardTitle>
          <CardDescription>
            Track remaining casts and adjust prepared copies by spell level.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableLevels.length === 0 ? (
            <div className="rounded-md border border-dashed bg-muted/40 p-3 text-sm">
              <p className="font-semibold text-foreground">
                No spell slots available yet.
              </p>
              <p className="text-muted-foreground">
                Increase wizard level or adjust spell slot modifiers to gain
                prepared slots.
              </p>
            </div>
          ) : (
            availableLevels.map((spellLevel) => (
              <WizardPreparedSpells
                key={spellLevel}
                spellLevel={spellLevel}
                progression={wizard}
                characterId={character.id}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
