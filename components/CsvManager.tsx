"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Download, FileSpreadsheet } from "lucide-react";
import { Input } from "@/components/ui/input";

type CsvManagerProps = {
  type: "internal_request" | "rfq" | "inventory";
  onUpload: (data: any[]) => void;
};

export function CsvManager({ type, onUpload }: CsvManagerProps) {
  // Define Headers based on Type
  const getHeaders = () => {
    if (type === "internal_request") return "ItemName,Quantity,Department";
    if (type === "rfq")
      return "SKU,ItemName,Quantity,TargetPrice,RequiredByDate(YYYY-MM-DD)";
    if (type === "inventory") return "SKU,ItemName,StockQty,UnitPrice";
    return "";
  };

  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + getHeaders();
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${type}_template.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split("\n");
      // Skip header (index 0) and parse lines
      const parsedData = lines
        .slice(1)
        .map((line) => {
          const cols = line.split(",");
          if (cols.length < 2) return null; // Skip empty lines

          // Return structured object based on type
          if (type === "internal_request")
            return {
              item_name: cols[0],
              quantity: Number(cols[1]),
              department: cols[2],
            };
          if (type === "rfq")
            return {
              sku: cols[0],
              item_name: cols[1],
              quantity: Number(cols[2]),
              target_price: Number(cols[3]),
              required_by: cols[4],
            };
          if (type === "inventory")
            return {
              sku: cols[0],
              item_name: cols[1],
              stock_quantity: Number(cols[2]),
              unit_price: Number(cols[3]),
            };
        })
        .filter(Boolean); // Remove nulls

      onUpload(parsedData);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
        <Download className="w-4 h-4 mr-2" /> Template
      </Button>
      <div className="relative">
        <Input
          type="file"
          accept=".csv"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileUpload}
        />
        <Button
          size="sm"
          className="pointer-events-none bg-emerald-600 text-white"
        >
          <Upload className="w-4 h-4 mr-2" /> Upload CSV
        </Button>
      </div>
    </div>
  );
}
