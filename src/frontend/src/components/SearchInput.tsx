import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: SearchInputProps) {
  return (
    <div className="flex-1 min-w-48 relative">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7D8AA0]"
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="crm-input w-full pl-9 pr-3 py-2 text-sm"
      />
    </div>
  );
}
