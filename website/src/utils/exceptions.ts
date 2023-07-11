import { TRPCError } from "@trpc/server";

export class BusinessException extends TRPCError {
  constructor(public message: string) {
    super({ message, code: "BAD_REQUEST" });
  }
}
