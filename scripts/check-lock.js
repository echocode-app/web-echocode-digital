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

async function main() {
  const stagedFiles = await getStagedFiles();
  const packageJsonStaged = stagedFiles.has("package.json");
  const packageLockStaged = stagedFiles.has("package-lock.json");

  if (packageJsonStaged && !packageLockStaged) {
    console.error("");
    console.error("ERROR: package.json is staged but package-lock.json is not.");
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
