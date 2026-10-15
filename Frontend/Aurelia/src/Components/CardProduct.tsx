import { ProductCard } from "./product/ProductCard";

export const CardProduct = ({ item }: { item: any }) => {
  return <ProductCard product={item} />;
};

export default CardProduct;
