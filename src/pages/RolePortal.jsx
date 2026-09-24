import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { normalizeLang } from "../i18n/config";
import BookingsPage from "./rolePortal/BookingsPage";
import CalendarPage from "./rolePortal/CalendarPage";
import CalendarDayDetailsPage from "./rolePortal/CalendarDayDetailsPage";
import LookupsPage from "./rolePortal/LookupsPage";
import OverviewPage from "./rolePortal/OverviewPage";
import RoleShell from "./rolePortal/RoleShell";
import SevaCatalogPage from "./rolePortal/SevaCatalogPage";
import SevaEditorPage from "./rolePortal/SevaEditorPage";
import StaffPage from "./rolePortal/StaffPage";
import UsersPage from "./rolePortal/UsersPage";
import { getMenuItems, sectionPath, shortDate } from "./rolePortal/rolePortalConfig";

const emptyStaff = { username: "", email: "", password: "", role: "" };
const emptySeva = {
  id: "",
  name: "",
  description: "",
  name_kn: "",
  description_kn: "",
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

export default function RolePortal({ role, section = "overview" }) {
  const { token, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { lang: rawLang, sevaId, bookingDate } = useParams();
  const lang = normalizeLang(rawLang);
  const [users, setUsers] = useState([]);
  const [sevas, setSevas] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [lookups, setLookups] = useState({ rashis: [], nakshatras: [] });
  const [staffForm, setStaffForm] = useState(emptyStaff);
  const [sevaForm, setSevaForm] = useState(() => toSevaForm(location.state?.seva));
  const [sevaBaseline, setSevaBaseline] = useState(() => toSevaForm(location.state?.seva));
  const [lookupForm, setLookupForm] = useState(emptyLookup);
  const [filters, setFilters] = useState({ from_date: "", to_date: "" });
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sevaMissing, setSevaMissing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toasts, notify, dismiss } = useToasts();

  const canManage = role === "admin";
  const canSeeUsers = role === "admin" || role === "manager";
  const allowedSections = getMenuItems(role);
  const virtualSections = ["calendar-detail"];
  const activeSection = allowedSections.includes(section) || virtualSections.includes(section) ? section : "overview";

  const bookingQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (activeSection === "calendar-detail" && bookingDate) {
      params.set("from_date", bookingDate);
      params.set("to_date", bookingDate);
    } else {
      if (filters.from_date) params.set("from_date", filters.from_date);
      if (filters.to_date) params.set("to_date", filters.to_date);
    }
    params.set("per_page", "100");
    return `/booked_sevas?${params.toString()}`;
  }, [activeSection, bookingDate, filters.from_date, filters.to_date]);

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
        if (canSeeUsers) requests.push(apiRequest("/users/", { token }));

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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const clearFilters = () => setFilters({ from_date: "", to_date: "" });

  const createStaff = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await apiRequest("/users/staff", { method: "POST", token, body: staffForm });
      notify("success", "Staff login created", `${staffForm.username} can now sign in as ${staffForm.role}.`);
      setStaffForm(emptyStaff);
      setRefreshKey((current) => current + 1);
    } catch (err) {
      notify("error", "Could not create the login", err.message || "Please check the details and try again.");
    } finally {
      setSaving(false);
    }
  };

  const saveSeva = async (event) => {
    event.preventDefault();
    const payload = sevaForm.photo
      ? new FormData()
      : {
          name: sevaForm.name,
          description: sevaForm.description,
          amount: sevaForm.amount === "" ? null : Number(sevaForm.amount),
          photo_url: sevaForm.photo_url || null,
          enabled: sevaForm.enabled,
        };
    if (payload instanceof FormData) {
      payload.append("name", sevaForm.name);
      payload.append("description", sevaForm.description);
      if (sevaForm.amount !== "") payload.append("amount", String(Number(sevaForm.amount)));
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
    if (activeSection === "staff" && canManage) {
      return (
        <StaffPage
          staffForm={staffForm}
          onStaffChange={handleStaffChange}
          onCreateStaff={createStaff}
          saving={saving}
          users={users}
          loaded={loaded}
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
    if (activeSection === "sevas") {
      return (
        <SevaCatalogPage
          sevas={sevas}
          loaded={loaded}
          canManage={canManage}
          onEditSeva={editSeva}
          onAddSeva={canManage ? addSeva : null}
        />
      );
    }
    if (activeSection === "bookings") {
      return (
        <BookingsPage
          bookings={bookings}
          loaded={loaded}
          lang={lang}
          role={role}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />
      );
    }
    if (activeSection === "calendar") {
      return <CalendarPage bookings={bookings} loaded={loaded} lang={lang} role={role} />;
    }
    if (activeSection === "calendar-detail") {
      return <CalendarDayDetailsPage bookings={bookings} loaded={loaded && !loading} lang={lang} date={bookingDate} role={role} />;
    }
    if (activeSection === "users" && canSeeUsers) {
      return <UsersPage users={users} loaded={loaded} />;
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
    return (
      <OverviewPage
        role={role}
        lang={lang}
        user={user}
        loaded={loaded}
        bookings={bookings}
        sevas={sevas}
        users={users}
        lookups={lookups}
        canSeeUsers={canSeeUsers}
      />
    );
  };

  let crumb;
  if (activeSection === "calendar-detail") {
    crumb = { parent: "Seva calendar", parentTo: sectionPath(lang, role, "calendar"), label: shortDate(bookingDate, { day: "numeric", month: "short", year: "numeric" }) };
  } else if (activeSection === "seva-editor") {
    crumb = { parent: "Seva catalog", parentTo: sectionPath(lang, role, "sevas"), label: sevaId ? sevaForm.name || "Edit seva" : "New seva" };
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
