/**
 * API Router Module (Buggy Backup)
 */

export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.errors = [{ msg: message, field }];
  }
}

export function handleApiRequest(req) {
  try {
    if (!req?.body || !req.body.email) {
      throw new ValidationError('Email is required', 'email');
    }
    if (req.body.age < 18) {
      throw new ValidationError('Must be at least 18 years old', 'age');
    }

    return {
      status: 200,
      body: { success: true, user: req.body }
    };
  } catch (err) {
    const formattedDetails = Array.isArray(err.errors)
      ? err.errors.map(e => e.msg).join(', ')
      : err.message;

    const status = err instanceof ValidationError ? 400 : 500;

    return {
      status,
      body: {
        error: err.name,
        message: err.message,
        details: formattedDetails
      }
    };
  }
}
