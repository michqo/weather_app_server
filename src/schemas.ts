/**
 * Zod schemas
 */

import { z } from "zod";

const tempSchema = z.object({
  y: z.number(),
  m: z.number(),
  d: z.number(),
  h: z.number(),
  averageTemp: z.string().min(1).max(5),
  humidity: z.string().min(1).max(5),
});
const tempsSchema = z.array(tempSchema);

const tempSchema2 = z.object({
  averageTemp: z.string().min(1).max(5),
  humidity: z.string().min(1).max(5),
});
const tempsSchema2 = z.array(tempSchema2);

export { tempSchema, tempsSchema, tempSchema2, tempsSchema2 };
