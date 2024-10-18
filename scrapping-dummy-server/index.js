const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
const sampleFile = "jobs-sample.json";
const sampleSelectorFile = "selector-sample.json";

function createRegex(selector) {
  // Échapper les caractères spéciaux pour les regex
  const escapedSelector = selector.trim().replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&');

  return new RegExp(escapedSelector, "i");
}

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
  let query = { ...req.query };
  let selectors = JSON.parse(fs.readFileSync(path.join(__dirname, sampleSelectorFile), "utf-8"));
  let sortOrder = query.sort_order === "asc" ? 1 : -1;
  let parent;

  /*if (query.parent !== undefined) {
    query.parent = query.parent.split(",").map(value => Number(value));
    while (parent = query.parent.shift()) {
      selectors = selectors[parent];
    }
  }*/
  if (query.search) {
    let searchRegexp = createRegex(query.search);
    selectors = selectors.filter((selector) =>
      searchRegexp.test(selector._id) ||
      searchRegexp.test(selector.name) ||
      searchRegexp.test(selector.displayName) ||
      searchRegexp.test(selector.description) ||
      searchRegexp.test(selector.selector)
    )
  }

  console.log(query)
  if (query.group) {
    selectors = selectors.filter((selector) => selector[query.group]);
  }

  let selectorsTotalLength = selectors.length;
  console.log(query, selectors)

  if (selectors.length > 0) {
    switch (typeof (selectors[0][query.sort_field] ?? null)) {
      case "number": selectors = selectors.sort((a, b) => (a[query.sort_field] - b[query.sort_field]) * sortOrder);
      case "string": selectors = selectors.sort((a, b) => (a[query.sort_field].localeCompare(b[query.sort_field])) * sortOrder);
      default: null;
    }
  }

  if (query.page && query.offset) {
    query.page = Number(query.page);
    query.offset = Number(query.offset);
    selectors = selectors.slice((query.page - 1) * query.offset, query.page * query.offset);
  }

  res.json({
    body: selectors,
    metadata: {
      total: selectorsTotalLength,
      page: query.page,
      hasNextPage: selectors.length > 0
    }
  });
});

app.get("/selectors/details/:id", async (req, res) => {
  const params = { ...req.params };
  let result = [];
  let selector = [];
  let parent;
  let child;
  if (params.id !== undefined || params.id !== null) {
    result = JSON.parse(fs.readFileSync(path.join(__dirname, sampleSelectorFile), "utf-8"));
    selector = result.filter((item) => item._id === params.id)?.[0];
  }
  else {
    selector = {};
  }

  if (Object.keys(selector).length > 0) {
    if (selector.parentId) parent = result.filter((item) => item._id === selector.parentId)?.[0];
    child = result.filter((item) => item.parentId === selector._id);
  }

  res.json({
    selector,
    parent,
    child
  });
});

app.post("/selectors/add", async (req, res) => {
  console.log(req.body);
  res.json({ test: true })
});


app.listen(process.env.PORT || 3000, () => {
  console.log("server listening on localhost:" + process.env.PORT);
});