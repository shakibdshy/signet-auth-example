import { ENV } from "@/env";
import { forwardSignet } from "@/lib/signet-proxy";

export const dynamic = "force-dynamic";

function handle(request: Request): Promise<Response> {
  return forwardSignet(request, ENV.SIGNET_BACKEND_URL);
}

export { handle as DELETE, handle as GET, handle as PATCH, handle as POST, handle as PUT };
