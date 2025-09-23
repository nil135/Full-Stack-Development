import express from "express";
const app = express();
const port = 3000;


app.get("/", (req, res) => {
     const today = new Date();
     const day = today.getDay();

     let type = "a weekday";
     let adv = "You need to learn more about EJS, Today";

     if (day === 0 || day === 6) {
          type = "a weekend";
          adv = "You need to rest today";
     }

     res.render("index.ejs", {
          dayType: type,
          advice: adv,
     })
})

app.listen(port, () => {
     console.log(`Server is started on port ${port}.`);
})