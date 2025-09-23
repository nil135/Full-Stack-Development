import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';

inquirer.prompt([
     {
          /* Pass your questions in here */
          message: "Type URL here to generate QR code",
          name: "URL",
     },
]).then((answers) => {
     // Use user feedback for... whatever!!
     const url = answers.URL;
     var qr_png = qr.image(url);
     qr_png.pipe(fs.createWriteStream('qr-image.png'));

     fs.writeFile("url.txt", url, (err) => {
          if (err) {
               console.log("Error while creating file for URLs", err);
          } else {
               console.log("File has been created");
          }
     })
}).catch((error) => {
     if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
          console.log("Error while generating QR from URL", error);
     } else {
          // Something else went wrong
          console.log("Else: Error while generating QR from URL", error);
     }
});