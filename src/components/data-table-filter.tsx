"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
    CommandEmpty,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown, ArrowUp, Filter as FilterIcon, X } from "lucide-react";

export type SortOrder = "asc" | "desc" | null;

export interface ColumnFilterState<TValue> {
    selected: TValue[];
    sort: SortOrder;
}

export interface DataTableFilterProps<TValue> {
    label: string;
    options: TValue[];
    value: ColumnFilterState<TValue>;
    onApply: (value: ColumnFilterState<TValue>) => void;
    onClear: () => void;
    isActive?: boolean;
    toLabel?: (value: TValue) => string;
    sortLabels?: {
        asc?: string;
        desc?: string;
        none?: string;
    };
}

export function DataTableFilter<TValue>({
    label,
    options,
    value,
    onApply,
    onClear,
    isActive,
    toLabel = (v) => String(v),
    sortLabels,
}: DataTableFilterProps<TValue>) {
    const [open, setOpen] = React.useState(false);

    const [tempSelected, setTempSelected] = React.useState<TValue[]>(value.selected);
    const [tempSort, setTempSort] = React.useState<SortOrder>(value.sort);
    const [search, setSearch] = React.useState("");

    React.useEffect(() => {
        setTempSelected(value.selected);
        setTempSort(value.sort);
    }, [value.selected, value.sort]);

    const normalizedOptions = React.useMemo(() => {
        const seen = new Set<string>();
        const out: TValue[] = [];
        for (const opt of options) {
            const key = toLabel(opt);
            if (!seen.has(key)) {
                seen.add(key);
                out.push(opt);
            }
        }
        return out;
    }, [options, toLabel]);

    const filteredOptions = React.useMemo(() => {
        if (!search.trim()) return normalizedOptions;
        const s = search.toLowerCase();
        return normalizedOptions.filter((opt) =>
            toLabel(opt).toLowerCase().includes(s),
        );
    }, [normalizedOptions, search, toLabel]);

    const toggleOption = (opt: TValue) => {
        const key = toLabel(opt);
        const exists = tempSelected.some((v) => toLabel(v) === key);
        if (exists) {
            setTempSelected((prev) => prev.filter((v) => toLabel(v) !== key));
        } else {
            setTempSelected((prev) => [...prev, opt]);
        }
    };

    const handleApply = () => {
        onApply({ selected: tempSelected, sort: tempSort });
        setOpen(false);
    };

    const handleClear = () => {
        setTempSelected([]);
        setTempSort(null);
        onClear();
        setOpen(false);
    };

    const sortLabel =
        tempSort === "asc"
            ? sortLabels?.asc ?? "A → Z"
            : tempSort === "desc"
                ? sortLabels?.desc ?? "Z → A"
                : sortLabels?.none ?? "No sort";

    const active = isActive ?? (value.selected.length > 0 || value.sort !== null);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                        "relative h-8 w-8 rounded-md border bg-slate-900/80",
                        "border-slate-600/70 text-sky-200",
                        "hover:bg-cyan-500/15 hover:border-cyan-300/80",
                        "transition-all duration-150",
                        active &&
                        "border-cyan-300 bg-cyan-500/15 shadow-[0_0_18px_rgba(34,211,238,0.65)]"
                    )}
                    aria-label={`Filter ${label}`}
                >
                    <FilterIcon className="h-4 w-4" />
                    {active && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.95)]" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="start">
                <div className="border-b px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Filter: {label}
                </div>

                {/* Ricerca + lista valori */}
                <Command shouldFilter={false}>
                    <div className="px-3 pt-2 pb-1">
                        <CommandInput
                            placeholder="Search values…"
                            value={search}
                            onValueChange={setSearch}
                        />
                    </div>
                    <CommandList className="max-h-52">
                        <CommandEmpty>No values found.</CommandEmpty>
                        <ScrollArea className="max-h-52">
                            {filteredOptions.map((opt) => {
                                const lab = toLabel(opt);
                                const checked = tempSelected.some(
                                    (v) => toLabel(v) === lab,
                                );
                                return (
                                    <CommandItem
                                        key={lab}
                                        onSelect={() => toggleOption(opt)}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            checked={checked}
                                            onCheckedChange={() => toggleOption(opt)}
                                        />
                                        <span className="truncate">{lab}</span>
                                    </CommandItem>
                                );
                            })}
                        </ScrollArea>
                    </CommandList>
                </Command>

                {/* Sort + pulsanti */}
                <div className="border-t px-3 py-2 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Sort</span>
                        <div className="flex gap-1">
                            <Button
                                type="button"
                                variant={tempSort === "asc" ? "default" : "outline"}
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                    setTempSort((prev) => (prev === "asc" ? null : "asc"))
                                }
                            >
                                <ArrowUp className="h-3 w-3" />
                            </Button>
                            <Button
                                type="button"
                                variant={tempSort === "desc" ? "default" : "outline"}
                                size="icon"
                                className="h-7 w-7"
                                onClick={() =>
                                    setTempSort((prev) => (prev === "desc" ? null : "desc"))
                                }
                            >
                                <ArrowDown className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="text-[11px] text-muted-foreground">
                        {sortLabel}
                    </div>

                    <div className="flex justify-between gap-2 pt-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={handleClear}
                        >
                            <X className="mr-1 h-3 w-3" />
                            Clear filter
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            className="flex-1 text-xs"
                            onClick={handleApply}
                            disabled={
                                tempSelected.length === value.selected.length &&
                                tempSort === value.sort
                            }
                        >
                            Apply filter
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}