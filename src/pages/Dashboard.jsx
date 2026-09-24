import { useEffect, useMemo, useState } from "react";
import { Navigate, NavLink, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  CalendarDays,
  CreditCard,
  Edit,
  HeartHandshake,
  IndianRupee,
  Save,
  UserRoundPlus,
  Users,
  X,
} from "lucide-react";
import { apiRequest } from "../api/client";
import { getRoleHomePath, normalizeRole } from "../auth/access";
import { useAuth } from "../auth/AuthContext";
import { normalizeLang } from "../i18n/config";
import { formatAmount, formatSevaDate, sevaContactPhone, telHref } from "./sevaHelpers";

const emptyProfile = {
  name: "",
  email: "",
  phone_number: "",
  address: "",
  rashi_id: "",
  nakshatra_id: "",
  gotra: "",
  charana: "",
};

const palette = {
  primary: "#0f3d3e",
  primaryDark: "#123236",
  accent: "#d6a73a",
  clay: "#9b3d2e",
  gold: "#7b5f19",
  page: "#f5f7f6",
  paper: "#ffffff",
  text: "#1f2d2f",
  muted: "#617071",
  border: "rgba(31,45,47,0.1)",
};

const navItems = [
  { section: "overview", label: "Dashboard", to: "", icon: HeartHandshake },
  { section: "profile", label: "Profile", to: "profile", icon: Users },
  { section: "book-seva", label: "Book Seva", to: "book-seva", icon: IndianRupee },
  { section: "bookings", label: "Booked Sevas", to: "bookings", icon: CalendarDays },
];

function toProfileForm(profile, user) {
  return {
    ...emptyProfile,
    name: profile?.name || user?.username || "",
    email: profile?.email || user?.email || "",
    phone_number: profile?.phone_number || "",
    address: profile?.address || "",
    rashi_id: profile?.rashi_id || "",
    nakshatra_id: profile?.nakshatra_id || "",
    gotra: profile?.gotra || "",
    charana: profile?.charana || "",
  };
}

function toLookupName(item, lang) {
  if (!item) return "";
  if (typeof item === "string") return item;
  return lang === "kn" ? item.name_kn : item.name;
}

function LookupSelect({ label, name, value, items, lang, onChange }) {
  return (
    <TextField label={label} select name={name} value={value} onChange={onChange} required>
      <MenuItem value="">Select {label.toLowerCase()}</MenuItem>
      {items.map((item) => (
        <MenuItem key={item.id} value={item.id}>
          {toLookupName(item, lang)}
        </MenuItem>
      ))}
    </TextField>
  );
}

function statusChipSx(status) {
  const value = String(status || "pending").toLowerCase();
  if (value === "paid" || value === "success") return { fontWeight: 800, bgcolor: "#e3f1e6", color: "#1d5a31" };
  if (value === "failed" || value === "cancelled") return { fontWeight: 800, bgcolor: "#f8e3df", color: "#8a2419" };
  return { fontWeight: 800, bgcolor: "#fbf0d9", color: "#7a5410" };
}

function EmptyState({ text }) {
  return (
    <Box sx={{ py: 5, textAlign: "center", color: palette.muted, fontWeight: 800 }}>
      {text}
    </Box>
  );
}

function MetricCard({ title, value, helper, icon: Icon, tone }) {
  return (
    <Paper elevation={0} sx={{ p: 2.25, borderRadius: 2, border: `1px solid ${palette.border}`, bgcolor: palette.paper }}>
      <Stack spacing={1.3}>
        <Box sx={{ width: 42, height: 42, borderRadius: 2, display: "grid", placeItems: "center", color: "#ffffff", bgcolor: tone }}>
          <Icon size={20} />
        </Box>
        <Typography variant="body2" sx={{ color: palette.muted, fontWeight: 800 }}>{title}</Typography>
        <Typography variant="h4" sx={{ color: palette.text, fontWeight: 950, lineHeight: 1 }}>{value}</Typography>
        <Typography variant="caption" sx={{ color: palette.gold, fontWeight: 800 }}>{helper}</Typography>
      </Stack>
    </Paper>
  );
}

export default function Dashboard({ section = "overview" }) {
  const { token, user } = useAuth();
  const { lang: rawLang } = useParams();
  const lang = normalizeLang(rawLang);
  const role = normalizeRole(user?.role);
  const activeSection = navItems.some((item) => item.section === section) ? section : "overview";
  const [lookups, setLookups] = useState({ rashis: [], nakshatras: [] });
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState(() => toProfileForm(null, user));
  const [familyForm, setFamilyForm] = useState(() => ({ ...emptyProfile, email: user?.email || "" }));
  const [isFamilyFormOpen, setIsFamilyFormOpen] = useState(false);
  const [editingFamilyMemberId, setEditingFamilyMemberId] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [sevas, setSevas] = useState([]);
  const [selectedSevaId, setSelectedSevaId] = useState("");
  const [selectedProfileId, setSelectedProfileId] = useState("");
  const [sevaDate, setSevaDate] = useState("");
  const [paymentSession, setPaymentSession] = useState(null);
  const [notice, setNotice] = useState({ type: "", message: "" });
  const [refreshKey, setRefreshKey] = useState(0);

  const profileOptions = useMemo(
    () => [profile, ...familyMembers].filter(Boolean),
    [familyMembers, profile]
  );

  const selectedSeva = useMemo(
    () => sevas.find((seva) => String(seva.id) === String(selectedSevaId)),
    [sevas, selectedSevaId]
  );

  const profilePayload = useMemo(() => ({
    ...profileForm,
    rashi_id: Number(profileForm.rashi_id),
    nakshatra_id: Number(profileForm.nakshatra_id),
    gotra: profileForm.gotra.trim(),
  }), [profileForm]);

  const familyPayload = useMemo(() => ({
    ...familyForm,
    rashi_id: Number(familyForm.rashi_id),
    nakshatra_id: Number(familyForm.nakshatra_id),
    gotra: familyForm.gotra.trim(),
  }), [familyForm]);

  useEffect(() => {
    if (!token || role !== "bhakta") return undefined;
    let active = true;

    async function loadBhaktaData() {
      setNotice({ type: "", message: "" });
      try {
        const [lookupData, profileData, familyData, bookingData, sevaData] = await Promise.all([
          apiRequest("/lookups", { lang }),
          apiRequest("/bhakta/profile", { token, lang }),
          apiRequest("/family_member", { token, lang }),
          apiRequest("/booked_sevas", { token, lang }),
          apiRequest("/seva", { lang }),
        ]);
        if (!active) return;
        const nextProfile = profileData.profile || null;
        const nextFamily = familyData.family_members || [];
        const nextSevas = sevaData.sevas || [];
        const nextProfiles = [nextProfile, ...nextFamily].filter(Boolean);
        setLookups(lookupData);
        setProfile(nextProfile);
        setProfileForm(toProfileForm(nextProfile, user));
        setFamilyMembers(nextFamily);
        setBookings(bookingData.booked_sevas || []);
        setSevas(nextSevas);
        setSelectedProfileId((current) => current || nextProfiles[0]?.id || "");
        setSelectedSevaId((current) => current || nextSevas.find((seva) => seva.is_bookable)?.id || nextSevas[0]?.id || "");
      } catch (err) {
        if (active) setNotice({ type: "error", message: err.message || "Unable to load dashboard" });
      }
    }

    loadBhaktaData();
    return () => {
      active = false;
    };
  }, [lang, refreshKey, role, token, user]);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleFamilyChange = (event) => {
    const { name, value } = event.target;
    setFamilyForm((current) => ({ ...current, [name]: value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setNotice({ type: "", message: "" });
    try {
      await apiRequest("/bhakta/profile", { method: "POST", token, lang, body: profilePayload });
      setNotice({ type: "success", message: "Profile saved" });
      setRefreshKey((current) => current + 1);
    } catch (err) {
      setNotice({ type: "error", message: err.message || "Unable to save profile" });
    }
  };

  const openAddFamilyForm = () => {
    setFamilyForm({ ...emptyProfile, email: user?.email || "" });
    setEditingFamilyMemberId(null);
    setIsFamilyFormOpen(true);
  };

  const openEditFamilyForm = (member) => {
    setFamilyForm(toProfileForm(member, user));
    setEditingFamilyMemberId(member.id);
    setIsFamilyFormOpen(true);
  };

  const closeFamilyForm = () => {
    setFamilyForm({ ...emptyProfile, email: user?.email || "" });
    setEditingFamilyMemberId(null);
    setIsFamilyFormOpen(false);
  };

  const saveFamily = async (event) => {
    event.preventDefault();
    setNotice({ type: "", message: "" });
    try {
      const path = editingFamilyMemberId ? `/family_member/${editingFamilyMemberId}` : "/family_member";
      await apiRequest(path, {
        method: editingFamilyMemberId ? "PUT" : "POST",
        token,
        lang,
        body: familyPayload,
      });
      setNotice({ type: "success", message: editingFamilyMemberId ? "Family member saved" : "Family member added" });
      closeFamilyForm();
      setRefreshKey((current) => current + 1);
    } catch (err) {
      setNotice({ type: "error", message: err.message || "Unable to save family member" });
    }
  };

  const handleBook = async (event) => {
    event.preventDefault();
    setNotice({ type: "", message: "" });
    setPaymentSession(null);
    try {
      const data = await apiRequest("/book/seva", {
        method: "POST",
        token,
        lang,
        body: {
          seva_id: Number(selectedSevaId),
          bhakta_profile_id: Number(selectedProfileId),
          seva_date: sevaDate,
        },
      });
      setPaymentSession(data.payment);
      setNotice({ type: "success", message: "Your seva booking is recorded. Online payment is in test mode, so no money has been charged." });
      setRefreshKey((current) => current + 1);
    } catch (err) {
      setNotice({ type: "error", message: err.message || "Unable to create booking" });
    }
  };

  if (role !== "bhakta") {
    return <Navigate to={getRoleHomePath(role, lang)} replace />;
  }

  const renderOverview = () => (
    <Stack spacing={2.5}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, gap: 2 }}>
        <MetricCard title="Profiles" value={profileOptions.length} helper="Self and family members" icon={Users} tone={palette.primary} />
        <MetricCard title="Booked sevas" value={bookings.length} helper="Your visible seva history" icon={CalendarDays} tone={palette.clay} />
        <MetricCard title="Bookable sevas" value={sevas.filter((seva) => seva.is_bookable).length} helper="Available online" icon={IndianRupee} tone={palette.gold} />
        <MetricCard title="Profile status" value={profile ? "Ready" : "New"} helper={profile ? "Details available" : "Complete your profile"} icon={HeartHandshake} tone={palette.primaryDark} />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 2 }}>
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: `1px solid ${palette.border}` }}>
          <Typography variant="h5" sx={{ color: "#1f2d2f", fontWeight: 950, mb: 2 }}>Continue your journey</Typography>
          <Stack spacing={1.25}>
            {navItems.filter((item) => item.section !== "overview").map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.section}
                  component={NavLink}
                  to={`/${lang}/dashboard/${item.to}`}
                  startIcon={<Icon size={18} />}
                  sx={{
                    justifyContent: "flex-start",
                    minHeight: 52,
                    borderRadius: 2,
                    border: `1px solid ${palette.border}`,
                    color: palette.text,
                    fontWeight: 900,
                    textTransform: "none",
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: `1px solid ${palette.border}` }}>
          <Typography variant="h5" sx={{ color: "#1f2d2f", fontWeight: 950, mb: 2 }}>Booked sevas</Typography>
          {bookings.slice(0, 4).length ? (
            <Stack spacing={1.25}>
              {bookings.slice(0, 4).map((booking) => (
                <Paper key={booking.id} elevation={0} sx={{ p: 1.5, borderRadius: 2, bgcolor: "#f8faf7", border: "1px solid rgba(35,53,57,0.08)" }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ justifyContent: "space-between" }}>
                    <Box>
                      <Typography sx={{ fontWeight: 900 }}>{booking.seva?.name || "Seva"}</Typography>
                      <Typography variant="body2" sx={{ color: "#657576" }}>{booking.bhakta_profile?.name || "Bhakta"}</Typography>
                    </Box>
                    <Chip label={booking.seva_date ? formatSevaDate(booking.seva_date, lang) : "Date to be confirmed"} size="small" sx={{ alignSelf: { xs: "flex-start", sm: "center" }, fontWeight: 850 }} />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <EmptyState text="No bookings yet." />
          )}
        </Paper>
      </Box>
    </Stack>
  );

  const profileFields = (form, handler) => (
    <>
      <TextField label="Name" name="name" value={form.name} onChange={handler} required />
      <TextField label="Email" type="email" name="email" value={form.email} onChange={handler} required />
      <TextField label="Phone" name="phone_number" value={form.phone_number} onChange={handler} required />
      <TextField label="Charana" name="charana" value={form.charana} onChange={handler} required />
      <LookupSelect label="Rashi" name="rashi_id" value={form.rashi_id} items={lookups.rashis} lang={lang} onChange={handler} />
      <LookupSelect label="Nakshatra" name="nakshatra_id" value={form.nakshatra_id} items={lookups.nakshatras} lang={lang} onChange={handler} />
      <TextField label="Gotra" name="gotra" value={form.gotra} onChange={handler} required />
      <TextField label="Address" name="address" value={form.address} onChange={handler} required multiline minRows={3} sx={{ gridColumn: "1 / -1" }} />
    </>
  );

  const renderProfile = () => (
    <Stack spacing={2}>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: "1px solid rgba(35,53,57,0.1)" }}>
        <Typography variant="h5" sx={{ color: "#1f2d2f", fontWeight: 950, mb: 2 }}>Self details</Typography>
        <Box component="form" onSubmit={saveProfile} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }}>
          {profileFields(profileForm, handleProfileChange)}
          <Button type="submit" variant="contained" startIcon={<Save size={17} />} sx={{ minHeight: 50, bgcolor: "#0b6b72", fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#0b6b72" } }}>
            Save profile
          </Button>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: "1px solid rgba(35,53,57,0.1)" }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 2, justifyContent: "space-between", alignItems: {sm: "center"} }}>
          <Box>
            <Typography variant="h5" sx={{ color: "#1f2d2f", fontWeight: 950 }}>Family members</Typography>
          </Box>
          <Button variant="contained" startIcon={<UserRoundPlus size={17} />} onClick={openAddFamilyForm} sx={{ minHeight: 44, bgcolor: "#9b3d2e", fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#9b3d2e" } }}>
            Add family member
          </Button>
        </Stack>

        {isFamilyFormOpen ? (
          <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: "#fff8f6", border: "1px solid rgba(155,61,46,0.16)" }}>
            <Stack direction="row" spacing={1.5} sx={{ mb: 2, justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6" sx={{ color: "#1f2d2f", fontWeight: 950 }}>
                  {editingFamilyMemberId ? "Update family member details" : "Add family member details"}
                </Typography>
              </Box>
              <Button variant="text" startIcon={<X size={17} />} onClick={closeFamilyForm} sx={{ color: "#617071", fontWeight: 900, textTransform: "none" }}>
                Cancel
              </Button>
            </Stack>
            <Box component="form" onSubmit={saveFamily} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2 }}>
              {profileFields(familyForm, handleFamilyChange)}
              <Button type="submit" variant="contained" startIcon={<Save size={17} />} sx={{ minHeight: 50, bgcolor: "#9b3d2e", fontWeight: 900, textTransform: "none", "&:hover": { bgcolor: "#9b3d2e" } }}>
                {editingFamilyMemberId ? "Save member" : "Add member"}
              </Button>
            </Box>
          </Paper>
        ) : null}

        <Divider sx={{ mb: 2 }} />
        {familyMembers.length ? (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }, gap: 1.5 }}>
            {familyMembers.map((member) => (
              <Paper key={member.id} elevation={0} sx={{ p: 1.75, borderRadius: 2, bgcolor: "#f8faf7", border: "1px solid rgba(35,53,57,0.08)" }}>
                <Stack direction="row" spacing={1.5} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Box>
                    <Typography sx={{ fontWeight: 950 }}>{member.name}</Typography>
                    <Typography variant="body2" sx={{ color: "#657576" }}>{member.phone_number || member.email}</Typography>
                  </Box>
                  <Button size="small" startIcon={<Edit size={15} />} onClick={() => openEditFamilyForm(member)} sx={{ color: "#9b3d2e", fontWeight: 900, textTransform: "none" }}>
                    Edit
                  </Button>
                </Stack>
                <Stack direction="row" sx={{ mt: 1.25, flexWrap: "wrap", gap: 0.75 }}>
                  <Chip size="small" label={toLookupName(member.rashi, lang) || "Rashi"} />
                  <Chip size="small" label={toLookupName(member.nakshatra, lang) || "Nakshatra"} />
                  <Chip size="small" label={(lang === "kn" ? member.gotra_kn || member.gotra : member.gotra) || "Gotra"} />
                  <Chip size="small" label={member.charana ? `Charana ${member.charana}` : "Charana"} />
                </Stack>
                <Box sx={{ display: "grid", gap: 0.5, mt: 1.5 }}>
                  <Typography variant="body2" sx={{ color: "#3f4c4d", fontWeight: 800, overflowWrap: "anywhere" }}>
                    {member.email}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#657576", overflowWrap: "anywhere" }}>
                    {member.address}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        ) : (
          <EmptyState text="No family members have been added." />
        )}
      </Paper>
    </Stack>
  );

  const renderBookSeva = () => (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.25fr) minmax(340px, 0.75fr)" }, gap: 2 }}>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: "1px solid rgba(35,53,57,0.1)" }}>
        <Typography variant="h5" sx={{ color: "#1f2d2f", fontWeight: 950, mb: 2 }}>Choose a seva</Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 1.5 }}>
          {sevas.map((seva) => {
            const isActive = String(selectedSevaId) === String(seva.id);
            const isContactOnly = !seva.is_bookable;
            return (
              <Button
                key={seva.id}
                type="button"
                onClick={() => setSelectedSevaId(seva.id)}
                sx={{
                  minHeight: 148,
                  p: 1.75,
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  borderRadius: 2,
                  border: isActive ? "2px solid #0b6b72" : "1px solid rgba(35,53,57,0.1)",
                  bgcolor: isActive ? "rgba(11,107,114,0.08)" : "#ffffff",
                  color: "#1f2d2f",
                  textTransform: "none",
                }}
              >
                <Stack spacing={0.8} sx={{ width: "100%" }}>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 950 }}>{seva.name}</Typography>
                    <Chip size="small" label={formatAmount(seva.amount) || "Contact office"} sx={{ flexShrink: 0 }} />
                  </Stack>
                  <Typography variant="body2" sx={{ color: "#657576" }}>{seva.description}</Typography>
                  <Typography variant="caption" sx={{ color: isContactOnly ? "#8b6b47" : "#0b6b72", fontWeight: 900 }}>
                    {isContactOnly ? `Contact ${sevaContactPhone(seva)}` : "Bookable online"}
                  </Typography>
                </Stack>
              </Button>
            );
          })}
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: "1px solid rgba(35,53,57,0.1)", alignSelf: "start", position: { lg: "sticky" }, top: { lg: 96 } }}>
        <Typography variant="h5" sx={{ color: "#1f2d2f", fontWeight: 950, mb: 2 }}>{selectedSeva?.is_bookable ? "Book seva" : "Call to book"}</Typography>
        <Stack component="form" onSubmit={handleBook} spacing={2}>
          <TextField label="Selected seva" select value={selectedSevaId} onChange={(event) => setSelectedSevaId(event.target.value)} required>
            <MenuItem value="">Select seva</MenuItem>
            {sevas.map((seva) => (
              <MenuItem key={seva.id} value={seva.id}>
                {seva.name} {formatAmount(seva.amount) ? `· ${formatAmount(seva.amount)}` : "· contact office"}
              </MenuItem>
            ))}
          </TextField>
          {selectedSeva?.is_bookable ? (
            <>
              <TextField label="For" select value={selectedProfileId} onChange={(event) => setSelectedProfileId(event.target.value)} required>
                <MenuItem value="">Select profile</MenuItem>
                {profileOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.is_self ? `${option.name} (Self)` : option.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField label="Date" type="date" value={sevaDate} onChange={(event) => setSevaDate(event.target.value)} required InputLabelProps={{ shrink: true }} />
            </>
          ) : null}
          <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, bgcolor: "#f8faf7", border: "1px solid rgba(35,53,57,0.08)" }}>
            <Stack spacing={0.75}>
              <Typography variant="body2" sx={{ fontWeight: 900 }}>Summary</Typography>
              <Typography variant="body2" sx={{ color: "#657576" }}>Amount: {formatAmount(selectedSeva?.amount) || "Confirmed by the office"}</Typography>
              {selectedSeva?.is_bookable ? (
                <Typography variant="body2" sx={{ color: "#657576" }}>Date: {sevaDate ? formatSevaDate(sevaDate, lang) : "Choose a date"}</Typography>
              ) : (
                <Typography variant="body2" sx={{ color: "#657576" }}>Phone: {sevaContactPhone(selectedSeva)}</Typography>
              )}
            </Stack>
          </Paper>
          {selectedSeva?.is_bookable ? (
            <Button type="submit" variant="contained" startIcon={<CreditCard size={18} />} sx={{ minHeight: 52, bgcolor: "#0b6b72", fontWeight: 950, textTransform: "none", "&:hover": { bgcolor: "#0b6b72" } }}>
              Confirm booking
            </Button>
          ) : (
            <Button component="a" href={telHref(sevaContactPhone(selectedSeva))} variant="contained" sx={{ minHeight: 52, bgcolor: "#8b6b47", fontWeight: 950, textTransform: "none", "&:hover": { bgcolor: "#8b6b47" } }}>
              Call {sevaContactPhone(selectedSeva)}
            </Button>
          )}
        </Stack>

        {paymentSession ? (
          <Paper elevation={0} role="status" sx={{ mt: 2, p: 1.5, borderRadius: 2, bgcolor: "#eef6ef", border: "1px solid rgba(35,110,60,0.22)" }}>
            <Typography sx={{ fontWeight: 900, color: "#173d24" }}>Your seva booking is recorded</Typography>
            {paymentSession.order_id ? (
              <Typography variant="body2" sx={{ color: "#1d4a2c", overflowWrap: "anywhere" }}>
                Booking reference: <strong>{paymentSession.order_id}</strong>
              </Typography>
            ) : null}
          </Paper>
        ) : null}
      </Paper>
    </Box>
  );

  const renderBookings = () => (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: "1px solid rgba(35,53,57,0.1)", overflow: "hidden" }}>
      <Typography variant="h5" sx={{ color: "#1f2d2f", fontWeight: 950, mb: 2 }}>Booked sevas</Typography>
      {bookings.length ? (
        <TableContainer>
          <Table size="small" sx={{ "& td, & th": { py: 1.4 } }}>
            <TableHead>
              <TableRow>
                <TableCell>Seva</TableCell>
                <TableCell>For</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Reference</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell sx={{ fontWeight: 900 }}>{booking.seva?.name}</TableCell>
                  <TableCell>{booking.bhakta_profile?.name}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>{booking.seva_date ? formatSevaDate(booking.seva_date, lang) : "To be confirmed"}</TableCell>
                  <TableCell><Chip label={booking.payment_status || "Pending"} size="small" sx={statusChipSx(booking.payment_status)} /></TableCell>
                  <TableCell sx={{ display: { xs: "none", md: "table-cell" }, maxWidth: 240, overflowWrap: "anywhere", fontVariantNumeric: "tabular-nums" }}>{booking.payment_order_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <EmptyState text="No booked sevas yet." />
      )}
    </Paper>
  );

  const renderSection = () => {
    if (activeSection === "profile") return renderProfile();
    if (activeSection === "book-seva") return renderBookSeva();
    if (activeSection === "bookings") return renderBookings();
    return renderOverview();
  };

  return (
    <Box
      component="section"
      sx={{
        minHeight: "100vh",
        pt: { xs: 11, md: 12 },
        pb: 4,
        px: { xs: 1.5, sm: 2.5, lg: 4 },
        background: palette.page,
      }}
    >
      <Stack spacing={2.5} sx={{ width: "min(1240px, 100%)", mx: "auto" }}>
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: `1px solid ${palette.border}`, bgcolor: palette.paper, backdropFilter: "blur(18px)" }}>
          <Stack direction={{ xs: "column", lg: "row" }} spacing={2} sx={{ justifyContent: "space-between", alignItems: {lg: "center"} }}>
            <Box>
              <Breadcrumbs aria-label="Breadcrumb" sx={{ mb: 1, color: palette.muted, "& .MuiBreadcrumbs-separator": { color: palette.muted } }}>
                <Typography variant="body2" sx={{ color: palette.muted, fontWeight: 800 }}>
                  Bhakta portal
                </Typography>
                <Typography variant="body2" sx={{ color: palette.text, fontWeight: 900 }}>
                  {navItems.find((item) => item.section === activeSection)?.label}
                </Typography>
              </Breadcrumbs>
              <Typography variant="h3" sx={{ color: palette.text, fontWeight: 950, lineHeight: 1.05, fontSize: { xs: "2rem", md: "3rem" } }}>
                {activeSection === "overview" ? `Welcome, ${user?.username}` : navItems.find((item) => item.section === activeSection)?.label}
              </Typography>
              
            </Box>
            
          </Stack>
        </Paper>

        {notice.message ? (
          <Alert severity={notice.type || "info"} onClose={() => setNotice({ type: "", message: "" })}>
            {notice.message}
          </Alert>
        ) : null}

        {renderSection()}
      </Stack>
    </Box>
  );
}
