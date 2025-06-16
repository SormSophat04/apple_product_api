const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.use(cors());
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("🍎 Apple Product API is running!");
// });

// GET all products
app.get("/", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET one product
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

// POST a new product
app.post("/products", async (req, res) => {
  const { name, price, des, rate, image } = req.body;
  const { data, error } = await supabase
    .from("products")
    .insert([{ name, price, des, rate, image }]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// PUT update a product
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, des, rate, image } = req.body;
  const { data, error } = await supabase
    .from("products")
    .update({ name, price, des, rate, image })
    .eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// DELETE a product
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Product deleted" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
