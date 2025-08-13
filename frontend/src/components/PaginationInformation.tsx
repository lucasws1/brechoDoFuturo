import type { Product } from "@/types/Product";

const PaginationInformation = ({
  pagination,
  page,
  products,
}: {
  pagination: any;
  page: number;
  products: Product[];
}) => {
  return (
    <div>
      {/* Informações de paginação */}
      {pagination && (
        <div className="text-muted-foreground text-center text-sm">
          Mostrando{" "}
          {pagination.totalPages > 1 ? page * products.length : products.length}
          de {pagination.total} produtos
          {pagination.totalPages > 1 && (
            <span>
              • Página {pagination.page} de {pagination.totalPages}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PaginationInformation;
