import { Command } from "commander";
const program = new Command();

//func to calculate expense
const addExpense = () => {};

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
  .action((numbers, options) => {
    if (options.add) {
      console.log(calculate("+", (p, v) => Number(p) + Number(v), numbers));
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
