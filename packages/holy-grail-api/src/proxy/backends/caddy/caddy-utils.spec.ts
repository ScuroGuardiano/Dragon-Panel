import CaddyUtils from "./caddy-utils";

// TODO: Really write test for this.

const serversJson = String.raw`
{}`;

describe("CaddyUtils", () => {
  const caddyUtils = new CaddyUtils();

  it("Parses caddy servers json config", () => {
    console.log(caddyUtils.proxyEntriesFromServers(JSON.parse(serversJson)));
  });
});
