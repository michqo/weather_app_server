/**
 * Zod express middleware to validate schemas
 */

import { Request, Response, NextFunction } from "express";
import { AnyZodObject, z } from "zod";

type AnyZodArray = z.ZodArray<any, any>;

const validate =
  (schema: AnyZodObject | AnyZodArray) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };

export default validate;
