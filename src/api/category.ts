import { https, type ApiMeta, type ApiResponse } from "../utils/https";
import type { CategoryStatus, ICategory } from "../interfaces";

export interface CategoryListQuery {
  page?: number;
  limit?: number;
  slug?: string;
  status?: CategoryStatus;
  sort?: "newest";
}

export interface CategoryListResult {
  categories: ICategory[];
  meta?: ApiMeta;
}

const categoryService = {
  getList(query: CategoryListQuery = {}) {
    return https.get<ICategory[], ApiResponse<ICategory[]>>("/categories", {
      params: query,
    });
  },

  async getById(id: string): Promise<ICategory> {
    const res = await https.get<ICategory, ApiResponse<ICategory>>(
      `/categories/${id}`,
    );
    return res.data;
  },

  async getBySlug(slug: string): Promise<ICategory> {
    const res = await https.get<ICategory, ApiResponse<ICategory>>(
      `/categories/slug/${slug}`,
    );
    return res.data;
  },
};

export { categoryService };
