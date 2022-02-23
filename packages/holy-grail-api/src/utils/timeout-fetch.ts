import AbortController from "abort-controller";
import fetch from "cross-fetch";

export default async function timeoutFetch(timeout: number, request: RequestInfo, options?: RequestInit) {
  const abortController = new AbortController();
  const _timeout = setTimeout(() => {
    abortController.abort();
  }, timeout);

  try {
    return await fetch(request, {...options, signal: abortController.signal});
  }
  catch(err) {
    throw err;
  }
  finally {
    clearTimeout(_timeout);
  }
}
