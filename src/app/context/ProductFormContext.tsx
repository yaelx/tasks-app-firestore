"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { Product } from "../types/Product";

interface ProductFormContextType {
  draftProduct: ({ id: number } & Partial<Product>) | undefined;
  editProduct: (product: { id: number } & Partial<Product>) => void;
  openProductForm: boolean;
  setOpenProductForm: (open: boolean) => void;
  resetDraft: () => void;
}

const ProductFormContext = createContext<ProductFormContextType | undefined>(
  undefined
);

interface ProductFormProviderProps {
  children: ReactNode;
}

export const ProductFormProvider: React.FC<ProductFormProviderProps> = ({
  children,
}) => {
  const [draftProduct, setDraftProduct] = React.useState<
    { id: number } & Partial<Product>
  >();
  const [openProductForm, setOpenProductForm] = React.useState<boolean>(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const editProduct = (product: { id: number } & Partial<Product>) => {
    setDraftProduct(product);
    setOpenProductForm(true);
  };

  const resetDraft = () => {
    setDraftProduct(undefined);
  };

  const value = React.useMemo(
    () => ({
      draftProduct,
      editProduct,
      openProductForm,
      setOpenProductForm,
      resetDraft,
    }),
    [draftProduct, editProduct, openProductForm, setOpenProductForm]
  );

  return (
    <ProductFormContext.Provider value={value}>
      {children}
    </ProductFormContext.Provider>
  );
};

export const useProductFormContext = (): ProductFormContextType => {
  const context = useContext(ProductFormContext);
  if (!context) {
    throw new Error("No provider was provided for ProductContext");
  }
  return context;
};
