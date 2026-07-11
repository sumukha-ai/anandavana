import { useEffect, useMemo, useState } from "react";
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
import { getMenuItems } from "./rolePortal/rolePortalConfig";

const emptyStaff = { username: "", email: "", password: "", role: "priest" };
const emptySeva = {
  id: "",
  name: "",
  description: "",
  name_kn: "",
  description_kn: "",
  amount: "",
  photo_url: "",
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
    enabled: Boolean(seva.enabled),
  };
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
  const [lookupForm, setLookupForm] = useState(emptyLookup);
  const [filters, setFilters] = useState({ from_date: "", to_date: "" });
  const [status, setStatus] = useState(location.state?.seva ? "Loaded seva into the editor" : "");
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

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
    const query = params.toString();
    return query ? `/booked_sevas?${query}` : "/booked_sevas";
  }, [activeSection, bookingDate, filters.from_date, filters.to_date]);

  useEffect(() => {
    if (!token) return undefined;
    let active = true;

    async function loadWorkspace() {
      setError("");
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
          if (selectedSeva) {
            setSevaForm(toSevaForm(selectedSeva));
            setStatus("Loaded seva into the editor");
          } else {
            setError("Seva not found");
          }
        }
        setLookups(lookupData);
        setBookings(bookingData.booked_sevas || []);
        if (userData) setUsers(userData.users || []);
      } catch (err) {
        if (active) setError(err.message || "Unable to load workspace");
      }
    }

    loadWorkspace();
    return () => {
      active = false;
    };
  }, [activeSection, bookingQuery, canSeeUsers, lang, refreshKey, sevaId, token]);

  useEffect(() => {
    if (!location.state?.seva) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const handleStaffChange = (event) => {
    const { name, value } = event.target;
    setStaffForm((current) => ({ ...current, [name]: value }));
  };

  const handleSevaChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSevaForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleLookupChange = (event) => {
    const { name, value } = event.target;
    setLookupForm((current) => ({ ...current, [name]: value }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const createStaff = async (event) => {
    event.preventDefault();
    setStatus("");
    setError("");
    try {
      await apiRequest("/users/staff", { method: "POST", token, body: staffForm });
      setStatus(`${staffForm.role} account created`);
      setStaffForm(emptyStaff);
      setRefreshKey((current) => current + 1);
    } catch (err) {
      setError(err.message || "Unable to create staff account");
    }
  };

  const saveSeva = async (event) => {
    event.preventDefault();
    setStatus("");
    setError("");
    const payload = {
      name: sevaForm.name,
      description: sevaForm.description,
      amount: sevaForm.amount === "" ? null : Number(sevaForm.amount),
      photo_url: sevaForm.photo_url || null,
      enabled: sevaForm.enabled,
    };
    if (sevaForm.id) payload.id = Number(sevaForm.id);
    if (sevaForm.name_kn || sevaForm.description_kn) {
      payload.name_kn = sevaForm.name_kn;
      payload.description_kn = sevaForm.description_kn;
    }
    try {
      await apiRequest("/seva", { method: "POST", token, body: payload });
      setStatus("Seva saved");
      setSevaForm(emptySeva);
      setRefreshKey((current) => current + 1);
    } catch (err) {
      setError(err.message || "Unable to save seva");
    }
  };

  const editSeva = (seva) => {
    navigate(`/${lang}/${role}/seva-editor/${seva.id}`, { state: { seva } });
  };

  const addSeva = () => {
    setSevaForm(emptySeva);
    setStatus("");
    setError("");
    navigate(`/${lang}/${role}/seva-editor`);
  };

  const saveLookup = async (event) => {
    event.preventDefault();
    setStatus("");
    setError("");
    const { kind, ...payload } = lookupForm;
    if (!payload.id) delete payload.id;
    try {
      await apiRequest(`/lookups/${kind}`, { method: "POST", token, body: payload });
      setStatus("Lookup saved");
      setLookupForm(emptyLookup);
      setRefreshKey((current) => current + 1);
    } catch (err) {
      setError(err.message || "Unable to save lookup");
    }
  };

  const renderPage = () => {
    if (activeSection === "staff" && canManage) {
      return <StaffPage staffForm={staffForm} onStaffChange={handleStaffChange} onCreateStaff={createStaff} />;
    }
    if (activeSection === "seva-editor" && canManage) {
      return <SevaEditorPage sevaForm={sevaForm} onSevaChange={handleSevaChange} onSaveSeva={saveSeva} />;
    }
    if (activeSection === "sevas") {
      return <SevaCatalogPage sevas={sevas} canManage={canManage} onEditSeva={editSeva} onAddSeva={canManage ? addSeva : null} />;
    }
    if (activeSection === "bookings") {
      return <BookingsPage bookings={bookings} filters={filters} onFilterChange={handleFilterChange} />;
    }
    if (activeSection === "calendar") {
      return <CalendarPage bookings={bookings} lang={lang} role={role} />;
    }
    if (activeSection === "calendar-detail") {
      return <CalendarDayDetailsPage bookings={bookings} lang={lang} date={bookingDate} role={role} />;
    }
    if (activeSection === "users" && canSeeUsers) {
      return <UsersPage users={users} />;
    }
    if (activeSection === "lookups" && canManage) {
      return (
        <LookupsPage
          lang={lang}
          lookups={lookups}
          lookupForm={lookupForm}
          onLookupChange={handleLookupChange}
          onSaveLookup={saveLookup}
        />
      );
    }
    return (
      <OverviewPage
        role={role}
        lang={lang}
        bookings={bookings}
        sevas={sevas}
        users={users}
        lookups={lookups}
        canSeeUsers={canSeeUsers}
      />
    );
  };

  return (
    <RoleShell
      role={role}
      lang={lang}
      section={activeSection}
      user={user}
      status={status}
      error={error}
      titleOverride={activeSection === "seva-editor" ? (sevaId || sevaForm.id ? "Edit seva" : "Add seva") : undefined}
      textOverride={activeSection === "seva-editor" ? "Manage seva details, amount, availability, Kannada text, and media from this editor." : undefined}
      onClearStatus={() => setStatus("")}
      onClearError={() => setError("")}
    >
      {renderPage()}
    </RoleShell>
  );
}
