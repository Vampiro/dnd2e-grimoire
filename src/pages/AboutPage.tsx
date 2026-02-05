import { Card, CardContent } from "@/components/ui/card";

export function AboutPage() {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">About</h1>
      </div>

      <Card>
        <CardContent className="space-y-3 text-sm">
          <p>
            After playing AD&amp;D 2nd Edition with some friends for a while, I
            wanted a dedicated spellbook and a way to prepare and manage spells
            day to day. This app is that solution: a personal grimoire that
            keeps spell details, preparation, and casting all in one place.
          </p>
          <p>
            GitHub Page:{" "}
            <a
              href="https://github.com/Vampiro/grimoire"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              https://github.com/Vampiro/grimoire
            </a>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 text-sm">
          <p>
            The spell descriptions were sourced from the{" "}
            <a
              href="https://adnd2e.fandom.com/wiki/Advanced_Dungeons_%26_Dragons_2nd_Edition_Wiki"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              AD&amp;D 2e Wiki
            </a>{" "}
            and are licensed{" "}
            <a
              href="https://www.fandom.com/licensing"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              CC BY-SA
            </a>
            . I have parsed/transformed them so there may be some changes.
            Definitely thankful to the folks there who have contributed so much
            to that Wiki. As I went, I tried to fix whatever small issues with
            spells I found under the alias{" "}
            <a
              href="https://adnd2e.fandom.com/wiki/User:CheetahGoesMeow"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              CheetahGoesMeow
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
