// "use client";

// import { useState } from "react";
// import {
//   Plus,
//   FileText,
//   Pencil,
//   Trash2,
//   Package,
//   Calendar,
//   Euro,
//   Search,
//   Filter,
//   MapPin,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { RFQForm } from "@/components/RFQForm";

// // --- 1. VENDOR DIRECTORY (Using External API Data) ---
// function VendorDirectory({
//   vendors,
//   userCountry,
// }: {
//   vendors: any[];
//   userCountry: string | null;
// }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("default");

//   const filteredVendors = vendors
//     .filter(
//       (v) =>
//         v.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         v.country.toLowerCase().includes(searchTerm.toLowerCase()),
//     )
//     .sort((a, b) => {
//       if (sortBy === "name")
//         return a.company_name.localeCompare(b.company_name);
//       if (sortBy === "country") return a.country.localeCompare(b.country);

//       // Default: Local country first
//       const aLocal = a.country === userCountry;
//       const bLocal = b.country === userCountry;
//       if (aLocal && !bLocal) return -1;
//       if (!aLocal && bLocal) return 1;
//       return 0;
//     });

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       {/* Filters Bar */}
//       <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
//         <div className="relative w-full sm:w-96">
//           <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
//           <Input
//             placeholder="Search vendors..."
//             className="pl-9 bg-neutral-50"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="flex items-center gap-2 w-full sm:w-auto">
//           <Filter className="w-4 h-4 text-neutral-500" />
//           <Select onValueChange={setSortBy} defaultValue="default">
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Sort By" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="default">Relevance (Local First)</SelectItem>
//               <SelectItem value="name">Company Name (A-Z)</SelectItem>
//               <SelectItem value="country">Country (A-Z)</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>
//       </div>

//       {/* Directory Table */}
//       <Card>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader className="bg-neutral-50">
//               <TableRow>
//                 <TableHead className="w-[400px]">Company Name</TableHead>
//                 <TableHead>Location</TableHead>
//                 <TableHead>Compliance Estimate</TableHead>
//                 <TableHead className="text-right">Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredVendors.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={4}
//                     className="h-24 text-center text-neutral-500"
//                   >
//                     No vendors found.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 filteredVendors.map((v) => (
//                   <TableRow key={v.id || v.company_name}>
//                     <TableCell className="font-bold text-neutral-900">
//                       {v.company_name}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         {v.country === userCountry ? (
//                           <Badge
//                             variant="secondary"
//                             className="bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200"
//                           >
//                             <MapPin className="w-3 h-3 mr-1" /> Local
//                           </Badge>
//                         ) : (
//                           <span className="text-neutral-600">{v.country}</span>
//                         )}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <div className="w-24 bg-neutral-200 rounded-full h-1.5 overflow-hidden">
//                           <div
//                             className="bg-teal-600 h-1.5 rounded-full"
//                             style={{ width: `${v.compliance_score}%` }}
//                           ></div>
//                         </div>
//                         <span className="text-xs text-neutral-500">
//                           {v.compliance_score}%
//                         </span>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="h-7 text-xs"
//                       >
//                         View Profile
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// // --- 2. ANALYST VIEW (Operational) ---
// function AnalystDashboard({
//   requests,
//   onEdit,
//   onDelete,
//   onNew,
//   isDialogOpen,
//   setIsDialogOpen,
//   editingRequest,
//   profile,
//   onFormSuccess,
// }: any) {
//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       {/* HEADER WITH THE "ADD RFQ" BUTTON */}
//       <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-b border-neutral-200 pb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-neutral-900">
//             Procurement Overview
//           </h2>
//           <p className="text-neutral-500">
//             Manage your active requests and sourcing.
//           </p>
//         </div>

//         {/* HERE IS THE BUTTON YOU ASKED FOR */}
//         <Button
//           onClick={onNew}
//           className="bg-neutral-900 hover:bg-black text-white px-6 py-6 text-md shadow-md transition-all"
//         >
//           <Plus className="w-5 h-5 mr-2" />
//           Create New RFQ
//         </Button>
//       </div>

//       {/* KPI Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardContent className="p-6 flex items-center gap-4">
//             <div className="p-3 bg-neutral-100 rounded-full">
//               <FileText className="w-6 h-6 text-neutral-600" />
//             </div>
//             <div>
//               <h3 className="font-bold text-2xl">{requests.length}</h3>
//               <p className="text-sm text-neutral-500">Active RFQs</p>
//             </div>
//           </CardContent>
//         </Card>
//         {/* Add more KPIs here if needed */}
//       </div>

//       {/* RFQ TABLE */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="font-serif">Active Requests</CardTitle>
//         </CardHeader>
//         <CardContent className="p-0">
//           <Table>
//             <TableHeader className="bg-neutral-50">
//               <TableRow>
//                 <TableHead>Medicine ID</TableHead>
//                 <TableHead>Item Name</TableHead>
//                 <TableHead>Qty</TableHead>
//                 <TableHead>Target</TableHead>
//                 <TableHead>Required By</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {requests.length === 0 ? (
//                 <TableRow>
//                   <TableCell
//                     colSpan={6}
//                     className="h-32 text-center text-neutral-500"
//                   >
//                     No active requests. Click the black button above to create
//                     one.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 requests.map((req: any) => (
//                   <TableRow key={req.id}>
//                     <TableCell className="font-mono text-xs text-neutral-500">
//                       {req.sku || "N/A"}
//                     </TableCell>
//                     <TableCell className="font-medium text-neutral-900">
//                       {req.item_name}
//                     </TableCell>
//                     <TableCell>{req.quantity}</TableCell>
//                     <TableCell>€{req.target_price}</TableCell>
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <Calendar className="w-3 h-3 text-neutral-400" />
//                         {new Date(req.required_by).toLocaleDateString()}
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex items-center justify-end gap-2">
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8 hover:bg-neutral-100"
//                           onClick={() => onEdit(req)}
//                         >
//                           <Pencil className="w-4 h-4 text-neutral-500" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8 hover:bg-red-50"
//                           onClick={() => onDelete(req.id)}
//                         >
//                           <Trash2 className="w-4 h-4 text-neutral-400 hover:text-red-600" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       {/* Hidden Dialog Controller */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-[650px] bg-white">
//           <DialogHeader>
//             <DialogTitle className="font-serif text-2xl">
//               {editingRequest
//                 ? "Edit Procurement Request"
//                 : "New Procurement Request"}
//             </DialogTitle>
//           </DialogHeader>
//           <RFQForm
//             hospitalName={profile.hospital_name || "Unknown"}
//             onSuccess={onFormSuccess}
//             initialData={editingRequest}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// // 3. CPO VIEW
// function CPODashboard({ requests }: any) {
//   const totalSpend = requests.reduce(
//     (acc: number, r: any) => acc + r.target_price * r.quantity,
//     0,
//   );

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 mb-6">
//         <h2 className="text-2xl font-bold text-purple-900">
//           Executive Overview
//         </h2>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card className="border-t-4 border-t-purple-600 shadow-sm">
//           <CardContent className="p-6">
//             <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
//               Pipeline Value
//             </p>
//             <h3 className="text-3xl font-bold text-neutral-900 mt-2">
//               €{totalSpend.toLocaleString()}
//             </h3>
//           </CardContent>
//         </Card>
//         <Card className="border-t-4 border-t-emerald-500 shadow-sm">
//           <CardContent className="p-6">
//             <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
//               Requests
//             </p>
//             <h3 className="text-3xl font-bold text-neutral-900 mt-2">
//               {requests.length}
//             </h3>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// // 4. DIRECTOR VIEW
// function DirectorDashboard({ requests }: any) {
//   return <CPODashboard requests={requests} />;
// }

// // --- MAIN CONTROLLER COMPONENT ---
// export function HospitalDashboard(props: any) {
//   const role = props.profile.role;

//   // Role Routing
//   let DashboardView = AnalystDashboard;
//   if (role === "cpo") DashboardView = CPODashboard;
//   if (role === "sourcing_director") DashboardView = DirectorDashboard;

//   return (
//     <Tabs defaultValue="overview" className="w-full">
//       <div className="flex items-center justify-between mb-6">
//         <TabsList className="bg-neutral-100 p-1 h-auto">
//           <TabsTrigger value="overview" className="px-4 py-2">
//             My Dashboard
//           </TabsTrigger>
//           <TabsTrigger value="vendors" className="px-4 py-2">
//             Vendor Directory
//           </TabsTrigger>
//         </TabsList>
//       </div>

//       <TabsContent value="overview">
//         <DashboardView {...props} />
//       </TabsContent>

//       <TabsContent value="vendors">
//         <VendorDirectory
//           vendors={props.vendors}
//           userCountry={props.profile.country}
//         />
//       </TabsContent>
//     </Tabs>
//   );
// }

"use client";

import { useState } from "react";
import {
  Plus,
  FileText,
  Pencil,
  Trash2,
  Calendar,
  Search,
  Filter,
  MapPin,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RFQForm } from "@/components/RFQForm";

// --- 1. VENDOR DIRECTORY TAB (With API Data & Filters) ---
function VendorDirectory({
  vendors,
  userCountry,
}: {
  vendors: any[];
  userCountry: string | null;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const filteredVendors = vendors
    .filter(
      (v) =>
        v.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.country.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "name")
        return a.company_name.localeCompare(b.company_name);
      if (sortBy === "country") return a.country.localeCompare(b.country);

      // Default: Local country first
      const aLocal = a.country === userCountry;
      const bLocal = b.country === userCountry;
      if (aLocal && !bLocal) return -1;
      if (!aLocal && bLocal) return 1;
      return 0;
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <Input
            placeholder="Search vendors by name or country..."
            className="pl-9 bg-neutral-50 border-neutral-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-neutral-500" />
          <Select onValueChange={setSortBy} defaultValue="default">
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Relevance (Local First)</SelectItem>
              <SelectItem value="name">Company Name (A-Z)</SelectItem>
              <SelectItem value="country">Country (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Directory Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead className="w-[30%]">Company Name</TableHead>
                <TableHead className="w-[20%]">Location</TableHead>
                <TableHead className="w-[20%]">Compliance Estimate</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-neutral-500"
                  >
                    No vendors found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((v) => (
                  <TableRow key={v.id || v.company_name}>
                    <TableCell className="font-bold text-neutral-900">
                      {v.company_name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {v.country === userCountry ? (
                          <Badge
                            variant="secondary"
                            className="bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200 font-normal"
                          >
                            <MapPin className="w-3 h-3 mr-1" /> Local
                          </Badge>
                        ) : (
                          <span className="text-neutral-600 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-300"></span>
                            {v.country}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-neutral-100 rounded-full h-2 overflow-hidden border border-neutral-200">
                          <div
                            className="bg-teal-600 h-full rounded-full"
                            style={{ width: `${v.compliance_score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-neutral-600">
                          {v.compliance_score}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// --- 2. ANALYST VIEW (The Operational Dashboard) ---
function AnalystDashboard({
  requests,
  onEdit,
  onDelete,
  onNew,
  isDialogOpen,
  setIsDialogOpen,
  editingRequest,
  profile,
  onFormSuccess,
}: any) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 pb-2">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
            Procurement Overview
          </h2>
          <p className="text-neutral-500">
            Manage active requests and monitor sourcing status.
          </p>
        </div>

        <Button
          onClick={onNew}
          className="bg-neutral-900 hover:bg-black text-white px-5 py-6 shadow-md transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New RFQ
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-neutral-200">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-neutral-100 rounded-lg">
              <FileText className="w-6 h-6 text-neutral-600" />
            </div>
            <div>
              <h3 className="font-bold text-2xl text-neutral-900">
                {requests.length}
              </h3>
              <p className="text-sm text-neutral-500">Active Requests</p>
            </div>
          </CardContent>
        </Card>
        {/* You can add more KPIs here later (Total Spend, Pending Bids, etc) */}
      </div>

      {/* THE RFQ TABLE */}
      <Card className="shadow-sm border-neutral-200">
        <CardHeader className="bg-neutral-50/50 border-b border-neutral-100 py-4">
          <CardTitle className="font-serif text-lg">
            Active Requests Table
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Medicine ID (SKU)</TableHead>
                <TableHead>Item Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Target Price</TableHead>
                <TableHead>Required By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-500">
                      <FileText className="w-8 h-8 mb-2 text-neutral-300" />
                      <p>No active requests found.</p>
                      <Button
                        variant="link"
                        onClick={onNew}
                        className="text-indigo-600 mt-1"
                      >
                        Create your first RFQ
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req: any) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs text-neutral-500 font-medium">
                      {req.sku || "N/A"}
                    </TableCell>
                    <TableCell className="font-medium text-neutral-900">
                      {req.item_name}
                    </TableCell>
                    <TableCell>{req.quantity.toLocaleString()}</TableCell>
                    <TableCell>€{req.target_price.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(req.required_by).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="w-4 h-4 text-neutral-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(req)}>
                            <Pencil className="w-4 h-4 mr-2" /> Edit Request
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(req.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[650px] bg-white">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">
              {editingRequest
                ? "Edit Procurement Request"
                : "New Procurement Request"}
            </DialogTitle>
          </DialogHeader>
          <RFQForm
            hospitalName={profile.hospital_name || "Unknown"}
            onSuccess={onFormSuccess}
            initialData={editingRequest}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// --- 3. CPO VIEW (Strategic) ---
function CPODashboard({ requests }: any) {
  const totalSpend = requests.reduce(
    (acc: number, r: any) => acc + r.target_price * r.quantity,
    0,
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 mb-2">
        <h2 className="text-2xl font-bold text-purple-900 font-serif">
          Executive Overview
        </h2>
        <p className="text-purple-700">
          Financial health and procurement efficiency metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-t-4 border-t-purple-600 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
              Total Pipeline Value
            </p>
            <h3 className="text-3xl font-bold text-neutral-900 mt-2">
              €{totalSpend.toLocaleString()}
            </h3>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-t-emerald-500 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-neutral-500 uppercase tracking-wide">
              Active Requests
            </p>
            <h3 className="text-3xl font-bold text-neutral-900 mt-2">
              {requests.length}
            </h3>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- 4. DIRECTOR VIEW ---
function DirectorDashboard({ requests }: any) {
  return <CPODashboard requests={requests} />;
}

// --- MAIN CONTROLLER COMPONENT ---
export function HospitalDashboard(props: any) {
  const role = props.profile.role;

  // Determine Dashboard View
  let DashboardView = AnalystDashboard;
  if (role === "cpo") DashboardView = CPODashboard;
  if (role === "sourcing_director") DashboardView = DirectorDashboard;

  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        {/* Tabs Navigation */}
        <TabsList className="bg-neutral-100 p-1 h-auto self-start">
          <TabsTrigger value="overview" className="px-6 py-2">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="vendors" className="px-6 py-2">
            Vendor Directory
          </TabsTrigger>
        </TabsList>

        {/* User Context (Optional right side info) */}
        <div className="hidden sm:block text-xs text-neutral-400 font-medium">
          Viewing as {props.profile.role?.replace("_", " ")}
        </div>
      </div>

      <TabsContent value="overview" className="mt-0">
        <DashboardView {...props} />
      </TabsContent>

      <TabsContent value="vendors" className="mt-0">
        <VendorDirectory
          vendors={props.vendors}
          userCountry={props.profile.country}
        />
      </TabsContent>
    </Tabs>
  );
}
