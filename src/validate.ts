/**
 * Zod express middleware to validate schemas
 */

import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

// TODO: make tempsSchema accepted by validate function
const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };

export default validate;
