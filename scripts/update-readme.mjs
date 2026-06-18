#!/usr/bin/env node
// Regenerates the Projects section of README.md to mirror the whole repo.
// Run manually:  node scripts/update-readme.mjs
// Or let the GitHub Action run it on every push.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const README_PATH = "README.md";
const CONFIG_PATH = "scripts/projects.json";
const START = "<!-- PROJECTS:START -->";
const END = "<!-- PROJECTS:END -->";

const DEFAULT_EXCLUDE = new Set([".github", ".vs", "scripts", "node_modules"]);

function loadConfig() {
    if (!existsSync(CONFIG_PATH)) return {};
    try {
        return JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
    } catch (err) {
        console.warn(`Could not parse ${CONFIG_PATH}: ${err.message}`);
        return {};
    }
}

function trackedFiles() {
    try {
        const out = execSync("git ls-files", {
        encoding: "utf8",
        maxBuffer: 64 * 1024 * 1024,
        });
        return out.split("\n").map((s) => s.trim()).filter(Boolean);
    } catch {
        console.warn("git ls-files unavailable; walking filesystem (ignores .gitignore).");
        return walk(".");
    }
}

function walk(dir, base = "", acc = []) {
    let entries;
    try {
        entries = readdirSync(dir, { withFileTypes: true });
    } catch {
        return acc;
    }
    for (const e of entries) {
        if (e.name.startsWith(".")) continue;
        const rel = base ? `${base}/${e.name}` : e.name;
        if (e.isDirectory()) {
        if (e.name === "node_modules") continue;
        walk(join(dir, e.name), rel, acc);
        } else {
        acc.push(rel);
        }
    }
    return acc;
}

function prettify(folder) {
    return folder
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function decodeEntities(s) {
    return s
        .replace(/&amp;/g, "&")
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
}

function readTextSmart(file) {
    try {
        const raw = readFileSync(file);
        if (raw.includes(0x00)) return raw.toString("utf16le");
        return raw.toString("utf8");
    } catch {
        return null;
    }
}

function findFile(dir, predicate, maxDepth) {
    const stack = [{ d: dir, depth: 0 }];
    while (stack.length) {
        const { d, depth } = stack.pop();
        let entries;
        try {
        entries = readdirSync(d, { withFileTypes: true });
        } catch {
        continue;
        }
        for (const e of entries) {
        const p = join(d, e.name);
        if (e.isFile() && predicate(e.name)) return p;
        if (e.isDirectory() && depth < maxDepth && e.name !== "node_modules") {
            stack.push({ d: p, depth: depth + 1 });
        }
        }
    }
    return null;
}

function firstSentence(text) {
    const content = [];
    for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line) {
        if (content.length) break;
        continue;
        }
        if (line.startsWith("#")) continue;
        if (line.startsWith("![") || line.startsWith("[!")) continue;
        if (/^[-=*_]{3,}$/.test(line)) continue;
        content.push(line);
    }
    if (!content.length) return null;
    const oneLine = content.join(" ").replace(/\s+/g, " ").trim();
    const m = oneLine.match(/^(.*?\.)(\s|$)/);
    return (m ? m[1] : oneLine).trim();
}

function deriveName(path, dir, cfg) {
    if (cfg.items?.[path]?.name) return cfg.items[path].name;

    const html = findFile(dir, (n) => n.toLowerCase().endsWith(".html"), 2);
    if (html) {
        const t = readTextSmart(html);
        const m = t && t.match(/<title>([^<]*)<\/title>/i);
        if (m && m[1].trim()) return decodeEntities(m[1].trim());
    }

    const pkg = join(dir, "package.json");
    if (existsSync(pkg)) {
        try {
        const d = JSON.parse(readFileSync(pkg, "utf8"));
        if (d.name && /[a-z]/i.test(d.name) && d.name !== "server") {
            return prettify(d.name);
        }
        } catch {
        /* ignore */
        }
    }

    return prettify(path.split("/").pop());
}

function deriveDescription(path, dir, cfg) {
    if (cfg.items?.[path]?.description) return cfg.items[path].description;

    const readme = findFile(dir, (n) => n.toLowerCase() === "readme.md", 0);
    if (readme) {
        const t = readTextSmart(readme);
        const s = t && firstSentence(t);
        if (s) return s;
    }

    const pkg = join(dir, "package.json");
    if (existsSync(pkg)) {
        try {
        const d = JSON.parse(readFileSync(pkg, "utf8"));
        if (d.description && d.description.trim()) return d.description.trim();
        } catch {
        /* ignore */
        }
    }

    return "_No description yet._";
}

function escapeCell(t) {
    return String(t).replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim();
}

function linkPath(p) {
    return p.replace(/ /g, "%20");
}

function build() {
    const cfg = loadConfig();
    const excludeSet = new Set(cfg.exclude || []);
    const files = trackedFiles();

    const tree = new Map();
    for (const f of files) {
        const parts = f.split("/");
        if (parts.length < 2) continue;

        const category = parts[0];
        if (category.startsWith(".")) continue;
        if (DEFAULT_EXCLUDE.has(category) || excludeSet.has(category)) continue;

        if (!tree.has(category)) tree.set(category, { items: new Set(), loose: 0 });
        const node = tree.get(category);

        if (parts.length >= 3) {
        const itemPath = `${category}/${parts[1]}`;
        if (!excludeSet.has(itemPath)) node.items.add(parts[1]);
        } else {
        node.loose += 1;
        }
    }

    const order = cfg.order || [];
    const categories = [...tree.keys()].sort((a, b) => {
        const ia = order.indexOf(a);
        const ib = order.indexOf(b);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.localeCompare(b);
    });

    const sections = [];
    for (const category of categories) {
        const node = tree.get(category);
        const catCfg = cfg.categories?.[category] || {};
        const title = catCfg.title || prettify(category);
        const lines = [`### ${title}`, ""];
        if (catCfg.description) lines.push(catCfg.description, "");

        // Pin any "featured" items to the top, then the rest alphabetically.
        const featured = (catCfg.featured || []).filter((f) => node.items.has(f));
        const featuredSet = new Set(featured);
        const rest = [...node.items]
        .filter((i) => !featuredSet.has(i))
        .sort((a, b) => a.localeCompare(b));
        const ordered = [...featured, ...rest];

        // Cap rows if a limit is set (category limit overrides the global default).
        const limit = catCfg.limit ?? cfg.limit ?? 0;
        const shown = limit > 0 ? ordered.slice(0, limit) : ordered;
        const hidden = ordered.length - shown.length;

        if (ordered.length > 0) {
        lines.push("| Project | Description |", "| --- | --- |");
        for (const item of shown) {
            const path = `${category}/${item}`;
            const dir = join(category, item);
            const name = deriveName(path, dir, cfg);
            const desc = deriveDescription(path, dir, cfg);
            lines.push(`| [${escapeCell(name)}](${linkPath(path)}) | ${escapeCell(desc)} |`);
        }
        if (hidden > 0) {
            lines.push("");
            lines.push(`_…and ${hidden} more in [${title}](${linkPath(category)}/)._`);
        }
        } else if (node.loose > 0) {
        const desc = deriveDescription(category, category, cfg);
        if (desc && desc !== "_No description yet._") lines.push(desc);
        else lines.push(`See [\`${category}\`](${linkPath(category)}).`);
        }

        sections.push(lines.join("\n").trimEnd());
    }

    return sections.join("\n\n");
}

function main() {
    const generated = build();
    const readme = readFileSync(README_PATH, "utf8");

    const startIdx = readme.indexOf(START);
    const endIdx = readme.indexOf(END);
    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
        console.error(`Could not find the PROJECTS markers in ${README_PATH}.`);
        process.exit(1);
    }

    const before = readme.slice(0, startIdx + START.length);
    const after = readme.slice(endIdx);
    const updated = `${before}\n\n${generated}\n\n${after}`;

    if (updated !== readme) {
        writeFileSync(README_PATH, updated);
        console.log("README projects section updated.");
    } else {
        console.log("README projects section already up to date.");
    }
}

main();