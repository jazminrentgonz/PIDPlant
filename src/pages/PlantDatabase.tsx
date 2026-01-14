import { useMemo, useState } from "react";
import type { PlantProfile } from "../types";
import PlantCard from "../components/PlantCard";

export default function PlantDatabase({
  plants,
  myPlantIds,
  onAdd,
}: {
  plants: PlantProfile[];
  myPlantIds: Set<string>;
  onAdd: (p: PlantProfile) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return plants;
    return plants.filter((p) => {
      const hay = `${p.name} ${p.scientificName ?? ""} ${p.type}`.toLowerCase();
      return hay.includes(q);
    });
  }, [plants, query]);

  return (
    <section>
      <h1 className="pageTitle">Extensive Plant Database</h1>
      <p className="pageSubtitle">Select a profile to add to your personal incubator collection.</p>

      <div className="searchRow">
        <input
          className="searchInput"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search plants by name or type..."
        />
      </div>

      <div className="grid">
        {filtered.map((p) => (
          <PlantCard
            key={p.id}
            plant={p}
            alreadyAdded={myPlantIds.has(p.id)}
            onAdd={onAdd}
          />
        ))}
      </div>
    </section>
  );
}
