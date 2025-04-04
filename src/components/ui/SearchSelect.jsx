import React, { useState } from "react";

const SearchSelect = ({
  label,
  placeholder = "Select Option",
  classLabel = "form-label",
  className = "",
  name,
  value,
  error,
  disabled,
  id,
  onChange,
  options = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsDropdownOpen(true);
  };

  const handleOptionSelect = (option) => {
    const optionValue = option.value || option; // Support for both string and object
    setSearchTerm(option.label || option); // Update input with selected label
    setIsDropdownOpen(false);

    if (onChange) {
      onChange({ target: { name, value: optionValue } }); // Pass selected value
    }
  };

  const filteredOptions = options.filter((option) => {
    const optionLabel = option.label || option; // Handle object or string
    return optionLabel
  });

  return (
    <div className="form-group">
      {label && (
        <label
          htmlFor={id}
          className={`block text-gray-700 text-sm font-medium mb-1 ${classLabel}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {/* Search Input */}
        <input
          type="text"
          placeholder={placeholder}
          className={`w-full border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : ""
          } ${className}`}
          id={id}
          name={name}
          value={searchTerm}
          onFocus={() => setIsDropdownOpen(true)}
          onChange={handleInputChange}
          disabled={disabled}
        />

        {/* Dropdown Options */}
        {isDropdownOpen && filteredOptions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-60 overflow-auto shadow-md">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-gray-700"
                onClick={() => handleOptionSelect(option)}
              >
                {option.label || option} {/* Handle object or string */}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Error Message */}
      {error && typeof error === "object" && error.message && (
        <p className="mt-2 text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default SearchSelect;
