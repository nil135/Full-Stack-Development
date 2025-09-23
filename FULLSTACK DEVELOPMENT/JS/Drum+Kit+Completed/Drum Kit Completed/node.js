// NODE JS
import fs from "fs";
import os from "os";
import generateName from 'sillyname';
import superheroes from 'superheroes';

// OS platform
const osPlatform = os.platform();
console.log("OS Platform", osPlatform);

// Writefile
fs.writeFile("message.txt", "Hello from NodeJS: File System. WOW!", (err) => {
     if (err) {
          console.log("Error while creating file using nodefs", err);
     } else {
          console.log("File has been created using nodefs");
     }
})

// Readfile
fs.readFile("message.txt", "utf8", (err, data) => {
     if (err) {
          console.log("Error while reading file using nodefs", err);
     } else {
          console.log(data);
     }
})

// Used NPM
var sillyName = generateName();
const superheroesName = superheroes.random();

console.log(`My random name is, ${sillyName}.`);
console.log(`I am superhero and my name is, ${superheroesName}.`);