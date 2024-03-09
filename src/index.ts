#!/usr/bin/env node

import { intro, outro, spinner, text } from "@clack/prompts";
import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
async function renameAndMoveFolder(
	domainName: string,
	domainsPath: string | false,
) {
	try {
		const sourceDir = process.cwd() + domainsPath;
		const currentDirr = new URL(".", import.meta.url).pathname;

		// You might want to remove the file protocol prefix and convert to OS specific path
		const currentDir = path.normalize(currentDirr);

		const templateDir = path.join(currentDir, "..", "template");
		const newName = domainName;
		const newDir = path.join(sourceDir, newName);
		await fs.copy(templateDir, newDir);
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
			fileContent = fileContent.replace(
				/from\s+["']\.\W*?_.*?["']/g,
				(match) => {
					return match.replace(/_/, newNameWithoutUnderscores);
				},
			);
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
		const fileExists = await fs.pathExists(jsonFilePath);
		if (!fileExists) {
			return null;
		}
		return jsonFilePath;
	} catch (error) {
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
		const jsonData = await fs.readJSON(health);

		await renameAndMoveFolder(meaning.toString().trim(), jsonData.domainsPath);
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
