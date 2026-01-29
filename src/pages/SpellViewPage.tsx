import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { SpellViewer } from "@/components/custom/SpellViewer";
import { findPriestSpellById, findWizardSpellById } from "@/lib/spellLookup";

export function SpellViewPage() {
  const { spellId } = useParams();

  const spell = useMemo(() => {
    const id = Number(spellId);
    if (!Number.isFinite(id)) return null;
    return findWizardSpellById(id) ?? findPriestSpellById(id);
  }, [spellId]);

  if (!spellId) {
    return <div>Missing spell id.</div>;
  }

  if (!spell) {
    return <div>No spell found with id {spellId}.</div>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{spell.name}</h1>
          <p className="text-muted-foreground text-sm capitalize">
            {spell.spellClass} Spell Level: {spell.level}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <SpellViewer spell={spell} showTitle={false} />
        </CardContent>
      </Card>
    </div>
  );
}
