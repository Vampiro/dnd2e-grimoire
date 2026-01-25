import { SelectWithSearch } from "@/components/custom/SelectWithSearch";

const testItems = [
  { id: 1, name: "Item 1" },
  { id: 2, name: "Item 2" },
  { id: 3, name: "Item 3" },
  { id: 4, name: "Item 4" },
  { id: 5, name: "Item 5" },
  { id: 6, name: "Item 6" },
  { id: 7, name: "Item 7" },
  { id: 8, name: "Item 8" },
  { id: 9, name: "Item 9" },
  { id: 10, name: "Item 10" },
  { id: 11, name: "Item 11" },
  { id: 12, name: "Item 12" },
  { id: 13, name: "Item 13" },
  { id: 14, name: "Item 14" },
  { id: 15, name: "Item 15" },
  { id: 16, name: "Item 16" },
  { id: 17, name: "Item 17" },
  { id: 18, name: "Item 18" },
  { id: 19, name: "Item 19" },
  { id: 20, name: "Item 20" },
];

export function TestPage() {
  return (
    <div>
      <h1>Custom Page</h1>
      <div>
        <SelectWithSearch
          items={testItems}
          getLabel={(item) => item.name}
          getKey={(item) => item.id.toString()}
          getCategory={(item) => {
            if (item.id % 2 === 0) return "Even";
            return "Odd";
          }}
        />
      </div>
    </div>
  );
}
