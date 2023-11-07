"use client";
import CardProduct from "./CardProduct";
import Filter from "./Filter";
import { useState } from "react";
import { Category, Product, Color, ProductVariant } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import ProductListHeader from "./CollectionListHeader";
import { motion } from "framer-motion";

interface CollectionProps {
  products: (Product & {
    category: Category | null;
    variants: ProductVariant[] | null;
  })[];
  categories: Category[];
  colors: Color[];
}

export default function Collection({
  products,
  categories,
  colors,
}: CollectionProps) {
  const [filterData, setFilterData] = useState({
    selectedCategory: null as Category | null,
    selectedColor: null as Color | null,
    sortedProducts: [...products] as (Product & {
      category: Category | null;
      variants: ProductVariant[] | null;
    })[],
    priceRange: 50000,
    searchTerm: "",
    selectedSort: "A-Z",
  });

  const {
    selectedCategory,
    selectedColor,
    sortedProducts,
    priceRange,
    searchTerm,
    selectedSort,
  } = filterData;

  const sortProducts = (order: "A-Z" | "Z-A") => {
    const sorted = [...products].sort((a, b) =>
      order === "A-Z"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );
    setFilterData({
      ...filterData,
      sortedProducts: sorted,
      selectedSort: order,
    });
  };

  const handleSortAlphabetically = () => {
    sortProducts("A-Z");
  };

  const handleSortReverseAlphabetically = () => {
    sortProducts("Z-A");
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPriceRange = parseInt(e.target.value, 10);
    setFilterData({ ...filterData, priceRange: newPriceRange });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterData({ ...filterData, searchTerm: e.target.value });
  };

  const handleCategorySelect = (category: Category | null) => {
    setFilterData({ ...filterData, selectedCategory: category });
  };

  const handleColorSelect = (color: Color | null) => {
    setFilterData({ ...filterData, selectedColor: color });
  };

  const filteredProducts = sortedProducts
    .filter((product) => {
      if (
        (selectedCategory && product.categoryId !== selectedCategory.id) ||
        (selectedColor && product.colorsId !== selectedColor.id)
      ) {
        return false;
      }
      return product.price <= priceRange;
    })
    .filter((product) => {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full flex flex-col md:pt-10"
    >
      <div className="w-full flex flex-col xl:flex-row">
        <div className="bg-third xl:block hidden px-4">
          <Filter
            categories={categories}
            colors={colors}
            selectedCategory={selectedCategory}
            selectedColor={selectedColor}
            onSelectColor={handleColorSelect}
            onSelectCategory={handleCategorySelect}
            priceRange={priceRange}
            PriceRangeChange={handlePriceRangeChange}
          />
        </div>

        <div className="mt-4 xl:w-3/4 mx-8 md:mx-20 xl:mx-0 xl:mr-12 flex flex-col xl:pl-20 ">
          <ProductListHeader
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            productsCount={filteredProducts.length}
            selectedSort={selectedSort}
            onSortAlphabetically={handleSortAlphabetically}
            onSortReverseAlphabetically={handleSortReverseAlphabetically}
          />

          <Separator />
          <div className="xl:hidden">
            <Filter
              categories={categories}
              colors={colors}
              selectedCategory={selectedCategory}
              selectedColor={selectedColor}
              onSelectColor={handleColorSelect}
              onSelectCategory={handleCategorySelect}
              priceRange={priceRange}
              PriceRangeChange={handlePriceRangeChange}
            />
          </div>
          <ul className="mt-4 mb-8 xl:mb-0 w-full pb-4 flex justify-center lg:justify-start flex-wrap gap-8">
            {filteredProducts.map((product) => (
              <CardProduct
                product={product}
                key={product.id}
                selectedCategory={selectedCategory}
                selectedColor={selectedColor}
              />
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
