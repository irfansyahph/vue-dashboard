import { defineStore } from "pinia";
import axios from "axios";
import { useToast } from "vue-toastification";

const toast = useToast();

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface ProductPayload {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface State {
  products: Product[];
  search: string;
  limit: number;
  offset: number;
  loading: boolean;
  error: '';
}

export const useProductStore = defineStore("product", {
  state: (): State => ({
    products: [],
    search: "",
    limit: 10,
    offset: 0,
    loading: false,
    error: null,
  }),

  getters: {
    filteredProducts(state): Product[] {
      let filtered = state.products;

      if (state.search) {
        filtered = filtered.filter((p) =>
          p.title.toLowerCase().includes(state.search.toLowerCase())
        );
      }

      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));

      return filtered.slice(state.offset, state.offset + state.limit);
    },

    next(state): boolean {
      return state.offset + state.limit < state.products.length;
    },

    previous(state): boolean {
      return state.offset > 0;
    },
  },

  actions: {
    async fetchProducts(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.get<Product[]>("https://fakestoreapi.com/products");
        this.products = data;
      } catch (err) {
        this.error = "Failed to fetch products.";
      } finally {
        this.loading = false;
      }
    },

    async fetchDetailProduct(id: number): Promise<Product | null> {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.get<Product>(`https://fakestoreapi.com/products/${id}`);
        return data;
      } catch (err) {
        this.error = "Failed to fetch product details.";
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createProduct(product: ProductPayload): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.post<Product>("https://fakestoreapi.com/products", product);
        this.products.push(data);
        toast.success("Product created successfully!");
      } catch (err) {
        this.error = "Failed to create product.";
        toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async updateProduct(id: number, product: ProductPayload): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.put<Product>(`https://fakestoreapi.com/products/${id}`, product);
        const index = this.products.findIndex((p) => p.id === id);
        if (index !== -1) {
          this.products[index] = data;
        }
        toast.success("Product updated successfully!");
      } catch (err) {
        this.error = "Failed to update product.";
        toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async deleteProduct(id: number): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`https://fakestoreapi.com/products/${id}`);
        this.products = this.products.filter((p) => p.id !== id);
        toast.success("Product deleted successfully!");
      } catch (err) {
        this.error = "Failed to delete product.";
        toast.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    setSearch(query: string): void {
      this.search = query;
      this.offset = 0;
    },

    setLimit(limit: number): void {
      this.limit = limit;
      this.offset = 0;
    },

    nextPage(): void {
      if (this.next) {
        this.offset += this.limit;
      }
    },

    prevPage(): void {
      if (this.previous) {
        this.offset -= this.limit;
      }
    },
  },
});
