import { z } from 'zod';

export const teamSchema = z.object({
  countryName: z
    .string({ message: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  fifaCode: z
    .string({ message: 'El código FIFA es obligatorio' })
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, 'El código FIFA debe tener exactamente 3 letras'),
  coach: z
    .string({ message: 'El director técnico es obligatorio' })
    .trim()
    .min(2, 'El director técnico es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  playersCount: z
    .number({ message: 'Debe ser un número' })
    .int('Debe ser un entero')
    .min(23, 'Mínimo 23 jugadores')
    .max(26, 'Máximo 26 jugadores'),
  fifaRanking: z
    .number({ message: 'Debe ser un número' })
    .int('Debe ser un entero')
    .min(1, 'El ranking debe ser mayor a 0'),
});

export type TeamInput = z.infer<typeof teamSchema>;

export const groupSchema = z.object({
  name: z
    .string({ message: 'El nombre es obligatorio' })
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(50, 'Máximo 50 caracteres'),
  description: z
    .string()
    .trim()
    .max(500, 'Máximo 500 caracteres')
    .nullish(),
});

export type GroupInput = z.infer<typeof groupSchema>;

export const distributionPreviewSchema = z.object({
  groupsCount: z
    .number({ message: 'La cantidad debe ser un número' })
    .int('Debe ser un entero')
    .min(2, 'La cantidad de grupos debe ser mayor a 1'),
});

export type DistributionPreviewInput = z.infer<typeof distributionPreviewSchema>;

export const distributionSaveSchema = z.object({
  name: z
    .string({ message: 'El nombre es obligatorio' })
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'Máximo 100 caracteres'),
  groups: z
    .array(
      z.object({
        groupId: z.string().uuid('groupId inválido'),
        teamIds: z.array(z.string().uuid('teamId inválido')).min(1, 'Cada grupo debe tener al menos un equipo'),
      })
    )
    .min(2, 'Debe haber al menos 2 grupos'),
});

export type DistributionSaveInput = z.infer<typeof distributionSaveSchema>;

export const uuidParamSchema = z.object({
  id: z.string().uuid('ID inválido'),
});
