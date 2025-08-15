import type { Product } from "@/types/Product";
import { ProductPagination } from "./ProductPagination";

const PaginationInformation = ({
  pagination,
  products,
  setPage,
}: {
  pagination: any;
  products: Product[];
  setPage: (page: number) => void;
}) => {
  const numeroDeProdutos = () => {
    if (pagination.totalPages > 1) {
      return Math.min(
        pagination.total,
        (pagination.page - 1) * pagination.limit + products.length,
      );
    }
    return products.length;
  };

  return (
    <>
      {pagination && (
        <div className="mt-4 flex flex-col items-center gap-4">
          {pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <ProductPagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage || (() => {})}
              />
            </div>
          )}
          <div className="text-center text-sm">
            Mostrando {numeroDeProdutos()} de {pagination.total} produtos
          </div>
        </div>
      )}
    </>
  );
};

export default PaginationInformation;
