import { t } from 'i18next';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Input } from '../../ui/input';

interface SearchInputProps {
  initialValue?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceDelay?: number;
  className?: string;
}

const SearchInput = ({
  initialValue,
  onChange,
  debounceDelay = 300,
  className = '',
  placeholder = 'Search...',
}: SearchInputProps) => {
  const [inputValue, setInputValue] = useState(initialValue || '');
  const [debouncedValue] = useDebounce(inputValue, debounceDelay);

  useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return (
    <div className={`relative w-full ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
      <Input
        type="search"
        placeholder={t(placeholder)}
        className="pl-9 pr-4 bg-muted border-none"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
};

SearchInput.displayName = 'SearchInput';
export { SearchInput };
