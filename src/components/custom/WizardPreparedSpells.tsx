import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Plus, Info, Trash2, Minus } from "lucide-react";
import { findSpellById } from "@/lib/spellLookup";
import {
  WizardClassProgression,
  PreparedSpell,
} from "@/types/ClassProgression";
import { getWizardProgressionSpellSlots } from "@/lib/spellSlots";
import { PageRoute } from "@/pages/PageRoute";
import { updateWizardPreparedSpells } from "@/firebase/characters";
import type { Spell } from "@/types/Spell";

interface WizardPreparedSpellsProps {
  spellLevel: number;
  progression: WizardClassProgression;
  characterId: string;
  onViewSpell?: (spell: Spell) => void;
}

/**
 * Renders prepared wizard spells for a given spell level, including slot counts and spellbook selection.
 * Mutations are persisted directly to the wizard progression.
 */
export function WizardPreparedSpells({
  spellLevel,
  progression,
  characterId,
  onViewSpell,
}: WizardPreparedSpellsProps) {
  const spells = progression.preparedSpells[spellLevel] || [];
  const slotMap = getWizardProgressionSpellSlots(progression);
  const maxSlots = slotMap[spellLevel] || 0;
  const castable = spells.filter((s) => !s.used).length;
  const totalPrepared = spells.length;

  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateLevelSpells = async (
    mutate: (current: PreparedSpell[]) => PreparedSpell[],
  ) => {
    setIsUpdating(true);
    setError(null);
    try {
      const current = progression.preparedSpells[spellLevel] ?? [];
      const nextLevel = mutate(current);
      const nextPrepared = {
        ...progression.preparedSpells,
        [spellLevel]: nextLevel,
      };
      await updateWizardPreparedSpells(characterId, nextPrepared);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update prepared spells",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const updateSpellGroup = (
    spellId: string,
    mutate: (group: PreparedSpell[]) => PreparedSpell[],
  ) =>
    updateLevelSpells((current) => {
      const others = current.filter((s) => s.spellId !== spellId);
      const group = current.filter((s) => s.spellId === spellId);
      const nextGroup = mutate(group);
      return [...others, ...nextGroup];
    });

  const adjustRemaining = (spellId: string, delta: number, total: number) =>
    updateSpellGroup(spellId, (group) => {
      const currentRemaining = group.filter((s) => !s.used).length;
      const nextRemaining = Math.min(
        Math.max(currentRemaining + delta, 0),
        total,
      );
      const used = Math.max(total - nextRemaining, 0);
      return [
        ...Array.from({ length: nextRemaining }, () => ({
          spellId,
          used: false,
        })),
        ...Array.from({ length: used }, () => ({ spellId, used: true })),
      ];
    });

  const adjustTotal = (spellId: string, delta: number) =>
    updateSpellGroup(spellId, (group) => {
      const total = Math.max(0, group.length + delta);
      if (total === 0) return [];

      const unused = group.filter((s) => !s.used);
      const used = group.filter((s) => s.used);

      if (delta < 0) {
        const removeCount = Math.min(group.length, Math.abs(delta));
        const ordered = [...unused, ...used];
        return ordered.slice(0, group.length - removeCount);
      }

      // delta > 0, add fresh unused slots
      return [
        ...group,
        ...Array.from({ length: delta }, () => ({ spellId, used: false })),
      ];
    });

  const deleteSpellGroup = (spellId: string) =>
    updateSpellGroup(spellId, () => []);

  const handleAddSpell = (spellId: string) => adjustTotal(spellId, 1);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold">Level {spellLevel}</h3>
          <span className="text-sm text-muted-foreground">
            ({castable} remaining)
          </span>
          <span
            className={`text-sm font-medium ${
              totalPrepared > maxSlots
                ? "text-destructive"
                : totalPrepared < maxSlots
                  ? "text-amber-500"
                  : "text-foreground"
            }`}
          >
            ({totalPrepared}/{maxSlots})
          </span>
          {totalPrepared > maxSlots && (
            <span className="text-xs text-destructive">
              Too many memorized spells.
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="ghost">
            <Link to={PageRoute.WIZARD_SPELLBOOKS(characterId)}>
              Spellbooks
            </Link>
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" disabled={isUpdating}>
                <Plus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <div className="space-y-4">
                <p className="text-sm font-semibold">
                  Add Spell from Spellbook
                </p>
                <div className="space-y-3">
                  {progression.spellbooks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No spellbooks available
                    </p>
                  ) : (
                    progression.spellbooks.map((spellbook) => {
                      // Get all spells of this level from this spellbook
                      const availableSpells = spellbook.spells
                        .map((spellId) => findSpellById(spellId))
                        .filter(
                          (spell): spell is Spell =>
                            spell !== null && spell.level === spellLevel,
                        );

                      if (availableSpells.length === 0) {
                        return (
                          <div key={spellbook.id}>
                            <p className="text-xs text-muted-foreground">
                              {spellbook.name}: No spells at this level
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div key={spellbook.id}>
                          <p className="text-xs font-semibold text-muted-foreground mb-1">
                            {spellbook.name}
                          </p>
                          <Select
                            disabled={isUpdating}
                            onValueChange={(spellName) => {
                              const selectedSpell = availableSpells.find(
                                (s) => s.name === spellName,
                              );
                              if (selectedSpell) {
                                handleAddSpell(
                                  `${selectedSpell.class} - ${selectedSpell.name}`,
                                );
                              }
                            }}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select spell..." />
                            </SelectTrigger>
                            <SelectContent>
                              {availableSpells.map((spell) => (
                                <SelectItem key={spell.name} value={spell.name}>
                                  {spell.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Spells for this level */}
      <div className="space-y-2 pl-4">
        {Object.entries(
          spells.reduce<Record<string, PreparedSpell[]>>((acc, s) => {
            acc[s.spellId] = acc[s.spellId] ? [...acc[s.spellId], s] : [s];
            return acc;
          }, {}),
        )
          .sort((a, b) =>
            (findSpellById(a[0])?.name || a[0]).localeCompare(
              findSpellById(b[0])?.name || b[0],
            ),
          )
          .map(([spellId, group]) => {
            const spell = findSpellById(spellId);
            const spellName = spell?.name || spellId;
            const remaining = group.filter((s) => !s.used).length;
            const total = group.length;

            return (
              <div key={spellId} className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="relative h-10 w-20 p-0"
                      disabled={isUpdating}
                      title="Adjust prepared/remaining copies"
                    >
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="h-full border-l border-muted-foreground origin-center rotate-45" />
                      </div>
                      <span className="absolute top-1 left-2 text-sm font-semibold">
                        {remaining}
                      </span>
                      <span className="absolute bottom-1 right-2 text-sm font-semibold">
                        {total}
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-3">
                      <div className="relative h-28 rounded-md border p-4">
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="h-full border-l border-muted-foreground origin-center rotate-45" />
                        </div>

                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            disabled={isUpdating || remaining <= 0}
                            onClick={() => adjustRemaining(spellId, -1, total)}
                            title="Mark one as cast"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            disabled={isUpdating || remaining >= total}
                            onClick={() => adjustRemaining(spellId, 1, total)}
                            title="Restore one use"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                          {total <= 1 ? (
                            <Button
                              size="icon"
                              variant="outline"
                              disabled={isUpdating || total === 0}
                              onClick={() => deleteSpellGroup(spellId)}
                              title="Remove this spell from prepared"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="icon"
                              variant="outline"
                              disabled={isUpdating || total === 0}
                              onClick={() => adjustTotal(spellId, -1)}
                              title="Decrease prepared copies"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="outline"
                            disabled={isUpdating}
                            onClick={() => adjustTotal(spellId, 1)}
                            title="Increase prepared copies"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="absolute top-2 right-3 text-xs text-muted-foreground">
                          Remaining / Prepared
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="flex-1 text-sm">{spellName}</div>
                {spell && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => onViewSpell && onViewSpell(spell)}
                    title="View spell details"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => deleteSpellGroup(spellId)}
                  title="Remove spell from prepared list"
                  disabled={isUpdating}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            );
          })}

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
