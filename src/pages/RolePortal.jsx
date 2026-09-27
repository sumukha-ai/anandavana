import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { normalizeLang } from "../i18n/config";
import BhaktaDetailPage from "./rolePortal/BhaktaDetailPage";
import BhaktasPage from "./rolePortal/BhaktasPage";
import BookingsPage from "./rolePortal/BookingsPage";
import CalendarDayDetailsPage from "./rolePortal/CalendarDayDetailsPage";
import EventEditorPage from "./rolePortal/EventEditorPage";
import EventsPage from "./rolePortal/EventsPage";
import DonationFundsPage from "./rolePortal/finance/DonationFundsPage";
import FinancePage from "./rolePortal/finance/FinancePage";
import RecordDonationPage from "./rolePortal/finance/RecordDonationPage";
import SevaEntryPage from "./rolePortal/finance/SevaEntryPage";
import TrustProfilePage from "./rolePortal/trust/TrustProfilePage";
import GalleryEventPage from "./rolePortal/GalleryEventPage";
import GalleryPage from "./rolePortal/GalleryPage";
import LookupsPage from "./rolePortal/LookupsPage";
// import OverviewPage from "./rolePortal/OverviewPage";
import RoleShell from "./rolePortal/RoleShell";
import SevaCatalogPage from "./rolePortal/SevaCatalogPage";
import SevaEditorPage from "./rolePortal/SevaEditorPage";
import StaffPage from "./rolePortal/StaffPage";
import AddStaffPage from "./rolePortal/AddStaffPage";
import { getMenuItems, sectionMeta, sectionPath, shortDate } from "./rolePortal/rolePortalConfig";

const emptyStaff = { username: "", email: "", password: "", role: "" };
const emptySeva = {
  id: "",
  name: "",
  description: "",
  name_kn: "",
  description_kn: "",
  online_booking: false,
  amount: "",
  photo_url: "",
  photo: null,
  enabled: true,
};
const emptyLookup = { id: "", kind: "rashi", name: "", name_kn: "" };

function toSevaForm(seva) {
  if (!seva) return emptySeva;
  return {
    id: seva.id,
    name: seva.name || "",
    description: seva.description || "",
    name_kn: seva.name_kn || "",
    description_kn: seva.description_kn || "",
    // No separate flag on the API: a seva is bookable online when it carries an amount
    online_booking: Boolean(seva.is_bookable) || Number(seva.amount) > 0,
    amount: seva.amount ?? "",
    photo_url: seva.photo_url || "",
    photo: null,
    enabled: Boolean(seva.enabled),
  };
}

function useToasts() {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)));
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 200);
  }, []);

  const notify = useCallback(
    (tone, title, text) => {
      counter.current += 1;
      const id = counter.current;
      setToasts((current) => [...current.slice(-2), { id, tone, title, text }]);
      if (tone !== "error") window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss]
  );

  return { toasts, notify, dismiss };
}

export default function RolePortal({ role, section = "bookings" }) {
  const { token, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang: rawLang, sevaId, bookingDate, eventId, bhaktaId } = useParams();
  const lang = normalizeLang(rawLang);
  const [users, setUsers] = useState([]);
  const [sevas, setSevas] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [lookups, setLookups] = useState({ rashis: [], nakshatras: [] });
  const [staffForm, setStaffForm] = useState(emptyStaff);
  const [sevaForm, setSevaForm] = useState(() => toSevaForm(location.state?.seva));
  const [sevaBaseline, setSevaBaseline] = useState(() => toSevaForm(location.state?.seva));
  const [lookupForm, setLookupForm] = useState(emptyLookup);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sevaMissing, setSevaMissing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [eventTitle, setEventTitle] = useState("");
  const [bhaktaName, setBhaktaName] = useState("");
  const [updatingStaffId, setUpdatingStaffId] = useState(null);
  const { toasts, notify, dismiss } = useToasts();

  const canManage = role === "admin";
  const canSeeUsers = role === "admin" || role === "manager";
  const canEditEvents = role === "admin" || role === "manager";
  const canSeeFinance = role === "admin";
  const allowedSections = getMenuItems(role);
  const virtualSections = ["seva-editor", "calendar-detail", "bhakta-detail", "event-editor", "gallery-event", "finance-seva-entry", "finance-donation-entry", "finance-causes", ...(canManage ? ["staff-new"] : [])];
  // Overview is commented out and the calendar is part of booked sevas, so both land there
  const activeSection = allowedSections.includes(section) || virtualSections.includes(section) ? section : "bookings";

  const bookingQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (activeSection === "calendar-detail" && bookingDate) {
      params.set("from_date", bookingDate);
      params.set("to_date", bookingDate);
    }
    params.set("per_page", "100");
    return `/booked_sevas?${params.toString()}`;
  }, [activeSection, bookingDate]);

  useEffect(() => {
    if (!token) return undefined;
    let active = true;

    async function loadWorkspace() {
      setLoading(true);
      try {
        const requests = [
          apiRequest("/seva", { token, lang }),
          apiRequest("/lookups", { lang }),
          apiRequest(bookingQuery, { token, lang }),
        ];
        if (canSeeUsers) requests.push(apiRequest("/users/staff", { token }));

        const [sevaData, lookupData, bookingData, userData] = await Promise.all(requests);
        if (!active) return;

        setSevas(sevaData.sevas || []);
        if (activeSection === "seva-editor" && sevaId) {
          const selectedSeva = (sevaData.sevas || []).find((seva) => String(seva.id) === String(sevaId));
          setSevaMissing(!selectedSeva);
          if (selectedSeva) {
            setSevaForm(toSevaForm(selectedSeva));
            setSevaBaseline(toSevaForm(selectedSeva));
          }
        }
        setLookups({ rashis: lookupData?.rashis || [], nakshatras: lookupData?.nakshatras || [] });
        setBookings(bookingData.booked_sevas || []);
        if (userData) setUsers(userData.users || []);
      } catch (err) {
        if (active) notify("error", "Could not load the workspace", err.message);
      } finally {
        if (active) {
          setLoading(false);
          setLoaded(true);
        }
      }
    }

    loadWorkspace();
    return () => {
      active = false;
    };
  }, [activeSection, bookingQuery, canSeeUsers, lang, notify, refreshKey, sevaId, token]);

  useEffect(() => {
    if (!location.state?.seva) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (activeSection !== "seva-editor" || sevaId) return;
    setSevaForm(emptySeva);
    setSevaBaseline(emptySeva);
    setSevaMissing(false);
  }, [activeSection, sevaId, location.pathname]);

  const handleStaffChange = (event) => {
    const { name, value } = event.target;
    setStaffForm((current) => ({ ...current, [name]: value }));
  };

  const handleSevaChange = (event) => {
    const { name, value, type, checked, files } = event.target;
    setSevaForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
    }));
  };

  const handleLookupChange = (event) => {
    const { name, value } = event.target;
    setLookupForm((current) => ({ ...current, [name]: value }));
  };

  const createStaff = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/users/staff", { method: "POST", token, body: staffForm });
      notify("success", "Staff login created", `${staffForm.username} can now sign in as ${staffForm.role}.`);
      setStaffForm(emptyStaff);
      navigate(sectionPath(lang, role, "staff"));
    } catch (err) {
      notify("error", "Could not create the login", err.message || "Please check the details and try again.");
    } finally {
      setSaving(false);
    }
  };

  const setStaffStatus = async (account, isActive) => {
    setUpdatingStaffId(account.id);
    try {
      const data = await apiRequest(`/users/staff/${account.id}/status`, { method: "PATCH", token, body: { is_active: isActive } });
      setUsers((current) => current.map((item) => (item.id === account.id ? data.user : item)));
      notify(
        "success",
        isActive ? "Account enabled" : "Account disabled",
        isActive ? `${account.username} can sign in again.` : `${account.username} can no longer sign in.`,
      );
    } catch (err) {
      notify("error", "Could not update the account", err.message || "Please try again.");
    } finally {
      setUpdatingStaffId(null);
    }
  };

  const saveSeva = async (event) => {
    event.preventDefault();
    const amount = sevaForm.online_booking ? sevaForm.amount : "";
    const payload = sevaForm.photo
      ? new FormData()
      : {
          name: sevaForm.name,
          description: sevaForm.description,
          amount: amount === "" ? null : Number(amount),
          photo_url: sevaForm.photo_url || null,
          enabled: sevaForm.enabled,
        };
    if (payload instanceof FormData) {
      payload.append("name", sevaForm.name);
      payload.append("description", sevaForm.description);
      if (amount !== "") payload.append("amount", String(Number(amount)));
      payload.append("enabled", String(sevaForm.enabled));
      payload.append("photo", sevaForm.photo);
      if (sevaForm.photo_url) payload.append("photo_url", sevaForm.photo_url);
    }
    if (sevaForm.id) {
      if (payload instanceof FormData) payload.append("id", String(Number(sevaForm.id)));
      else payload.id = Number(sevaForm.id);
    }
    if (sevaForm.name_kn || sevaForm.description_kn) {
      if (payload instanceof FormData) {
        payload.append("name_kn", sevaForm.name_kn);
        payload.append("description_kn", sevaForm.description_kn);
      } else {
        payload.name_kn = sevaForm.name_kn;
        payload.description_kn = sevaForm.description_kn;
      }
    }
    setSaving(true);
    try {
      await apiRequest("/seva", { method: "POST", token, body: payload });
      notify("success", sevaForm.id ? "Seva updated" : "Seva added", `${sevaForm.name} is saved to the catalog.`);
      setSevaForm(emptySeva);
      setRefreshKey((current) => current + 1);
      navigate(sectionPath(lang, role, "sevas"));
    } catch (err) {
      notify("error", "Could not save the seva", err.message || "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const editSeva = (seva) => {
    setSevaForm(toSevaForm(seva));
    setSevaBaseline(toSevaForm(seva));
    setSevaMissing(false);
    navigate(`/${lang}/${role}/seva-editor/${seva.id}`, { state: { seva } });
  };

  const toggleSevaEnabled = async (seva) => {
    const enabled = !seva.enabled;
    const setEnabled = (value) => setSevas((current) => current.map((item) => (item.id === seva.id ? { ...item, enabled: value } : item)));
    setEnabled(enabled);
    try {
      await apiRequest("/seva", {
        method: "POST",
        token,
        body: {
          id: Number(seva.id),
          name: seva.name,
          description: seva.description,
          amount: seva.amount ?? null,
          photo_url: seva.photo_url || null,
          enabled,
          ...(seva.name_kn || seva.description_kn ? { name_kn: seva.name_kn || "", description_kn: seva.description_kn || "" } : {}),
        },
      });
      notify("success", enabled ? "Seva enabled" : "Seva disabled", enabled ? `${seva.name} is shown on the site.` : `${seva.name} is hidden from the public catalog.`);
    } catch (err) {
      setEnabled(seva.enabled);
      notify("error", "Could not update the seva", err.message || "Please try again.");
    }
  };

  const addSeva = () => {
    setSevaForm(emptySeva);
    navigate(`/${lang}/${role}/seva-editor`);
  };

  const saveLookup = async (event) => {
    event.preventDefault();
    const { kind, ...payload } = lookupForm;
    if (!payload.id) delete payload.id;
    setSaving(true);
    try {
      await apiRequest(`/lookups/${kind}`, { method: "POST", token, body: payload });
      notify("success", payload.id ? "Reference updated" : "Reference added", `${payload.name} · ${payload.name_kn}`);
      setLookupForm((current) => ({ ...emptyLookup, kind: current.kind }));
      setRefreshKey((current) => current + 1);
    } catch (err) {
      notify("error", "Could not save the reference", err.message || "Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const editLookup = (kind, item) => {
    setLookupForm({ id: item.id, kind, name: item.name || "", name_kn: item.name_kn || "" });
  };

  const resetLookup = (kind) => setLookupForm({ ...emptyLookup, kind: kind || lookupForm.kind });

  const renderPage = () => {
    if (activeSection === "staff" && canSeeUsers) {
      return (
        <StaffPage
          lang={lang}
          role={role}
          users={users}
          loaded={loaded}
          canManage={canManage}
          currentUserId={user?.id}
          updatingId={updatingStaffId}
          onToggleStatus={setStaffStatus}
        />
      );
    }
    if (activeSection === "staff-new" && canManage) {
      return (
        <AddStaffPage
          lang={lang}
          role={role}
          staffForm={staffForm}
          onStaffChange={handleStaffChange}
          onCreateStaff={createStaff}
          saving={saving}
        />
      );
    }
    if (activeSection === "seva-editor" && canManage) {
      return (
        <SevaEditorPage
          key={sevaId || "new-seva"}
          lang={lang}
          role={role}
          isEdit={Boolean(sevaId)}
          notFound={loaded && sevaMissing && Boolean(sevaId)}
          loading={Boolean(sevaId) && String(sevaForm.id) !== String(sevaId) && !sevaMissing}
          sevaForm={sevaForm}
          sevaBaseline={sevaBaseline}
          onSevaChange={handleSevaChange}
          onSaveSeva={saveSeva}
          saving={saving}
        />
      );
    }
    if (activeSection === "events" && canEditEvents) {
      return <EventsPage lang={lang} role={role} token={token} notify={notify} />;
    }
    if (activeSection === "event-editor" && canEditEvents) {
      return (
        <EventEditorPage
          key={eventId || "new-event"}
          lang={lang}
          role={role}
          token={token}
          eventId={eventId}
          sevas={sevas}
          notify={notify}
          onTitle={setEventTitle}
        />
      );
    }
    if (activeSection === "gallery" && canEditEvents) {
      return <GalleryPage lang={lang} role={role} token={token} notify={notify} />;
    }
    if (activeSection === "gallery-event" && canEditEvents) {
      return <GalleryEventPage key={eventId} lang={lang} role={role} token={token} eventId={eventId} notify={notify} onTitle={setEventTitle} />;
    }
    if (canSeeFinance) {
      const financeProps = { lang, role, token, notify };
      if (activeSection === "finance") return <FinancePage {...financeProps} />;
      if (activeSection === "finance-seva-entry") return <SevaEntryPage {...financeProps} sevas={sevas} lookups={lookups} loaded={loaded} />;
      if (activeSection === "finance-donation-entry") return <RecordDonationPage {...financeProps} />;
      if (activeSection === "finance-causes") return <DonationFundsPage {...financeProps} />;
      if (activeSection === "trust") return <TrustProfilePage {...financeProps} />;
    }
    if (activeSection === "sevas") {
      return (
        <SevaCatalogPage
          sevas={sevas}
          loaded={loaded}
          canManage={canManage}
          onToggleEnabled={toggleSevaEnabled}
          onEditSeva={editSeva}
          onAddSeva={canManage ? addSeva : null}
        />
      );
    }
    if (activeSection === "calendar-detail") {
      return <CalendarDayDetailsPage bookings={bookings} loaded={loaded && !loading} lang={lang} date={bookingDate} role={role} />;
    }
    if (activeSection === "bhaktas" && canSeeUsers) {
      return <BhaktasPage lang={lang} role={role} token={token} notify={notify} />;
    }
    if (activeSection === "bhakta-detail" && canSeeUsers) {
      return <BhaktaDetailPage key={bhaktaId} lang={lang} role={role} token={token} notify={notify} bhaktaId={bhaktaId} onTitle={setBhaktaName} />;
    }
    if (activeSection === "lookups" && canManage) {
      return (
        <LookupsPage
          lang={lang}
          lookups={lookups}
          loaded={loaded}
          lookupForm={lookupForm}
          onLookupChange={handleLookupChange}
          onSaveLookup={saveLookup}
          onEditLookup={editLookup}
          onResetLookup={resetLookup}
          saving={saving}
        />
      );
    }
    // Overview is switched off for now; everything else falls through to booked sevas (calendar + table)
    // return (
    //   <OverviewPage
    //     role={role}
    //     lang={lang}
    //     user={user}
    //     loaded={loaded}
    //     bookings={bookings}
    //     sevas={sevas}
    //     users={users}
    //     lookups={lookups}
    //     canSeeUsers={canSeeUsers}
    //   />
    // );
    return <BookingsPage bookings={bookings} loaded={loaded} lang={lang} role={role} />;
  };

  let crumb;
  if (activeSection === "calendar-detail") {
    crumb = { parent: "Booked sevas", parentTo: sectionPath(lang, role, "bookings"), label: shortDate(bookingDate, { day: "numeric", month: "short", year: "numeric" }) };
  } else if (activeSection === "seva-editor") {
    crumb = { parent: "Seva catalog", parentTo: sectionPath(lang, role, "sevas"), label: sevaId ? sevaForm.name || "Edit seva" : "New seva" };
  } else if (activeSection === "event-editor") {
    crumb = { parent: "Events", parentTo: sectionPath(lang, role, "events"), label: eventTitle || (eventId ? "Edit event" : "New event") };
  } else if (["finance-seva-entry", "finance-donation-entry", "finance-causes"].includes(activeSection)) {
    crumb = { parent: "Finance", parentTo: sectionPath(lang, role, "finance"), label: sectionMeta[activeSection].label };
  } else if (activeSection === "bhakta-detail") {
    crumb = { parent: "Bhaktas", parentTo: sectionPath(lang, role, "bhaktas"), label: bhaktaName || "Bhakta" };
  } else if (activeSection === "staff-new") {
    crumb = { parent: sectionMeta.staff.label, parentTo: sectionPath(lang, role, "staff"), label: sectionMeta["staff-new"].label };
  } else if (activeSection === "gallery-event") {
    crumb = { parent: "Gallery", parentTo: sectionPath(lang, role, "gallery"), label: eventTitle || "Event photos" };
  }

  return (
    <RoleShell
      role={role}
      lang={lang}
      section={activeSection}
      sevas={sevas}
      loading={loading}
      crumb={crumb}
      toasts={toasts}
      onDismissToast={dismiss}
    >
      {renderPage()}
    </RoleShell>
  );
}
