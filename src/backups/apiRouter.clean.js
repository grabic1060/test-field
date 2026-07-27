/**
 * API Router Module (Clean / Fixed Version)
 */

export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.errors = [{ field, msg: message }];
  }
}

export function handleApiRequest(req) {
  try {
    if (!req || !req.body) {
      throw new ValidationError('Request body is missing', 'body');
    }
    if (!req.body.email) {
      throw new ValidationError('Email is required', 'email');
    }
    if (typeof req.body.age !== 'number' || req.body.age < 18) {
      throw new ValidationError('Must be at least 18 years old', 'age');
    }

    return {
      status: 200,
      body: { success: true, user: req.body }
    };
  } catch (err) {
    if (err instanceof ValidationError) {
      const details = Array.isArray(err.errors)
        ? err.errors.map(e => `${e.field}: ${e.msg}`).join(', ')
        : `${err.field}: ${err.message}`;

      return {
        status: 400,
        body: {
          error: err.name,
          message: err.message,
          details: details
        }
      };
    }

    return {
      status: 500,
      body: {
        error: 'InternalServerError',
        message: err.message || 'An unexpected error occurred'
      }
    };
  }
}
