import { readFile, writeFile, readdir } from "node:fs/promises";

  let count = 1;

for (const file of await readdir("./src/data")) {
  const filePath = `./src/data/${file}`;
  const fileData = await readFile(filePath, { encoding: "utf8" });
  console.log('-------------')
  console.log(fileData);
  count++;
}
