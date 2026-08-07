/**
 * API Router Module (Buggy Backup)
 */

export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export function handleApiRequest(req) {
  try {
    if (!req.body || !req.body.email) {
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
    const formattedDetails = Array.isArray(err?.errors)
      ? err.errors.map(e => e?.msg ?? String(e)).join(', ')
      : err?.field
        ? `${err.field}: ${err.message}`
        : err?.message ?? 'Unknown validation error';

    return {
      status: err instanceof ValidationError ? 400 : 500,
      body: {
        error: err.name ?? 'Error',
        message: err.message ?? 'Unexpected error',
        details: formattedDetails
      }
    };
  }
}
