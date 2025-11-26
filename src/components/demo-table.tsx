import * as React from "react";
import {
  DataTableFilter,
  type ColumnFilterState,
} from "./data-table-filter";

type Status = "Open" | "Closed" | "Pending";

interface Row {
  id: number;
  customer: string;
  status: Status;
  country: string;
  amount: number;
}

const DATA: Row[] = [
  { id: 1, customer: "Stark Industries",  status: "Open",   country: "USA",     amount: 1200 },
  { id: 2, customer: "Wayne Enterprises", status: "Closed", country: "USA",     amount: 900 },
  { id: 3, customer: "Oscorp",           status: "Pending",country: "UK",      amount: 300 },
  { id: 4, customer: "Hammer Tech",      status: "Open",   country: "Italy",   amount: 700 },
  { id: 5, customer: "Pym Technologies", status: "Closed", country: "Germany", amount: 1500 },
];

const emptyCustomerFilter: ColumnFilterState<string> = {
  selected: [],
  sort: null,
};
const emptyStatusFilter: ColumnFilterState<Status> = {
  selected: [],
  sort: null,
};
const emptyCountryFilter: ColumnFilterState<string> = {
  selected: [],
  sort: null,
};
const emptyAmountFilter: ColumnFilterState<number> = {
  selected: [],
  sort: null,
};

export function DemoTable() {
  const [customerFilter, setCustomerFilter] =
    React.useState<ColumnFilterState<string>>(emptyCustomerFilter);
  const [statusFilter, setStatusFilter] =
    React.useState<ColumnFilterState<Status>>(emptyStatusFilter);
  const [countryFilter, setCountryFilter] =
    React.useState<ColumnFilterState<string>>(emptyCountryFilter);
  const [amountFilter, setAmountFilter] =
    React.useState<ColumnFilterState<number>>(emptyAmountFilter);

  const customerOptions = React.useMemo(
    () => Array.from(new Set(DATA.map((r) => r.customer))),
    [],
  );
  const statusOptions = React.useMemo(
    () => Array.from(new Set(DATA.map((r) => r.status))),
    [],
  );
  const countryOptions = React.useMemo(
    () => Array.from(new Set(DATA.map((r) => r.country))),
    [],
  );
  const amountOptions = React.useMemo(
    () => Array.from(new Set(DATA.map((r) => r.amount))),
    [],
  );

  function applyColumnFilter<T>(
    rows: Row[],
    filter: ColumnFilterState<T>,
    getValue: (row: Row) => T,
    compare?: (a: T, b: T) => number,
  ): Row[] {
    let out = [...rows];

    if (filter.selected.length > 0) {
      const selectedSet = new Set(filter.selected.map((v) => String(v)));
      out = out.filter((row) =>
        selectedSet.has(String(getValue(row))),
      );
    }

    if (filter.sort) {
      const cmp =
        compare ??
        ((a: T, b: T) => String(a).localeCompare(String(b)));
      out.sort((aRow, bRow) => {
        const a = getValue(aRow);
        const b = getValue(bRow);
        const res = cmp(a, b);
        return filter.sort === "asc" ? res : -res;
      });
    }

    return out;
  }

  const filteredData = React.useMemo(() => {
    let rows = [...DATA];

    rows = applyColumnFilter(rows, customerFilter, (r) => r.customer);
    rows = applyColumnFilter(rows, statusFilter, (r) => r.status);
    rows = applyColumnFilter(rows, countryFilter, (r) => r.country);
    rows = applyColumnFilter(
      rows,
      amountFilter,
      (r) => r.amount,
      (a, b) => a - b,
    );

    return rows;
  }, [customerFilter, statusFilter, countryFilter, amountFilter]);

  return (
    <div className="overflow-x-auto rounded-xl border border-cyan-500/30 bg-slate-950/60">
      <table className="w-full text-sm text-sky-50/90">
        <thead className="bg-slate-900/80">
          <tr className="border-b border-cyan-500/30">
            <ThWithFilter
              label="Customer"
              filter={
                <DataTableFilter
                  label="Customer"
                  options={customerOptions}
                  value={customerFilter}
                  onApply={setCustomerFilter}
                  onClear={() => setCustomerFilter(emptyCustomerFilter)}
                  toLabel={(v) => v}
                />
              }
            />
            <ThWithFilter
              label="Status"
              filter={
                <DataTableFilter
                  label="Status"
                  options={statusOptions}
                  value={statusFilter}
                  onApply={setStatusFilter}
                  onClear={() => setStatusFilter(emptyStatusFilter)}
                  toLabel={(v) => v}
                />
              }
            />
            <ThWithFilter
              label="Country"
              filter={
                <DataTableFilter
                  label="Country"
                  options={countryOptions}
                  value={countryFilter}
                  onApply={setCountryFilter}
                  onClear={() => setCountryFilter(emptyCountryFilter)}
                  toLabel={(v) => v}
                />
              }
            />
            <ThWithFilter
              label="Amount"
              filter={
                <DataTableFilter
                  label="Amount"
                  options={amountOptions}
                  value={amountFilter}
                  onApply={setAmountFilter}
                  onClear={() => setAmountFilter(emptyAmountFilter)}
                  toLabel={(v) => v.toString()}
                  sortLabels={{
                    asc: "Smallest → Largest",
                    desc: "Largest → Smallest",
                    none: "No sort",
                  }}
                />
              }
            />
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-3 py-6 text-center text-sm text-slate-400"
              >
                Nessun risultato. Modifichi i filtri per vedere i dati.
              </td>
            </tr>
          ) : (
            filteredData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-800/70 last:border-b-0 hover:bg-slate-900/80 transition-colors"
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-medium">{row.customer}</span>
                    <span className="text-[11px] text-slate-500">
                      #{row.id.toString().padStart(4, "0")}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-3 py-2 text-slate-300">
                  {row.country}
                </td>
                <td className="px-3 py-2 text-right font-mono tabular-nums text-sky-100">
                  {row.amount.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function ThWithFilter(props: { label: string; filter: React.ReactNode }) {
  return (
    <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
      <div className="flex items-center gap-2">
        <span>{props.label}</span>
        {props.filter}
      </div>
    </th>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const base =
    "inline-flex items-center gap-1 rounded-full border px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wide";

  if (status === "Open") {
    return (
      <span
        className={
          base +
          " border-emerald-400/60 bg-emerald-500/10 text-emerald-300"
        }
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Open
      </span>
    );
  }

  if (status === "Closed") {
    return (
      <span
        className={
          base +
          " border-rose-400/60 bg-rose-500/10 text-rose-300"
        }
      >
        <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
        Closed
      </span>
    );
  }

  return (
    <span
      className={
        base +
        " border-amber-400/60 bg-amber-500/10 text-amber-300"
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      Pending
    </span>
  );
}