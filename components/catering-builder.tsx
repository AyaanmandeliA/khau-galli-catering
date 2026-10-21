
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Search,
  Sparkles,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  cateringPackages,
  liveCounters,
  logisticsAreas,
  locations,
  menuItemSurcharges,
  getMenuItemSurcharges,
  menuSections,
  paanShishaFlavours,
  fruitShishaFlavours,
  selectionGroups,
  serviceExtras,
  type CateringPackage,
} from "@/data/catering";

type Selections = Record<string, string[]>;
type EventDetails = {
  name: string;
  mobile: string;
  email: string;
  guests: string;
  eventType: string;
  date: string;
  time: string;
  deliveryArea: string;
  location: string;
  notes: string;
};

type ModelContext = {
  registerTool: (tool: {
    name: string;
    title: string;
    description: string;
    inputSchema: Record<string, unknown>;
    annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
    execute: (input: Record<string, unknown>) => unknown;
  }, options?: { signal?: AbortSignal }) => void | Promise<void>;
};

const steps = ["Package", "Menu", "Add-ons", "Event", "Review"];
const cateringPhone = "971525596653";
const customSelectionKey = (sectionId: string) => `custom:${sectionId}`;

const initialDetails: EventDetails = {
  name: "",
  mobile: "",
  email: "",
  guests: "20",
  eventType: "",
  date: "",
  time: "",
  deliveryArea: "",
  location: "",
  notes: "",
};

function dietaryLabel(value: CateringPackage["dietary"]) {
  if (value === "veg") return "Vegetarian";
  if (value === "non-veg") return "Non-vegetarian";
  return "Veg & non-veg";
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-AE", { maximumFractionDigits: 0 }).format(value);
}

function describeMenuItem(item: string) {
  const surcharge = menuItemSurcharges[item];
  return surcharge ? `${item} (+AED ${surcharge}/guest)` : item;
}

function FieldLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return <span className="field-label">{children}{required ? <span aria-hidden="true"> *</span> : null}</span>;
}

function SelectionPill({ item, checked, disabled, onToggle }: { item: string; checked: boolean; disabled: boolean; onToggle: () => void }) {
  const surcharge = menuItemSurcharges[item];
  return (
    <label className={`selection-pill ${checked ? "is-checked" : ""} ${disabled ? "is-disabled" : ""}`}>
      <Checkbox checked={checked} disabled={disabled && !checked} onCheckedChange={onToggle} aria-label={item} />
      <span className="selection-pill-copy"><span>{item}</span>{surcharge ? <small>+ AED {surcharge} / guest</small> : null}</span>
    </label>
  );
}

export function CateringBuilder() {
  const [step, setStep] = useState(0);
  const [packageId, setPackageId] = useState("");
  const [selections, setSelections] = useState<Selections>({});
  const [selectedCounters, setSelectedCounters] = useState<string[]>([]);
  const [counterChoices, setCounterChoices] = useState<Record<string, string>>({});
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [additionalHours, setAdditionalHours] = useState(false);
  const [additionalWaiters, setAdditionalWaiters] = useState(false);
  const [shishaCount, setShishaCount] = useState(0);
  const [shishaFlavours, setShishaFlavours] = useState<string[]>([]);
  const [details, setDetails] = useState<EventDetails>(initialDetails);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuSearch, setMenuSearch] = useState("");
  const [menuFilter, setMenuFilter] = useState<"all" | "veg" | "non-veg">("all");

  const selectedPackage = cateringPackages.find((pkg) => pkg.id === packageId);
  const guestCount = Math.max(0, Number(details.guests) || 0);
  const selectedDeliveryArea = logisticsAreas.find((area) => area.id === details.deliveryArea);
  const isCustomMenu = selectedPackage?.id === "build-your-own";
  const customSelectedSections = menuSections.map((section) => ({
    ...section,
    selectedItems: selections[customSelectionKey(section.id)] ?? [],
  })).filter((section) => section.selectedItems.length > 0);
  const customSelectionCount = customSelectedSections.reduce((sum, section) => sum + section.selectedItems.length, 0);
  const selectedMenuSurcharges = getMenuItemSurcharges([
    ...(selectedPackage?.fixedItems ?? []),
    ...Object.values(selections).flat(),
  ]);
  const menuSurchargeRate = selectedMenuSurcharges.reduce((sum, row) => sum + row.rate, 0);

  const menuComplete = Boolean(selectedPackage) && (isCustomMenu
    ? customSelectionCount > 0
    : selectedPackage?.slots.every((slot) => (selections[slot.id] ?? []).length === slot.count));
  const eventComplete = details.name.trim().length >= 2
    && details.mobile.replace(/\D/g, "").length >= 7
    && guestCount > 0
    && Boolean(details.eventType && details.date && details.time && details.deliveryArea && details.location.trim());
  const addOnsComplete = shishaCount === 0 || shishaCount >= 5;

  const selectedCounterRows = selectedCounters.map((id) => liveCounters.find((counter) => counter.id === id)).filter(Boolean);
  const selectedExtraRows = selectedExtras.map((id) => serviceExtras.find((extra) => extra.id === id)).filter(Boolean);

  const estimate = useMemo(() => {
    const base = selectedPackage?.pricePerGuest == null ? null : selectedPackage.pricePerGuest * guestCount;
    const extras = selectedExtraRows.reduce((sum, extra) => {
      if (!extra) return sum;
      return sum + (extra.priceType === "per-guest" ? extra.price * guestCount : extra.price);
    }, 0);
    let counters: number | null = 0;
    if (selectedCounterRows.length > 0) {
      if (guestCount < 25) counters = selectedCounterRows.length * 250;
      else if (guestCount > 25) counters = selectedCounterRows.reduce((sum, counter) => sum + (counter?.ratePerGuest ?? 0) * guestCount, 0);
      else counters = null;
    }
    const shisha = shishaCount >= 5 ? shishaCount * 120 : 0;
    const dessertSurcharge = menuSurchargeRate * guestCount;
    const logistics = selectedDeliveryArea?.charge ?? 0;
    const knownTotal = base !== null && guestCount >= 20 && counters !== null && selectedDeliveryArea
      ? base + extras + counters + shisha + dessertSurcharge + logistics
      : null;
    return { base, extras, counters, shisha, dessertSurcharge, logistics, knownTotal };
  }, [guestCount, menuSurchargeRate, selectedCounterRows, selectedDeliveryArea, selectedExtraRows, selectedPackage?.pricePerGuest, shishaCount]);

  const toggleSelection = (slotId: string, item: string, max: number) => {
    setSelections((current) => {
      const existing = current[slotId] ?? [];
      const next = existing.includes(item)
        ? existing.filter((candidate) => candidate !== item)
        : existing.length < max ? [...existing, item] : existing;
      return { ...current, [slotId]: next };
    });
  };

  const toggleCustomSelection = (sectionId: string, item: string) => {
    const key = customSelectionKey(sectionId);
    setSelections((current) => {
      const existing = current[key] ?? [];
      return {
        ...current,
        [key]: existing.includes(item)
          ? existing.filter((candidate) => candidate !== item)
          : [...existing, item],
      };
    });
  };

  const choosePackage = (id: string) => {
    setPackageId(id);
    setSelections({});
  };

  const toggleListValue = (value: string, setValues: React.Dispatch<React.SetStateAction<string[]>>) => {
    setValues((current) => current.includes(value) ? current.filter((candidate) => candidate !== value) : [...current, value]);
  };

  const menuSummary = useMemo(() => {
    if (!selectedPackage) return "";
    if (isCustomMenu) return customSelectedSections.map((section) => `${section.label}: ${section.selectedItems.map(describeMenuItem).join(", ")}`).join("\n");
    if (selectedPackage.fixedItems) return selectedPackage.fixedItems.map(describeMenuItem).join(", ");
    return selectedPackage.slots.map((slot) => `${slot.label}: ${(selections[slot.id] ?? []).map(describeMenuItem).join(", ") || "Not selected"}`).join("\n");
  }, [customSelectedSections, isCustomMenu, selectedPackage, selections]);

  const whatsappMessage = useMemo(() => {
    if (!selectedPackage) return "";
    const lines = [
      "Khau Galli Catering Enquiry",
      "",
      `Package: ${selectedPackage.name}`,
      selectedPackage.pricePerGuest === null ? "Pricing: Custom quotation requested" : `Catalogue rate: AED ${selectedPackage.pricePerGuest} per guest`,
      `Guests: ${details.guests || "-"}`,
      "",
      "Menu selections:",
    ];
    if (isCustomMenu) {
      customSelectedSections.forEach((section) => lines.push(`${section.label}: ${section.selectedItems.map(describeMenuItem).join(", ")}`));
    } else if (selectedPackage.fixedItems) {
      lines.push(`Included: ${selectedPackage.fixedItems.map(describeMenuItem).join(", ")}`);
    } else {
      selectedPackage.slots.forEach((slot) => lines.push(`${slot.label}: ${(selections[slot.id] ?? []).map(describeMenuItem).join(", ") || "-"}`));
    }
    if (guestCount > 0) selectedMenuSurcharges.forEach(({ item, rate }) => lines.push(`${item} supplement: AED ${rate} per guest (AED ${formatMoney(rate * guestCount)})`));
    lines.push("");
    lines.push(`Live counters: ${selectedCounterRows.length ? selectedCounterRows.map((counter) => `${counter?.name}${counter?.choices && counterChoices[counter.id] ? ` (${counterChoices[counter.id]})` : ""}`).join(", ") : "None"}`);
    lines.push(`Service extras: ${selectedExtraRows.length ? selectedExtraRows.map((extra) => extra?.name).join(", ") : "None"}`);
    if (additionalHours) lines.push("Additional live-counter hours: Requested");
    if (additionalWaiters) lines.push("Additional waiters: Requested");
    if (shishaCount > 0) lines.push(`Premium shisha service: ${shishaCount} shishas${shishaFlavours.length ? ` - ${shishaFlavours.join(", ")}` : ""}`);
    lines.push("");
    lines.push(`Event type: ${details.eventType || "-"}`);
    lines.push(`Event date: ${details.date || "-"}`);
    lines.push(`Preferred time: ${details.time || "-"}`);
    lines.push(`Delivery area: ${selectedDeliveryArea?.name ?? "-"}`);
    lines.push(`Venue / address: ${details.location || "-"}`);
    if (selectedDeliveryArea) lines.push(`Indicative logistics charge: AED ${formatMoney(selectedDeliveryArea.charge)} (subject to confirmation for the exact location)`);
    if (details.notes.trim()) lines.push(`Notes: ${details.notes.trim()}`);
    lines.push("");
    lines.push(`Name: ${details.name || "-"}`);
    lines.push(`Mobile: ${details.mobile || "-"}`);
    if (details.email.trim()) lines.push(`Email: ${details.email.trim()}`);
    lines.push("");
    if (isCustomMenu) lines.push("Estimate: Custom menu pricing will be prepared by the catering team.");
    else if (estimate.knownTotal !== null) lines.push(`Indicative known total: AED ${formatMoney(estimate.knownTotal)}`);
    else if (guestCount < 20) lines.push("Estimate: Price confirmation required for fewer than 20 guests.");
    else if (guestCount === 25 && selectedCounterRows.length) lines.push("Estimate: Live-counter charge at exactly 25 guests to be confirmed.");
    lines.push("Please confirm availability, final pricing, setup and delivery details.");
    return lines.join("\n");
  }, [additionalHours, additionalWaiters, counterChoices, customSelectedSections, details, estimate.dessertSurcharge, estimate.knownTotal, guestCount, isCustomMenu, selectedMenuSurcharges, selectedCounterRows, selectedDeliveryArea, selectedExtraRows, selectedPackage, selections, shishaCount, shishaFlavours]);

  const whatsappUrl = `https://wa.me/${cateringPhone}?text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const safeRegister = (tool: Parameters<ModelContext["registerTool"]>[0]) => {
      try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => undefined); } catch { /* unsupported browser */ }
    };
    safeRegister({
      name: "list_catering_packages",
      title: "List catering packages",
      description: "Read Khau Galli's catering packages, prices, included selection slots and quote-only custom menu option.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => cateringPackages.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        price_per_guest_aed: pkg.pricePerGuest,
        quote_only: Boolean(pkg.quoteOnly),
        fixed_items: pkg.fixedItems ?? null,
        slots: pkg.slots.map((slot) => ({ id: slot.id, label: slot.label, count: slot.count, options: selectionGroups[slot.groupId].items })),
        menu_item_surcharges_aed_per_guest: menuItemSurcharges,
        logistics_charges_aed_per_order: logisticsAreas.map((area) => ({ area: area.name, charge: area.charge })),
        custom_menu_sections: pkg.quoteOnly ? menuSections.map((section) => ({ id: section.id, label: section.label, items: section.items })) : null,
      })),
    });
    safeRegister({
      name: "stage_catering_enquiry",
      title: "Stage a catering enquiry",
      description: "Select a package or custom menu, guest count and valid menu choices in the visible Khau Galli catering builder. This does not send an enquiry.",
      inputSchema: {
        type: "object",
        properties: {
          package_id: { type: "string", enum: cateringPackages.map((pkg) => pkg.id) },
          guests: { type: "integer", minimum: 1 },
          selections: { type: "object", additionalProperties: { type: "array", items: { type: "string" } } },
        },
        required: ["package_id", "guests"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input) => {
        const nextPackage = cateringPackages.find((pkg) => pkg.id === input.package_id);
        if (!nextPackage) throw new Error("Unknown package_id.");
        const inputSelections = (input.selections && typeof input.selections === "object" ? input.selections : {}) as Selections;
        let nextSelections = inputSelections;
        if (nextPackage.quoteOnly) {
          nextSelections = {};
          for (const [sectionId, values] of Object.entries(inputSelections)) {
            const menuSection = menuSections.find((section) => section.id === sectionId);
            if (!menuSection || values.some((value) => !menuSection.items.includes(value))) throw new Error(`Invalid custom-menu selections for ${sectionId}.`);
            nextSelections[customSelectionKey(sectionId)] = values;
          }
        } else {
          for (const slot of nextPackage.slots) {
            const values = nextSelections[slot.id] ?? [];
            const allowed = selectionGroups[slot.groupId].items;
            if (values.length > slot.count || values.some((value) => !allowed.includes(value))) throw new Error(`Invalid selections for ${slot.label}.`);
          }
        }
        setPackageId(nextPackage.id);
        setDetails((current) => ({ ...current, guests: String(input.guests) }));
        setSelections(nextSelections);
        setStep(nextPackage.quoteOnly || nextPackage.slots.length ? 1 : 2);
        const customCount = Object.entries(nextSelections).filter(([key]) => key.startsWith("custom:")).reduce((sum, [, values]) => sum + values.length, 0);
        return { staged: true, package: nextPackage.name, guests: input.guests, menu_complete: nextPackage.quoteOnly ? customCount > 0 : nextPackage.slots.every((slot) => (nextSelections[slot.id] ?? []).length === slot.count) };
      },
    });
    safeRegister({
      name: "read_catering_enquiry",
      title: "Read catering enquiry",
      description: "Read the package, menu selections, add-ons, event details and current estimate staged in the visible catering builder.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: () => ({ package: selectedPackage?.name ?? null, guests: guestCount, menu: menuSummary, live_counters: selectedCounterRows.map((counter) => counter?.name), service_extras: selectedExtraRows.map((extra) => extra?.name), event: details, delivery_area: selectedDeliveryArea?.name ?? null, logistics_charge_aed: estimate.logistics, menu_item_surcharges: selectedMenuSurcharges, menu_item_surcharge_aed: estimate.dessertSurcharge, indicative_known_total_aed: estimate.knownTotal }),
    });
    return () => lifecycle.abort();
  }, [details, estimate.dessertSurcharge, estimate.knownTotal, estimate.logistics, guestCount, menuSummary, selectedCounterRows, selectedDeliveryArea, selectedExtraRows, selectedPackage]);

  const goNext = () => {
    if (selectedPackage) setStep((current) => Math.min(4, current + 1));
  };
  const goBack = () => setStep((current) => Math.max(0, current - 1));

  const filteredMenu = menuSections.filter((section) => {
    const dietaryMatch = menuFilter === "all" || section.dietary === menuFilter;
    const query = menuSearch.trim().toLowerCase();
    return dietaryMatch && (!query || section.label.toLowerCase().includes(query) || section.items.some((item) => item.toLowerCase().includes(query)));
  });

  return (
    <main>
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="Khau Galli catering home">
          <Image src="/catering/khau-galli-logo.webp" alt="Khau Galli" width={210} height={72} priority />
          <span>Catering</span>
        </a>
        <div className="header-links">
          <a href="#menu">Full menu</a>
          <a className="header-cta" href="#build"><MessageCircle aria-hidden="true" /> Build your enquiry</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles aria-hidden="true" /> Khau Galli Catering</p>
          <h1>Your menu. Your crowd. Our full street-food theatre.</h1>
          <p>Choose a package or build your own menu, add live counters and send one clear event brief to our catering team.</p>
          <div className="hero-facts">
            <span><Users aria-hidden="true" /> Package pricing for 20+ guests</span>
            <span><Check aria-hidden="true" /> Premium setup included</span>
          </div>
        </div>
        <div className="hero-image-wrap">
          <Image src="/catering/outdoor-service.webp" alt="Khau Galli outdoor catering setup" fill sizes="(max-width: 800px) 100vw, 44vw" priority />
          <div className="hero-stamp">From chaat carts<br />to full-course feasts</div>
        </div>
      </section>

      <section className="builder-shell" id="build">
        <nav className="step-nav" aria-label="Catering enquiry steps">
          {steps.map((label, index) => (
            <button key={label} type="button" className={`${step === index ? "is-active" : ""} ${step > index ? "is-complete" : ""}`} disabled={index > 0 && !selectedPackage} onClick={() => { if (index === 0 || selectedPackage) setStep(index); }}>
              <span>{step > index ? <Check aria-hidden="true" /> : index + 1}</span>
              {label}
            </button>
          ))}
        </nav>

        {step === 0 ? (
          <div className="step-panel">
            <div className="builder-intro">
              <div><p className="eyebrow">Step 1 of 5</p><h2>Choose a package—or make it yours</h2></div>
              <p>Use a priced package for 20+ guests, or choose Build Your Own Menu for a tailored quotation.</p>
            </div>
            <RadioGroup value={packageId} onValueChange={choosePackage} className="package-grid" aria-label="Catering menu options">
              {cateringPackages.map((pkg) => (
                <label className={`package-card ${pkg.quoteOnly ? "is-custom" : ""} ${packageId === pkg.id ? "is-selected" : ""}`} key={pkg.id}>
                  <RadioGroupItem value={pkg.id} aria-label={pkg.name} />
                  <span className="package-card-body">
                    <span className="package-meta"><span>{pkg.quoteOnly ? "Fully custom" : dietaryLabel(pkg.dietary)}</span>{pkg.pricePerGuest === null ? <strong className="package-quote">Tailored quote</strong> : <strong>AED {pkg.pricePerGuest}<small>/guest</small></strong>}</span>
                    <span className="package-name">{pkg.name}</span>
                    <span className="package-description">{pkg.description}</span>
                  </span>
                </label>
              ))}
            </RadioGroup>
            <div className="step-actions"><span>{!selectedPackage ? "Select a package to view menu options." : null}</span><Button className="primary-action" size="lg" disabled={!selectedPackage} onClick={goNext}>Choose menu <ChevronRight /></Button></div>
          </div>
        ) : null}

        {step === 1 && selectedPackage ? (
          <div className="step-panel">
            <div className="builder-intro">
              <div><p className="eyebrow">Step 2 of 5</p><h2>{isCustomMenu ? "Build the menu your event needs" : "Choose every included dish"}</h2></div>
              <p>{selectedPackage.name} · {selectedPackage.pricePerGuest === null ? "price confirmed by our team" : `AED ${selectedPackage.pricePerGuest} per guest`}</p>
            </div>
            {isCustomMenu ? (
              <div className="custom-menu-builder">
                <div className="custom-quote-note">
                  <Sparkles aria-hidden="true" />
                  <div><h3>No fixed combinations. No fixed price.</h3><p>Select as many dishes as you like from any section. Our catering team will review the event size, menu and setup, then send you a tailored quotation.</p></div>
                  <strong>{customSelectionCount} selected</strong>
                </div>
                <Accordion type="multiple" className="custom-menu-accordion" defaultValue={["chaats", "street-food"]}>
                  {menuSections.map((section, index) => {
                    const selected = selections[customSelectionKey(section.id)] ?? [];
                    return (
                      <AccordionItem value={section.id} key={section.id}>
                        <AccordionTrigger>
                          <span className="custom-section-heading"><span>{String(index + 1).padStart(2, "0")}</span><span><b>{section.label}</b><small>{section.dietary === "non-veg" ? "Non-vegetarian" : "Vegetarian"} · {section.items.length} options</small></span></span>
                          <strong className={selected.length ? "has-items" : ""}>{selected.length ? `${selected.length} selected` : "Choose any"}</strong>
                        </AccordionTrigger>
                        <AccordionContent><div className="selection-grid">{section.items.map((item) => <SelectionPill key={item} item={item} checked={selected.includes(item)} disabled={false} onToggle={() => toggleCustomSelection(section.id, item)} />)}</div></AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
                {!customSelectionCount ? <p className="custom-menu-requirement">Choose at least one item to continue.</p> : null}
              </div>
            ) : selectedPackage.fixedItems ? (
              <div className="fixed-menu-card">
                <CircleCheck aria-hidden="true" />
                <div><h3>Your Chaat Counter is already set</h3><p>{selectedPackage.fixedItems.join(" · ")}</p><small>These four items are served together at AED 40 per guest.</small></div>
              </div>
            ) : (
              <div className="slot-stack">
                {selectedPackage.slots.map((slot, index) => {
                  const selected = selections[slot.id] ?? [];
                  const options = selectionGroups[slot.groupId].items;
                  return (
                    <section className="slot-card" key={slot.id}>
                      <div className="slot-heading">
                        <div><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{slot.label}</h3><p>Choose exactly {slot.count}</p></div></div>
                        <strong className={selected.length === slot.count ? "is-done" : ""}>{selected.length} / {slot.count}</strong>
                      </div>
                      <div className="selection-grid">
                        {options.map((item) => <SelectionPill key={item} item={item} checked={selected.includes(item)} disabled={selected.length >= slot.count} onToggle={() => toggleSelection(slot.id, item, slot.count)} />)}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
            <div className="step-actions"><Button variant="outline" size="lg" onClick={goBack}><ChevronLeft /> Back</Button><Button className="primary-action" size="lg" disabled={!menuComplete} onClick={goNext}>Add counters <ChevronRight /></Button></div>
          </div>
        ) : null}

        {step === 2 && selectedPackage ? (
          <div className="step-panel">
            <div className="builder-intro">
              <div><p className="eyebrow">Step 3 of 5</p><h2>Add live counters and service extras</h2></div>
              <p>All live counters run for 3 hours. Extra hours and additional waiters are quoted separately.</p>
            </div>
            <div className="counter-note"><strong>Live-counter pricing:</strong> AED 250 per selected counter below 25 guests. Above 25 guests, the listed per-guest rate applies. Exactly 25 guests will be confirmed by the team.</div>
            <div className="counter-layout">
              <div>
                <h3 className="subsection-title">Live counter options</h3>
                <div className="counter-grid">
                  {liveCounters.map((counter) => {
                    const checked = selectedCounters.includes(counter.id);
                    return (
                      <div className={`counter-card ${checked ? "is-selected" : ""}`} key={counter.id}>
                        <label>
                          <Checkbox checked={checked} onCheckedChange={() => toggleListValue(counter.id, setSelectedCounters)} aria-label={counter.name} />
                          <span><strong>{counter.name}</strong><small>{counter.description}</small></span>
                          <b>AED {counter.ratePerGuest}<small>/guest*</small></b>
                        </label>
                        {checked && counter.choices ? (
                          <RadioGroup value={counterChoices[counter.id] ?? ""} onValueChange={(value) => setCounterChoices((current) => ({ ...current, [counter.id]: value }))} className="counter-choice-list" aria-label={`${counter.name} preparation`}>
                            {counter.choices.map((choice) => <label key={choice}><RadioGroupItem value={choice} />{choice}</label>)}
                          </RadioGroup>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
              <aside className="extras-panel">
                <h3 className="subsection-title">Service extras</h3>
                {serviceExtras.map((extra) => (
                  <label className="extra-row" key={extra.id}>
                    <Checkbox checked={selectedExtras.includes(extra.id)} onCheckedChange={() => toggleListValue(extra.id, setSelectedExtras)} />
                    <span>{extra.name}</span>
                    <strong>+ AED {extra.price}{extra.priceType === "per-guest" ? " pp" : ""}</strong>
                  </label>
                ))}
                <label className="extra-row"><Checkbox checked={additionalHours} onCheckedChange={(value) => setAdditionalHours(Boolean(value))} /><span>Additional counter hours</span><strong>On quote</strong></label>
                <label className="extra-row"><Checkbox checked={additionalWaiters} onCheckedChange={(value) => setAdditionalWaiters(Boolean(value))} /><span>Additional waiters</span><strong>On quote</strong></label>
                <div className="shisha-box">
                  <div><span className="eyebrow">Optional service</span><h4>Premium Shisha</h4><p>AED 120 per shisha, minimum 5. Includes unlimited flavour refreshes for 3 hours.</p></div>
                  <div className="quantity-control"><Button variant="outline" size="icon" onClick={() => setShishaCount((current) => Math.max(0, current - 1))} aria-label="Remove one shisha"><Minus /></Button><strong>{shishaCount}</strong><Button variant="outline" size="icon" onClick={() => setShishaCount((current) => current === 0 ? 5 : current + 1)} aria-label="Add one shisha"><Plus /></Button></div>
                  {shishaCount > 0 ? (
                    <Accordion type="single" collapsible>
                      <AccordionItem value="flavours"><AccordionTrigger>Choose preferred flavours ({shishaFlavours.length})</AccordionTrigger><AccordionContent><div className="flavour-grid">{[...paanShishaFlavours, ...fruitShishaFlavours].map((flavour) => <SelectionPill key={flavour} item={flavour} checked={shishaFlavours.includes(flavour)} disabled={false} onToggle={() => toggleListValue(flavour, setShishaFlavours)} />)}</div></AccordionContent></AccordionItem>
                    </Accordion>
                  ) : null}
                  {shishaCount > 0 && shishaCount < 5 ? <p className="validation-note">Minimum 5 shishas.</p> : null}
                </div>
              </aside>
            </div>
            <div className="step-actions"><Button variant="outline" size="lg" onClick={goBack}><ChevronLeft /> Back</Button><Button className="primary-action" size="lg" disabled={!addOnsComplete} onClick={goNext}>Event details <ChevronRight /></Button></div>
          </div>
        ) : null}

        {step === 3 && selectedPackage ? (
          <div className="step-panel event-step">
            <div className="builder-intro">
              <div><p className="eyebrow">Step 4 of 5</p><h2>Tell us about the event</h2></div>
              <p>These details go into the WhatsApp brief so the catering manager can respond with a final quote.</p>
            </div>
            <div className="event-grid">
              <label><FieldLabel required>Your name</FieldLabel><Input value={details.name} onChange={(event) => setDetails({ ...details, name: event.target.value })} placeholder="Full name" autoComplete="name" /></label>
              <label><FieldLabel required>Mobile / WhatsApp</FieldLabel><Input value={details.mobile} onChange={(event) => setDetails({ ...details, mobile: event.target.value })} placeholder="+971 5X XXX XXXX" type="tel" autoComplete="tel" /></label>
              <label><FieldLabel>Email</FieldLabel><Input value={details.email} onChange={(event) => setDetails({ ...details, email: event.target.value })} placeholder="Optional" type="email" autoComplete="email" /></label>
              <label><FieldLabel required>Number of guests</FieldLabel><Input value={details.guests} onChange={(event) => setDetails({ ...details, guests: event.target.value.replace(/\D/g, "") })} min="1" inputMode="numeric" type="number" /></label>
              <label><FieldLabel required>Event type</FieldLabel><Select value={details.eventType} onValueChange={(value) => setDetails({ ...details, eventType: value })}><SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger><SelectContent><SelectItem value="Corporate event">Corporate event</SelectItem><SelectItem value="Private party">Private party</SelectItem><SelectItem value="Wedding function">Wedding function</SelectItem><SelectItem value="Community event">Community event</SelectItem><SelectItem value="School or university event">School or university event</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></label>
              <label><FieldLabel required>Event date</FieldLabel><div className="input-with-icon"><CalendarDays /><Input value={details.date} onChange={(event) => setDetails({ ...details, date: event.target.value })} type="date" /></div></label>
              <label><FieldLabel required>Preferred service time</FieldLabel><div className="input-with-icon"><Clock3 /><Input value={details.time} onChange={(event) => setDetails({ ...details, time: event.target.value })} type="time" /></div></label>
              <label><FieldLabel required>Delivery area</FieldLabel><Select value={details.deliveryArea} onValueChange={(value) => setDetails({ ...details, deliveryArea: value })}><SelectTrigger><SelectValue placeholder="Select delivery area" /></SelectTrigger><SelectContent>{logisticsAreas.map((area) => <SelectItem value={area.id} key={area.id}>{area.name} — AED {formatMoney(area.charge)}</SelectItem>)}</SelectContent></Select><small className="field-help">{selectedDeliveryArea ? `Indicative AED ${formatMoney(selectedDeliveryArea.charge)} logistics charge. The team will confirm it after reviewing the exact location.` : "Select an area to add the indicative logistics charge."}</small></label>
              <label className="span-2"><FieldLabel required>Venue / exact address</FieldLabel><div className="input-with-icon"><MapPin /><Input value={details.location} onChange={(event) => setDetails({ ...details, location: event.target.value })} placeholder="Area, venue, building or villa, and access notes" autoComplete="street-address" /></div></label>
              <label className="span-2"><FieldLabel>Notes, allergies or setup requests</FieldLabel><Textarea value={details.notes} onChange={(event) => setDetails({ ...details, notes: event.target.value })} placeholder="Tell us about dietary needs, venue access, serving preferences or anything else the team should know." rows={4} /></label>
            </div>
            {guestCount > 0 && guestCount < 20 ? <div className="counter-note"><strong>Under 20 guests:</strong> the PDF package prices do not apply automatically; the team will send a tailored quote.</div> : null}
            <div className="step-actions"><Button variant="outline" size="lg" onClick={goBack}><ChevronLeft /> Back</Button><Button className="primary-action" size="lg" disabled={!eventComplete} onClick={goNext}>Review enquiry <ChevronRight /></Button></div>
          </div>
        ) : null}

        {step === 4 && selectedPackage ? (
          <div className="step-panel review-step">
            <div className="builder-intro">
              <div><p className="eyebrow">Step 5 of 5</p><h2>Review your catering brief</h2></div>
              <p>This prepares a WhatsApp message. Nothing is booked until the Khau Galli team confirms the details.</p>
            </div>
            <div className="review-layout">
              <div className="review-stack">
                <section className="review-card"><div className="review-card-heading"><h3>Package</h3><button onClick={() => setStep(0)}>Edit</button></div><strong className="review-title">{selectedPackage.name}</strong><p>{selectedPackage.pricePerGuest === null ? "Tailored quotation" : `AED ${selectedPackage.pricePerGuest} per guest`} · {guestCount} guests</p></section>
                <section className="review-card"><div className="review-card-heading"><h3>Menu</h3><button onClick={() => setStep(1)}>Edit</button></div>{isCustomMenu ? customSelectedSections.map((section) => <div className="review-row" key={section.id}><span>{section.label}</span><strong>{section.selectedItems.map(describeMenuItem).join(", ")}</strong></div>) : selectedPackage.fixedItems ? <p>{selectedPackage.fixedItems.map(describeMenuItem).join(" · ")}</p> : selectedPackage.slots.map((slot) => <div className="review-row" key={slot.id}><span>{slot.label}</span><strong>{(selections[slot.id] ?? []).map(describeMenuItem).join(", ")}</strong></div>)}</section>
                <section className="review-card"><div className="review-card-heading"><h3>Add-ons</h3><button onClick={() => setStep(2)}>Edit</button></div><p>{selectedCounterRows.length ? selectedCounterRows.map((counter) => counter?.name).join(" · ") : "No live counters selected"}</p><p>{selectedExtraRows.length ? selectedExtraRows.map((extra) => extra?.name).join(" · ") : "No service extras selected"}</p>{shishaCount ? <p>{shishaCount} premium shishas</p> : null}</section>
                <section className="review-card"><div className="review-card-heading"><h3>Event</h3><button onClick={() => setStep(3)}>Edit</button></div><div className="review-row"><span>Date and time</span><strong>{details.date} · {details.time}</strong></div><div className="review-row"><span>Delivery area</span><strong>{selectedDeliveryArea?.name} · indicative AED {formatMoney(estimate.logistics)}</strong></div><div className="review-row"><span>Venue / address</span><strong>{details.location}</strong></div><div className="review-row"><span>Contact</span><strong>{details.name} · {details.mobile}</strong></div></section>
              </div>
              <aside className="estimate-card">
                <p className="eyebrow">{isCustomMenu ? "Tailored quotation" : "Indicative estimate"}</p>
                <div className="estimate-row"><span>{isCustomMenu ? "Custom menu" : "Package"}</span><strong>{estimate.base === null ? "Price on request" : `AED ${formatMoney(estimate.base)}`}</strong></div>
                {estimate.counters !== 0 ? <div className="estimate-row"><span>Live counters</span><strong>{estimate.counters === null ? "Confirm at 25 guests" : `AED ${formatMoney(estimate.counters)}`}</strong></div> : null}
                {estimate.extras > 0 ? <div className="estimate-row"><span>Service extras</span><strong>AED {formatMoney(estimate.extras)}</strong></div> : null}
                {estimate.shisha > 0 ? <div className="estimate-row"><span>Shisha service</span><strong>AED {formatMoney(estimate.shisha)}</strong></div> : null}
                {guestCount > 0 ? selectedMenuSurcharges.map(({ item, rate }) => <div className="estimate-row" key={item}><span>{item} (+AED {rate}/guest)</span><strong>AED {formatMoney(rate * guestCount)}</strong></div>) : null}
                {estimate.logistics > 0 ? <div className="estimate-row"><span>Indicative logistics</span><strong>AED {formatMoney(estimate.logistics)}</strong></div> : null}
                <div className="estimate-total"><span>Indicative total</span><strong>{estimate.knownTotal === null ? "Price on request" : `AED ${formatMoney(estimate.knownTotal)}`}</strong></div>
                <p className="estimate-disclaimer">This is an enquiry estimate, not an invoice. The logistics charge may change after the team confirms the exact location. Final pricing, taxes if applicable, availability, staffing and setup are confirmed by the catering team.</p>
                <Button className="whatsapp-action" size="lg" disabled={!menuComplete || !eventComplete} onClick={() => setWhatsappOpen(true)}><MessageCircle /> Prepare WhatsApp enquiry</Button>
              </aside>
            </div>
            <div className="step-actions"><Button variant="outline" size="lg" onClick={goBack}><ChevronLeft /> Back</Button><span /></div>
          </div>
        ) : null}
      </section>

      <section className="counter-showcase">
        <div className="counter-showcase-copy"><p className="eyebrow">Live-counter add-ons</p><h2>Freshly made. Served with a little theatre.</h2><p>Add dosa, pasta, momos, jalebi, kulfi, mocktails and more to any package or custom menu.</p><a href="#build" onClick={() => setStep(selectedPackage ? 2 : 0)}>Explore counter options</a></div>
        <div className="showcase-image large"><Image src="/catering/live-counter.webp" alt="Khau Galli live food counter setup" fill sizes="(max-width: 800px) 100vw, 38vw" /></div>
        <div className="showcase-image small"><Image src="/catering/chaat-service.webp" alt="Khau Galli chaat service at an event" fill sizes="(max-width: 800px) 100vw, 24vw" /></div>
      </section>

      <section className="menu-library" id="menu">
        <div className="menu-library-heading"><div><p className="eyebrow">Full catering menu</p><h2>Every section from the catering catalogue</h2></div><p>Explore the complete range here. Standard packages guide the included choices; Build Your Own Menu opens every section.</p></div>
        <div className="menu-tools">
          <div className="menu-search"><Search aria-hidden="true" /><Input value={menuSearch} onChange={(event) => setMenuSearch(event.target.value)} placeholder="Search dishes or sections" aria-label="Search catering menu" /></div>
          <div className="filter-buttons" aria-label="Filter menu"><Button variant={menuFilter === "all" ? "default" : "outline"} onClick={() => setMenuFilter("all")}>All</Button><Button variant={menuFilter === "veg" ? "default" : "outline"} onClick={() => setMenuFilter("veg")}>Vegetarian</Button><Button variant={menuFilter === "non-veg" ? "default" : "outline"} onClick={() => setMenuFilter("non-veg")}>Non-veg</Button></div>
        </div>
        <Accordion type="multiple" className="menu-accordion">
          {filteredMenu.map((section) => {
            const query = menuSearch.trim().toLowerCase();
            const visibleItems = query ? section.items.filter((item) => item.toLowerCase().includes(query) || section.label.toLowerCase().includes(query)) : section.items;
            return <AccordionItem value={section.id} key={section.id}><AccordionTrigger><span><b>{section.label}</b><small>{section.dietary === "non-veg" ? "Non-vegetarian" : "Vegetarian"} · {visibleItems.length} items</small></span></AccordionTrigger><AccordionContent><div className="menu-item-cloud">{visibleItems.map((item) => <span className={menuItemSurcharges[item] ? "has-surcharge" : undefined} key={item}>{item}{menuItemSurcharges[item] ? <small>+ AED {menuItemSurcharges[item]} / guest</small> : null}</span>)}</div></AccordionContent></AccordionItem>;
          })}
        </Accordion>
        {filteredMenu.length === 0 ? <div className="empty-menu">No menu items match your search.</div> : null}
      </section>

      <section className="terms-section">
        <div><p className="eyebrow">Good to know</p><h2>Clear terms before you enquire</h2></div>
        <ul><li>Standard package pricing applies for a minimum of 20 guests; smaller events are quoted separately.</li><li>Indicative logistics charges are Dubai AED 250, Abu Dhabi AED 500, Sharjah AED 250, Ajman AED 500, Al Ain AED 750 and Fujairah AED 1,000. The final charge may change after the team confirms the exact location.</li><li>Rabri, all fruit creams, ice creams, Kulfi Stick Small and Rabri Falooda each add AED 10 per guest when selected.</li><li>Premium catering setup with biodegradable disposable cutlery is included.</li><li>All live counters run for 3 hours. Additional hours and waiters are chargeable.</li><li>Traditional chaat-cart setup adds AED 250.</li><li>Final pricing and availability are confirmed by the Khau Galli team.</li></ul>
      </section>

      <footer>
        <div className="footer-top"><div><Image src="/catering/khau-galli-logo.webp" alt="Khau Galli" width={230} height={80} /><p>Street food, full-course catering and live counters for events across the UAE.</p></div><div className="footer-contact"><span>Catering WhatsApp</span><a href="https://wa.me/971525596653">+971 52 559 6653</a><span>Bulk order enquiries</span><p>+971 58 665 5413 · +971 58 665 5412</p></div></div>
        <div className="location-grid">{locations.map((location) => <div key={location.name}><strong>{location.name}</strong><span>{location.detail}</span><a href={`tel:${location.phone.replace(/\s/g, "")}`}>{location.phone}</a></div>)}</div>
        <p className="footer-note">The Taste of India Presented in a Unique Way</p>
      </footer>

      <Dialog open={whatsappOpen} onOpenChange={setWhatsappOpen}>
        <DialogContent className="whatsapp-dialog">
          <DialogHeader><DialogTitle>Send your catering enquiry</DialogTitle><DialogDescription>Review the structured message below. WhatsApp opens only when you choose to continue.</DialogDescription></DialogHeader>
          <pre>{whatsappMessage}</pre>
          <DialogFooter>
            <Button variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(whatsappMessage); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { /* clipboard unavailable */ } }}>{copied ? "Copied" : "Copy message"}</Button>
            <Button asChild className="whatsapp-action"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer"><MessageCircle /> Open WhatsApp</a></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
