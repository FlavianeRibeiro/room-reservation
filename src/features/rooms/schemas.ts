import { z } from 'zod';

export const roomFiltersSchema = z.object({
  minCapacity: z.coerce.number().int().positive().optional().catch(undefined),
  resource: z.string().trim().min(1).optional().catch(undefined), // .catch(undefined) ignora o filtro em vez de quebrar a página.
});

export const roomInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome precisa ter ao menos 2 letras.')
    .max(80, 'O nome é longo demais.'),
  capacity: z.coerce
    .number()
    .int('A capacidade deve ser um número inteiro.')
    .min(1, 'A capacidade deve ser de pelo menos 1 pessoa.')
    .max(500, 'A capacidade máxima é 500 pessoas.'),
  location: z.string().trim().max(80).optional(),
  resourceIds: z.array(z.coerce.number().int()),
});

export type RoomInput = z.infer<typeof roomInputSchema>;

export function parseRoomForm(formData: FormData): RoomInput {
  return roomInputSchema.parse({
    name: formData.get('name') ?? '',
    capacity: formData.get('capacity') ?? '',
    location: formData.get('location') ?? '',
    resourceIds: formData.getAll('resourceIds'),
  });
}
