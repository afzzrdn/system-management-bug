import React, { Fragment, useMemo } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronsUpDown } from 'lucide-react';

export interface Option {
  label: string;
  value: string | number; 
}

interface FilterDropdownProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Option[];
  placeholder?: string;
  widthClassName?: string;
  showResetOption?: boolean; 
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Pilih Opsi',
  widthClassName = 'w-48',
  showResetOption = true,
}) => {
  const selectedOption = useMemo(() => options.find(opt => opt.value === value), [options, value]);

  return (
    <Listbox value={value} onChange={onChange}>
      <div className={`relative ${widthClassName}`}>
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm">
          <span className="block truncate">{selectedOption ? selectedOption.label : placeholder}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><ChevronsUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" /></span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
            {showResetOption && (
              <Listbox.Option className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`} value="">
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>-- {placeholder} --</span>
                    {selected && (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600"><Check className="h-5 w-5" aria-hidden="true" /></span>)}
                  </>
                )}
              </Listbox.Option>
            )}
            {options.map((option) => (
              <Listbox.Option key={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'}`} value={option.value}>
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{option.label}</span>
                    {selected && (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600"><Check className="h-5 w-5" aria-hidden="true" /></span>)}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default FilterDropdown;