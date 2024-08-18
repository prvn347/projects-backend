#!/usr/bin/env node
import { Command } from "commander";
const program = new Command();
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFilePath = path.join(__dirname, "storage.csv");

//func to calculate expense
const addExpense = (desc) => {
  try {
    let id;
    fs.readFile(csvFilePath, (err, data) => {
      const csvData = data.toString().split("\n");
      const eleCsvData = csvData[csvData.length - 1].split(";");
      id = parseInt(eleCsvData[0]);

      const newRows = [[parseInt(id) + 1, "13-2-12", desc[0], desc[1]]];

      const newCsvRows = newRows.map((row) => row.join(";")).join("\n");
      const csvContentToAdd = `\n${newCsvRows}`;

      fs.appendFile(csvFilePath, csvContentToAdd, (err) => {
        if (err) {
          console.error("Error appending to CSV file:", err);
          return;
        }
        console.log("New expenses added to CSV file successfully");
      });
    });
  } catch (error) {
    console.error(error);
  }
};

//list expenses
const listExpenses = () => {
  try {
    fs.readFile(csvFilePath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading CSV file:", err);
        return;
      }

      // Split the CSV data by new lines
      const rows = data.split("\n").filter((row) => row.trim() !== "");

      // Print each row with formatted columns
      rows.forEach((row, index) => {
        // Split row by semicolon
        const columns = row.split(";");

        // Align columns with padding
        const id = columns[0].trim().padEnd(4, " ");
        const date = columns[1].trim().padEnd(10, " ");
        const description = columns[2].trim().padEnd(12, " ");
        const amount = columns[3].trim().padStart(10, " ");

        console.log(`# ${id} ${date} ${description} ${amount}`);
      });
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

//summery of expernses
const summeryOfExpenses = () => {
  try {
    fs.readFile(csvFilePath, "utf-8", (err, data) => {
      let cost;
      const rows = data.split("\n").filter((row) => row.trim() !== "");
      rows.forEach((row, index) => {
        // Split row by semicolon
        const columns = row.split(";");
        cost = columns[3] += row[index][3];
      });
      console.log(cost);
    });
  } catch (error) {}
};
program
  .name("expense-tracker")
  .description("CLI to track expenses.")
  .version("0.0.1");

program
  .command("tracker")
  .description("track all your expenses")
  .argument("<value...>", "description of your expense")
  .option("--add", "add", "")
  .option("--delete", "delete", "")
  .option("--summery", "summery", "")
  .option("--list", "list", "")
  .action((desc, options) => {
    if (options.add) {
      console.log(addExpense(desc));
    }
    if (options.delete) {
      console.log(listExpenses(desc));
    }
    if (options.summery) {
      console.log(summeryOfExpenses(desc));
    }
    if (options.list) {
      console.log(listExpenses(desc));
    }
  });

program.parse();
