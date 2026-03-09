"use client";

import { bulkDeleteTransactions } from '@/actions/accounts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { categoryColors } from '@/data/categories';
import useFetch from '@/hooks/use-fetch';
import { format } from 'date-fns';
import {
  ChevronDown, ChevronUp, Clock, MoreHorizontal,
  RefreshCw, Search, Trash, X, ArrowUpRight, ArrowDownRight,
  CalendarDays, Tag, AlignLeft, Hash
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

// ── Row-anchored detail popover ───────────────────────────────────────────────
const TransactionPopover = ({ transaction, anchorEl, onClose }) => {
  const popoverRef = useRef(null);
  const [style, setStyle] = useState({ opacity: 0 });

  useLayoutEffect(() => {
    if (!anchorEl || !popoverRef.current) return;

    const rowRect = anchorEl.getBoundingClientRect();
    const popRect = popoverRef.current.getBoundingClientRect();
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const scrollY = window.scrollY;

    // Vertical: try below row, flip above if not enough space
    let top = rowRect.bottom + scrollY + 6;
    if (rowRect.bottom + popRect.height + 6 > viewportH) {
      top = rowRect.top + scrollY - popRect.height - 6;
    }

    // Horizontal: align to right edge of row, but don't go off-screen
    let left = rowRect.right - popRect.width;
    if (left < 8) left = 8;
    if (left + popRect.width > viewportW - 8) left = viewportW - popRect.width - 8;

    setStyle({ top, left, opacity: 1 });
  }, [anchorEl]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target) &&
          anchorEl && !anchorEl.contains(e.target)) {
        onClose();
      }
    };
    // Small delay so the row click that opened it doesn't immediately close it
    const t = setTimeout(() => document.addEventListener("mousedown", handleClick), 50);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", handleClick); };
  }, [anchorEl, onClose]);

  if (!transaction) return null;
  const isExpense = transaction.type === "EXPENSE";

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 w-80"
      style={{ ...style, transition: "opacity 0.15s ease" }}
    >
      <div className="bg-[#111827] border border-[#1e2d45] rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Top accent stripe */}
        <div className={`h-1 w-full ${isExpense ? "bg-red-500" : "bg-emerald-500"}`} />

        <div className="p-4">
          {/* Amount + close */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">
                {isExpense ? "Expense" : "Income"}
              </p>
              <p className={`text-2xl font-bold ${isExpense ? "text-red-400" : "text-emerald-400"}`}>
                {isExpense ? "-" : "+"}€{transaction.amount.toFixed(2)}
              </p>
            </div>
            <button onClick={onClose} className="text-slate-600 hover:text-slate-300 transition-colors mt-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#1a2235] flex items-center justify-center flex-shrink-0">
                <AlignLeft className="w-3.5 h-3.5 text-[#c9a96e]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Description</p>
                <p className="text-white text-sm leading-snug">{transaction.description || "No description"}</p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#1a2235] flex items-center justify-center flex-shrink-0">
                <Tag className="w-3.5 h-3.5 text-[#c9a96e]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Category</p>
                <span
                  style={{ background: categoryColors[transaction.category] }}
                  className="px-2 py-0.5 rounded text-white text-xs font-medium capitalize"
                >
                  {transaction.category}
                </span>
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#1a2235] flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-3.5 h-3.5 text-[#c9a96e]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Transaction Date</p>
                <p className="text-white text-sm">{format(new Date(transaction.date), "EEE, MMM d, yyyy")}</p>
              </div>
            </div>

            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[#1a2235] flex items-center justify-center flex-shrink-0">
                <Hash className="w-3.5 h-3.5 text-[#c9a96e]" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Created At</p>
                <p className="text-white text-sm">{format(new Date(transaction.createdAt), "MMM d, yyyy · h:mm a")}</p>
              </div>
            </div>

            {transaction.isRecurring && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-md bg-[#1a2235] flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-3.5 h-3.5 text-[#c9a96e]" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Recurring</p>
                  <p className="text-white text-sm">
                    {RECURRING_INTERVALS[transaction.recurringInterval]} · Next:{" "}
                    {format(new Date(transaction.nextRecurringDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#1e2d45]">
            <p className="text-xs text-slate-700 text-center font-mono">
              ID: {transaction.id.slice(0, 20)}...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Table ────────────────────────────────────────────────────────────────
const TransactionTable = ({ transactions }) => {
  const router = useRouter();

  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ field: "date", direction: "desc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const { loading: deleteLoading, fn: deleteFn, data: deleted } = useFetch(bulkDeleteTransactions);

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((t) => t.description?.toLowerCase().includes(lower));
    }
    if (recurringFilter) {
      result = result.filter((t) => recurringFilter === "recurring" ? t.isRecurring : !t.isRecurring);
    }
    if (typeFilter) result = result.filter((t) => t.type === typeFilter);

    result.sort((a, b) => {
      let cmp = 0;
      if (sortConfig.field === "date")     cmp = new Date(a.date) - new Date(b.date);
      if (sortConfig.field === "amount")   cmp = a.amount - b.amount;
      if (sortConfig.field === "category") cmp = a.category.localeCompare(b.category);
      return sortConfig.direction === "asc" ? cmp : -cmp;
    });
    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  const handleSort = (field) => {
    setSortConfig((c) => ({ field, direction: c.field === field && c.direction === "asc" ? "desc" : "asc" }));
  };

  const handleSelect = (id) => {
    setSelectedIds((c) => c.includes(id) ? c.filter((i) => i !== id) : [...c, id]);
  };

  const handleSelectAll = () => {
    setSelectedIds((c) =>
      c.length === filteredAndSortedTransactions.length ? [] : filteredAndSortedTransactions.map((t) => t.id)
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} transactions?`)) return;
    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) toast.success("Transactions deleted successfully");
  }, [deleted, deleteLoading]);

  const handleClearFilters = () => {
    setSearchTerm(""); setTypeFilter(""); setRecurringFilter(""); setSelectedIds([]);
  };

  const handleRowClick = (e, transaction) => {
    if (selectedTransaction?.id === transaction.id) {
      setSelectedTransaction(null);
      setAnchorEl(null);
      return;
    }
    setSelectedTransaction(transaction);
    setAnchorEl(e.currentTarget);
  };

  const truncate = (str, n = 30) => !str ? "—" : str.length > n ? str.slice(0, n) + "…" : str;

  return (
    <div className="space-y-4">
      {deleteLoading && <BarLoader className="mt-4" width={"100%"} color="#c9a96e" />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute h-4 w-4 top-2.5 left-3 text-slate-500" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-[#1a2235] border-[#1e2d45] text-slate-300 placeholder:text-slate-600"
          />
        </div>
        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px] bg-[#1a2235] border-[#1e2d45] text-slate-300">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={recurringFilter} onValueChange={setRecurringFilter}>
            <SelectTrigger className="w-[150px] bg-[#1a2235] border-[#1e2d45] text-slate-300">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">One-time Only</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="gap-1">
              <Trash className="h-3.5 w-3.5" /> Delete ({selectedIds.length})
            </Button>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button variant="ghost" size="icon" onClick={handleClearFilters}
              className="text-slate-500 hover:text-slate-300 border border-[#1e2d45]">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#1e2d45] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#1e2d45] hover:bg-transparent bg-[#0d1117]">
              <TableHead className="w-[40px]">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={selectedIds.length === filteredAndSortedTransactions.length && filteredAndSortedTransactions.length > 0}
                />
              </TableHead>
              <TableHead className="cursor-pointer text-slate-400 hover:text-[#c9a96e] transition-colors w-[110px]" onClick={() => handleSort("date")}>
                <div className="flex items-center gap-1">Date
                  {sortConfig.field === "date" && (sortConfig.direction === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
                </div>
              </TableHead>
              <TableHead className="text-slate-400">Description</TableHead>
              <TableHead className="cursor-pointer text-slate-400 hover:text-[#c9a96e] transition-colors" onClick={() => handleSort("category")}>
                <div className="flex items-center gap-1">Category
                  {sortConfig.field === "category" && (sortConfig.direction === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer text-slate-400 hover:text-[#c9a96e] transition-colors text-right" onClick={() => handleSort("amount")}>
                <div className="flex items-center justify-end gap-1">Amount
                  {sortConfig.field === "amount" && (sortConfig.direction === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
                </div>
              </TableHead>
              <TableHead className="text-slate-400">Type</TableHead>
              <TableHead className="w-[40px]" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow className="border-[#1e2d45]">
                <TableCell colSpan={7} className="text-center text-slate-600 py-10">No transactions found</TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className={`border-[#1e2d45] cursor-pointer transition-colors ${
                    selectedTransaction?.id === transaction.id
                      ? "bg-[#1a2235] border-l-2 border-l-[#c9a96e] relative z-50"
                      : "hover:bg-[#1a2235]/50"
                  }`}
                  onClick={(e) => handleRowClick(e, transaction)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                    />
                  </TableCell>

                  <TableCell className="text-slate-400 text-sm whitespace-nowrap">
                    {format(new Date(transaction.date), "MMM d, yyyy")}
                  </TableCell>

                  <TableCell className="text-slate-300 text-sm max-w-[180px]">
                    <span className="truncate block">{truncate(transaction.description, 28)}</span>
                  </TableCell>

                  <TableCell>
                    <span
                      style={{ background: categoryColors[transaction.category] }}
                      className="px-2 py-0.5 rounded text-white text-xs font-medium capitalize whitespace-nowrap"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>

                  <TableCell className="text-right font-semibold text-sm whitespace-nowrap">
                    <span className={`flex items-center justify-end gap-1 ${transaction.type === "EXPENSE" ? "text-red-400" : "text-emerald-400"}`}>
                      {transaction.type === "EXPENSE" ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
                      €{transaction.amount.toFixed(2)}
                    </span>
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge className="gap-1 bg-[#1a2235] text-[#c9a96e] border border-[#c9a96e]/30 hover:bg-[#1a2235] text-xs">
                              <RefreshCw className="h-3 w-3" />{RECURRING_INTERVALS[transaction.recurringInterval]}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#1a2235] border-[#1e2d45] text-slate-300">
                            Next: {format(new Date(transaction.nextRecurringDate), "MMM d, yyyy")}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge className="gap-1 bg-transparent border border-[#1e2d45] text-slate-500 hover:bg-transparent text-xs">
                        <Clock className="h-3 w-3" />One-time
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-7 w-7 p-0 text-slate-600 hover:text-slate-300 hover:bg-[#1a2235]">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#111827] border-[#1e2d45]">
                        <DropdownMenuItem
                          className="text-slate-300 hover:text-white cursor-pointer"
                          onClick={() => router.push(`/transaction/create?edit=${transaction.id}`)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#1e2d45]" />
                        <DropdownMenuItem
                          className="text-red-400 hover:text-red-300 cursor-pointer"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dim backdrop — covers everything except the popover */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px]"
          onClick={() => { setSelectedTransaction(null); setAnchorEl(null); }}
        />
      )}

      {/* Row-anchored popover */}
      {selectedTransaction && (
        <TransactionPopover
          transaction={selectedTransaction}
          anchorEl={anchorEl}
          onClose={() => { setSelectedTransaction(null); setAnchorEl(null); }}
        />
      )}
    </div>
  );
};

export default TransactionTable;