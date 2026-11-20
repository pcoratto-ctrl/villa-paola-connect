import { expect, it } from "vitest";
import { execFileSync } from "node:child_process";

it("loads public pages through Vite SSR with the app's design-system alias", () => {
  // Use native Node: the project's DOM test environment cannot run esbuild.
  const output = execFileSync("node", ["--input-type=module", "-e", `
    import { createServer } from 'vite';
    import { resolve } from 'node:path';
    const server = await createServer({configFile:false, resolve:{alias:{'@':resolve('src')}}, optimizeDeps:{noDiscovery:true,include:[]}, esbuild:{jsx:'automatic'}, server:{middlewareMode:true}, appType:'custom'});
    try {
      const {renderStaticPage} = await server.ssrLoadModule('/src/lib/staticPublicDocument.tsx');
      console.log('locale=' + renderStaticPage('/en/beachfront-villa-calabria').lang);
    } finally { await server.close(); }
  `], { encoding: "utf8", timeout: 12000 });
  expect(output).toContain("locale=en");
}, 15000);