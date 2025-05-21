"use client";

import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import type { PaginatedProductsResponse, Product } from "../lib/types";
import { columns } from "./_products/columns";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    skip: 0,
    limit: 194,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://dummyjson.com/products?limit=${pagination.limit}&skip=${pagination.skip}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: PaginatedProductsResponse = await response.json();

        const enhancedProducts = data.products.map((product) => ({
          ...product,
          sku: product.sku || `SKU-${product.id}`,
          tags: product.tags || [],
          weight: product.weight || Math.random() * 10,
          dimensions: product.dimensions || {
            width: 10,
            height: 10,
            depth: 10,
          },
          warrantyInformation:
            product.warrantyInformation ||
            "Standard 1-year manufacturer warranty",
          shippingInformation:
            product.shippingInformation ||
            "Standard shipping, 3-5 business days",
          availabilityStatus:
            product.availabilityStatus ||
            (product.stock > 0 ? "In Stock" : "Out of Stock"),
          reviews: product.reviews || [],
          returnPolicy:
            product.returnPolicy ||
            "30-day return policy, item must be in original condition",
          minimumOrderQuantity: product.minimumOrderQuantity || 1,
          meta: product.meta || {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            barcode: `BARCODE-${product.id}`,
            qrCode: `QRCODE-${product.id}`,
          },
        }));

        setProducts(enhancedProducts);
        setPagination({
          total: data.total,
          skip: data.skip,
          limit: data.limit,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [pagination.skip, pagination.limit]);

  const categories = [
    ...new Set(products.map((product) => product.category)),
  ].map((category) => ({
    label: category.charAt(0).toUpperCase() + category.slice(1),
    value: category,
  }));

  const brands = [
    ...new Set(products.map((product) => product.brand || "Unbranded")),
  ].map((brand) => ({
    label: brand,
    value: brand,
  }));

  const statuses = [
    ...new Set(
      products.map(
        (product) =>
          product.availabilityStatus ||
          (product.stock > 0 ? "In Stock" : "Out of Stock")
      )
    ),
  ].map((status) => ({
    label: status,
    value: status,
  }));

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 tracking-tight">
          Products
        </h1>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-10">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 tracking-tight">
          Products
        </h1>
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg shadow-sm">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-10">
      <h1 className="text-xl sm:text-2xl font-bold mb-6 tracking-tight">
        Products
      </h1>
      <DataTable
        columns={columns}
        data={products}
        filterableColumns={[
          {
            id: "category",
            title: "Category",
            options: categories,
          },
          {
            id: "brand",
            title: "Brand",
            options: brands,
          },
          {
            id: "availabilityStatus",
            title: "Status",
            options: statuses,
          },
        ]}
      />
    </div>
  );
}
