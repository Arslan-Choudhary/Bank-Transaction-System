import { ResponseHandler } from "#utils";

class Validation {
  static validateRegister = (schema) => async (req, res, next) => {
    try {
      const parseBody = await schema.parseAsync(req.body);

      req.body = parseBody;
      next();
    } catch (error) {
      console.log("Validation Error:", error.issues[0].message);

      const err = new Error(error.issues?.[0]?.message || "Validation failed");
      err.status = 400;
      err.logging = false; // avoid noisy logs

      return ResponseHandler.errorHandler(res, err);
    }
  };
}

export default Validation;
