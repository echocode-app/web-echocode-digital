#!/usr/bin/env node

async function getStagedFiles() {
  const { execFileSync } = await import("node:child_process");

  try {
    const output = execFileSync("git", ["diff", "--cached", "--name-only"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    return new Set(
      output
        .split(/\r?\n/)
        .map((file) => file.trim())
        .filter(Boolean)
    );
  } catch (error) {
    console.error("[check-lock] Unable to read staged files.");

    if (error && typeof error.message === "string") {
      console.error(error.message);
    }

    process.exit(1);
  }
}

async function readGitJson(revisionPath) {
  const { execFileSync } = await import("node:child_process");

  const output = execFileSync("git", ["show", revisionPath], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  return JSON.parse(output);
}

function sortValue(value) {
  if (Array.isArray(value)) {
    return value.map(sortValue);
  }

  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort()
      .reduce((result, key) => {
        result[key] = sortValue(value[key]);
        return result;
      }, {});
  }

  return value;
}

function pickLockRelevantPackageFields(packageJson) {
  const lockRelevantFields = [
    "name",
    "version",
    "engines",
    "dependencies",
    "devDependencies",
    "optionalDependencies",
    "peerDependencies",
    "peerDependenciesMeta",
    "bundleDependencies",
    "bundledDependencies",
    "overrides",
    "packageManager",
    "workspaces",
  ];

  return lockRelevantFields.reduce((result, field) => {
    if (Object.hasOwn(packageJson, field)) {
      result[field] = packageJson[field];
    }
    return result;
  }, {});
}

async function packageJsonNeedsLockfileUpdate() {
  try {
    const previousPackageJson = await readGitJson("HEAD:package.json");
    const stagedPackageJson = await readGitJson(":package.json");

    return (
      JSON.stringify(sortValue(pickLockRelevantPackageFields(previousPackageJson))) !==
      JSON.stringify(sortValue(pickLockRelevantPackageFields(stagedPackageJson)))
    );
  } catch (error) {
    console.error("[check-lock] Unable to compare package.json with HEAD.");

    if (error && typeof error.message === "string") {
      console.error(error.message);
    }

    return true;
  }
}

async function main() {
  const stagedFiles = await getStagedFiles();
  const packageJsonStaged = stagedFiles.has("package.json");
  const packageLockStaged = stagedFiles.has("package-lock.json");

  if (
    packageJsonStaged &&
    !packageLockStaged &&
    (await packageJsonNeedsLockfileUpdate())
  ) {
    console.error("");
    console.error(
      "ERROR: package.json dependency graph changed but package-lock.json is not staged."
    );
    console.error("");
    console.error(
      "This can cause CI failures due to an inconsistent dependency graph."
    );
    console.error("");
    console.error("Resolution:");
    console.error(
      "1. Run npm install (or npm install <package>) to update package-lock.json."
    );
    console.error("2. Stage the lockfile: git add package-lock.json");
    console.error("3. Re-run your commit.");
    console.error("");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[check-lock] Unexpected error.");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
});
