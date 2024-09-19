const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
const sampleFile = "jobs-sample.json";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", async (req, res) => {
  res.json({
    message: "success"
  });
});

app.get("/jobs/list", async (req, res) => {
  const product = JSON.parse(fs.readFileSync(path.join(__dirname, sampleFile), "utf-8"));
  console.log(product)
  res.json({ job: product });
})

app.get("/jobs/details/:id", async (req, res) => {
  const params = { ...req.params };
  let product = [];
  if (params.id !== undefined || params.id !== null) {
    product = JSON.parse(fs.readFileSync(path.join(__dirname, sampleFile), "utf-8"));
    product = product.filter((item) => item.id === Number(params.id))?.[0];
  }
  else {
    product = {};
  }
  console.log(product)
  res.json({ job: product });
});

app.put("/jobs/:id", async (req, res) => {
  const params = { ...req.params };
  const data = { ...req.body };
  let product = [];
  if (params.id !== undefined || params.id !== null) {
    product = JSON.parse(fs.readFileSync(path.join(__dirname, sampleFile), "utf-8"));
    product = product.map((item) => {
      if (item.id === Number(params.id)) {
        item.category = data.category;
      }
      return item;
    });
    fs.writeFileSync(path.join(__dirname, sampleFile), JSON.stringify(product), "utf-8");
    product = product.filter((item) => item.id === Number(params.id))?.[0];
  }

  res.json({ product });
});

app.post("/jobs/add", async (req, res) => {
  console.log(req)
  res.send({
    message: "success",
  });
});


app.listen(process.env.PORT || 3000, () => {
  console.log("server listening on localhost:" + process.env.PORT);
});