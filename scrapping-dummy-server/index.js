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
  console.log(req.query)

  let query = { ...req.query };
  let result = JSON.parse(fs.readFileSync(path.join(__dirname, sampleFile), "utf-8"));
  let jobs = Array.from(result).map(job => {
    delete job.returnvalue;
    return job;
  });
  let jobTotalLength = jobs.length;
  let sortOrder = query.sort_order === "asc" ? 1 : -1;

  switch (typeof (jobs[0][query.sort_field] ?? null)) {
    case "number": jobs = jobs.sort((a, b) => (a[query.sort_field] - b[query.sort_field]) * sortOrder); break;
    case "string": jobs = jobs.sort((a, b) => (a[query.sort_field].localeCompare(b[query.sort_field])) * sortOrder); break;
    default: null;
  }

  if (query.page && query.offset) {
    query.page = Number(query.page);
    query.offset = Number(query.offset);
    jobs = jobs.slice((query.page - 1) * query.offset, query.page * query.offset);
  }

  res.json({
    body: jobs,
    metadata: {
      total: jobTotalLength,
      page: query.page,
      hasNextPage: jobs.length > 0
    }
  });
});

app.get("/jobs/details/:id", async (req, res) => {
  const params = { ...req.params };
  let product = [];
  if (params.id !== undefined || params.id !== null) {
    product = JSON.parse(fs.readFileSync(path.join(__dirname, sampleFile), "utf-8"));
    product = product.filter((item) => item.id === Number(params.id))?.[0];
    delete product?.returnvalue?.reviews;
  }
  else {
    product = {};
  }
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
  res.send({
    message: "success",
  });
});


app.get("/reviews/list", async (req, res) => {
  const query = { ...req.query };
  let product = [];
  query.id = query.jobId;
  if (query.id !== undefined || query.id !== null) {
    product = JSON.parse(fs.readFileSync(path.join(__dirname, sampleFile), "utf-8"));
    product = product.filter((item) => item.id === Number(query.id))?.[0];
  }
  else {
    product = {};
  }

  let review = product?.returnvalue.reviews ?? [];
  let reviewTotalLength = review.length;
  if (query.page && query.offset) {
    review = review.slice((query.page - 1) * query.offset, query.page * query.offset);
  }

  res.json({
    body: review,
    metadata: {
      total: reviewTotalLength,
      page: query.page,
      hasNextPage: review.length > 0
    }
  });
});


app.get("/selectors/list", async (req, res) => {
  const selectors = fs.readFileSync(path.join(__dirname, "selector-sample.json"), "utf-8");
  res.json({
    body: selectors
  });
})


app.listen(process.env.PORT || 3000, () => {
  console.log("server listening on localhost:" + process.env.PORT);
});