"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { Product } from "../types/Product";
import { updateItem, deleteItem, createItem, getItems } from "../utils/api";
import { _sortProducts } from "../utils/helperFunctions";

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  deleteProduct: (productId: number) => void;
  fetchProducts: () => void;
  filterProducts: (query: string) => void;
  updateProduct: (updatedProduct: { id: number } & Partial<Product>) => void;
  sortProducts: (sort: string) => void;
  sort: string;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({
  children,
}) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [sort, setSort] = React.useState<string>("Name");

  const fetchProducts = React.useCallback(async () => {
    const data = await getItems();
    const sortedData = _sortProducts(sort, data);
    setProducts(sortedData);
  }, [sort]);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = React.useCallback(
    async (newProduct: Omit<Product, "id">) => {
      await createItem(newProduct);
      fetchProducts();
    },
    [fetchProducts]
  );

  const updateProduct = React.useCallback(
    async (updatedProduct: { id: number } & Partial<Product>) => {
      await updateItem(updatedProduct.id, updatedProduct);
      fetchProducts();
    },
    [fetchProducts]
  );

  const deleteProduct = React.useCallback(
    async (id: number) => {
      await deleteItem(id);
      fetchProducts();
    },
    [fetchProducts]
  );

  const filterProducts = React.useCallback(
    async (query: string) => {
      if (query === "") {
        fetchProducts();
        return;
      }
      const data = await getItems();
      const filteredList = data.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
      );
      setProducts(filteredList);
    },
    [fetchProducts]
  );

  const sortProducts = React.useCallback(
    (newsort: string) => {
      setSort(newsort);
      const sortedList = _sortProducts(newsort, [...products]);
      setProducts(sortedList);
    },
    [products]
  );

  const value = React.useMemo(
    () => ({
      products,
      addProduct,
      deleteProduct,
      fetchProducts,
      filterProducts,
      updateProduct,
      sortProducts,
      sort,
    }),
    [
      products,
      addProduct,
      deleteProduct,
      fetchProducts,
      filterProducts,
      updateProduct,
      sortProducts,
      sort,
    ]
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProductContext = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("No provider was provided for ProductContext");
  }
  return context;
};
