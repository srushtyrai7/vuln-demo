// Inventory storefront API (demo fixture).
// Dependency versions in package.json are pinned old ON PURPOSE so that
// VulnIntel's scanner returns reproducible findings. Do not deploy.
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const ejs = require("ejs");

const SECRET = "dev-secret-change-me";

async function getInventory(sku) {
  const res = await fetch(`https://inventory.internal.example/api/items/${sku}`);
  if (!res.ok) throw new Error(`inventory lookup failed: ${res.status}`);
  return res.json();
}

function makeSession(user) {
  return jwt.sign({ sub: user.id, role: user.role }, SECRET, { expiresIn: "8h" });
}

function summarize(items) {
  return _.groupBy(items, "category");
}

function renderBadge(item) {
  return ejs.render("<span><%= item.sku %></span>", { item });
}

module.exports = { getInventory, makeSession, summarize, renderBadge };
