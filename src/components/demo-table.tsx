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
    { id: 1, customer: "Stark Industries", status: "Open", country: "USA", amount: 1200 },
    { id: 2, customer: "Wayne Enterprises", status: "Closed", country: "USA", amount: 900 },
    { id: 3, customer: "Oscorp", status: "Pending", country: "UK", amount: 300 },
    { id: 4, customer: "Hammer Tech", status: "Open", country: "Italy", amount: 700 },
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
        <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
                <thead className="bg-muted/50">
                    <tr className="border-b">
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
                                className="px-3 py-4 text-center text-sm text-muted-foreground"
                            >
                                Nessun risultato. Provi a cambiare i filtri.
                            </td>
                        </tr>
                    ) : (
                        filteredData.map((row) => (
                            <tr
                                key={row.id}
                                className="border-b last:border-b-0 hover:bg-muted/40"
                            >
                                <td className="px-3 py-2">{row.customer}</td>
                                <td className="px-3 py-2">{row.status}</td>
                                <td className="px-3 py-2">{row.country}</td>
                                <td className="px-3 py-2 text-right tabular-nums">
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
        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <div className="flex items-center gap-2">
                <span>{props.label}</span>
                {props.filter}
            </div>
        </th>
    );
}