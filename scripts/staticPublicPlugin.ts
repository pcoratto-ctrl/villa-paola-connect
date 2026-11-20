import type { Plugin, ResolvedConfig } from "vite";
import { createServer } from "vite";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";

// Build-time only: no runtime server, accounts, or backend data are involved.
export function staticPublicPlugin(): Plugin {
  let output = "dist";
  let root = process.cwd();
  let aliases: ResolvedConfig["resolve"]["alias"] = [];
  return {
    name: "villa-static-public-html",
    apply: "build",
    configResolved(config) {
      root = config.root;
      aliases = config.resolve.alias;
      output = resolve(root, config.build.outDir);
    },
    async closeBundle() {
      const server = await createServer({ root, resolve: { alias: aliases }, configFile: false, cacheDir: "node_modules/.vite-static-public", optimizeDeps: { noDiscovery: true, include: [] }, esbuild: { jsx: "automatic" }, server: { middlewareMode: true }, appType: "custom" });
      try {
        const { staticPaths, renderStaticPage } = await server.ssrLoadModule("/src/lib/staticPublicDocument.tsx");
        const template = await readFile(resolve(output, "index.html"), "utf8");
        for (const route of staticPaths as string[]) {
          const page = renderStaticPage(route);
          const html = template
            .replace(/<html[^>]*>/, `<html lang="${page.lang}">`)
            .replace(/<title>[\s\S]*?<\/title>/g, "")
            .replace(/<meta\b[^>]*(?:name=["'](?:description|robots|twitter:title|twitter:description)["']|property=["']og:(?:title|description|url|type|locale)["'])[^>]*>/g, "")
            .replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/g, "")
            .replace(/<\/head>/, page.head + "</head>")
            .replace('<div id="root"></div>', `<div id="root">${page.body}</div>`);
          const file = resolve(output, route === "/" ? "index.html" : route.slice(1) + "/index.html");
          await mkdir(dirname(file), { recursive: true }); await writeFile(file, html);
        }
        console.info(`Static public HTML written for ${staticPaths.length} routes`);
      } finally { await server.close(); }
    },
  };
}