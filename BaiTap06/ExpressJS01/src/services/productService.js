// services/product.service.js
const Product = require("../models/Product");
const Category = require("../models/Category");
const esClient = require("../config/elasticsearch");
const PRODUCT_INDEX = "products";


// Tạo product mới (Mongo + index vào Elasticsearch)
const createProduct = async (data) => {
  const {
    name,
    category,
    brand,
    cpu,
    ram,
    storage,
    gpu,
    screen,
    price,
    quantity,
    description,
    imageUrl,
    discount = 0,
    views = 0,
  } = data;

  // Kiểm tra category
  const categoryExist = await Category.findById(category);
  if (!categoryExist) {
    throw new Error("Category not found");
  }

  // Lưu vào MongoDB
  const product = await Product.create({
    name,
    category,
    brand,
    cpu,
    ram,
    storage,
    gpu,
    screen,
    price,
    quantity,
    description,
    imageUrl,
    discount,
    views,
  });

  // Index vào Elasticsearch
  await esClient.index({
    index: PRODUCT_INDEX,
    id: product._id.toString(),
    document: {
      name,
      category,
      brand,
      cpu,
      ram,
      storage,
      gpu,
      screen,
      price,
      quantity,
      description,
      imageUrl,
      discount,
      views,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    },
  });

  return product;
};

// Lấy sản phẩm (MongoDB, vẫn giữ nguyên)
const getProducts = async ({ page = 1, limit = 5, category }) => {
  page = Number(page);
  limit = Number(limit);

  const query = category ? { category } : {};

  const totalItems = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  const products = await Product.find(query)
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: products,
    totalPages,
    currentPage: page,
    totalItems,
  };
};

const searchProducts = async (params) => {
  let {
    page = 1,
    limit = 10,
    name,
    category,
    brand,
    minPrice,
    maxPrice,
    discount,
    minViews,
    maxViews,
  } = params;

  page = Number(page) || 1;
  limit = Number(limit) || 10;

  // FILTER (không ảnh hưởng điểm số)
  const filter = [];

  if (category) {
    filter.push({ term: { category } });
  }

  if (brand) {
    // robust cho cả mapping text/keyword
    filter.push({
      bool: {
        should: [
          { term: { "brand.keyword": brand } }, // nếu có subfield keyword
          { term: { brand } },                  // fallback nếu chỉ có text
        ],
        minimum_should_match: 1,
      },
    });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.push({
      range: {
        price: {
          gte: Number(minPrice ?? 0),
          lte: Number(maxPrice ?? 1000000),
        },
      },
    });
  }

  if (discount !== undefined && Number(discount) > 0) {
    filter.push({ range: { discount: { gte: Number(discount) } } });
  }

  if (minViews !== undefined || maxViews !== undefined) {
    filter.push({
      range: {
        views: {
          gte: Number(minViews ?? 0),
          lte: Number(maxViews ?? 1000000),
        },
      },
    });
  }

  // SHOULD (tính điểm, dùng khi có keyword)
  const should = [];
  if (name && String(name).trim()) {
    const q = String(name).trim();

    // 1) Fuzzy + boost các field quan trọng
    should.push({
      multi_match: {
        query: q,
        fields: ["name^3", "brand^5", "description"],
        fuzziness: "AUTO",   // asuz -> Asus
        operator: "and",
      },
    });

    // 2) Hỗ trợ gõ dần (prefix)
    should.push({ match_phrase_prefix: { name: { query: q } } });

    // 3) Prefix trên brand (case-insensitive cơ bản)
    should.push({ prefix: { brand: q.toLowerCase() } });
  }

  const query =
    should.length > 0 || filter.length > 0
      ? {
          bool: {
            filter,
            should,
            minimum_should_match: should.length ? 1 : 0,
          },
        }
      : { match_all: {} };

  const from = (page - 1) * limit;

  const result = await esClient.search({
    index: PRODUCT_INDEX,
    from,
    size: limit,
    // Nếu bạn đang dùng client v7: dùng `body: { query }`
    // Nếu client v8: có thể dùng `query` trực tiếp. Để an toàn, giữ body:
    body: { query },
    track_total_hits: true, // chuẩn totalItems kể cả >10k
  });

  const products = (result.hits.hits || []).map((hit) => ({
    _id: hit._id,
    ...hit._source,
  }));

  return {
    data: products,
    totalItems: result.hits?.total?.value || 0,
    page,
    limit,
  };
};

module.exports = {
  createProduct,
  getProducts,
  searchProducts,
};
