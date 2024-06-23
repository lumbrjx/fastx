#!/usr/bin/env node

import { intro, outro, spinner, text } from "@clack/prompts";
import chalk from "chalk";
import fs from "fs/promises";
import path from "path";

async function renameAndMoveFolder(domainName: string, domainsPath: string) {
  try {
    const sourceDir = process.cwd() + domainsPath;
    const currentDirr = new URL(".", import.meta.url).pathname;
    const currentDir = path.normalize(currentDirr);

    const templateDir = path.join(currentDir, "..", "template");
    const newName = domainName;
    const newDir = path.join(sourceDir, newName); // Ensure the new directory path is correctly formed
    await fs.copyFile(templateDir, newDir); // Use copyFile for copying directories

    const files = await fs.readdir(newDir);
    for (const file of files) {
      const filePath = path.join(newDir, file);
      const newNameWithoutUnderscores = newName.replace(/_/g, "");
      const newFilePath = path.join(
        newDir,
        file.replace(/_/, newNameWithoutUnderscores),
      );

      await fs.rename(filePath, newFilePath);
      let fileContent = await fs.readFile(newFilePath, "utf-8");

      // Replace all occurrences of _ROUTE with hello
      fileContent = fileContent.replace(/_ROUTE/g, "hello");

      await fs.writeFile(newFilePath, fileContent);
    }
  } catch (error) {
    console.error(error);
  }
}
async function init(domain: string) {
  const sourceDir = process.cwd();
  const jsonData = {
    domainsPath: domain,
  };
  const jsonFilePath = path.join(sourceDir, "fastz.config.json");
  await fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2));
}
async function checkJSONFileExists() {
  try {
    const sourceDir = process.cwd();
    const jsonFilePath = path.join(sourceDir, "fastz.config.json");

    // Use fs.access to check if the file exists
    await fs.access(jsonFilePath);
    return jsonFilePath;
  } catch (error) {
    // If an error occurs (e.g., file does not exist), log the error and return null
    console.error(error);
    return null;
  }
}
async function main() {
  if (process.argv.length < 3) {
    console.log(chalk.red("Please provide an argument."));
    process.exit(1);
  }
  const arg = process.argv[2];
  if (arg == "c") {
    intro(chalk.bgMagenta(chalk.black(chalk.bold(" Fast-z "))));
    const s = spinner();
    s.start(chalk.yellow("Checking config file"));
    const health = await checkJSONFileExists();
    if (health === null) {
      outro(
        chalk.red(
          "Config file does not exist make sure to run 'fastz i' first",
        ),
      );
      process.exit(1);
    }

    s.stop(chalk.green("Checking config file"));
    const meaning = await text({
      message: "What would you like to name this domain?",
      placeholder: "Not sure",
    });
    if (!meaning || meaning.toString().trim().length === 0) {
      outro(chalk.red("Domain name can't be empty"));
      process.exit(1);
    }
    s.start(chalk.yellow("Generating Domain routes and controllers.."));
    const jsonData = await fs.readFile(health, "utf-8");

    await renameAndMoveFolder(
      meaning.toString().trim(),
      JSON.parse(jsonData).domainsPath,
    );
    outro(chalk.green("Domain generated"));
    process.exit(0);
  }
  if (arg == "i") {
    intro(chalk.bgBlue(chalk.black(chalk.bold(" Fast-z "))));
    const s = spinner();
    const meaning = await text({
      message: "where would you like to generate domains?",
      placeholder: "/src/domains",
    });
    if (!meaning || meaning.toString().trim().length === 0) {
      outro(chalk.red("Domain name can't be empty"));
      process.exit(1);
    }

    s.start("Intialization...");
    init(meaning.toString().trim());
    s.stop(chalk.green("Initialized"));
    outro(chalk.green("done"));
  }
}

main();
