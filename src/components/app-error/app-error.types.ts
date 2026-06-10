export interface RuntimeError {
  type: 'error' | 'unhandledrejection';
  message: string;
  error?: unknown;
}

export interface AppErrorProps {
  error: RuntimeError;
}
