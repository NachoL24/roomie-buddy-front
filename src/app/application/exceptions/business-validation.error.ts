/**
 * Error de validación de reglas de negocio
 */
export class BusinessValidationError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'BusinessValidationError';
  }
}

/**
 * Error cuando un recurso no se encuentra
 */
export class ResourceNotFoundError extends Error {
  constructor(resource: string, id: string | number) {
    super(`${resource} with id ${id} not found`);
    this.name = 'ResourceNotFoundError';
  }
}

/**
 * Error de permisos insuficientes
 */
export class InsufficientPermissionsError extends Error {
  constructor(action: string, resource: string) {
    super(`Insufficient permissions to ${action} ${resource}`);
    this.name = 'InsufficientPermissionsError';
  }
}

/**
 * Error de conflicto (ej: duplicado)
 */
export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}

/**
 * Error de conexión con servicios externos
 */
export class ExternalServiceError extends Error {
  constructor(service: string, originalError?: Error) {
    super(`Error connecting to ${service}: ${originalError?.message || 'Unknown error'}`);
    this.name = 'ExternalServiceError';
  }
}
