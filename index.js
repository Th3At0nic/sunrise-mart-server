const express = require("express");
const port = process.env.PORT || 5009;
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hz5rx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db("sunriseMart").collection("products");
  const ordersCollection = client.db("sunriseMart").collection("orders");
  console.log("connection err", err);

  app.get("/allProducts", (req, res) => {
    productCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.get("/manageProducts", (req, res) => {
    productCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    console.log("adding new product", newProduct);
    productCollection.insertOne(newProduct).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/showProductById/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    productCollection.find({ _id: ObjectId(id) }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  app.get("/showMyOrders/:email", (req, res) => {
    const email = req.params.email;
    ordersCollection.find({ email: email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    console.log("deleted successfully", req.params.id);
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    console.log(order);
    ordersCollection.insertOne(order).then((result) => {
      console.log(order, "order added");
      res.send(result.insertedCount > 0);
    });
  });
});

app.listen(process.env.PORT || port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
