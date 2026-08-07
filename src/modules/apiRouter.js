/**
 * API Router Module
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
    if (!req?.body || !req.body.email) {
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
    const details = err instanceof ValidationError
      ? `${err.field}: ${err.message}`
      : '요청 처리 중 문제가 발생했습니다.';

    return {
      status: 400,
      body: {
        error: err.name,
        message: err.message,
        details
      }
    };
  }
}
