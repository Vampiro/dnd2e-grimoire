import { Link } from "react-router-dom";
import { CharacterList } from "@/components/custom/CharacterList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PageRoute } from "./PageRoute";

export function CharactersPage() {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Characters</h1>
            <Button asChild variant="outline" size="icon">
              <Link to={PageRoute.CHARACTERS_NEW} aria-label="Create character">
                <Plus className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground">
            Create and manage your roster.
          </p>
        </div>
      </div>

      <CharacterList />
    </div>
  );
}
