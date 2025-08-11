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
      <SelectTrigger className="text-sm">
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Ordenar por</SelectLabel>
          <SelectItem value="newest">Novos</SelectItem>
          <SelectItem value="oldest">Antigos</SelectItem>
          <SelectItem value="price-asc">Preço: Menor</SelectItem>
          <SelectItem value="price-desc">Preço: Maior</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SortSelect;
