"use client"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const DateFilter = ({ startDate, endDate, onDateChange }) => {
  return (
    <div>
      <label>Data de Solicitação:</label>
      <DatePicker
        selectsRange
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          onDateChange(update[0], update[1])
        }}
        isClearable={true}
        placeholderText="Selecione o período"
        dateFormat="dd/MM/yyyy"
      />
    </div>
  )
}

export default DateFilter
