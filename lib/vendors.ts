export type Vendor = {
  id: string; // We'll generate a fake ID since the API doesn't seem to have one
  company_name: string;
  country: string;
  compliance_score: number; // Generated client-side
  verified: boolean; // Generated client-side
};

export async function getSortedVendors(
  userCountry?: string | null,
): Promise<Vendor[]> {
  const apiUrl = process.env.NEXT_PUBLIC_VENDOR_API_URL;

  if (!apiUrl) {
    console.error("API URL not defined");
    return [];
  }

  try {
    // 1. Fetch from your External API
    const res = await fetch(apiUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch vendors");

    const rawData = await res.json();

    // 2. Map and Enhance the Data (Add fake ID/Score for UI)
    const vendors: Vendor[] = rawData.map((v: any, index: number) => ({
      id: `ext-${index}`,
      company_name: v.company_name,
      country: v.country,
      compliance_score: Math.floor(Math.random() * (99 - 85 + 1) + 85), // Random score 85-99
      verified: true,
    }));

    // 3. Sort Logic: Local Country First
    if (userCountry) {
      return vendors.sort((a, b) => {
        const aIsLocal = a.country.toLowerCase() === userCountry.toLowerCase();
        const bIsLocal = b.country.toLowerCase() === userCountry.toLowerCase();

        if (aIsLocal && !bIsLocal) return -1;
        if (!aIsLocal && bIsLocal) return 1;
        return a.company_name.localeCompare(b.company_name); // Alphabetical fallback
      });
    }

    return vendors;
  } catch (error) {
    console.error("Vendor fetch error:", error);
    return [];
  }
}
