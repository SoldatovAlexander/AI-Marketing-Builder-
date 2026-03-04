import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const baseStyle = "px-4 py-2 rounded-xl font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-[#FFD1A6] hover:bg-[#FFBE8A] text-gray-900 focus:ring-[#FFD1A6]",
    secondary: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 focus:ring-gray-200",
    outline: "border-2 border-[#DCEEFF] hover:bg-[#DCEEFF] text-gray-800 focus:ring-[#DCEEFF]",
    ghost: "hover:bg-gray-100 text-gray-600 focus:ring-gray-200"
  };

  return (
    <button className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input = ({ label, className = '', ...props }: any) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input 
      className="px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DCEEFF] focus:border-[#DCEEFF] transition-all"
      {...props} 
    />
  </div>
);

export const Textarea = ({ label, className = '', ...props }: any) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <textarea 
      className="px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DCEEFF] focus:border-[#DCEEFF] transition-all min-h-[100px]"
      {...props} 
    />
  </div>
);

export const Select = ({ label, options, className = '', ...props }: any) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <select 
      className="px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DCEEFF] focus:border-[#DCEEFF] transition-all"
      {...props}
    >
      {options.map((opt: any) => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  </div>
);

export const Card = ({ children, className = '' }: any) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'default', className = '' }: any) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    blue: "bg-[#DCEEFF] text-gray-800",
    green: "bg-[#DFF3DF] text-gray-800",
    orange: "bg-[#FFD1A6] text-gray-800"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </span>
  );
};
