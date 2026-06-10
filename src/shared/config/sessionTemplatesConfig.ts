import type { SessionTemplate } from "@/domain/sessions/session.types";

const conditionTags = [
  "outdoor",
  "indoor",
  "summer",
  "winter",
  "extreme_heat",
  "cold",
  "rain",
  "night",
  "morning",
  "intense",
] as const;

export const SESSION_TEMPLATES: SessionTemplate[] = [
  {
    id: "combat_session",
    title: "Combate",
    description: "Entrenamiento de combate, sparring o tecnica.",
    defaultTags: ["combat"],
    allowedTags: [...conditionTags],
    baseXp: 15,
    fields: [
      { key: "durationMinutes", label: "Duracion (min)", type: "number", required: true, min: 1, placeholder: "60" },
      { key: "intensity", label: "Intensidad", type: "slider", required: true, min: 1, max: 10 },
      { key: "combatStyle", label: "Estilo", type: "text", placeholder: "Boxeo, BJJ, kickboxing..." },
      { key: "notes", label: "Notas", type: "textarea", placeholder: "Sensaciones, tecnica, rival..." },
    ],
  },
  {
    id: "strength_session",
    title: "Fuerza",
    description: "Sesion de fuerza con opcion de registrar marcas.",
    defaultTags: ["strength"],
    allowedTags: [...conditionTags, "personal_record"],
    baseXp: 15,
    fields: [
      { key: "durationMinutes", label: "Duracion (min)", type: "number", required: true, min: 1, placeholder: "60" },
      { key: "intensity", label: "Intensidad", type: "slider", required: true, min: 1, max: 10 },
      { key: "benchPressKg", label: "Press banca (kg)", type: "number", min: 0, placeholder: "100" },
      { key: "deadliftKg", label: "Peso muerto (kg)", type: "number", min: 0, placeholder: "160" },
      { key: "squatKg", label: "Sentadilla (kg)", type: "number", min: 0, placeholder: "140" },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  {
    id: "swimming_session",
    title: "Natacion",
    description: "Sesion de piscina, mar o tecnica.",
    defaultTags: ["swimming"],
    allowedTags: [...conditionTags, "personal_record"],
    baseXp: 15,
    fields: [
      { key: "durationMinutes", label: "Duracion (min)", type: "number", required: true, min: 1, placeholder: "45" },
      { key: "intensity", label: "Intensidad", type: "slider", min: 1, max: 10 },
      { key: "distanceKm", label: "Distancia (km)", type: "number", min: 0, placeholder: "1.5" },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  {
    id: "running_session",
    title: "Carrera",
    description: "Carrera o entrenamiento de resistencia.",
    defaultTags: ["running"],
    allowedTags: [...conditionTags, "personal_record"],
    baseXp: 12,
    fields: [
      { key: "durationMinutes", label: "Duracion (min)", type: "number", required: true, min: 1, placeholder: "40" },
      { key: "distanceKm", label: "Distancia (km)", type: "number", required: true, min: 0.1, placeholder: "5" },
      { key: "intensity", label: "Intensidad", type: "slider", required: true, min: 1, max: 10 },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  {
    id: "walking_session",
    title: "Caminata",
    description: "Paseo, caminata larga o recuperacion activa.",
    defaultTags: ["walking"],
    allowedTags: [...conditionTags],
    baseXp: 8,
    fields: [
      { key: "durationMinutes", label: "Duracion (min)", type: "number", min: 1, placeholder: "45" },
      { key: "distanceKm", label: "Distancia (km)", type: "number", min: 0.1, placeholder: "3" },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  {
    id: "route_session",
    title: "Ruta",
    description: "Ruta larga a pie, bici u otra modalidad.",
    defaultTags: ["route"],
    allowedTags: [...conditionTags, "running", "walking", "personal_record"],
    baseXp: 20,
    fields: [
      { key: "distanceKm", label: "Distancia (km)", type: "number", required: true, min: 0.1, placeholder: "20" },
      { key: "durationMinutes", label: "Duracion (min)", type: "number", min: 1, placeholder: "180" },
      { key: "intensity", label: "Intensidad", type: "slider", min: 1, max: 10 },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  {
    id: "finance_saving",
    title: "Ahorro",
    description: "Dinero apartado para objetivos.",
    defaultTags: ["finance"],
    allowedTags: ["manual"],
    baseXp: 8,
    fields: [
      { key: "amountEur", label: "Cantidad (EUR)", type: "number", required: true, min: 0.01, placeholder: "100" },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  {
    id: "finance_expense",
    title: "Gasto",
    description: "Registro financiero manual de gasto.",
    defaultTags: ["finance"],
    allowedTags: ["manual"],
    baseXp: 2,
    fields: [
      { key: "amountEur", label: "Cantidad (EUR)", type: "number", required: true, min: 0.01, placeholder: "25" },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  {
    id: "finance_income",
    title: "Ingreso",
    description: "Ingreso o entrada de dinero.",
    defaultTags: ["finance"],
    allowedTags: ["manual"],
    baseXp: 4,
    fields: [
      { key: "amountEur", label: "Cantidad (EUR)", type: "number", required: true, min: 0.01, placeholder: "500" },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  {
    id: "challenge_result",
    title: "Resultado de reto",
    description: "Cierre de reto personal o duelo.",
    defaultTags: ["challenge"],
    allowedTags: ["rival", "manual"],
    baseXp: 10,
    fields: [
      {
        key: "result",
        label: "Resultado",
        type: "select",
        required: true,
        options: [
          { value: "win", label: "Victoria" },
          { value: "complete", label: "Completado" },
          { value: "loss", label: "Derrota" },
        ],
      },
      { key: "notes", label: "Notas", type: "textarea" },
    ],
  },
  {
    id: "manual_action",
    title: "Accion manual",
    description: "Evento manual para casos no cubiertos.",
    defaultTags: ["manual"],
    allowedTags: ["outdoor", "indoor", "morning", "night", "challenge"],
    baseXp: 3,
    fields: [
      { key: "notes", label: "Descripcion", type: "textarea", required: true },
    ],
  },
];

export const TEMPLATE_BY_ID = Object.fromEntries(
  SESSION_TEMPLATES.map((template) => [template.id, template])
) as Record<SessionTemplate["id"], SessionTemplate>;
