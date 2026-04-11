import React from "react";

export default function ToggleButton({ checked, onChange, labelOn = "Ativo", labelOff = "Inativo" }) {
  return (
    <label className="flex items-center cursor-pointer">
      <div className="relative">
        {/* Checkbox oculto */}
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        {/* Botão estilizado */}
        <div className={`block w-12 h-6 rounded-full ${checked ? "bg-green-500" : "bg-red-500"}`}></div>
        {/* Círculo que desliza */}
        <div
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? "translate-x-6" : ""
          }`}
        ></div>
      </div>
      {/* <span className="ml-3 text-gray-700">
        {checked ? labelOn : labelOff}
      </span> */}
    </label>
  );
}
