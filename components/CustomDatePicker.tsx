'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react';

interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
}

export default function CustomDatePicker({
  value,
  onChange,
  placeholder = 'Select a date',
  label,
  required,
  disabled,
  minDate,
  maxDate,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState<Date>(() => {
    if (value) {
      const date = new Date(value);
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
    const dateString = selectedDate.toISOString().split('T')[0];

    // Check min/max constraints
    if (minDate && dateString < minDate) return;
    if (maxDate && dateString > maxDate) return;

    onChange(dateString);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handlePrevMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 1));
  };

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-AU', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const monthYear = displayMonth.toLocaleDateString('en-AU', {
    month: 'long',
    year: 'numeric',
  });

  const daysInMonth = getDaysInMonth(displayMonth);
  const firstDay = getFirstDayOfMonth(displayMonth);
  const calendarDays = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-[#E31C5F]">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          readOnly
          value={value ? formatDisplayDate(value) : ''}
          placeholder={placeholder}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 pl-10 text-sm shadow-sm transition-all duration-200 hover:shadow-[0_2px_12px_rgba(227,28,95,0.1)] focus:border-[#E31C5F] focus:outline-none focus:ring-2 focus:ring-[#E31C5F]/20 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
        />
        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl border border-gray-200 shadow-[0_4px_20px_rgba(227,28,95,0.15)] z-[1100] p-4 animate-in fade-in slide-in-from-top-1">
          {/* Month/Year Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <h3 className="text-sm font-semibold text-gray-900 min-w-[120px] text-center">
              {monthYear}
            </h3>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-xs font-medium text-gray-500 text-center py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dateString = `${displayMonth.getFullYear()}-${String(
                displayMonth.getMonth() + 1
              ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

              const isSelected = value === dateString;
              const isDisabled =
                !!(minDate && dateString < minDate) || !!(maxDate && dateString > maxDate);
              const isToday = dateString === new Date().toISOString().split('T')[0];

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => !isDisabled && handleDateSelect(day)}
                  disabled={isDisabled}
                  className={`aspect-square rounded-lg text-sm font-medium transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#E31C5F] text-white shadow-[0_2px_8px_rgba(227,28,95,0.3)]'
                      : isToday
                      ? 'bg-gray-100 text-gray-900 border border-gray-300'
                      : isDisabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50 hover:shadow-[0_1px_4px_rgba(227,28,95,0.1)]'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Clear button */}
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              className="mt-3 w-full py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}
