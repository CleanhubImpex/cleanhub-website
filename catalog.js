const fallbackProducts = [
  { name: "Langano Broom", detail: "Locally manufactured monofilament broom", detailAm: "በኢትዮጵያ የተመረተ መጥረጊያ", category: "brooms" },
  { name: "Largo Liquid Detergent", detail: "Available in 2 L and 5 L", detailAm: "በ2 እና 5 ሊትር ይገኛል", category: "detergents" },
  { name: "MAMCO Facial Tissue", detail: "Available in 180 and 200 sheets", detailAm: "በ180 እና 200 ብዛት ይገኛል", category: "tissues" },
  { name: "240 L Roto Bin", detail: "Heavy-duty mobile waste bin", detailAm: "ጠንካራ ተንቀሳቃሽ የቆሻሻ ቢን", category: "bins" }
];

const labels = {
  en: { detergents: "Detergents", brooms: "Brooms & brushes", tissues: "Tissues & paper", bins: "Waste solutions", ask: "Ask about this product", empty: "No products match your search.", shown: count => `${count} product${count === 1 ? "" : "s"} shown` },
  am: { detergents: "ዲተርጀንቶች", brooms: "መጥረጊያ እና ብሩሽ", tissues: "ሶፋት እና የወረቀት ምርቶች", bins: "የቆሻሻ መፍትሄዎች", ask: "ስለዚህ ምርት ይጠይቁ", empty: "ከፍለጋዎ ጋር የሚዛመድ ምርት የለም።", shown: count => `${count} ምርቶች ታይተዋል` }
};

const productGrid = document.getElementById("product-grid");
const productSearch = document.getElementById("product-search");
const catalogStatus = document.getElementById("catalog-status");
let products = fallbackProducts;
let activeCategory = "all";

const currentLanguage = () => document.documentElement.lang === "am" ? "am" : "en";
const validProducts = value => Array.isArray(value) && value.every(product => product && typeof product.name === "string" && typeof product.category === "string");

const renderProducts = () => {
  const language = currentLanguage();
  const copy = labels[language];
  const query = productSearch.value.trim().toLowerCase();
  const filtered = products.filter(product => (activeCategory === "all" || product.category === activeCategory) && `${product.name} ${product.detail || ""} ${product.detailAm || ""}`.toLowerCase().includes(query));
  productGrid.replaceChildren();
  filtered.forEach(product => {
    const article = document.createElement("article");
    article.className = "product-card";
    const category = document.createElement("span");
    category.className = "product-category";
    category.textContent = copy[product.category] || product.category;
    const title = document.createElement("h4");
    title.textContent = product.name;
    const detail = document.createElement("p");
    detail.textContent = language === "am" ? (product.detailAm || product.detail) : product.detail;
    const link = document.createElement("a");
    link.href = window.CLEANHUB_CONFIG?.telegramUrl || "https://t.me/CLEANHUBGO";
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", `${copy.ask}: ${product.name}`);
    link.append(`${copy.ask} `);
    const arrow = document.createElement("b");
    arrow.textContent = "↗";
    link.append(arrow);
    article.append(category, title, detail, link);
    productGrid.append(article);
  });
  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "catalog-empty";
    empty.textContent = copy.empty;
    productGrid.append(empty);
  }
  catalogStatus.textContent = copy.shown(filtered.length);
};

const loadCatalog = async () => {
  const configuredEndpoint = window.CLEANHUB_CONFIG?.catalogEndpoint?.trim();
  const sources = configuredEndpoint ? [configuredEndpoint, "products.json"] : ["products.json"];
  for (const source of sources) {
    try {
      const response = await fetch(source, { headers: { Accept: "application/json" } });
      if (!response.ok) continue;
      const data = await response.json();
      const candidate = Array.isArray(data) ? data : data.products;
      if (validProducts(candidate)) { products = candidate; break; }
    } catch {}
  }
  renderProducts();
};

document.querySelectorAll(".catalog-filters button").forEach(button => button.addEventListener("click", () => {
  activeCategory = button.dataset.filter;
  document.querySelectorAll(".catalog-filters button").forEach(item => item.classList.toggle("active", item === button));
  renderProducts();
}));
productSearch.addEventListener("input", renderProducts);
document.addEventListener("cleanhub:languagechange", renderProducts);
loadCatalog();
