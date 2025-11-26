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
            <PopoverContent
                align="start"
                sideOffset={8}
                className="z-50 w-80 p-0 rounded-xl border border-cyan-500/40
                    bg-slate-950/95 shadow-[0_0_35px_rgba(8,47,73,0.85)]
                    backdrop-blur-xl"
            >
                <div className="flex items-center justify-between
                rounded-t-xl border-b border-cyan-500/40
                bg-slate-900/80 px-4 py-2.5
                text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-200">
                    <span>Filter: {label}</span>
                    <span className="text-[10px] font-mono text-slate-400">STK·HUD</span>
                </div>

                {/* Ricerca + lista valori */}
                <Command
                    shouldFilter={false}
                    className="bg-transparent"
                >
                    <div className="px-4 pt-3 pb-2">
                        <CommandInput
                            placeholder="Search values…"
                            value={search}
                            onValueChange={setSearch}
                            className="h-8 rounded-md border border-slate-700/70 bg-slate-950/70
                 text-xs placeholder:text-slate-500 mb-3 px-3 py-1 text-xs"
                        />
                    </div>
                    <CommandList className="max-h-52 bg-slate-950/80">
                        <CommandEmpty className="px-4 py-2 text-xs text-slate-500">
                            No values found.
                        </CommandEmpty>
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
                                        className="flex items-center gap-2 px-4 py-1.5 text-xs
                       text-sky-100 hover:bg-sky-500/15"
                                    >
                                        <Checkbox
                                            checked={checked}
                                            onCheckedChange={() => toggleOption(opt)}
                                            className="border-slate-500 data-[state=checked]:border-cyan-300
                         data-[state=checked]:bg-cyan-500/80"
                                        />
                                        <span className="truncate">{lab}</span>
                                    </CommandItem>
                                );
                            })}
                        </ScrollArea>
                    </CommandList>
                </Command>

                {/* FOOTER Sort + pulsanti */}
                <div className="border-t border-slate-800/90 bg-slate-950/90 px-4 py-3 space-y-2 rounded-b-xl">
                    <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-300">Sort</span>
                        <div className="flex gap-1">
                            <Button
                                type="button"
                                variant={tempSort === "asc" ? "default" : "outline"}
                                size="icon"
                                className="h-7 w-7 rounded-md border-slate-700/80 bg-slate-900/80
                   hover:bg-sky-500/20"
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
                                className="h-7 w-7 rounded-md border-slate-700/80 bg-slate-900/80
                   hover:bg-sky-500/20"
                                onClick={() =>
                                    setTempSort((prev) => (prev === "desc" ? null : "desc"))
                                }
                            >
                                <ArrowDown className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div className="text-[11px] text-slate-500">
                        {sortLabel}
                    </div>

                    <div className="flex justify-between gap-2 pt-1">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="flex-1 text-[11px] justify-start text-slate-300 hover:bg-rose-500/10"
                            onClick={handleClear}
                        >
                            <X className="mr-1 h-3 w-3" />
                            Clear filter
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            className="flex-1 text-[11px] justify-center bg-cyan-600 hover:bg-cyan-500"
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