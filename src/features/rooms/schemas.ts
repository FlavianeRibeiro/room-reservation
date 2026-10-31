import { z } from 'zod';

export const roomFiltersSchema = z.object({
  minCapacity: z.coerce.number().int().positive().optional().catch(undefined),
  resource: z.string().trim().min(1).optional().catch(undefined), // .catch(undefined) ignora o filtro em vez de quebrar a página.
});
