"use client";

import { useEffect, useMemo, useState } from "react";
import {
    CalendarDays,
    MapPin,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    Trash2,
} from "lucide-react";
import { PageContainer, PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store/hook";
import type {
    IRetreatBatch,
    IRetreatLocation,
    RetreatBatchStatus,
    RetreatLocationStatus,
} from "@/lib/features/retreat/retreatTypes";
import {
    RETREAT_BATCH_STATUSES,
    RETREAT_LOCATION_STATUSES,
} from "@/lib/features/retreat/retreatTypes";
import {
    cardClass,
    inputClass,
    mutedTextClass,
    outlineButtonClass,
    pageBgClass,
    primaryButtonClass,
    tabButtonClass,
} from "./Retreatdesigntokens";
import {
    BatchStatusBadge,
    LocationStatusBadge,
} from "@/components/invictus/management/retreat/Retreatstatusbadges";
// import LocationFormDialog from "@/components/invictus/management/retreat/Locationformdialog";
// import BatchFormDialog from "@/components/invictus/management/retreat/Batchformdialog";
// import DeleteConfirmDialog from "@/components/invictus/management/retreat/Deleteconfirmdialog";
import {
    deleteRetreatBatch,
    deleteRetreatLocation,
    fetchRetreatBatches,
    fetchRetreatLocations,
    selectRetreatBatches,
    selectRetreatBatchesMeta,
    selectRetreatError,
    selectRetreatLocations,
    selectRetreatLocationsMeta,
    selectRetreatStatus,
} from "@/lib/features/retreat/retreatSlice";
import { PaginationControl } from "@/components/ui/PaginationControll";
import dynamic from "next/dynamic";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const LocationFormDialog = dynamic(
    () => import("@/components/invictus/management/retreat/Locationformdialog"),
    {
        ssr: false,
    },
);

const BatchFormDialog = dynamic(
    () => import("@/components/invictus/management/retreat/Batchformdialog"),
    {
        ssr: false,
    },
);

const DeleteConfirmDialog = dynamic(
    () =>
        import("@/components/invictus/management/retreat/Deleteconfirmdialog"),
    {
        ssr: false,
    },
);

function formatDate(iso: string) {
    return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
    }).format(new Date(iso));
}

function formatMoney(amount: number, currency: string) {
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase(),
        }).format(amount);
    } catch {
        return `${amount} ${currency.toUpperCase()}`;
    }
}

/** Safely resolve batch.retreatLocation to an id (handles string | object | null). */
function getBatchLocationId(
    retreatLocation: IRetreatBatch["retreatLocation"] | null | undefined,
): string | null {
    if (typeof retreatLocation === "string") return retreatLocation;
    if (
        retreatLocation &&
        typeof retreatLocation === "object" &&
        "_id" in retreatLocation
    ) {
        return retreatLocation._id;
    }
    return null;
}

/** Safely resolve a display label for batch.retreatLocation. */
function getBatchLocationLabel(
    retreatLocation: IRetreatBatch["retreatLocation"] | null | undefined,
    locations: IRetreatLocation[],
): string {
    if (typeof retreatLocation === "string") {
        return locations.find((l) => l._id === retreatLocation)?.title ?? "—";
    }
    if (
        retreatLocation &&
        typeof retreatLocation === "object" &&
        "title" in retreatLocation
    ) {
        return retreatLocation.title;
    }
    return "—";
}

type Tab = "locations" | "batches";

export default function RetreatManagementPage() {
    const dispatch = useAppDispatch();

    const [tab, setTab] = useState<Tab>("locations");

    const locations = useAppSelector(selectRetreatLocations);
    const locationsMeta = useAppSelector(selectRetreatLocationsMeta);
    const batches = useAppSelector(selectRetreatBatches);
    const batchesMeta = useAppSelector(selectRetreatBatchesMeta);
    const status = useAppSelector(selectRetreatStatus);
    const error = useAppSelector(selectRetreatError);

    const [locationPage, setLocationPage] = useState(1);
    const [batchPage, setBatchPage] = useState(1);

    const PAGE_SIZE = 10;

    // ---- Locations tab state ----
    const [locationSearch, setLocationSearch] = useState("");
    const [locationStatusFilter, setLocationStatusFilter] = useState<
        RetreatLocationStatus | "all"
    >("all");
    const [locationFormOpen, setLocationFormOpen] = useState(false);
    const [editingLocation, setEditingLocation] =
        useState<IRetreatLocation | null>(null);
    const [deletingLocation, setDeletingLocation] =
        useState<IRetreatLocation | null>(null);

    // ---- Batches tab state ----
    const [batchLocationFilter, setBatchLocationFilter] = useState<
        string | "all"
    >("all");
    const [batchStatusFilter, setBatchStatusFilter] = useState<
        RetreatBatchStatus | "all"
    >("all");
    const [batchFormOpen, setBatchFormOpen] = useState(false);
    const [editingBatch, setEditingBatch] = useState<IRetreatBatch | null>(
        null,
    );
    const [deletingBatch, setDeletingBatch] = useState<IRetreatBatch | null>(
        null,
    );

    const loadLocations = (page = locationPage) => {
        dispatch(
            fetchRetreatLocations({
                page,
                limit: PAGE_SIZE,
                ...(locationStatusFilter !== "all"
                    ? { status: locationStatusFilter }
                    : {}),
                ...(locationSearch.trim()
                    ? { search: locationSearch.trim() }
                    : {}),
            }),
        );
    };

    const loadBatches = (page = batchPage) => {
        dispatch(
            fetchRetreatBatches({
                page,
                limit: PAGE_SIZE,
                includePast: true,
                ...(batchLocationFilter !== "all"
                    ? { locationId: batchLocationFilter }
                    : {}),
                ...(batchStatusFilter !== "all"
                    ? { status: batchStatusFilter }
                    : {}),
            }),
        );
    };

    const filteredLocations = useMemo(() => {
        const value = locationSearch.trim().toLowerCase();
        if (!value) return locations;
        return locations.filter(
            (location) =>
                location.title.toLowerCase().includes(value) ||
                location.city.toLowerCase().includes(value) ||
                location.country.toLowerCase().includes(value),
        );
    }, [locations, locationSearch]);

    const filteredBatches = useMemo(() => {
        return batches.filter((batch) => {
            const locationId = getBatchLocationId(batch.retreatLocation);

            const matchesLocation =
                batchLocationFilter === "all" ||
                (locationId !== null && locationId === batchLocationFilter);

            const matchesStatus =
                batchStatusFilter === "all" ||
                batch.status === batchStatusFilter;

            return matchesLocation && matchesStatus;
        });
    }, [batches, batchLocationFilter, batchStatusFilter]);

    const handleDeleteLocation = async () => {
        if (!deletingLocation) return;
        const result = await dispatch(
            deleteRetreatLocation(deletingLocation._id),
        );
        if (deleteRetreatLocation.fulfilled.match(result)) {
            setDeletingLocation(null);
        }
    };

    const handleDeleteBatch = async () => {
        if (!deletingBatch) return;
        const result = await dispatch(deleteRetreatBatch(deletingBatch._id));
        if (deleteRetreatBatch.fulfilled.match(result)) {
            setDeletingBatch(null);
        }
    };

    useEffect(() => {
        dispatch(fetchRetreatLocations({ limit: PAGE_SIZE, page: 1 }));
        dispatch(
            fetchRetreatBatches({
                limit: PAGE_SIZE,
                page: 1,
                includePast: true,
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Optional: reset to page 1 when filters change
    useEffect(() => {
        setLocationPage(1);
        loadLocations(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locationStatusFilter]);

    useEffect(() => {
        setBatchPage(1);
        loadBatches(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [batchLocationFilter, batchStatusFilter]);

    return (
        <div className={pageBgClass}>
            <PageContainer variant="invictus">
                <PageHeader
                    title="Manage retreats"
                    description="Create and maintain retreat locations and their bookable batches."
                    variant="invictus"
                />

                {/* Tabs */}
                <div className="mt-6 flex gap-2">
                    <button
                        type="button"
                        onClick={() => setTab("locations")}
                        className={tabButtonClass(tab === "locations")}
                    >
                        <MapPin className="mr-1.5 inline h-4 w-4" />
                        Locations
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("batches")}
                        className={tabButtonClass(tab === "batches")}
                    >
                        <CalendarDays className="mr-1.5 inline h-4 w-4" />
                        Batches
                    </button>
                </div>

                {error && (
                    <div className="mt-4 rounded-lg border border-[#F0D3CE] bg-[#FCEEEC] px-4 py-3 text-sm text-[#B3413E]">
                        {error}
                    </div>
                )}

                {/* ---------------- Locations tab ---------------- */}
                {tab === "locations" && (
                    <>
                        <div className="mt-6 space-y-4">
                            <Card className={cardClass}>
                                <CardContent className="p-4">
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#B0A996]" />
                                            <Input
                                                value={locationSearch}
                                                onChange={(event) =>
                                                    setLocationSearch(
                                                        event.target.value,
                                                    )
                                                }
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter") {
                                                        loadLocations();
                                                    }
                                                }}
                                                placeholder="Search by title, city, or country..."
                                                className={`pl-9 ${inputClass}`}
                                            />
                                        </div>

                                        <div className="lg:w-[180px]">
                                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#9C9284]">
                                                Status
                                            </label>
                                            <Select
                                                value={locationStatusFilter}
                                                onValueChange={(value) =>
                                                    setLocationStatusFilter(
                                                        value as
                                                            | RetreatLocationStatus
                                                            | "all",
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-9 w-full rounded-md border-[#E9E2D2] bg-white text-sm text-[#1C1A16] focus-visible:border-[#C6A34A]">
                                                    <SelectValue placeholder="All statuses"  className={"capitalize"}/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all" className={"capitalize"} >
                                                        All statuses
                                                    </SelectItem>
                                                    {RETREAT_LOCATION_STATUSES.map(
                                                        (s) => (
                                                            <SelectItem
                                                                key={s}
                                                                value={s}
                                                            >
                                                                {s[0].toUpperCase() +
                                                                    s.slice(1)}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                loadLocations(locationPage)
                                            }
                                            disabled={
                                                status.locationsList ===
                                                "loading"
                                            }
                                            className={outlineButtonClass}
                                        >
                                            <RefreshCw
                                                className={`mr-2 h-4 w-4 ${
                                                    status.locationsList ===
                                                    "loading"
                                                        ? "animate-spin"
                                                        : ""
                                                }`}
                                            />
                                            Refresh
                                        </Button>

                                        <Button
                                            onClick={() => {
                                                setEditingLocation(null);
                                                setLocationFormOpen(true);
                                            }}
                                            className={primaryButtonClass}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add location
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card
                                className={`overflow-hidden border border-gold-soft`}
                            >
                                <CardHeader className="border-b border-[#E9E2D2]">
                                    <CardTitle className="text-base p-5 text-[#1C1A16]">
                                        Retreat locations
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[900px]">
                                            <thead>
                                                <tr className="border-b border-[#E9E2D2] bg-[#FAF6EE] text-left text-xs uppercase tracking-wide text-[#9C9284]">
                                                    <th className="px-6 py-4">
                                                        Title
                                                    </th>
                                                    <th className="px-6 py-4">
                                                        Location
                                                    </th>
                                                    <th className="px-6 py-4">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-4">
                                                        Featured
                                                    </th>
                                                    <th className="px-6 py-4">
                                                        Order
                                                    </th>
                                                    <th className="px-6 py-4 text-right">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {status.locationsList ===
                                                "loading" ? (
                                                    <tr>
                                                        <td
                                                            colSpan={6}
                                                            className="px-6 py-10 text-center text-sm text-[#B0A996]"
                                                        >
                                                            Loading locations...
                                                        </td>
                                                    </tr>
                                                ) : filteredLocations.length ===
                                                  0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan={6}
                                                            className="px-6 py-16 text-center"
                                                        >
                                                            <MapPin className="mx-auto h-10 w-10 text-[#DCD3BF]" />
                                                            <p className="mt-3 font-medium text-[#4A4539]">
                                                                No retreat
                                                                locations found
                                                            </p>
                                                            <p
                                                                className={`mt-1 ${mutedTextClass}`}
                                                            >
                                                                Try adjusting
                                                                your search or
                                                                add a new
                                                                location.
                                                            </p>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredLocations.map(
                                                        (location) => (
                                                            <tr
                                                                key={
                                                                    location._id
                                                                }
                                                                className="border-b border-[#F0EBDE] last:border-0  hover:bg-[#FAF6EE]/60"
                                                            >
                                                                <td className="px-6 py-4">
                                                                    <p className="font-medium text-[#1C1A16]">
                                                                        {
                                                                            location.title
                                                                        }
                                                                    </p>
                                                                    <p className="text-xs text-[#B0A996]">
                                                                        /
                                                                        {
                                                                            location.slug
                                                                        }
                                                                    </p>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-[#4A4539]">
                                                                    {
                                                                        location.city
                                                                    }
                                                                    ,{" "}
                                                                    {
                                                                        location.country
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <LocationStatusBadge
                                                                        status={
                                                                            location.status
                                                                        }
                                                                    />
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-[#4A4539]">
                                                                    {location.isFeatured
                                                                        ? "Yes"
                                                                        : "—"}
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-[#4A4539]">
                                                                    {
                                                                        location.order
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex justify-end gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="rounded-full  aspect-square"
                                                                            onClick={() => {
                                                                                setEditingLocation(
                                                                                    location,
                                                                                );
                                                                                setLocationFormOpen(
                                                                                    true,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Pencil className="h-4 w-4 " />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() =>
                                                                                setDeletingLocation(
                                                                                    location,
                                                                                )
                                                                            }
                                                                            className="text-[#B3413E] hover:text-[#9C3733] rounded-full aspect-square"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    {locationsMeta && (
                                        <div className="border-t border-[#E9E2D2] px-6 py-3 text-sm text-[#8A8375]">
                                            {locationsMeta.total} location
                                            {locationsMeta.total === 1
                                                ? ""
                                                : "s"}{" "}
                                            total
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {locationsMeta && locationsMeta.totalPages > 1 && (
                            <div className="border-t border-[#E9E2D2] px-6 py-3">
                                <PaginationControl
                                    currentPage={locationPage}
                                    totalPages={locationsMeta.totalPages}
                                    variant="light"
                                    onPageChange={(page) => {
                                        setLocationPage(page);
                                        loadLocations(page);
                                    }}
                                />
                            </div>
                        )}
                    </>
                )}

                {/* ---------------- Batches tab ---------------- */}
                {tab === "batches" && (
                    <>
                        <div className="mt-6 space-y-4">
                            <Card className={cardClass}>
                                <CardContent className="p-4">
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
                                        <div className="flex-1">
                                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#9C9284]">
                                                Location
                                            </label>
                                            <Select
                                                value={batchLocationFilter}
                                                onValueChange={(value) =>
                                                    setBatchLocationFilter(
                                                        value!,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-9 w-full rounded-md border-[#E9E2D2] bg-white text-sm text-[#1C1A16] focus-visible:border-[#C6A34A]">
                                                    <SelectValue placeholder="All locations" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        All locations
                                                    </SelectItem>
                                                    {locations.map((loc) => (
                                                        <SelectItem
                                                            key={loc._id}
                                                            value={loc._id}
                                                        >
                                                            {loc.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="lg:w-[180px]">
                                            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#9C9284]">
                                                Status
                                            </label>
                                            <Select
                                                value={batchStatusFilter}
                                                onValueChange={(value) =>
                                                    setBatchStatusFilter(
                                                        value as
                                                            | RetreatBatchStatus
                                                            | "all",
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="h-9 w-full rounded-md border-[#E9E2D2] bg-white text-sm text-[#1C1A16] focus-visible:border-[#C6A34A]">
                                                    <SelectValue placeholder="All statuses" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        All statuses
                                                    </SelectItem>
                                                    {RETREAT_BATCH_STATUSES.map(
                                                        (s) => (
                                                            <SelectItem
                                                                key={s}
                                                                value={s}
                                                            >
                                                                {s
                                                                    .split("_")
                                                                    .map(
                                                                        (
                                                                            word,
                                                                        ) =>
                                                                            word[0].toUpperCase() +
                                                                            word.slice(
                                                                                1,
                                                                            ),
                                                                    )
                                                                    .join(" ")}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                loadBatches(batchPage)
                                            }
                                            disabled={
                                                status.batchesList === "loading"
                                            }
                                            className={outlineButtonClass}
                                        >
                                            <RefreshCw
                                                className={`mr-2 h-4 w-4 ${
                                                    status.batchesList ===
                                                    "loading"
                                                        ? "animate-spin"
                                                        : ""
                                                }`}
                                            />
                                            Refresh
                                        </Button>

                                        <Button
                                            onClick={() => {
                                                setEditingBatch(null);
                                                setBatchFormOpen(true);
                                            }}
                                            disabled={locations.length === 0}
                                            className={primaryButtonClass}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add batch
                                        </Button>
                                    </div>
                                    {locations.length === 0 && (
                                        <p className="mt-2 text-xs text-[#B0A996]">
                                            Add a retreat location first before
                                            creating a batch.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card
                                className={`overflow-hidden border border-gold-soft`}
                            >
                                <CardHeader className="border-b border-[#E9E2D2]">
                                    <CardTitle className="text-base p-5 text-[#1C1A16]">
                                        Retreat batches
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[1000px]">
                                            <thead>
                                                <tr className="border-b border-[#E9E2D2] bg-[#FAF6EE] text-left text-xs uppercase tracking-wide text-[#9C9284]">
                                                    <th className="px-6 py-4">
                                                        Batch
                                                    </th>
                                                    <th className="px-6 py-4">
                                                        Location
                                                    </th>
                                                    <th className="px-6 py-4">
                                                        Dates
                                                    </th>
                                                    <th className="px-6 py-4">
                                                        Capacity
                                                    </th>
                                                    <th className="px-6 py-4">
                                                        Price
                                                    </th>
                                                    <th className="px-6 py-4">
                                                        Status
                                                    </th>
                                                    <th className="px-6 py-4 text-right">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {status.batchesList ===
                                                "loading" ? (
                                                    <tr>
                                                        <td
                                                            colSpan={7}
                                                            className="px-6 py-10 text-center text-sm text-[#B0A996]"
                                                        >
                                                            Loading batches...
                                                        </td>
                                                    </tr>
                                                ) : filteredBatches.length ===
                                                  0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan={7}
                                                            className="px-6 py-16 text-center"
                                                        >
                                                            <CalendarDays className="mx-auto h-10 w-10 text-[#DCD3BF]" />
                                                            <p className="mt-3 font-medium text-[#4A4539]">
                                                                No retreat
                                                                batches found
                                                            </p>
                                                            <p
                                                                className={`mt-1 ${mutedTextClass}`}
                                                            >
                                                                Try adjusting
                                                                your filters or
                                                                add a new batch.
                                                            </p>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredBatches.map(
                                                        (batch) => {
                                                            const locationLabel =
                                                                getBatchLocationLabel(
                                                                    batch.retreatLocation,
                                                                    locations,
                                                                );

                                                            return (
                                                                <tr
                                                                    key={
                                                                        batch._id
                                                                    }
                                                                    className="border-b border-[#F0EBDE] last:border-0 hover:bg-[#FAF6EE]/60"
                                                                >
                                                                    <td className="px-6 py-4 min-w-50 sm:min-w-50">
                                                                        <p className="font-medium text-[#1C1A16]">
                                                                            {
                                                                                batch.batchName
                                                                            }
                                                                        </p>
                                                                        <p className="text-xs text-[#B0A996]">
                                                                            /
                                                                            {
                                                                                batch.slug
                                                                            }
                                                                        </p>
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm min-w-20 sm:min-w-30 text-[#4A4539]">
                                                                        {
                                                                            locationLabel
                                                                        }
                                                                    </td>
                                                                    <td className="px-6 py-4 min-w-20 sm:min-w-30 text-sm text-[#4A4539]">
                                                                        {formatDate(
                                                                            batch.startDate,
                                                                        )}{" "}
                                                                        –{" "}
                                                                        {formatDate(
                                                                            batch.endDate,
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm text-[#4A4539]">
                                                                        {
                                                                            batch.confirmedBookingsCount
                                                                        }{" "}
                                                                        /{" "}
                                                                        {
                                                                            batch.capacity
                                                                        }
                                                                    </td>
                                                                    <td className="px-6 py-4 text-sm text-[#4A4539]">
                                                                        {formatMoney(
                                                                            batch.price,
                                                                            batch.currency,
                                                                        )}
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <BatchStatusBadge
                                                                            status={
                                                                                batch.status
                                                                            }
                                                                        />
                                                                    </td>
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex justify-end gap-1">
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="rounded-full aspect-square"
                                                                                onClick={() => {
                                                                                    setEditingBatch(
                                                                                        batch,
                                                                                    );
                                                                                    setBatchFormOpen(
                                                                                        true,
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <Pencil className="h-4 w-4" />
                                                                            </Button>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    setDeletingBatch(
                                                                                        batch,
                                                                                    )
                                                                                }
                                                                                className="text-[#B3413E] hover:text-[#9C3733] rounded-full aspect-square"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        },
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    {batchesMeta && (
                                        <div className="border-t border-[#E9E2D2] px-6 py-3 text-sm text-[#8A8375]">
                                            {batchesMeta.total} batch
                                            {batchesMeta.total === 1
                                                ? ""
                                                : "es"}{" "}
                                            total
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                        {batchesMeta && batchesMeta.totalPages > 1 && (
                            <div className="border-t border-[#E9E2D2] px-6 py-3">
                                <PaginationControl
                                    currentPage={batchPage}
                                    totalPages={batchesMeta.totalPages}
                                    variant="light"
                                    onPageChange={(page) => {
                                        setBatchPage(page);
                                        loadBatches(page);
                                    }}
                                />
                            </div>
                        )}
                    </>
                )}
            </PageContainer>

            {/* Dialogs */}
            {locationFormOpen && (
                <LocationFormDialog
                    open={locationFormOpen}
                    onOpenChange={setLocationFormOpen}
                    location={editingLocation}
                />
            )}
            {batchFormOpen && (
                <BatchFormDialog
                    open={batchFormOpen}
                    onOpenChange={setBatchFormOpen}
                    locations={locations}
                    batch={editingBatch}
                />
            )}
            {Boolean(deletingLocation) && (
                <DeleteConfirmDialog
                    open={Boolean(deletingLocation)}
                    onOpenChange={(open) => {
                        if (!open) setDeletingLocation(null);
                    }}
                    title="Delete this retreat location?"
                    description={`"${deletingLocation?.title ?? ""}" will be permanently removed. This cannot be undone.`}
                    isDeleting={status.locationDelete === "loading"}
                    onConfirm={handleDeleteLocation}
                />
            )}
            {Boolean(deletingBatch) && (
                <DeleteConfirmDialog
                    open={Boolean(deletingBatch)}
                    onOpenChange={(open) => {
                        if (!open) setDeletingBatch(null);
                    }}
                    title="Delete this retreat batch?"
                    description={`"${deletingBatch?.batchName ?? ""}" will be permanently removed. This cannot be undone.`}
                    isDeleting={status.batchDelete === "loading"}
                    onConfirm={handleDeleteBatch}
                />
            )}
        </div>
    );
}
