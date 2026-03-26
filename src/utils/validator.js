import { z } from "zod";
import mongoose from "mongoose";

// Helper to validate ObjectId
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

class SchemaValidation {
  static createAccountSchema = z.object({
    currency: z
      .string()
      .min(3, "Currency must be at least 3 characters")
      .max(5, "Currency must be at most 5 characters")
      .optional(),

    status: z.enum(["ACTIVE", "FROZEN", "CLOSED"]).optional(),
  });

  static createInitialFundsTransactionSchema = z.object({
    toAccount: objectIdSchema,

    amount: z
      .number({
        required_error: "Amount is required",
        invalid_type_error: "Amount must be a number",
      })
      .positive("Amount must be greater than 0"),

    idempotencyKey: z
      .string()
      .min(10, "Idempotency key must be at least 10 characters")
      .max(100, "Idempotency key too long"),
  });

  static createTransactionSchema = z
    .object({
      fromAccount: objectIdSchema,

      toAccount: objectIdSchema,

      amount: z
        .number({
          required_error: "Amount is required",
          invalid_type_error: "Amount must be a number",
        })
        .positive("Amount must be greater than 0")
        .multipleOf(0.01, "Amount must have max 2 decimal places"),

      idempotencyKey: z.string().uuid("Invalid idempotency key format"),
    })
    // Prevent self-transfer
    .refine((data) => data.fromAccount !== data.toAccount, {
      message: "Cannot transfer to the same account",
      path: ["toAccount"],
    });

  static userRegisterSchema = z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format")
      .toLowerCase()
      .trim(),

    name: z
      .string({
        required_error: "Name is required",
      })
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name too long")
      .trim(),

    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password too long")
      // Strong password (recommended)
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one letter and one number",
      ),
  });

  static userLoginSchema = z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format")
      .toLowerCase()
      .trim(),

    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password too long"),
  });
}

export default SchemaValidation;
