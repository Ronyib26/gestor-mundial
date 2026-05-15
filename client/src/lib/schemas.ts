import { z } from 'zod';

export const teamSchema = z.object({
  countryName: z
    .string()
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  fifaCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, 'El código FIFA debe tener exactamente 3 letras'),
  coach: z
    .string()
    .trim()
    .min(2, 'El nombre del director técnico es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  playersCount: z.coerce
    .number({ message: 'Debe ser un número' })
    .int('Debe ser un entero')
    .min(23, 'Mínimo 23 jugadores')
    .max(26, 'Máximo 26 jugadores'),
  fifaRanking: z.coerce
    .number({ message: 'Debe ser un número' })
    .int('Debe ser un entero')
    .min(1, 'El ranking debe ser mayor a 0'),
});

export type TeamFormData = z.infer<typeof teamSchema>;

export const groupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(50, 'Máximo 50 caracteres'),
  description: z
    .string()
    .trim()
    .max(500, 'Máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
});

export type GroupFormData = z.infer<typeof groupSchema>;
