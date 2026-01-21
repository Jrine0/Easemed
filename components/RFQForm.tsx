"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Send,
  Package,
  Calendar,
  Hash,
  Euro,
  Save,
} from "lucide-react";

type RFQData = {
  id?: string;
  sku: string;
  item_name: string;
  quantity: number;
  target_price: number;
  required_by: string;
};

export function RFQForm({
  onSuccess,
  hospitalName,
  initialData,
}: {
  onSuccess?: () => void;
  hospitalName: string;
  initialData?: RFQData | null;
}) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  // If editing, we update; otherwise we insert.
  const isEditMode = !!initialData?.id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("User session not found. Please login again.");
      return;
    }

    const payload = {
      requester_id: user.id,
      organization_name: hospitalName,
      status: "open",
      sku: formData.get("sku"),
      item_name: formData.get("item_name"),
      quantity: Number(formData.get("quantity")),
      required_by: formData.get("required_by"),
      target_price: Number(formData.get("target_price")) || 0,
    };

    let error;

    if (isEditMode && initialData?.id) {
      // UPDATE existing request
      const { error: updateError } = await supabase
        .from("procurement_requests")
        .update(payload)
        .eq("id", initialData.id);
      error = updateError;
    } else {
      // INSERT new request
      const { error: insertError } = await supabase
        .from("procurement_requests")
        .insert(payload);
      error = insertError;
    }

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
    } else {
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4 bg-white">
      {/* SECTION 1: IDENTIFICATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="sku"
            className="text-sm font-medium text-neutral-700 flex items-center gap-2"
          >
            <Hash className="w-4 h-4 text-teal-600" /> Medicine ID
          </Label>
          <Input
            id="sku"
            name="sku"
            defaultValue={initialData?.sku}
            placeholder="e.g. MED-X-99"
            required
            className="h-11 bg-neutral-50 border-neutral-200 focus:ring-teal-500 font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="item_name"
            className="text-sm font-medium text-neutral-700 flex items-center gap-2"
          >
            <TagIcon className="w-4 h-4 text-teal-600" /> Item Name
          </Label>
          <Input
            id="item_name"
            name="item_name"
            defaultValue={initialData?.item_name}
            placeholder="e.g. Paracetamol 500mg"
            required
            className="h-11 border-neutral-200 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* SECTION 2: REQUIREMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="quantity"
            className="text-sm font-medium text-neutral-700 flex items-center gap-2"
          >
            <Package className="w-4 h-4 text-indigo-600" /> Quantity
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            defaultValue={initialData?.quantity}
            placeholder="1000"
            required
            className="h-11 border-neutral-200 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="target_price"
            className="text-sm font-medium text-neutral-700 flex items-center gap-2"
          >
            <Euro className="w-4 h-4 text-indigo-600" /> Target Price
          </Label>
          <Input
            id="target_price"
            name="target_price"
            type="number"
            step="0.01"
            defaultValue={initialData?.target_price}
            placeholder="0.00"
            className="h-11 border-neutral-200 focus:ring-indigo-500"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="required_by"
            className="text-sm font-medium text-neutral-700 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-red-500" /> Required By
          </Label>
          <Input
            id="required_by"
            name="required_by"
            type="date"
            defaultValue={initialData?.required_by}
            required
            className="h-11 border-neutral-200 focus:ring-red-500 block w-full"
          />
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-neutral-900 hover:bg-black text-white font-medium tracking-wide flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isEditMode ? (
            <Save className="w-4 h-4" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {isEditMode ? "Save Changes" : "Broadcast Request to Network"}
        </Button>
      </div>
    </form>
  );
}

// Simple Icon Helper
function TagIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l5 5c.45.45 1.059.707 1.707.707s1.257-.257 1.707-.707l7-7a2 2 0 0 0 0-2.828l-5-5z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  );
}
