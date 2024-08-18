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
    const newRows = [
      ["2", "13-2-12", "hotel stay", "550"],
      ["3", "14-2-12", "restaurant", "120"],
    ];

    const newCsvRows = newRows.map((row) => row.join(";")).join("\n");
    const csvContentToAdd = `\n${newCsvRows}`;

    fs.appendFile(csvFilePath, csvContentToAdd, (err) => {
      if (err) {
        console.error("Error appending to CSV file:", err);
        return;
      }
      console.log("New rows added to CSV file successfully");
    });
  } catch (error) {
    console.error(error);
  }
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
      console.log(calculate("*", (p, v) => Number(p) * Number(v), numbers));
    }
    if (options.summery) {
      console.log(calculate("/", (p, v) => Number(p) / Number(v), numbers));
    }
    if (options.list) {
      console.log(calculate("-", (p, v) => Number(p) - Number(v), numbers));
    }
  });

program.parse();
