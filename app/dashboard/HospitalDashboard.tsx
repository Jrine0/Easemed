"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Plus,
  FileText,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Upload,
  Download,
  Trash2,
  Pencil,
  Gavel,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CsvManager } from "@/components/CsvManager";
import { RFQForm } from "@/components/RFQForm";

// --- HELPER: TENDER REVIEW MODAL (For CPO) ---
function TenderReviewModal({
  rfqId,
  rfqName,
}: {
  rfqId: string;
  rfqName: string;
}) {
  const [bids, setBids] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchBids = async () => {
      // Fetch bids joined with vendor name
      const { data, error } = await supabase
        .from("bids")
        .select(`*, vendors(company_name, compliance_score)`)
        .eq("request_id", rfqId);

      if (data) setBids(data);
      setLoading(false);
    };
    if (rfqId) fetchBids();
  }, [rfqId, supabase]);

  const handleDecision = async (
    bidId: string,
    status: "accepted" | "rejected",
  ) => {
    await supabase.from("bids").update({ status }).eq("id", bidId);
    // Update local state to reflect change immediately
    setBids((prev) => prev.map((b) => (b.id === bidId ? { ...b, status } : b)));
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-500">
        Reviewing tenders for: <strong>{rfqName}</strong>
      </p>
      {loading ? (
        <p>Loading tenders...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bids.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No bids received yet.
                </TableCell>
              </TableRow>
            ) : (
              bids.map((bid) => (
                <TableRow
                  key={bid.id}
                  className={bid.status === "accepted" ? "bg-green-50" : ""}
                >
                  <TableCell className="font-medium">
                    {bid.vendors?.company_name}
                  </TableCell>
                  <TableCell>€{bid.amount}</TableCell>
                  <TableCell>{bid.vendors?.compliance_score}%</TableCell>
                  <TableCell className="space-x-2">
                    {bid.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 h-7"
                          onClick={() => handleDecision(bid.id, "rejected")}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 h-7 text-white"
                          onClick={() => handleDecision(bid.id, "accepted")}
                        >
                          Accept
                        </Button>
                      </>
                    ) : (
                      <Badge
                        variant="outline"
                        className={
                          bid.status === "accepted"
                            ? "text-green-700 bg-green-100"
                            : "text-red-700 bg-red-100"
                        }
                      >
                        {bid.status.toUpperCase()}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

// --- 1. HOD DASHBOARD ---
function HODDashboard({ profile }: any) {
  const [requests, setRequests] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchMyRequests = async () => {
      const { data } = await supabase
        .from("internal_requests")
        .select("*")
        .eq("requester_id", profile.id);
      if (data) setRequests(data);
    };
    fetchMyRequests();
  }, [profile.id, supabase]);

  const handleCsvUpload = async (data: any[]) => {
    const enrichedData = data.map((item) => ({
      ...item,
      requester_id: profile.id,
      status: "pending",
    }));
    const { error } = await supabase
      .from("internal_requests")
      .insert(enrichedData);
    if (!error) window.location.reload();
    else alert("Upload failed");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Department Requests
          </h2>
          <p className="text-neutral-500">
            Submit medicine requirements to Procurement.
          </p>
        </div>
        <CsvManager type="internal_request" onUpload={handleCsvUpload} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Request History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.item_name}</TableCell>
                  <TableCell>{r.quantity}</TableCell>
                  <TableCell>
                    {r.status === "pending" && (
                      <Badge
                        variant="outline"
                        className="text-amber-600 bg-amber-50"
                      >
                        Pending
                      </Badge>
                    )}
                    {r.status === "approved" && (
                      <Badge
                        variant="outline"
                        className="text-emerald-600 bg-emerald-50"
                      >
                        Sent to RFQ
                      </Badge>
                    )}
                    {r.status === "rejected" && (
                      <Badge
                        variant="outline"
                        className="text-red-600 bg-red-50"
                      >
                        Rejected
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// --- 2. ANALYST DASHBOARD ---
function AnalystDashboard({
  requests: publicRfqs,
  onNew,
  profile,
  onEdit,
  onDelete,
}: any) {
  const [internalRequests, setInternalRequests] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const loadInbox = async () => {
      const { data } = await supabase
        .from("internal_requests")
        .select("*")
        .eq("status", "pending");
      if (data) setInternalRequests(data);
    };
    loadInbox();
  }, [supabase]);

  const handleAction = async (id: string, action: "approved" | "rejected") => {
    await supabase
      .from("internal_requests")
      .update({ status: action })
      .eq("id", id);
    setInternalRequests((prev) => prev.filter((r) => r.id !== id));
    if (action === "approved")
      alert("Request Approved. Create the Public RFQ in the next tab.");
  };

  const handleRfqCsv = async (data: any[]) => {
    const enriched = data.map((item) => ({
      ...item,
      requester_id: profile.id,
      organization_name: profile.hospital_name,
      status: "open",
    }));
    const { error } = await supabase
      .from("procurement_requests")
      .insert(enriched);
    if (!error) window.location.reload();
  };

  return (
    <Tabs defaultValue="inbox" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="inbox">
          Internal Inbox ({internalRequests.length})
        </TabsTrigger>
        <TabsTrigger value="rfqs">Active Public RFQs</TabsTrigger>
      </TabsList>

      {/* TAB 1: Internal Inbox */}
      <TabsContent value="inbox" className="space-y-6">
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
          <div>
            <h3 className="font-bold text-blue-900">Demand Aggregation</h3>
            <p className="text-sm text-blue-700">
              Review requests from HODs before publishing.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {internalRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center p-8">
                      All caught up!
                    </TableCell>
                  </TableRow>
                ) : (
                  internalRequests.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.department}</TableCell>
                      <TableCell className="font-medium">
                        {r.item_name}
                      </TableCell>
                      <TableCell>{r.quantity}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleAction(r.id, "rejected")}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleAction(r.id, "approved")}
                        >
                          Approve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      {/* TAB 2: Public RFQs (Updated to allow Creating RFQs) */}
      <TabsContent value="rfqs" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Active Market RFQs</h2>
          <div className="flex gap-2">
            <CsvManager type="rfq" onUpload={handleRfqCsv} />
            <Button onClick={onNew} className="bg-neutral-900 text-white">
              <Plus className="w-4 h-4 mr-2" /> Create RFQ
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publicRfqs.map((req: any) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.sku}</TableCell>
                    <TableCell>{req.item_name}</TableCell>
                    <TableCell>€{req.target_price}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(req)}
                      >
                        <Pencil className="w-4 h-4 text-neutral-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(req.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// --- 3. CPO DASHBOARD ---
function CPODashboard({ requests, onEdit, onDelete }: any) {
  // CPO can View/Edit/Delete AND Approve Tenders.

  return (
    <div className="space-y-8">
      <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 mb-6">
        <h2 className="text-2xl font-bold text-purple-900">
          Tender Approval Center
        </h2>
        <p className="text-purple-700">
          Review vendor bids and award contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requests.map((req: any) => (
          <Card
            key={req.id}
            className="border-l-4 border-l-purple-500 shadow-sm"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{req.item_name}</h3>
                  <div className="text-sm text-neutral-500">
                    <p>Qty: {req.quantity}</p>
                    <p>Target: €{req.target_price}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {/* Edit/Delete Actions for CPO */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(req)}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onDelete(req.id)}
                  >
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </div>
              </div>

              {/* TENDER REVIEW DIALOG */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2">
                    <Gavel className="w-4 h-4 mr-2" /> Review Tenders
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-white">
                  <DialogHeader>
                    <DialogTitle>Tender Management</DialogTitle>
                  </DialogHeader>
                  <TenderReviewModal rfqId={req.id} rfqName={req.item_name} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// --- MAIN CONTROLLER ---
export function HospitalDashboard(props: any) {
  const role = props.profile.role;

  // Passing down all props (onEdit, onDelete, onNew) to Analyst and CPO
  if (role === "cpo") return <CPODashboard {...props} />;
  if (role === "head_of_department") return <HODDashboard {...props} />;

  // Default to Analyst
  return <AnalystDashboard {...props} />;
}
