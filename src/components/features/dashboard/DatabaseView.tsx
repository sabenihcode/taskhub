"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { RequestTable } from "@/components/features/requests/RequestTable";
import { STATUSES } from "@/types";
import { useDataStore } from "@/store/useDataStore";
import { filterRequests } from "@/firebase/firestore";
import { useLookups } from "@/lib/useLookups";

const ALL = "ALL";

export function DatabaseView() {
  const requests = useDataStore((s) => s.requests);
  const companies = useDataStore((s) => s.companies);
  const users = useDataStore((s) => s.users);
  const isLoading = useDataStore((s) => s.isLoading);
  const { companyName } = useLookups();

  const [companyFilter, setCompanyFilter] = useState(ALL);
  const [picFilter, setPicFilter] = useState(ALL);
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRequests = useMemo(() => {
    // "ALL" diubah jadi undefined, karena filterRequests hanya mengabaikan "All"/kosong
    const base = filterRequests(requests, {
      companyId: companyFilter === ALL ? undefined : companyFilter,
      picId: picFilter === ALL ? undefined : picFilter,
      status: statusFilter === ALL ? undefined : statusFilter,
    });

    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;

    return base.filter((r) =>
      [
        r.requestId,
        r.id,
        r.title,
        r.applicantName,
        r.passportNumber,
        companyName(r.companyId),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [requests, companyFilter, picFilter, statusFilter, searchQuery, companyName]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold uppercase tracking-wide">Request Database</h2>
        <Link href="/create">
          <Button variant="primary">+ Create New Request</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mono-border p-4 bg-gray-50">
        <Field label="Search ID / Applicant">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="TYPE NAME OR ID..."
          />
        </Field>
        <Field label="Company Filter">
          <Select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
            <option value={ALL}>ALL COMPANIES</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="PIC Filter">
          <Select value={picFilter} onChange={(e) => setPicFilter(e.target.value)}>
            <option value={ALL}>ALL PIC</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name || u.email}
                {u.active ? "" : " (inactive)"}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status Filter">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value={ALL}>ALL STATUSES</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {isLoading ? (
        <div className="mono-border p-6 text-center text-xs uppercase font-bold text-gray-500">
          Loading requests...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="mono-border p-6 text-center text-xs uppercase font-bold text-gray-500">
          {requests.length === 0
            ? "No request yet. Create the first one."
            : "No request found matching filters."}
        </div>
      ) : (
        <RequestTable requests={filteredRequests} />
      )}
    </div>
  );
}