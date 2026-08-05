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

function formatValidationDetails(err) {
  if (Array.isArray(err?.errors) && err.errors.length > 0) {
    return err.errors
      .map((e) => e?.msg)
      .filter(Boolean)
      .join(', ');
  }

  if (err instanceof ValidationError) {
    return `${err.field}: ${err.message}`;
  }

  return err?.message || 'Unknown error';
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
    const isValidationError = err instanceof ValidationError;

    return {
      status: isValidationError ? 400 : 500,
      body: {
        error: err.name || 'Error',
        message: err.message || 'Internal Server Error',
        details: formatValidationDetails(err)
      }
    };
  }
}
