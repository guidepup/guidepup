export interface CommandOptions {
  timeout?: number;
}

export interface RetryableCommandOptions extends CommandOptions {
  retries?: number;
}
