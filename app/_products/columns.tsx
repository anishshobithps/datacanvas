"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Product } from "@/lib/types";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "thumbnail",
    header: "Image",
    cell: ({ row }) => {
      const thumbnail = row.getValue("thumbnail") as string;
      const title = row.getValue("title") as string;
      return (
        <Avatar className="h-10 w-10">
          <AvatarImage src={thumbnail || "/placeholder.svg"} alt={title} />
          <AvatarFallback>{title.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      );
    },
    enableSorting: false,
    size: 60,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Product" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col max-w-[280px]">
          <span className="font-medium truncate" title={row.getValue("title")}>
            {row.getValue("title")}
          </span>
          <span
            className="text-xs text-muted-foreground truncate"
            title={row.original.description}
          >
            {row.original.description}
          </span>
        </div>
      );
    },
    size: 300,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => {
      const price = Number.parseFloat(row.getValue("price"));
      const discountPercentage = row.original.discountPercentage;
      const discountedPrice = price * (1 - discountPercentage / 100);

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);

      const discountFormatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(discountedPrice);

      return (
        <div className="font-medium">
          {discountPercentage > 0 ? (
            <div className="flex flex-col">
              <span className="text-muted-foreground line-through text-xs">
                {formatted}
              </span>
              <span className="text-green-600">{discountFormatted}</span>
            </div>
          ) : (
            formatted
          )}
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="capitalize whitespace-nowrap">
          {row.getValue("category")}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    size: 120,
  },
  {
    accessorKey: "brand",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Brand" />
    ),
    cell: ({ row }) => {
      const brand = row.getValue("brand") as string | undefined;
      return (
        <div
          className="font-medium max-w-[120px] truncate"
          title={brand || "Unbranded"}
        >
          {brand || "Unbranded"}
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id) || "Unbranded");
    },
    size: 120,
  },
  {
    accessorKey: "availabilityStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status =
        (row.getValue("availabilityStatus") as string) ||
        (row.original.stock > 0 ? "In Stock" : "Out of Stock");

      let badgeVariant: "default" | "outline" | "secondary" | "destructive" =
        "outline";

      if (status === "In Stock" || status === "Available") {
        badgeVariant = "secondary";
      } else if (status === "Out of Stock" || status === "Discontinued") {
        badgeVariant = "destructive";
      }

      return (
        <Badge variant={badgeVariant} className="whitespace-nowrap">
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      const status =
        (row.getValue(id) as string) ||
        (row.original.stock > 0 ? "In Stock" : "Out of Stock");
      return value.includes(status);
    },
    size: 120,
  },
];
