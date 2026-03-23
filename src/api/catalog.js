import { apiRequest } from "./apiClient";

export async function fetchCatalogProducts({
  page = 1,
  pageSize = 20,
  q,
  isPremium,
} = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("page_size", String(pageSize));
  if (q !== undefined && q !== null && String(q).trim() !== "") {
    params.set("q", String(q).trim());
  }
  if (isPremium !== undefined && isPremium !== null) {
    params.set("is_premium", String(isPremium));
  }

  const path = `/catalog/products?${params.toString()}`;
  return apiRequest(path, { method: "GET", auth: false });
}

