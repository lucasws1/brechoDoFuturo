import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const SortSelect = ({
  sort,
  setSort,
}: {
  sort: string;
  setSort: (value: string) => void;
}) => {
  const handleSortChange = (value: string) => {
    setSort(value);
  };

  return (
    <Select value={sort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-fit cursor-pointer justify-start border-none px-0 text-left shadow-none focus:ring-0">
        <SelectValue placeholder="Ordenar" className="cursor-pointer" />
      </SelectTrigger>
      <SelectContent className="rounded-xl">
        <SelectGroup>
          <SelectLabel>Ordenar por</SelectLabel>
          <SelectItem value="newest">Mais novos</SelectItem>
          <SelectItem value="oldest">Mais antigos</SelectItem>
          <SelectItem value="price-asc">Menor preço</SelectItem>
          <SelectItem value="price-desc">Maior preço</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SortSelect;
