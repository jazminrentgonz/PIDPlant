import type { PlantProfile } from "../types";

export const PLANTS: PlantProfile[] = [
  {
    id: "basil",
    name: "Basil",
    scientificName: "Ocimum basilicum",
    type: "Herb",
    idealTempC: { min: 20, max: 25 },
    idealHumidityPct: { min: 45, max: 65 },
  },
  {
    id: "bostonFern",
    name: "Boston Fern",
    type: "Houseplant",
    idealTempC: { min: 18, max: 24 },
    idealHumidityPct: { min: 60, max: 80 },
  },
  {
    id: "spiderPlant",
    name: "Spider Plant",
    type: "Houseplant",
    idealTempC: { min: 18, max: 24 },
    idealHumidityPct: { min: 40, max: 60 },
  },
  {
    id: "lavender",
    name: "Lavender",
    type: "Herb",
    idealTempC: { min: 15, max: 20 },
    idealHumidityPct: { min: 30, max: 50 },
  },
  {
    id: "fiddleLeafFig",
    name: "Fiddle-Leaf Fig",
    type: "Houseplant",
    idealTempC: { min: 18, max: 24 },
    idealHumidityPct: { min: 40, max: 60 },
  },
  {
    id: "aloeVera",
    name: "Aloe Vera",
    type: "Succulent",
    idealTempC: { min: 20, max: 30 },
    idealHumidityPct: { min: 20, max: 40 },
  },
];
