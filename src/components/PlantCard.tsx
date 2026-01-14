import type { PlantProfile } from "../types";

export default function PlantCard({
  plant,
  alreadyAdded,
  onAdd,
}: {
  plant: PlantProfile;
  alreadyAdded: boolean;
  onAdd: (p: PlantProfile) => void;
}) {
  const subtitle = plant.scientificName
    ? `${plant.name} (${plant.scientificName})`
    : plant.name;

  return (
    <div className="card">
      <div className="cardHeader">
        <div className="cardTitle">{subtitle}</div>
        <div className="cardMeta">Type: {plant.type}</div>
        <div className="cardMeta">
          Ideal Temp: {plant.idealTempC.min}–{plant.idealTempC.max}°C
        </div>
      </div>

      <div className="cardActions">
        <button
          className={alreadyAdded ? "primaryButton disabled" : "primaryButton"}
          onClick={() => onAdd(plant)}
          disabled={alreadyAdded}
        >
          {alreadyAdded ? "Added" : "Add to My Plants"}
        </button>
      </div>
    </div>
  );
}
