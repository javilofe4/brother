import type { TagDefinition, TagId } from "./tag.types";

export const TAG_CATALOG: TagDefinition[] = [
  { id: "outdoor", label: "Exterior", category: "condition" },
  { id: "indoor", label: "Interior", category: "condition" },
  { id: "summer", label: "Verano", category: "condition" },
  { id: "winter", label: "Invierno", category: "condition" },
  { id: "extreme_heat", label: "Calor extremo", category: "condition" },
  { id: "cold", label: "Frio", category: "condition" },
  { id: "rain", label: "Lluvia", category: "condition" },
  { id: "night", label: "Noche", category: "condition" },
  { id: "morning", label: "Manana", category: "condition" },
  { id: "intense", label: "Intensa", category: "condition" },
  { id: "combat", label: "Combate", category: "activity" },
  { id: "strength", label: "Fuerza", category: "activity" },
  { id: "swimming", label: "Natacion", category: "activity" },
  { id: "running", label: "Carrera", category: "activity" },
  { id: "walking", label: "Caminata", category: "activity" },
  { id: "route", label: "Ruta", category: "activity" },
  { id: "finance", label: "Finanzas", category: "activity" },
  { id: "challenge", label: "Reto", category: "activity" },
  { id: "personal_record", label: "Record personal", category: "other" },
  { id: "rival", label: "Rival", category: "other" },
  { id: "manual", label: "Manual", category: "other" },
];

export const TAG_BY_ID = Object.fromEntries(
  TAG_CATALOG.map((tag) => [tag.id, tag])
) as Record<TagId, TagDefinition>;

export function isKnownTag(value: string): value is TagId {
  return value in TAG_BY_ID;
}

export function normalizeTags(tags: string[]): TagId[] {
  const normalized = tags
    .map((tag) => tag.trim())
    .map((tag) => {
      const legacy: Record<string, TagId> = {
        combate: "combat",
        fuerza: "strength",
        natacion: "swimming",
        "natación": "swimming",
        carrera: "running",
        caminata: "walking",
        ruta: "route",
        finanzas: "finance",
        ahorro: "finance",
        reto: "challenge",
        record: "personal_record",
        "récord": "personal_record",
      };
      return legacy[tag.toLowerCase()] ?? tag;
    })
    .filter(isKnownTag);

  return Array.from(new Set(normalized));
}
