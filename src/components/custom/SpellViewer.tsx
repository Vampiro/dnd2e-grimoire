import { fetchSpell } from "@/lib/wikiFetch";
import { MediaWikiPageJson } from "@/types/MediaWiki";
import { Spell } from "@/types/Spell";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";

interface SpellViewerProps {
  spell: Spell;
}

/**
 * Displays details for a spell fetched from the AD&D 2e wiki proxy.
 *
 * @remarks
 * The backend returns a {@link MediaWikiPageJson} containing a title, infobox fields,
 * categories, and section content. This component renders those in a readable layout.
 */
export function SpellViewer(props: SpellViewerProps) {
  const { spell } = props;
  const [data, setData] = useState<MediaWikiPageJson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    async function loadSpell() {
      setLoading(true);
      setError(null);
      try {
        const spellData = await fetchSpell(spell);
        if (!canceled) setData(spellData);
      } catch (err: any) {
        if (!canceled) setError(err.message || "Failed to fetch spell");
      } finally {
        if (!canceled) setLoading(false);
      }
    }

    loadSpell();

    return () => {
      canceled = true;
    };
  }, [spell]);

  const infoboxEntries = useMemo(() => {
    if (!data?.infobox) return [] as Array<[string, string]>;

    return Object.entries(data.infobox)
      .map(([k, v]) => [k.trim(), String(v ?? "").trim()] as [string, string])
      .filter(([k, v]) => k.length > 0 && v.length > 0)
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [data]);

  const sectionEntries = useMemo(() => {
    if (!data?.sections) return [] as Array<[string, string]>;

    return Object.entries(data.sections)
      .map(([k, v]) => [k.trim(), String(v ?? "").trim()] as [string, string])
      .filter(([k, v]) => k.length > 0 && v.length > 0)
      .sort((a, b) => a[0].localeCompare(b[0]));
  }, [data]);

  if (loading)
    return (
      <div className="text-sm text-muted-foreground">
        Loading {spell.name}...
      </div>
    );

  if (error)
    return (
      <div className="text-sm text-destructive">
        Error loading {spell.name}: {error}
      </div>
    );

  if (data) {
    return (
      <Card>
        <CardContent className="space-y-6 p-4">
          <div className="space-y-1">
            <div className="text-lg font-semibold leading-tight">
              {data.title || spell.name}
            </div>
            {Array.isArray(data.categories) && data.categories.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Categories: {data.categories.join(", ")}
              </div>
            )}
          </div>

          {infoboxEntries.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-semibold">Details</div>
              <Table>
                <TableBody>
                  {infoboxEntries.map(([k, v]) => (
                    <TableRow key={k}>
                      <TableCell className="w-px pr-4 font-medium text-muted-foreground whitespace-nowrap">
                        {k}
                      </TableCell>
                      <TableCell className="whitespace-pre-wrap break-words">
                        {v}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {sectionEntries.length > 0 ? (
            <div className="space-y-6">
              {sectionEntries.map(([heading, content]) => (
                <section key={heading} className="space-y-2">
                  <h3 className="text-sm font-semibold">{heading}</h3>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {content}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No page sections available.
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return <div className="text-sm text-muted-foreground">No data.</div>;
}
