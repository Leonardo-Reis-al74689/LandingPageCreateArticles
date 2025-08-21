"use client"

import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-center"
      toastOptions={{
        style: {
          background: "white",
          color: "#0f172a",
          border: "1px solid #e2e8f0",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          borderRadius: "8px",
          minWidth: "400px",
          maxWidth: "500px",
          fontSize: "14px",
          lineHeight: "1.5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
