import { InsurancePolicy } from "@/components/Financiamiento/types";

export async function fetchPolicies(): Promise<InsurancePolicy[]> {
  const response = await fetch("/api/financiamiento");
  if (!response.ok) {
    throw new Error("Failed to fetch insurance policies");
  }
  return response.json();
}

export async function createPolicy(
  policy: Omit<InsurancePolicy, "_id" | "createdAt" | "updatedAt">
): Promise<InsurancePolicy> {
  const response = await fetch("/api/financiamiento", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(policy),
  });
  if (!response.ok) {
    throw new Error("Failed to create insurance policy");
  }
  return response.json();
}

export async function updatePolicy(
  policy: InsurancePolicy
): Promise<InsurancePolicy> {
  const response = await fetch(`/api/financiamiento?id=${policy._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(policy),
  });
  if (!response.ok) {
    throw new Error("Failed to update insurance policy");
  }
  return response.json();
}

export async function deletePolicy(id: string): Promise<void> {
  const response = await fetch(`/api/financiamiento?id=${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete insurance policy");
  }
}

export async function fetchClients(): Promise<any[]> {
  const response = await fetch("/api/client");
  if (!response.ok) {
    throw new Error("Failed to fetch clients");
  }
  return response.json();
}
