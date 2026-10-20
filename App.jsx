import { useState, useEffect } from "react";
import "./App.css";

/*DATA*/
const MATKUL = [
  { kode: "IF101", nama: "Algoritma dan Pemrograman", sks: 3, semester: 1, dosen: "Dr. Rina Kusuma", deskripsi: "Dasar berpikir algoritmik, variabel, percabangan, perulangan, dan fungsi menggunakan Java." },
  { kode: "IF102", nama: "Matematika Diskrit", sks: 3, semester: 1, dosen: "Budi Santoso, M.Kom.", deskripsi: "Logika, himpunan, relasi, graf, dan pohon sebagai fondasi ilmu komputer." },
  { kode: "IF201", nama: "Struktur Data", sks: 3, semester: 3, dosen: "Dr. Rina Kusuma", deskripsi: "Array, linked list, stack, queue, tree, dan analisis kompleksitas sederhana." },
  { kode: "IF202", nama: "Basis Data", sks: 3, semester: 3, dosen: "Sari Wulandari, M.T.", deskripsi: "Pemodelan ER, normalisasi, dan SQL untuk mengelola data." },
  { kode: "IF301", nama: "Pemrograman Web", sks: 3, semester: 5, dosen: "Agus Prasetyo, M.Kom.", deskripsi: "HTML, CSS, JavaScript, dan React untuk membangun antarmuka web modern." },
  { kode: "IF302", nama: "Rekayasa Perangkat Lunak", sks: 3, semester: 5, dosen: "Sari Wulandari, M.T.", deskripsi: "Siklus hidup perangkat lunak, kebutuhan, desain, pengujian, dan kerja tim." },
];

const FAQ = [
  { t: "Berapa lama masa studi?", d: "Masa studi normal adalah 8 semester (4 tahun) dengan beban 144 SKS." },
  { t: "Apakah ada program magang?", d: "Ya. Mahasiswa dapat magang di industri pada semester 7 dan dikonversi menjadi SKS." },
  { t: "Apa prospek lulusan?", d: "Pengembang perangkat lunak, analis data, administrator sistem, dan wirausaha teknologi." },
];

/*HOOK ROUTING (hash)*/
function useHash() {
  const [hash, setHash] = useState(window.location.hash || "#/");
  useEffect(() => {
    const onChange = () => {
      setHash(window.location.hash || "#/");
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

/*HOOK localStorage*/
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

/*KOMPONEN REUSABLE*/
const MENU = [
  ["#/", "Beranda"],
  ["#/prodi", "Profil Prodi"],
  ["#/matkul", "Mata Kuliah"],
  ["#/kontak", "Kontak"],
];

function Navbar({ hash }) {
  const [open, setOpen] = useState(false);
  const aktif = (h) => (h === "#/" ? hash === "#/" : hash.startsWith(h));
  return (
    <header className="navbar">
      <a className="brand" href="#/">Informatika</a>
      <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">
        {open ? "Tutup" : "Menu"}
      </button>
      <nav className={open ? "menu show" : "menu"}>
        {MENU.map(([h, label]) => (
          <a key={h} href={h} className={aktif(h) ? "aktif" : ""} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 Program Studi Informatika Universitas Tralala</p>
    </footer>
  );
}

function Card({ judul, children, aksi }) {
  return (
    <article className="card">
      <h3>{judul}</h3>
      <div className="card-body">{children}</div>
      {aksi && <div className="card-aksi">{aksi}</div>}
    </article>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <small className="error">{error}</small>}
    </label>
  );
}

function ContactForm({ onSubmit }) {
  const [data, setData] = useState({ nama: "", email: "", pesan: "" });
  const [errors, setErrors] = useState({});

  const ubah = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const validasi = () => {
    const err = {};
    if (data.nama.trim().length < 3) err.nama = "Nama minimal 3 karakter.";
    if (!/^\S+@\S+\.\S+$/.test(data.email)) err.email = "Format Email belum benar.";
    if (data.pesan.trim().length < 10) err.pesan = "Pesan minimal 10 karakter.";
    return err;
  };

  const kirim = (e) => {
    e.preventDefault();
    const err = validasi();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      onSubmit({ ...data, waktu: new Date().toLocaleString("id-ID") });
      setData({ nama: "", email: "", pesan: "" });
    }
  };

  return (
    <form className="form" onSubmit={kirim} noValidate>
      <Field label="Nama" error={errors.nama}>
        <input name="nama" value={data.nama} onChange={ubah} />
      </Field>
      <Field label="Email" error={errors.email}>
        <input name="email" type="email" value={data.email} onChange={ubah} />
      </Field>
      <Field label="Pesan" error={errors.pesan}>
        <textarea name="pesan" rows="4" value={data.pesan} onChange={ubah} />
      </Field>
      <button className="btn" type="submit">Kirim pesan</button>
    </form>
  );
}

/*HALAMAN*/
function Beranda() {
  return (
    <>
      <section className="hero">
        <h1>Belajar membangun perangkat lunak yang berguna bagi banyak orang.</h1>
        <p>Program Studi Informatika membekali mahasiswa dengan dasar pemrograman, data, dan rekayasa sistem.</p>
        <a className="btn" href="#/matkul">Lihat mata kuliah</a>
      </section>
      <section className="grid">
        <Card judul="Kurikulum Terapan">Proyek nyata di setiap semester, dari aplikasi web sampai analisis data.</Card>
        <Card judul="Dosen Praktisi">Pengajar berpengalaman di akademik dan industri.</Card>
        <Card judul="Lulusan Siap Kerja">Magang dan sertifikasi kompetensi menjadi bagian dari studi.</Card>
      </section>
    </>
  );
}

function ProfilProdi() {
  const [buka, setBuka] = useState(null); // fitur interaktif: accordion
  return (
    <section>
      <h1>Profil Program Studi</h1>
      <p>
        Program Studi Informatika berdiri sejak 2005 dan terakreditasi Unggul.
        Visi kami: menjadi program studi yang unggul dalam pengembangan teknologi informasi
        yang berdampak bagi masyarakat.
      </p>
      <h2>Pertanyaan umum</h2>
      <div className="accordion">
        {FAQ.map((f, i) => (
          <div key={f.t} className="acc-item">
            <button onClick={() => setBuka(buka === i ? null : i)} aria-expanded={buka === i}>
              {f.t}
            </button>
            {buka === i && <p>{f.d}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}

function MataKuliah({ favorit, toggleFavorit }) {
  const [cari, setCari] = useState("");
  const [semester, setSemester] = useState("semua");

  // fitur interaktif: pencarian + filter semester
  const hasil = MATKUL.filter(
    (m) =>
      m.nama.toLowerCase().includes(cari.toLowerCase()) &&
      (semester === "semua" || m.semester === Number(semester))
  );

  return (
    <section>
      <h1>Mata Kuliah</h1>
      <div className="filter">
        <input
          placeholder="Cari mata kuliah..."
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          aria-label="Cari mata kuliah"
        />
        <select value={semester} onChange={(e) => setSemester(e.target.value)} aria-label="Filter semester">
          <option value="semua">Semua semester</option>
          {[1, 3, 5].map((s) => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>
      </div>
      {hasil.length === 0 && <p>Tidak ada mata kuliah yang cocok. Ubah kata kunci atau filter.</p>}
      <div className="grid">
        {hasil.map((m) => (
          <Card
            key={m.kode}
            judul={m.nama}
            aksi={
              <>
                <a className="link" href={`#/matkul/${m.kode}`}>Lihat detail</a>
                <button className="btn-kecil" onClick={() => toggleFavorit(m.kode)}>
                  {favorit.includes(m.kode) ? "★ Favorit" : "☆ Simpan"}
                </button>
              </>
            }
          >
            {m.kode} · {m.sks} SKS · Semester {m.semester}
          </Card>
        ))}
      </div>
    </section>
  );
}

function ProfilMatkul({ kode, favorit, toggleFavorit }) {
  const m = MATKUL.find((x) => x.kode === kode);
  if (!m) return (
    <section>
      <h1>Mata kuliah tidak ditemukan</h1>
      <a className="link" href="#/matkul">Kembali ke daftar</a>
    </section>
  );
  return (
    <section>
      <a className="link" href="#/matkul">← Daftar mata kuliah</a>
      <h1>{m.nama}</h1>
      <dl className="detail">
        <dt>Kode</dt><dd>{m.kode}</dd>
        <dt>SKS</dt><dd>{m.sks}</dd>
        <dt>Semester</dt><dd>{m.semester}</dd>
        <dt>Dosen</dt><dd>{m.dosen}</dd>
      </dl>
      <p>{m.deskripsi}</p>
      <button className="btn" onClick={() => toggleFavorit(m.kode)}>
        {favorit.includes(m.kode) ? "Hapus dari favorit" : "Simpan ke favorit"}
      </button>
    </section>
  );
}

function Kontak() {
  const [pesan, setPesan] = useLocalStorage("pesan", []);
  const [info, setInfo] = useState("");

  const tambah = (p) => {
    setPesan([p, ...pesan]);
    setInfo("Pesan terkirim dan disimpan di peramban ini.");
  };

  return (
    <section>
      <h1>Kontak</h1>
      <p>Gedung C Lantai 2, Kampus Tralala · prodi@tralala.ac.id</p>
      <ContactForm onSubmit={tambah} />
      {info && <p className="sukses">{info}</p>}
      {pesan.length > 0 && (
        <>
          <h2>Pesan tersimpan</h2>
          <ul className="pesan">
            {pesan.map((p, i) => (
              <li key={i}>
                <strong>{p.nama}</strong> <small>{p.waktu}</small>
                <p>{p.pesan}</p>
              </li>
            ))}
          </ul>
          <button className="btn-kecil" onClick={() => { setPesan([]); setInfo(""); }}>
            Hapus semua pesan
          </button>
        </>
      )}
    </section>
  );
}

/*APP*/
export default function App() {
  const hash = useHash();
  const [favorit, setFavorit] = useLocalStorage("favorit", []);

  const toggleFavorit = (kode) =>
    setFavorit((f) => (f.includes(kode) ? f.filter((k) => k !== kode) : [...f, kode]));

  let halaman;
  if (hash.startsWith("#/matkul/")) {
    halaman = <ProfilMatkul kode={hash.split("/")[2]} favorit={favorit} toggleFavorit={toggleFavorit} />;
  } else if (hash === "#/matkul") {
    halaman = <MataKuliah favorit={favorit} toggleFavorit={toggleFavorit} />;
  } else if (hash === "#/prodi") {
    halaman = <ProfilProdi />;
  } else if (hash === "#/kontak") {
    halaman = <Kontak />;
  } else {
    halaman = <Beranda />;
  }

  return (
    <>
      <Navbar hash={hash} />
      <main className="container">{halaman}</main>
      <Footer />
    </>
  );
}
