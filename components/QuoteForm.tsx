"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, DollarSign, Calendar, Send } from "lucide-react";

type RequestItem = {
  id: string;
  item_name: string;
  quantity: number;
};

export function QuoteForm({
  request,
  onSuccess,
  vendorEmail,
}: {
  request: RequestItem;
  onSuccess: () => void;
  vendorEmail: string;
}) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // 1. Find the Vendor ID based on the logged-in email
    const { data: vendorData, error: vendorError } = await supabase
      .from("vendors")
      .select("id")
      .eq("email", vendorEmail)
      .single();

    if (vendorError || !vendorData) {
      alert(
        "Error: Could not find your vendor profile. Please contact support.",
      );
      setLoading(false);
      return;
    }

    // 2. Submit the Bid
    const { error: bidError } = await supabase.from("bids").insert({
      request_id: request.id,
      vendor_id: vendorData.id,
      amount: Number(formData.get("amount")),
      delivery_date: formData.get("delivery_date"),
      status: "pending",
    });

    setLoading(false);

    if (bidError) {
      alert(bidError.message);
    } else {
      alert("Quote submitted successfully!");
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4 bg-white">
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100 mb-4">
        <p className="text-sm text-neutral-500 mb-1">Submitting quote for:</p>
        <p className="font-bold text-neutral-900 text-lg">
          {request.item_name}
        </p>
        <p className="text-sm text-neutral-600">Qty: {request.quantity}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Total Offer Amount (€)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              required
              className="pl-9"
              placeholder="5000.00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery_date">Earliest Delivery</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
            <Input
              id="delivery_date"
              name="delivery_date"
              type="date"
              required
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4 mr-2" />
        )}
        Submit Binding Quote
      </Button>
    </form>
  );
}
