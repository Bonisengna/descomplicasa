import { readFile } from "node:fs/promises";

const [metadataPath, repository] = process.argv.slice(2);

if (!metadataPath || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository ?? "")) {
  throw new Error("Usage: parse-release.mjs <metadata.json> <owner/repository>");
}

const release = JSON.parse(await readFile(metadataPath, "utf8"));

if (release.draft || release.prerelease) {
  throw new Error("The latest release is not a production release");
}

const match = /^deploy-([0-9a-f]{40})$/.exec(release.tag_name ?? "");
if (!match) {
  throw new Error("The release tag must be deploy- followed by a full commit SHA");
}

const revision = match[1];
if (release.target_commitish !== revision) {
  throw new Error("The release target does not match its revision");
}

const requiredAssets = ["descomplicaza.tar.gz", "descomplicaza.tar.gz.sha256"];
const assets = new Map();

for (const asset of release.assets ?? []) {
  if (requiredAssets.includes(asset.name)) {
    if (assets.has(asset.name)) {
      throw new Error(`Duplicate release asset: ${asset.name}`);
    }
    if (asset.state !== "uploaded" || !Number.isSafeInteger(asset.size) || asset.size <= 0) {
      throw new Error(`Release asset is incomplete: ${asset.name}`);
    }
    assets.set(asset.name, asset.browser_download_url);
  }
}

for (const name of requiredAssets) {
  const rawUrl = assets.get(name);
  if (!rawUrl) {
    throw new Error(`Missing release asset: ${name}`);
  }

  const url = new URL(rawUrl);
  const expectedPath = `/${repository}/releases/download/deploy-${revision}/${name}`;
  if (url.protocol !== "https:" || url.hostname !== "github.com" || url.pathname !== expectedPath || url.search || url.hash) {
    throw new Error(`Unexpected download URL for ${name}`);
  }
}

process.stdout.write(`${revision}\n${assets.get(requiredAssets[0])}\n${assets.get(requiredAssets[1])}\n`);
