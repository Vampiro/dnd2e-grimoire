import { Search } from "lucide-react";
import { SelectWithSearch } from "./SelectWithSearch";
import { useAtomValue } from "jotai";
import { priestSpellsAtom, wizardSpellsAtom } from "@/globalState";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageRoute } from "@/pages/PageRoute";
import type { Spell } from "@/types/Spell";

type SpellSearchEntry = {
  id: string;
  name: string;
  meta: string;
  spell: Spell;
};

export function NavbarSearch() {
  const wizardSpells = useAtomValue(wizardSpellsAtom);
  const priestSpells = useAtomValue(priestSpellsAtom);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const items = useMemo((): SpellSearchEntry[] => {
    const wizardEntries = wizardSpells.map((spell) => ({
      id: `wizard:${String(spell.id)}`,
      name: spell.name,
      meta: `Wizard Level ${spell.level}`,
      spell,
    }));

    const priestEntries = priestSpells.map((spell) => ({
      id: `priest:${String(spell.id)}`,
      name: spell.name,
      meta: `Priest Level ${spell.level}`,
      spell,
    }));

    return [...wizardEntries, ...priestEntries].sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
    );
  }, [priestSpells, wizardSpells]);

  const handleSelect = (entry?: SpellSearchEntry) => {
    if (!entry) return;
    setOpen(false);
    setTimeout(() => {
      navigate(PageRoute.SPELL_VIEW(entry.spell.id));
    }, 300);
  };

  return (
    <SelectWithSearch
      items={items}
      getLabel={(item) => item.name}
      getKey={(item) => item.id}
      renderItem={(item) => (
        <div className="flex w-full items-start gap-3">
          <span className="min-w-0 flex-1 whitespace-normal break-words">
            {item.name}
          </span>
          <span className="text-muted-foreground shrink-0 text-right">
            {item.meta}
          </span>
        </div>
      )}
      onChange={handleSelect}
      placeholder="Search spells..."
      emptyText="No spells found."
      title="Search Spells"
      limit={200}
      open={open}
      onOpenChange={setOpen}
      renderTrigger={() => (
        <button
          type="button"
          className="p-2 rounded-full hover:bg-accent cursor-pointer"
          aria-label="Search spells"
        >
          <Search className="h-5 w-5" />
        </button>
      )}
    />
  );
}
