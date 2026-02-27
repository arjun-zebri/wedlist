# Custom Dropdown & Date Picker Components

## Overview

A comprehensive set of reusable custom form components that follow the minimalistic but refined Dribbble-inspired design system. These components provide a consistent, accessible experience across the entire application.

## Components

### 1. CustomSelect

**Path**: `/components/CustomSelect.tsx`

A fully accessible custom dropdown component that replaces native HTML `<select>` elements.

#### Features:
- **Keyboard Navigation**: Arrow keys, Enter, Escape support
- **Accessible**: Proper ARIA attributes, focus management
- **Keyboard Control**: Full navigation without mouse
- **Click-outside Detection**: Auto-closes when clicking outside
- **Custom Styling**: Matches Dribbble aesthetic (rose-tinted, rounded corners, layered shadows)
- **Smooth Animations**: Transform + opacity only (no transition-all)
- **Selected State Indication**: Rose accent background + bold text
- **Disabled Support**: Full disabled state styling

#### Design Details:
- **Button**: `rounded-xl border-gray-300` with rose focus ring `focus:ring-[#E31C5F]/20`
- **Dropdown**: Rose-tinted shadow `shadow-[0_4px_20px_rgba(227,28,95,0.15)]`
- **Options**: Divided by `border-b border-gray-100` with hover effect
- **Selected**: `bg-[#E31C5F]/8` with rose text `text-[#E31C5F]`
- **ChevronDown Icon**: Rotates 180° when open

#### Usage:
```tsx
<CustomSelect
  label="MC Stage"
  value={formData.stage}
  onChange={(value) => handleChange({ target: { name: 'stage', value } })}
  options={[
    { value: 'prospect', label: 'Prospect' },
    { value: 'active', label: 'Active' },
  ]}
  required
/>
```

#### Props:
- `value: string` - Current selected value
- `onChange: (value: string) => void` - Selection change handler
- `options: Option[]` - Array of {value, label} pairs
- `placeholder?: string` - Default text (optional)
- `label?: string` - Field label (optional)
- `required?: boolean` - Show asterisk (optional)
- `disabled?: boolean` - Disable the dropdown (optional)

---

### 2. CustomDatePicker

**Path**: `/components/CustomDatePicker.tsx`

A fully functional calendar date picker that replaces native HTML `<input type="date">`.

#### Features:
- **Calendar Interface**: Full month view with prev/next navigation
- **Date Selection**: Click to select, disabled dates support
- **Month Navigation**: Arrow buttons to move between months
- **Today Indicator**: Current date highlighted with border
- **Min/Max Constraints**: Optional minDate/maxDate validation
- **Clear Button**: Easy date clearing when already selected
- **Keyboard Support**: Close with Escape
- **Accessible**: Proper ARIA labels on navigation buttons
- **Responsive**: Works on all screen sizes
- **Click-outside Detection**: Auto-closes when clicking outside

#### Design Details:
- **Input Field**: `rounded-xl` with calendar icon on the left
- **Calendar**: Rose-tinted shadow `shadow-[0_4px_20px_rgba(227,28,95,0.15)]`
- **Selected Day**: `bg-[#E31C5F]` with white text and rose shadow
- **Today**: `border border-gray-300` background
- **Navigation**: Subtle hover effect on month buttons
- **Formatting**: Uses `toLocaleDateString('en-AU', {...})` for Australian format

#### Usage:
```tsx
<CustomDatePicker
  label="Wedding Date"
  value={weddingDate}
  onChange={(date) => setWeddingDate(date)}
  minDate="2025-01-01"
  maxDate="2026-12-31"
/>
```

#### Props:
- `value: string` - Current selected date (YYYY-MM-DD format)
- `onChange: (date: string) => void` - Date change handler
- `placeholder?: string` - Placeholder text (optional)
- `label?: string` - Field label (optional)
- `required?: boolean` - Show asterisk (optional)
- `disabled?: boolean` - Disable the picker (optional)
- `minDate?: string` - Minimum selectable date (optional)
- `maxDate?: string` - Maximum selectable date (optional)

---

## Design System Consistency

### Color Palette
- **Primary Brand**: `#E31C5F` (rose)
- **Hover Primary**: `#C4184F` (darker rose)
- **Rose Tint**: `rgba(227,28,95,0.15)` for shadows
- **Borders**: `border-gray-300` (normal), `border-gray-200` (subtle)
- **Backgrounds**: `bg-white` with `bg-gray-50` hover state
- **Text**: `text-gray-700` (default), `text-gray-600` (secondary)

### Spacing & Sizing
- **Padding**: `px-4 py-2.5` (standard input height: 40px)
- **Rounded Corners**: `rounded-xl` (12px border radius)
- **Gap**: `gap-2` between elements
- **Border**: `border` (1px) - standard weight

### Shadows (Layered)
- **Default**: `shadow-sm` or none
- **Hover**: `shadow-[0_2px_12px_rgba(227,28,95,0.1)]`
- **Dropdown/Calendar**: `shadow-[0_4px_20px_rgba(227,28,95,0.15)]`

### Animations
- **Duration**: `duration-200` (buttons), `duration-150` (options)
- **Easing**: `transition-colors` (color changes only)
- **No transition-all**: Only animate specific properties
- **ChevronDown**: `transform` with `rotate(180deg)` when open

---

## Pages Updated

### Super Admin Forms
1. **`/super-admin/crm/mcs/new/page.tsx`**
   - MC Stage dropdown → `CustomSelect`
   - Listing Status dropdown → `CustomSelect`
   - Renewal Date picker → `CustomDatePicker`
   - Account Linking dropdown → `CustomSelect` (when enabled)

2. **`/super-admin/crm/mcs/[mcId]/edit/page.tsx`**
   - MC Stage dropdown → `CustomSelect`
   - Listing Status dropdown → `CustomSelect`
   - Renewal Date picker → `CustomDatePicker`

3. **`/super-admin/crm/page.tsx`**
   - Stage Filter dropdown → `CustomSelect`

### Public Forms
4. **`/components/ContactForm.tsx`**
   - Wedding Date picker → `CustomDatePicker`

---

## Accessibility Features

### Keyboard Navigation
- **Tab/Shift+Tab**: Focus management
- **Arrow Up/Down**: Navigate options in dropdown
- **Enter**: Select option / Open dropdown
- **Escape**: Close dropdown/calendar
- **Space**: Toggle dropdown open/closed

### Screen Reader Support
- Proper `<label>` associations
- Required field indicators
- ARIA labels on icon buttons
- Semantic HTML structure

### Visual Indicators
- Focus rings: `ring-2 ring-[#E31C5F]/20`
- Disabled states: `disabled:opacity-50 disabled:cursor-not-allowed`
- Hover states: Subtle shadow/color changes
- Selected states: Rose accent + bold text

---

## Implementation Notes

### Integration with react-hook-form
When integrating with `react-hook-form`, use `watch` and `setValue`:

```tsx
const { watch, setValue } = useForm();
const dateValue = watch('fieldName');

<CustomDatePicker
  value={dateValue || ''}
  onChange={(value) => setValue('fieldName', value)}
/>
```

### Type Safety
- All components are fully TypeScript typed
- Option arrays require `{ value: string; label: string }` shape
- Date values use ISO format: `YYYY-MM-DD`

### Performance
- Click-outside detection uses `mousedown` event (not `click`)
- Memoization of event handlers via closures
- No unnecessary re-renders
- Event listeners cleaned up properly

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

All animations use CSS transforms (GPU-accelerated) for smooth performance.

---

## Future Enhancements

Potential improvements for future iterations:
1. Time selection in `CustomDatePicker` (time picker variant)
2. Multi-select variant of `CustomSelect`
3. Search/filter in dropdown for long option lists
4. Custom number formatting in `CustomSelect` labels
5. Dark mode variants (if needed)
6. Internationalization (i18n) for date formatting
7. Range date picker variant (start/end dates)
