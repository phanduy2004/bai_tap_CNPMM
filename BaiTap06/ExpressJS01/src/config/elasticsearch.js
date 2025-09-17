// src/config/elasticsearch.js
const { Client } = require("@elastic/elasticsearch");
const path = require("path");

// Load .env ở root dự án (../.. từ file này)
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const node = process.env.ELASTIC_NODE || process.env.ES_NODE; // http://localhost:9200
const apiKey = process.env.ELASTIC_API_KEY || process.env.ES_API_KEY;

if (!node) {
  console.warn("[ES] Disabled: missing ELASTIC_NODE/ES_NODE");
  module.exports = null;
  return;
}

const cfg = { node };
if (apiKey) cfg.auth = { apiKey }; // chỉ set nếu có key hợp lệ (nếu ES đang bật security)

const client = new Client(cfg);

// Log kiểm tra kết nối
(async () => {
  try {
    const info = await client.info();
    console.log("[ES] connected:", info.version?.number || info.body?.version?.number, "→", node);
  } catch (e) {
    console.error("[ES] connect failed:", e.message, "target:", node);
  }
})();

module.exports = client;
