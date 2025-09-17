import { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Select,
  Pagination,
  Spin,
  Input,
  Slider,
  Tag,
  Badge,
  Typography,
  Space,
  Empty,
  message,
  Divider,
} from "antd";
import axios from "axios";

const { Option } = Select;
const { Search } = Input;
const { Text, Paragraph, Title } = Typography;

// Simple debounce hook
function useDebounce(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const formatCurrency = (num) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number(num || 0)
  );

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // filters
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [keyword, setKeyword] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [discount, setDiscount] = useState(0);
  const [views, setViews] = useState([0, 10000]);

  // paging + states
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  // tune page size cho grid đẹp hơn
  const limit = 12;

  // debounce tất cả filter để giảm call API
  const filters = useMemo(
    () => ({ page, category, brand, keyword, priceRange, discount, views }),
    [page, category, brand, keyword, priceRange, discount, views]
  );
  const debouncedFilters = useDebounce(filters, 400);

  // categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/v1/api/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Không tải được danh mục.");
    }
  };

  // products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8080/v1/api/products/search",
        {
          params: {
            page: debouncedFilters.page,
            limit,
            name: debouncedFilters.keyword,
            category: debouncedFilters.category,
            brand: debouncedFilters.brand,
            minPrice: debouncedFilters.priceRange[0],
            maxPrice: debouncedFilters.priceRange[1],
            discount: debouncedFilters.discount,
            minViews: debouncedFilters.views[0],
            maxViews: debouncedFilters.views[1],
          },
        }
      );
      setProducts(res?.data?.data || []);
      setTotalItems(res?.data?.totalItems ?? 0);
    } catch (err) {
      console.error(err);
      message.error("Không tải được sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters]); // chỉ bắn khi filters đã debounce

  const resetFilters = () => {
    setCategory("");
    setBrand("");
    setKeyword("");
    setPriceRange([0, 5000]);
    setDiscount(0);
    setViews([0, 10000]);
    setPage(1);
  };

  // Header gradient
  const Header = () => (
    <div
      style={{
        borderRadius: 16,
        padding: "24px 20px",
        background:
          "linear-gradient(135deg, rgba(24,144,255,0.12), rgba(82,196,26,0.12))",
        marginBottom: 16,
      }}
    >
      <Space
        size="middle"
        align="center"
        style={{ width: "100%", justifyContent: "space-between", flexWrap: "wrap" }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Sản phẩm
          </Title>
          <Text type="secondary">
            Tìm & lọc theo danh mục, thương hiệu, giá, khuyến mãi, lượt xem
          </Text>
        </div>
        <Space wrap>
          <Button onClick={resetFilters}>Reset</Button>
        </Space>
      </Space>
    </div>
  );

  const FilterBar = () => (
    <Card
      size="small"
      style={{
        borderRadius: 12,
        marginBottom: 20,
      }}
      bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
    >
      <Space size="large" wrap>
        {/* Category */}
        <Space direction="vertical" size={4}>
          <Text type="secondary">Danh mục</Text>
          <Select
            value={category || "all"}
            style={{ width: 220 }}
            onChange={(value) => {
              setCategory(value === "all" ? "" : value);
              setPage(1);
            }}
            options={[
              { label: "Tất cả danh mục", value: "all" },
              ...categories.map((c) => ({ label: c.name, value: c._id })),
            ]}
            showSearch
            optionFilterProp="label"
          />
        </Space>

        {/* Brand */}
        <Space direction="vertical" size={4}>
          <Text type="secondary">Thương hiệu</Text>
          <Select
            value={brand || "all"}
            style={{ width: 200 }}
            onChange={(value) => {
              setBrand(value === "all" ? "" : value);
              setPage(1);
            }}
          >
            <Option value="all">Tất cả thương hiệu</Option>
            <Option value="Asus">Asus</Option>
            <Option value="Dell">Dell</Option>
            <Option value="HP">HP</Option>
            <Option value="Lenovo">Lenovo</Option>
            <Option value="Acer">Acer</Option>
            <Option value="MSI">MSI</Option>
          </Select>
        </Space>

        {/* Search */}
        <Space direction="vertical" size={4}>
          <Text type="secondary">Từ khóa</Text>
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            enterButton="Tìm"
            onSearch={(val) => {
              setKeyword(val);
              setPage(1);
            }}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 280 }}
          />
        </Space>

        {/* Price */}
        <Space direction="vertical" size={4} style={{ width: 300 }}>
          <Text type="secondary">Khoảng giá</Text>
          <Slider
            range
            min={0}
            max={5000}
            step={50}
            value={priceRange}
            onChange={(val) => setPriceRange(val)}
            tooltip={{ formatter: (v) => formatCurrency(v) }}
          />
          <Text>
            {formatCurrency(priceRange[0])} – {formatCurrency(priceRange[1])}
          </Text>
        </Space>

        {/* Discount */}
        <Space direction="vertical" size={4} style={{ width: 220 }}>
          <Text type="secondary">Khuyến mãi từ (%)</Text>
          <Slider
            min={0}
            max={50}
            step={5}
            value={discount}
            onChange={setDiscount}
          />
          <Text>{discount}%</Text>
        </Space>

        {/* Views */}
        <Space direction="vertical" size={4} style={{ width: 300 }}>
          <Text type="secondary">Lượt xem</Text>
          <Slider
            range
            min={0}
            max={10000}
            step={200}
            value={views}
            onChange={(val) => setViews(val)}
          />
          <Text>
            {views[0].toLocaleString()} – {views[1].toLocaleString()}
          </Text>
        </Space>
      </Space>
    </Card>
  );

  const ProductCard = ({ p }) => {
    const hasDiscount = Number(p.discount) > 0;
    const discounted = hasDiscount
      ? Math.max(0, Number(p.price) * (1 - Number(p.discount) / 100))
      : Number(p.price);

    const cover = (
      <div style={{ position: "relative", background: "#fafafa" }}>
        <img
          alt={p.name}
          src={p.imageUrl}
          loading="lazy"
          style={{
            height: 180,
            objectFit: "contain",
            width: "100%",
            display: "block",
          }}
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400x300?text=No+Image";
          }}
        />
        <Tag
          color="processing"
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          👁 {p.views ?? 0}
        </Tag>
      </div>
    );

    const cardInner = (
      <Card
        hoverable
        style={{
          borderRadius: 14,
          overflow: "hidden",
          transition: "transform .18s ease, box-shadow .18s ease",
        }}
        bodyStyle={{ paddingTop: 14 }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
        cover={cover}
        actions={[
          <Button type="primary" key="add" block>
            Thêm vào giỏ
          </Button>,
        ]}
      >
        <Space direction="vertical" size={8} style={{ display: "block" }}>
          <Space wrap size={6}>
            {p.brand ? <Tag color="blue">{p.brand}</Tag> : null}
            {p.categoryName ? <Tag>{p.categoryName}</Tag> : null}
            {p.quantity !== undefined ? (
              <Tag color={p.quantity > 0 ? "success" : "error"}>
                {p.quantity > 0 ? `Còn ${p.quantity}` : "Hết hàng"}
              </Tag>
            ) : null}
          </Space>

          <Paragraph
            strong
            style={{ margin: 0, fontSize: 15, minHeight: 44 }}
            ellipsis={{ rows: 2 }}
            title={p.name}
          >
            {p.name}
          </Paragraph>

          <Paragraph
            type="secondary"
            style={{ minHeight: 40, marginBottom: 0 }}
            ellipsis={{ rows: 2 }}
          >
            {p.description || "Không có mô tả."}
          </Paragraph>

          <div>
            <Text strong style={{ fontSize: 16, color: "#52c41a" }}>
              {formatCurrency(discounted)}
            </Text>
            {hasDiscount && (
              <Text delete type="secondary" style={{ marginLeft: 8 }}>
                {formatCurrency(p.price)}
              </Text>
            )}
          </div>
        </Space>
      </Card>
    );

    return hasDiscount ? (
      <Badge.Ribbon text={`-${p.discount}%`} color="red">
        {cardInner}
      </Badge.Ribbon>
    ) : (
      cardInner
    );
  };

  const SkeletonGrid = () => (
    <Row gutter={[16, 16]}>
      {Array.from({ length: limit }).map((_, i) => (
        <Col xs={24} sm={12} md={8} lg={6} key={i}>
          <Card
            style={{ borderRadius: 14, overflow: "hidden" }}
            cover={<div style={{ height: 180, background: "#f5f5f5" }} />}
          >
            <Space direction="vertical" size={8} style={{ display: "block" }}>
              <Spin />
              <Divider style={{ margin: "8px 0" }} />
              <Spin />
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Header />
      <FilterBar />

      {loading ? (
        <SkeletonGrid />
      ) : products.length === 0 ? (
        <Card
          style={{ borderRadius: 14, overflow: "hidden" }}
          bodyStyle={{ padding: 28 }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có sản phẩm phù hợp"
          >
            <Button type="primary" onClick={resetFilters}>
              Xóa bộ lọc
            </Button>
          </Empty>
        </Card>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {products.map((p) => (
              <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
                <ProductCard p={p} />
              </Col>
            ))}
          </Row>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 24,
            }}
          >
            <Text type="secondary">
              Tổng: <b>{totalItems.toLocaleString()}</b> sản phẩm
            </Text>
            <Pagination
              current={page}
              pageSize={limit}
              total={totalItems}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
