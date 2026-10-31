import { ZodError } from "zod";
import { DomainError } from "./errors";

export type ActionState = { error?: string } | undefined;

export function toActionError(err: unknown): { error: string } {
  if (err instanceof DomainError) return { error: err.message };
  if (err instanceof ZodError) {
    return { error: err.issues[0]?.message ?? "Dados inválidos." };
  }
  throw err;
}
