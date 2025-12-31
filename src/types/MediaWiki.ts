export interface MediaWikiPageJson {
  title: string;
  infobox: Record<string, string>;
  categories: string[];
  sections: Record<string, string>;
}
