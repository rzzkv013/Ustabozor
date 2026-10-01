"use client";

import {
  ArrowDownWideNarrow,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  Camera,
  Check,
  ChevronDown,
  CircleHelp,
  Hammer,
  Heart,
  Home as HomeIcon,
  ImagePlus,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserRound,
  UsersRound,
  WandSparkles,
  Wrench,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type Role = "usta" | "mijoz";
type Master = {
  id: string;
  name: string;
  specialty: string;
  city: string;
  phone: string;
  rating: number;
  reviews: number;
  completed: number;
  price: string;
  photo: string;
  color: string;
  verified: boolean;
  description: string;
  tags: string[];
};
type Account = {
  role: Role;
  name: string;
  phone: string;
  specialty: string;
  city: string;
  username: string;
  bio: string;
  photo: string;
  pro: boolean;
  stories: string[];
  stickers: string[];
};
type ChatMessage = { text: string; author: string; time: string };

const starterMasters: Master[] = [
  {
    id: "aziz",
    name: "Azizbek Rahimov",
    specialty: "Elektrik",
    city: "Toshkent, Yunusobod",
    phone: "+998 90 123 45 67",
    rating: 5.0,
    reviews: 128,
    completed: 214,
    price: "150 000 so‘mdan",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=600&fit=crop&crop=faces",
    color: "#d7e7dd",
    verified: true,
    description:
      "Uy va ofis elektr tarmoqlarini xavfsiz o‘rnatish, ta’mirlash.",
    tags: ["Tezkor", "Kafolat bor"],
  },
  {
    id: "dilshod",
    name: "Dilshod Karimov",
    specialty: "Santexnik",
    city: "Toshkent, Chilonzor",
    phone: "+998 91 234 56 78",
    rating: 4.9,
    reviews: 96,
    completed: 173,
    price: "120 000 so‘mdan",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=600&fit=crop&crop=faces",
    color: "#f3dfd2",
    verified: true,
    description:
      "Suv quvurlari, isitish tizimi va zamonaviy santexnika ishlari.",
    tags: ["Bugun bo‘sh", "Kafolat bor"],
  },
  {
    id: "malika",
    name: "Malika Ismoilova",
    specialty: "Dizayner",
    city: "Toshkent, Mirzo Ulug‘bek",
    phone: "+998 93 345 67 89",
    rating: 4.9,
    reviews: 84,
    completed: 102,
    price: "Kelishiladi",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=600&fit=crop&crop=faces",
    color: "#e9dced",
    verified: true,
    description: "Interyer loyihasi, chizma va mualliflik nazorati.",
    tags: ["Masofadan", "Portfolio bor"],
  },
  {
    id: "sardor",
    name: "Sardor Tursunov",
    specialty: "Usta-quruvchi",
    city: "Toshkent, Sergeli",
    phone: "+998 95 456 78 90",
    rating: 4.8,
    reviews: 71,
    completed: 89,
    price: "250 000 so‘mdan",
    photo:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500&h=600&fit=crop&crop=faces",
    color: "#dce4ee",
    verified: false,
    description: "Kvartira ta’miri, suvoq va pardozlash ishlari.",
    tags: ["Jamoa bilan", "Hisob-kitob bepul"],
  },
];

const categories = [
  "Barchasi",
  "Elektrik",
  "Santexnik",
  "Usta-quruvchi",
  "Dizayner",
];
const stickerOptions = ["⚡", "🛠️", "✨", "🏆", "💎", "🔥"];
const localKey = "ustabozor-v1";

function Avatar({
  master,
  small = false,
}: {
  master: Master;
  small?: boolean;
}) {
  return (
    <div
      className={`avatar ${small ? "avatar-small" : ""}`}
      style={{
        backgroundColor: master.color,
        backgroundImage: `url("${master.photo}")`,
      }}
      role="img"
      aria-label={master.name}
    />
  );
}

export default function Home() {
  const [masters, setMasters] = useState(starterMasters);
  const [account, setAccount] = useState<Account | null>(null);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({});
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"bozor" | "xabarlar" | "profil">("bozor");
  const [category, setCategory] = useState("Barchasi");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<"register" | "chat" | "settings" | null>(
    null,
  );
  const [selectedMaster, setSelectedMaster] = useState<Master | null>(null);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  const [registerRole, setRegisterRole] = useState<Role>("mijoz");
  const [registerName, setRegisterName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerSpecialty, setRegisterSpecialty] = useState("Elektrik");
  const [profileName, setProfileName] = useState("");
  const [profileUsername, setProfileUsername] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [storyCount, setStoryCount] = useState(0);
  const [ratingMasterId, setRatingMasterId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hydrateTimer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(localKey);
      if (saved) {
        try {
          const data = JSON.parse(saved) as {
            masters?: Master[];
            account?: Account | null;
            chats?: Record<string, ChatMessage[]>;
          };
          if (data.masters?.length) {
            setMasters(
              data.masters.map((master) => ({
                ...master,
                phone:
                  master.phone ??
                  starterMasters.find((seed) => seed.id === master.id)?.phone ??
                  "",
                photo:
                  master.photo ||
                  (data.account?.role === "usta" &&
                  master.name === data.account.name
                    ? data.account.photo
                    : ""),
              })),
            );
          }
          if (data.account) {
            setAccount(data.account);
            setProfileName(data.account.name);
            setProfileUsername(data.account.username);
            setProfileBio(data.account.bio);
            setStoryCount(data.account.stories.length);
          }
          if (data.chats) setChats(data.chats);
        } catch {
          window.localStorage.removeItem(localKey);
        }
      }
      setReady(true);
    }, 0);
    const timer = window.setTimeout(() => setLoading(false), 1050);
    return () => {
      window.clearTimeout(hydrateTimer);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      const storedMasters = masters.map((master) =>
        account?.role === "usta" &&
        master.name === account.name &&
        master.photo === account.photo
          ? { ...master, photo: "" }
          : master,
      );
      window.localStorage.setItem(
        localKey,
        JSON.stringify({ masters: storedMasters, account, chats }),
      );
    } catch {
      window.setTimeout(
        () => setNotice("Brauzer xotirasi to‘ldi. Eski hikoyalarni o‘chirib ko‘ring."),
        0,
      );
    }
  }, [masters, account, chats, ready]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMaster, chats]);

  const rankedMasters = [...masters].sort(
    (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  );
  const topMaster = rankedMasters[0];
  const filteredMasters = rankedMasters.filter((master) => {
    const matchesCategory =
      category === "Barchasi" || master.specialty === category;
    const haystack =
      `${master.name} ${master.specialty} ${master.city}`.toLocaleLowerCase(
        "uz",
      );
    return matchesCategory && haystack.includes(query.toLocaleLowerCase("uz"));
  });
  const chatMaster = selectedMaster;
  const currentMessages = chatMaster ? (chats[chatMaster.id] ?? []) : [];

  function openChat(master: Master) {
    setSelectedMaster(master);
    setModal("chat");
  }

  function submitRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newAccount: Account = {
      role: registerRole,
      name: registerName.trim(),
      phone: registerPhone.trim(),
      specialty: registerRole === "usta" ? registerSpecialty : "",
      city: "Toshkent",
      username: registerName
        .trim()
        .toLocaleLowerCase("uz")
        .replace(/\s+/g, "_"),
      bio: "",
      photo: "",
      pro: false,
      stories: [],
      stickers: [],
    };
    setAccount(newAccount);
    setProfileName(newAccount.name);
    setProfileUsername(newAccount.username);
    setProfileBio(newAccount.bio);
    if (newAccount.role === "usta") {
      const newMaster: Master = {
        id: `usta-${Date.now()}`,
        name: newAccount.name,
        specialty: newAccount.specialty,
        city: newAccount.city,
        phone: newAccount.phone,
        rating: 5,
        reviews: 0,
        completed: 0,
        price: "Kelishiladi",
        photo: "",
        color: "#dcebe5",
        verified: false,
        description:
          "Yangi UstaBozor ustasi. Xizmat tafsilotlarini profilda kiriting.",
        tags: ["Yangi usta"],
      };
      setMasters((current) => [newMaster, ...current]);
    }
    setModal(null);
    setView(registerRole === "usta" ? "profil" : "bozor");
    setNotice("Akkauntingiz yaratildi. Ma’lumotlar ushbu qurilmada saqlandi.");
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!chatMaster || !draft.trim()) return;
    const nextMessage: ChatMessage = {
      text: draft.trim(),
      author: account?.name ?? "Men",
      time: new Date().toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChats((current) => ({
      ...current,
      [chatMaster.id]: [...(current[chatMaster.id] ?? []), nextMessage],
    }));
    setDraft("");
  }

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!account) return;
    const updated = {
      ...account,
      name: profileName.trim(),
      username: profileUsername.trim().replace(/^@/, ""),
      bio: profileBio.trim(),
    };
    setAccount(updated);
    setMasters((current) =>
      current.map((master) =>
        master.name === account.name && account.role === "usta"
          ? {
              ...master,
              name: updated.name,
              description: updated.bio || master.description,
            }
          : master,
      ),
    );
    setNotice("Profil sozlamalari saqlandi.");
    setModal(null);
  }

  function rateMaster(masterId: string, score: number) {
    setMasters((current) =>
      current.map((master) =>
        master.id === masterId
          ? {
              ...master,
              rating: Number(
                ((master.rating * master.reviews + score) / (master.reviews + 1)).toFixed(1),
              ),
              reviews: master.reviews + 1,
            }
          : master,
      ),
    );
    setRatingMasterId(null);
    setNotice(`${score} yulduzli bahoyingiz qabul qilindi.`);
  }

  async function addProfilePhoto(file?: File) {
    if (!file || !account) return;
    if (!file.type.startsWith("image/") || file.size > 2_000_000) {
      setNotice("Rasm tanlang. Fayl hajmi 2 MB dan oshmasin.");
      return;
    }
    let image: string;
    try {
      image = await compressImage(file);
    } catch {
      setNotice("Rasmni qayta ishlashda xatolik yuz berdi.");
      return;
    }
    setAccount({ ...account, photo: image });
    if (account.role === "usta") {
      setMasters((current) =>
        current.map((master) =>
          master.name === account.name ? { ...master, photo: image } : master,
        ),
      );
    }
    setNotice("Profil rasmi yangilandi.");
  }

  async function addStory(file?: File) {
    if (!file || !account) return;
    const maxStories = account.pro ? 30 : 5;
    if (account.stories.length >= maxStories) {
      setNotice(
        account.pro
          ? "Story limiti 30 ta."
          : "Bepul rejada 5 ta story limiti bor. PRO rejimni yoqing.",
      );
      return;
    }
    if (!file.type.startsWith("image/") || file.size > 2_000_000) {
      setNotice("Rasm tanlang. Fayl hajmi 2 MB dan oshmasin.");
      return;
    }
    let image: string;
    try {
      image = await compressImage(file);
    } catch {
      setNotice("Rasmni qayta ishlashda xatolik yuz berdi.");
      return;
    }
    const updated = { ...account, stories: [...account.stories, image] };
    setAccount(updated);
    setStoryCount(updated.stories.length);
    setNotice("Story profilingizga qo‘shildi.");
  }

  function togglePro() {
    if (!account) return;
    const updated = { ...account, pro: !account.pro };
    setAccount(updated);
    setNotice(
      updated.pro
        ? "PRO demo rejimi yoqildi. Bu haqiqiy to‘lov emas."
        : "Bepul rejim yoqildi.",
    );
  }

  function toggleSticker(sticker: string) {
    if (!account) return;
    if (account.stickers.includes(sticker)) {
      setAccount({
        ...account,
        stickers: account.stickers.filter((item) => item !== sticker),
      });
    } else if (!account.pro && account.stickers.length >= 2) {
      setNotice("Bepul rejada 2 ta belgi tanlash mumkin.");
    } else {
      setAccount({ ...account, stickers: [...account.stickers, sticker] });
    }
  }

  if (loading) {
    return (
      <main className="loader-screen" aria-label="UstaBozor yuklanmoqda">
        <div className="loader-mark">
          <Wrench size={25} strokeWidth={2.3} />
        </div>
        <div className="loader-wordmark">
          usta<span>bozor</span>
        </div>
        <div className="loader-line">
          <i />
        </div>
        <p>Yaxshi ustalar yaqin</p>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button
          className="brand"
          onClick={() => setView("bozor")}
          aria-label="UstaBozor bosh sahifasi"
        >
          <span className="brand-mark">
            <Wrench size={20} />
          </span>
          <span>
            usta<span className="brand-light">bozor</span>
            <small>ISHONCHLI USTA, OSON ISH</small>
          </span>
        </button>
        <div className="side-label">MENYU</div>
        <nav className="side-nav" aria-label="Asosiy menyu">
          <button
            className={view === "bozor" ? "nav-item active" : "nav-item"}
            onClick={() => setView("bozor")}
          >
            <HomeIcon size={18} /> Bozor{" "}
            <span className="nav-chevron">
              <ArrowRight size={15} />
            </span>
          </button>
          <button
            className={view === "xabarlar" ? "nav-item active" : "nav-item"}
            onClick={() => setView("xabarlar")}
          >
            <MessageCircle size={18} /> Xabarlar{" "}
            <span className="nav-count">
              {Object.values(chats).reduce(
                (sum, items) => sum + items.length,
                0,
              ) || ""}
            </span>
          </button>
          <button
            className={view === "profil" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setView("profil");
              if (!account) setModal("register");
            }}
          >
            <UserRound size={18} /> Profil
          </button>
        </nav>
        <div className="side-rule" />
        <div className="side-label">XIZMATLAR</div>
        <div className="service-list">
          {categories.slice(1).map((item, index) => (
            <button
              key={item}
              onClick={() => {
                setCategory(item);
                setView("bozor");
              }}
            >
              <span className={`service-dot dot-${index}`} />
              {item}
              <ArrowRight size={14} />
            </button>
          ))}
        </div>
        <div className="side-spacer" />
        <div className="help-block">
          <span className="help-icon">
            <CircleHelp size={17} />
          </span>
          <strong>Yordam kerakmi?</strong>
          <p>Biz bilan istalgan vaqtda bog‘laning.</p>
          <button
            onClick={() => setNotice("Yordam markazi tez orada ishga tushadi.")}
          >
            Yordam markazi <ArrowRight size={14} />
          </button>
        </div>
        <button
          className="account-chip"
          onClick={() =>
            account ? setModal("settings") : setModal("register")
          }
        >
          <span className="user-initial">
            {account?.name.slice(0, 1) ?? "U"}
          </span>
          <span className="account-info">
            <b>{account?.name ?? "Mehmon"}</b>
            <small>
              {account
                ? account.role === "usta"
                  ? "Usta akkaunti"
                  : "Mijoz akkaunti"
                : "Akkaunt ochish"}
            </small>
          </span>
          <MoreHorizontal size={18} />
        </button>
      </aside>

      <section className="main-column">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Bosh sahifa</span>
            <span>/</span>
            <b>
              {view === "bozor"
                ? "Ustalar bozori"
                : view === "xabarlar"
                  ? "Xabarlar"
                  : "Profil"}
            </b>
          </div>
          <div className="top-actions">
            <span className="location-chip">
              <MapPin size={15} /> Toshkent <ChevronDown size={14} />
            </span>
            <button
              className="icon-button"
              title="Bildirishnomalar"
              onClick={() => setNotice("Hozircha yangi bildirishnomalar yo‘q.")}
            >
              <Bell size={18} />
              <i />
            </button>
            <span className="top-divider" />
            <button
              className="top-profile"
              onClick={() =>
                account ? setModal("settings") : setModal("register")
              }
            >
              <span className="user-initial small-initial">
                {account?.name.slice(0, 1) ?? "U"}
              </span>
              <ChevronDown size={14} />
            </button>
          </div>
        </header>

        {view === "bozor" && (
          <>
            <section className="welcome-row">
              <div>
                <p className="eyebrow">USTABOZOR JAMOASI</p>
                <h1>
                  Assalomu alaykum
                  {account ? `, ${account.name.split(" ")[0]}` : ""}{" "}
                  <span>!</span>
                </h1>
                <p className="welcome-copy">
                  Uyingiz uchun ishonchli ustani toping yoki mahoratingizni
                  namoyish eting.
                </p>
              </div>
              <button
                className="outline-action"
                onClick={() => setModal("register")}
              >
                <WandSparkles size={16} />{" "}
                {account ? "Akkaunt sozlamasi" : "Usta bo‘lib qo‘shilish"}
              </button>
            </section>

            <section className="search-panel">
              <div className="search-copy">
                <span className="search-icon">
                  <Search size={19} />
                </span>
                <div>
                  <b>Qanday xizmat kerak?</b>
                  <small>
                    Minglab tekshirilgan mutaxassislar orasidan tanlang
                  </small>
                </div>
              </div>
              <label className="search-input">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Usta yoki xizmat nomini yozing"
                  aria-label="Usta yoki xizmat bo‘yicha qidirish"
                />
                <kbd>⌘ K</kbd>
              </label>
              <button
                className="search-submit"
                onClick={() =>
                  document
                    .querySelector<HTMLInputElement>(".search-input input")
                    ?.focus()
                }
              >
                Izlash <ArrowRight size={16} />
              </button>
            </section>

            <div className="section-heading category-heading">
              <div>
                <h2>Ommabop xizmatlar</h2>
                <p>Kerakli yo‘nalishni tanlang</p>
              </div>
              <button
                className="text-link"
                onClick={() => setCategory("Barchasi")}
              >
                Barchasini ko‘rish <ArrowRight size={15} />
              </button>
            </div>
            <div className="category-row">
              {categories.slice(1).map((item, index) => (
                <button
                  key={item}
                  className={`category-tile category-${index} ${category === item ? "chosen" : ""}`}
                  onClick={() =>
                    setCategory(category === item ? "Barchasi" : item)
                  }
                >
                  <span className="category-icon">
                    {index === 0 ? (
                      <ZapIcon />
                    ) : index === 1 ? (
                      <DropletIcon />
                    ) : index === 2 ? (
                      <Hammer size={21} />
                    ) : (
                      <Sparkles size={21} />
                    )}
                  </span>
                  <span>
                    <b>{item}</b>
                    <small>
                      {
                        [
                          "56 ta usta",
                          "42 ta usta",
                          "38 ta usta",
                          "24 ta usta",
                        ][index]
                      }
                    </small>
                  </span>
                  <ArrowRight size={16} />
                </button>
              ))}
            </div>

            {topMaster && (
              <section className="top-master-panel">
                <div className="top-master-copy">
                  <div className="top-label">
                    <span>
                      <Sparkles size={14} />
                    </span>{" "}
                    HAFTANING ENG YAXSHI USTASI
                  </div>
                  <div className="top-master-name">
                    <Avatar master={topMaster} />
                    <div>
                      <h2>{topMaster.name}</h2>
                      <p>
                        {topMaster.specialty} <span>·</span> {topMaster.city}
                      </p>
                    </div>
                  </div>
                  <p className="top-description">{topMaster.description}</p>
                  <div className="top-stats">
                    <div className="rating-area top-rating-area">
                      <button
                        className="top-rating-trigger"
                        aria-label={`${topMaster.name}ga baho berish`}
                        onClick={() => setRatingMasterId(ratingMasterId === topMaster.id ? null : topMaster.id)}
                      >
                        <Star size={16} fill="currentColor" />
                        <b>{topMaster.rating.toFixed(1)}</b>
                        <small>({topMaster.reviews} baho)</small>
                      </button>
                      {ratingMasterId === topMaster.id && (
                        <div className="rating-editor" role="group" aria-label="Yulduz bilan baholash">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button key={score} aria-label={`${score} yulduz`} onClick={() => rateMaster(topMaster.id, score)}><Star size={16} fill="currentColor" /></button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span>
                      <BriefcaseBusiness size={15} /> {topMaster.completed} ta
                      ish
                    </span>
                    <span>
                      <ShieldCheck size={15} /> Tekshirilgan
                    </span>
                  </div>
                  <div className="top-actions-row">
                    <button
                      className="primary-button"
                      onClick={() => openChat(topMaster)}
                    >
                      Usta bilan bog‘lanish <ArrowRight size={16} />
                    </button>
                    <button
                      className="save-button"
                      title="Sevimlilarga qo‘shish"
                      onClick={() => setNotice("Usta sevimlilarga qo‘shildi.")}
                    >
                      <Heart size={18} />
                    </button>
                  </div>
                </div>
                <div
                  className="top-master-photo"
                  style={{
                    backgroundImage: `url("${topMaster.photo}")`,
                    backgroundColor: topMaster.color,
                  }}
                >
                  <span className="photo-rating">
                    <Star size={15} fill="currentColor" />{" "}
                    {topMaster.rating.toFixed(1)}
                  </span>
                  <span className="photo-note">
                    <span className="online-dot" /> Bugun javob beradi
                  </span>
                  <span className="photo-index">
                    01 <i>/ 04</i>
                  </span>
                </div>
              </section>
            )}

            <div className="section-heading masters-heading">
              <div>
                <h2>Atrofingizdagi ustalar</h2>
                <p>
                  {category === "Barchasi"
                    ? "Mijozlar eng ko‘p tanlayotgan mutaxassislar"
                    : `${category} xizmatidagi mutaxassislar`}
                </p>
              </div>
              <button
                className="filter-button"
                onClick={() =>
                  setNotice("Saralash: eng yuqori reyting birinchi o‘rinda.")
                }
              >
                <SlidersHorizontal size={16} /> Saralash{" "}
                <ArrowDownWideNarrow size={14} />
              </button>
            </div>
            <div className="filter-tabs">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={category === item ? "selected" : ""}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="master-grid">
              {filteredMasters
                .filter((master) => master.id !== topMaster?.id)
                .map((master) => (
                  <article className="master-card" key={master.id}>
                    <div className="card-photo-wrap">
                      <Avatar master={master} />
                      <button
                        className="heart-button"
                        aria-label={`${master.name}ni saqlash`}
                        onClick={() =>
                          setNotice("Usta sevimlilarga qo‘shildi.")
                        }
                      >
                        <Heart size={17} />
                      </button>
                      {master.tags[0] && (
                        <span className="card-tag">{master.tags[0]}</span>
                      )}
                    </div>
                    <div className="master-card-body">
                      <div className="card-title-row">
                        <div>
                          <h3>
                            {master.name}
                            {master.verified && (
                              <BadgeCheck size={15} className="verified" />
                            )}
                          </h3>
                          <p>
                            {master.specialty} ·{" "}
                            {master.city.split(",")[1]?.trim()}
                          </p>
                        </div>
                        <div className="rating-area">
                          <button
                            className="rating-pill"
                            aria-label={`${master.name}ga baho berish`}
                            onClick={() => setRatingMasterId(ratingMasterId === master.id ? null : master.id)}
                          >
                            <Star size={13} fill="currentColor" /> {master.rating.toFixed(1)}
                          </button>
                          {ratingMasterId === master.id && (
                            <div className="rating-editor" role="group" aria-label="Yulduz bilan baholash">
                              {[1, 2, 3, 4, 5].map((score) => (
                                <button key={score} aria-label={`${score} yulduz`} onClick={() => rateMaster(master.id, score)}><Star size={16} fill="currentColor" /></button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="card-detail">
                        <span>
                          <BriefcaseBusiness size={14} /> {master.completed} ta
                          ish
                        </span>
                        <span>{master.price}</span>
                      </div>
                      <div className="card-footer">
                        <span>{master.reviews} ta mijoz bahosi</span>
                        <button onClick={() => openChat(master)}>
                          Bog‘lanish <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              {filteredMasters.length === 0 && (
                <div className="empty-state">
                  <Search size={24} />
                  <b>Usta topilmadi</b>
                  <span>Boshqa nom yoki xizmatni qidirib ko‘ring.</span>
                </div>
              )}
            </div>
          </>
        )}

        {view === "xabarlar" && (
          <section className="workspace-view">
            <div className="view-heading">
              <div>
                <p className="eyebrow">ALOQA MARKAZI</p>
                <h1>Xabarlar</h1>
                <p>Ustalar bilan kelishuvlaringiz shu yerda.</p>
              </div>
              <span className="message-count">
                <MessageCircle size={17} /> {Object.keys(chats).length} suhbat
              </span>
            </div>
            <div className="conversation-list">
              {rankedMasters.map((master) => (
                <button
                  className="conversation-row"
                  key={master.id}
                  onClick={() => openChat(master)}
                >
                  <Avatar master={master} small />
                  <span className="conversation-copy">
                    <b>{master.name}</b>
                    <small>
                      {chats[master.id]?.at(-1)?.text ??
                        `${master.specialty} · ${master.city}`}
                    </small>
                  </span>
                  <span className="conversation-meta">
                    <small>{chats[master.id]?.at(-1)?.time ?? "Yangi"}</small>
                    <ArrowRight size={15} />
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {view === "profil" && (
          <section className="workspace-view profile-view">
            <div className="view-heading">
              <div>
                <p className="eyebrow">SHAXSIY KABINET</p>
                <h1>
                  {account?.role === "usta" ? "Usta profilingiz" : "Akkaunt"}
                </h1>
                <p>Ma’lumotlaringiz va hikoyalaringizni boshqaring.</p>
              </div>
              {account && (
                <button
                  className="outline-action"
                  onClick={() => setModal("settings")}
                >
                  <Settings2 size={16} /> Profilni sozlash
                </button>
              )}
            </div>
            {account ? (
              <>
                <div className="profile-summary">
                  <div
                    className="profile-avatar"
                    style={account.photo ? { backgroundImage: `url("${account.photo}")` } : undefined}
                  >
                    {!account.photo && account.name.slice(0, 1)}
                  </div>
                  <div>
                    <span className="account-role">
                      {account.role === "usta"
                        ? "USTA PROFILI"
                        : "MIJOZ AKKAUNTI"}
                    </span>
                    <h2>
                      {account.name}{" "}
                      {account.stickers.map((sticker) => (
                        <span key={sticker}>{sticker}</span>
                      ))}
                    </h2>
                    <p>
                      {account.username
                        ? `@${account.username}`
                        : "Nik belgilanmagan"}{" "}
                      · {account.city}
                    </p>
                    <p>
                      {account.bio || "O‘zingiz haqingizda qisqacha yozing."}
                    </p>
                    {account.role === "usta" && (
                      <label className="profile-photo-upload">
                        <Camera size={14} /> Profil rasmini o‘zgartirish
                        <input type="file" accept="image/*" onChange={(event) => addProfilePhoto(event.target.files?.[0])} />
                      </label>
                    )}
                  </div>
                </div>
                {account.role === "usta" && (
                  <>
                    <div className="story-manager">
                      <div className="manager-heading">
                        <div>
                          <h2>Hikoyalarim</h2>
                          <p>
                            {storyCount} / {account.pro ? 30 : 5} ta joylandi
                          </p>
                        </div>
                        <label className="story-upload">
                          <ImagePlus size={16} /> Rasm yuklash
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                              addStory(event.target.files?.[0])
                            }
                          />
                        </label>
                      </div>
                      <div className="story-track">
                        {account.stories.map((image, index) => (
                          <div
                            className="story-thumb"
                            key={`${index}-${image.slice(0, 20)}`}
                            style={{ backgroundImage: `url("${image}")` }}
                          >
                            <span>{index + 1}</span>
                          </div>
                        ))}
                        {account.stories.length === 0 && (
                          <div className="no-stories">
                            <Camera size={20} /> Hali hikoya qo‘shilmagan
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="pro-banner">
                      <span className="pro-symbol">
                        <Sparkles size={20} />
                      </span>
                      <div>
                        <b>
                          {account.pro
                            ? "PRO demo rejimi faol"
                            : "UstaBozor PRO"}
                        </b>
                        <p>
                          {account.pro
                            ? "30 tagacha story · maxsus belgilar · avtomatik javob"
                            : "30+ hikoya, animatsiyali belgilar va avto-javob."}{" "}
                          <small>· $1/oy yoki $9/yil (demo narx)</small>
                        </p>
                      </div>
                      <button onClick={togglePro}>
                        {account.pro ? "Bepul rejim" : "PRO’ni sinash"}{" "}
                        <ArrowRight size={15} />
                      </button>
                    </div>
                    <div className="sticker-panel">
                      <div>
                        <h2>Profil bezaklari</h2>
                        <p>Username yonida ko‘rinadigan belgilar</p>
                      </div>
                      <div className="sticker-options">
                        {stickerOptions.map((sticker) => (
                          <button
                            key={sticker}
                            className={
                              account.stickers.includes(sticker)
                                ? "sticker-selected"
                                : ""
                            }
                            onClick={() => toggleSticker(sticker)}
                            title={`Belgi ${sticker}`}
                          >
                            {sticker}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="auto-reply-row">
                      <span className="auto-icon">
                        <MessageCircle size={18} />
                      </span>
                      <div>
                        <b>Avto-javob</b>
                        <p>
                          {account.pro
                            ? "Salom! Xabaringizni oldim, tez orada javob beraman."
                            : "PRO rejimida foydalanish mumkin"}
                        </p>
                      </div>
                      <span
                        className={
                          account.pro
                            ? "toggle-switch enabled"
                            : "toggle-switch"
                        }
                      >
                        <i />
                      </span>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="profile-empty">
                <span>
                  <UserRound size={26} />
                </span>
                <h2>Akkauntingiz hali yo‘q</h2>
                <p>Usta yoki mijoz sifatida ro‘yxatdan o‘ting.</p>
                <button
                  className="primary-button"
                  onClick={() => setModal("register")}
                >
                  Ro‘yxatdan o‘tish <ArrowRight size={16} />
                </button>
              </div>
            )}
          </section>
        )}

        <footer className="page-footer">
          <span>© 2025 UstaBozor</span>
          <span>
            <ShieldCheck size={14} /> Xavfsiz va ishonchli xizmat
          </span>
          <button
            onClick={() =>
              setNotice("Maxfiylik qoidalari tez orada qo‘shiladi.")
            }
          >
            Maxfiylik
          </button>
          <button
            onClick={() =>
              setNotice("Foydalanish shartlari tez orada qo‘shiladi.")
            }
          >
            Foydalanish shartlari
          </button>
        </footer>
      </section>

      {modal === "register" && (
        <div
          className="overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModal(null);
          }}
        >
          <section
            className="dialog register-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-title"
          >
            <button
              className="close-dialog"
              onClick={() => setModal(null)}
              aria-label="Yopish"
            >
              <X size={19} />
            </button>
            <div className="dialog-kicker">
              <span>
                <UsersRound size={16} />
              </span>{" "}
              USTABOZORGA QO‘SHILING
            </div>
            <h2 id="register-title">Hisob ochish</h2>
            <p className="dialog-subtitle">Sizga mos akkaunt turini tanlang.</p>
            <div className="role-switch">
              <button
                className={registerRole === "usta" ? "role-active" : ""}
                onClick={() => setRegisterRole("usta")}
              >
                <Wrench size={17} />
                <b>Men ustaman</b>
                <small>Xizmatlarimni taklif qilaman</small>
              </button>
              <button
                className={registerRole === "mijoz" ? "role-active" : ""}
                onClick={() => setRegisterRole("mijoz")}
              >
                <UserRound size={17} />
                <b>Usta kerak</b>
                <small>Ishonchli usta izlayman</small>
              </button>
            </div>
            <form className="dialog-form" onSubmit={submitRegistration}>
              <label>
                Ism va familiya
                <input
                  required
                  value={registerName}
                  onChange={(event) => setRegisterName(event.target.value)}
                  placeholder="Masalan, Ali Valiyev"
                />
              </label>
              <label>
                Telefon raqami
                <input
                  required
                  type="tel"
                  value={registerPhone}
                  onChange={(event) => setRegisterPhone(event.target.value)}
                  placeholder="+998 90 123 45 67"
                />
              </label>
              {registerRole === "usta" && (
                <label>
                  Asosiy xizmat
                  <select
                    value={registerSpecialty}
                    onChange={(event) =>
                      setRegisterSpecialty(event.target.value)
                    }
                  >
                    {categories.slice(1).map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              )}
              <button className="primary-button full-button" type="submit">
                Bepul akkaunt ochish <ArrowRight size={16} />
              </button>
              <p className="local-note">
                <ShieldCheck size={14} /> Ma’lumotlar faqat ushbu brauzerda
                saqlanadi.
              </p>
            </form>
          </section>
        </div>
      )}

      {modal === "chat" && chatMaster && (
        <div
          className="overlay chat-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModal(null);
          }}
        >
          <section
            className="chat-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={`${chatMaster.name} bilan suhbat`}
          >
            <header className="chat-header">
              <button
                className="back-button"
                onClick={() => setModal(null)}
                aria-label="Orqaga"
              >
                <ArrowLeft size={19} />
              </button>
              <Avatar master={chatMaster} small />
              <div>
                <b>{chatMaster.name}</b>
                <small>
                  <span className="online-dot" /> {chatMaster.specialty} ·
                  odatda tez javob beradi
                </small>
              </div>
              <button
                className="close-dialog"
                onClick={() => setModal(null)}
                aria-label="Yopish"
              >
                <X size={19} />
              </button>
            </header>
            <div className="chat-context">
              <span>
                <BriefcaseBusiness size={16} />
              </span>
              <div>
                <b>{chatMaster.specialty} xizmati</b>
                <small>
                  {chatMaster.city} · {chatMaster.price}
                </small>
              </div>
              <button
                onClick={() =>
                  setNotice(
                    chatMaster.phone ? `Telefon: ${chatMaster.phone}` : "Bu usta telefon raqamini hali kiritmagan.",
                  )
                }
              >
                Aloqa
              </button>
            </div>
            <div className="chat-messages">
              {currentMessages.length === 0 && (
                <div className="chat-welcome">
                  <span>
                    <MessageCircle size={20} />
                  </span>
                  <b>Suhbatni boshlang</b>
                  <p>{chatMaster.name}ga ish tafsilotlarini yozib yuboring.</p>
                  <button
                    onClick={() =>
                      setDraft(
                        "Assalomu alaykum, xizmatingiz haqida ma’lumot bersangiz.",
                      )
                    }
                  >
                    Salomlashish xabarini yozish <ArrowRight size={14} />
                  </button>
                </div>
              )}
              {currentMessages.map((message, index) => (
                <div
                  key={`${index}-${message.time}`}
                  className={`message-bubble ${message.author === (account?.name ?? "Men") ? "mine" : "theirs"}`}
                >
                  <span>{message.text}</span>
                  <small>{message.time}</small>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form className="chat-compose" onSubmit={sendMessage}>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Xabaringizni yozing..."
                aria-label="Xabar matni"
              />
              <button
                type="submit"
                aria-label="Xabar yuborish"
                disabled={!draft.trim()}
              >
                <Send size={17} />
              </button>
            </form>
            <p className="chat-local-hint">
              Xabarlar ushbu qurilmada saqlanadi
            </p>
          </section>
        </div>
      )}

      {modal === "settings" && account && (
        <div
          className="overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModal(null);
          }}
        >
          <section
            className="dialog settings-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="settings-title"
          >
            <button
              className="close-dialog"
              onClick={() => setModal(null)}
              aria-label="Yopish"
            >
              <X size={19} />
            </button>
            <div className="dialog-kicker">
              <span>
                <Settings2 size={16} />
              </span>{" "}
              PROFIL BOSHQARUVI
            </div>
            <h2 id="settings-title">Profil sozlamalari</h2>
            <p className="dialog-subtitle">
              O‘zingizni mijozlarga tanishtiring.
            </p>
            <form className="dialog-form" onSubmit={saveProfile}>
              <label>
                Ism va familiya
                <input
                  required
                  value={profileName}
                  onChange={(event) => setProfileName(event.target.value)}
                />
              </label>
              <label>
                Username
                <input
                  value={profileUsername}
                  onChange={(event) => setProfileUsername(event.target.value)}
                  placeholder="username"
                />
              </label>
              <label>
                Qisqacha ma’lumot
                <textarea
                  value={profileBio}
                  onChange={(event) => setProfileBio(event.target.value)}
                  placeholder="Tajriba va xizmatlaringiz haqida..."
                  rows={3}
                />
              </label>
              <div className="settings-phone">
                <span>
                  <ShieldCheck size={16} /> Telefon raqami
                </span>
                <b>{account.phone}</b>
              </div>
              <button className="primary-button full-button" type="submit">
                O‘zgarishlarni saqlash <Check size={16} />
              </button>
            </form>
          </section>
        </div>
      )}

      {notice && (
        <div className="toast" role="status">
          <span>
            <Check size={16} />
          </span>
          {notice}
          <button
            onClick={() => setNotice("")}
            aria-label="Bildirishnomani yopish"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </main>
  );
}

async function compressImage(file: File): Promise<string> {
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const image = new Image();
  image.src = source;
  await image.decode();

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Rasmni qayta ishlash mavjud emas.");

  let scale = Math.min(1, 960 / Math.max(image.naturalWidth, image.naturalHeight));
  let compressed = "";
  for (let resize = 0; resize < 7; resize += 1) {
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.72, 0.58, 0.44, 0.32]) {
      compressed = canvas.toDataURL("image/webp", quality);
      if (compressed.length <= 115_000) return compressed;
    }
    scale *= 0.78;
  }
  if (compressed.length > 115_000) {
    throw new Error("Rasmni kichraytirib bo‘lmadi.");
  }
  return compressed;
}

function ZapIcon() {
  return <span className="text-glyph">ϟ</span>;
}
function DropletIcon() {
  return <span className="text-glyph droplet-glyph">◉</span>;
}
