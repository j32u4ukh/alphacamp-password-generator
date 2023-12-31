const express = require("express");
const { engine } = require("express-handlebars");
const app = express();
const port = 3000;

function initPasswordPool(number, uppercase, lowercase, symbol, exclude) {
  let result = "";
  let char;
  if (number) {
    for (let i = 0; i < 10; i++) {
      char = i + "";
      if (!exclude.includes(char)) {
        result += char;
      }
    }
  }
  if (uppercase) {
    for (let i = 65; i <= 90; i++) {
      char = String.fromCharCode(i);
      if (!exclude.includes(char)) {
        result += char;
      }
    }
  }
  if (lowercase) {
    for (let i = 97; i <= 122; i++) {
      char = String.fromCharCode(i);
      if (!exclude.includes(char)) {
        result += char;
      }
    }
  }
  if (symbol) {
    const symbols = ["@", "#", "$", "%"];
    symbols.forEach((char) => {
      if (!exclude.includes(char)) {
        result += char;
      }
    });
  }
  return result;
}

function generatePassword(pool, len) {
  let password = "",
    rand;
  const np = pool.length;
  for (let i = 0; i < len; i++) {
    rand = Math.floor(Math.random() * np);
    password += pool.substring(rand, rand + 1);
  }
  return password;
}

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/generate", (req, res) => {
  const jsonData = req.body;
  console.log("Received JSON data:", jsonData);
  console.log(jsonData);
  const len = Number(jsonData.len);
  const base = initPasswordPool(
    jsonData.number,
    jsonData.uppercase,
    jsonData.lowercase,
    jsonData.symbol,
    jsonData.exclude
  );
  let password = generatePassword(base, len);
  for (let i = 0; i < len; i++) {}
  res.json({
    password: password,
  });
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`);
});
