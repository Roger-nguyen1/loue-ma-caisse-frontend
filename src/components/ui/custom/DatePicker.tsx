import React from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { fr, Locale } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fr", fr);

interface DatePickerProps {
  id?: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholderText?: string;
  dateFormat?: string;
  locale?: Locale;
  required?: boolean;
  className?: string;
}

const DatePicker = ({
  selected,
  onChange,
  minDate,
  maxDate,
  placeholderText = "Sélectionner une date",
  dateFormat = "dd/MM/yyyy",
  locale = fr,
  required = false,
}: DatePickerProps) => {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      minDate={minDate}
      maxDate={maxDate}
      placeholderText={placeholderText}
      dateFormat={dateFormat}
      locale={locale}
      required={required}
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
    />
  );
};

export default DatePicker;
