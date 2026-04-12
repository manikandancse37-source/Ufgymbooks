// DateRangePickerWeb.tsx
import React from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function DateRangePickerWeb({ range, setRange }) {
  return (
    <DateRange
      editableDateInputs={true}
      onChange={item => setRange([item.selection])}
      moveRangeOnFirstSelection={false}
      ranges={range}
      maxDate={new Date()}
    />
  );
}
