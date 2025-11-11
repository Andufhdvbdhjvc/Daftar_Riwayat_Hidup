// Calculate age automatically from a single birthdate constant
const BIRTH_DATE = "2005-01-28"; // YYYY-MM-DD (update here if needed)

function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);

  // This year's birthday at local midnight
  const thisYearBirthday = new Date(
    today.getFullYear(),
    birth.getMonth(),
    birth.getDate(),
    0,
    0,
    0,
    0
  );

  let age = today.getFullYear() - birth.getFullYear();

  // If today is before this year's birthday, subtract one
  if (today < thisYearBirthday) {
    age--;
  }

  return age;
}

function updateAge() {
  const ageElement = document.getElementById("age");
  if (ageElement) {
    ageElement.textContent = calculateAge(BIRTH_DATE);
  }
}

// Schedule a precise update at every midnight so the age will increment on the birthday date
function scheduleMidnightUpdate() {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0
  );
  const ms = nextMidnight - now;
  // setTimeout to run once at next midnight, then reschedule recursively
  setTimeout(() => {
    updateAge();
    // schedule the next one
    scheduleMidnightUpdate();
  }, ms + 50); // small buffer to ensure we're past midnight
}

// Small interactions: smooth scroll and contact form demo
// Matrix rain effect
class MatrixRain {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.resizeCanvas();
    this.characters =
      "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ";
    this.fontSize = 16;
    this.columns = 0;
    this.drops = [];

    window.addEventListener("resize", () => this.resizeCanvas());
    this.initDrops();
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.columns = Math.floor(this.canvas.width / this.fontSize);
    this.initDrops();
  }

  initDrops() {
    this.drops = Array(this.columns).fill(1);
  }

  draw() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#0F0";
    this.ctx.font = this.fontSize + "px monospace";

    for (let i = 0; i < this.drops.length; i++) {
      const char =
        this.characters[Math.floor(Math.random() * this.characters.length)];
      const x = i * this.fontSize;
      const y = this.drops[i] * this.fontSize;

      // Add glow effect
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = "#0F0";

      // Fade effect based on position
      const alpha = 1 - y / this.canvas.height;
      this.ctx.fillStyle = `rgba(0, 255, 140, ${alpha})`;

      this.ctx.fillText(char, x, y);

      // Reset shadow for next iteration
      this.ctx.shadowBlur = 0;

      if (y > this.canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      this.drops[i]++;
    }
  }

  animate() {
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Matrix effect
  const canvas = document.getElementById("matrixRain");
  if (canvas) {
    new MatrixRain(canvas);
  }
  // Update age when page loads
  updateAge();

  // Schedule precise midnight update for age
  scheduleMidnightUpdate();
  // Back to top button functionality
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });

    // Scroll to top with smooth behavior
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Setup scroll animation
  const animateElements = document.querySelectorAll(
    ".exp-item, .edu-item, .skill, .about-grid, .hero-card, .info-item"
  );
  animateElements.forEach((el) => {
    el.classList.add("scroll-animate");
  });

  // Setup collapsible sections
  const sections = document.querySelectorAll(".section-collapsible");
  sections.forEach((section) => {
    const header = section.querySelector(".section-header");
    const content = section.querySelector(".section-content");

    // Set initial state
    content.style.maxHeight = content.scrollHeight + "px";

    header.addEventListener("click", () => {
      section.classList.toggle("collapsed");
      if (section.classList.contains("collapsed")) {
        content.style.maxHeight = "0px";
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });

  // Trigger info items animation immediately if in view
  document.querySelectorAll(".info-item").forEach((item, index) => {
    item.style.animationDelay = `${(index + 1) * 0.1}s`;
  }); // Create intersection observer for scroll animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // Observe all animate elements
  animateElements.forEach((el) => {
    observer.observe(el);
  });

  // Smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (href.length > 1) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Simple contact form handling (no network)
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Mengirim...";
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = "Kirim";
        alert("Terima kasih! Pesan Anda telah disimpan (demo).");
        form.reset();
      }, 900);
    });
  }

  // Translation / language selector
  const translations = {
    en: {
      /* stats */
      "stats.lines": "Lines of Code",
      "stats.commits": "Git Commits",
      "stats.uptime": "Uptime %",
      "stats.coffee": "Coffee (ml)",

      "nav.about": "About",
      "nav.education": "Education",
      "nav.experience": "Experience",
      "nav.projects": "Projects",
      "nav.contact": "Contact",
      "btn.hire": "Hire me",
      "hero.greeting": "Hi, I'm Achmad Andi Prayoga.",
      "hero.role": "Junior IT Support",
      "hero.bio":
        "A graduate of Computer Science with strong foundations in programming and application development. Age: {age} years, born in Sidoarjo, passionate about IT and web development.",
      "hero.cta.experience": "See my experience",
      "hero.cta.contact": "Contact me",
      "experience.title": "Work Experience",
      "education.title": "Education",
      "skills.title": "Skills",
      "projects.title": "Projects",
      "contact.title": "Contact",
      "project.link.live": "Live Demo",
      "project.link.code": "Source Code",

      /* quick info */
      "quick.location": "Sidoarjo",
      "quick.degree": "B.Sc. Computer Science",
      "quick.availability": "Available for hire",

      /* identity */
      "identity.birth.label": "Place, Date of Birth",
      "identity.birth.value": "Sidoarjo, 28 January 2005",
      "identity.religion.label": "Religion",
      "identity.religion.value": "Islam",
      "identity.height.label": "Height",
      "identity.height.value": "180 cm",
      "identity.weight.label": "Weight",
      "identity.weight.value": "65 kg",
      "identity.hobby.label": "Hobby",
      "identity.hobby.value": "Swimming",

      /* experience */
      "exp.period.label": "Period:",
      "exp.one.title": "OFERO JX SIDOARJO — Store Staff (Store Boy)",
      "exp.one.address":
        "Jl. Diponegoro No.98, Lemah Putro, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61212",
      "exp.one.period": "January 2025 - May 2025",
      "exp.one.resp.1": "Managed daily store sales",
      "exp.one.resp.2": "Distributed flyers to local households",
      "exp.one.resp.3": "Maintained shop cleanliness",
      "exp.one.resp.4":
        "Handled online sales (social media live, shared promos in groups)",

      "exp.two.title": "Toko Pelangi Stationary — SPB (Sales Promotion Boy)",
      "exp.two.address":
        "Jl. Raya Kemantren No.26, RT.7/RW.2, Keputran, Kemantren, Sidoarjo, Sidoarjo Regency, East Java 61273",
      "exp.two.period": "August 2023 - December 2023",
      "exp.two.resp.1": "Cleaned shop stands",
      "exp.two.resp.2": "Applied product labels (barcode) and price tags",
      "exp.two.resp.3": "Cleaned products",
      "exp.two.resp.4": "Restocked goods",

      /* education */
      "edu.period.label": "Period:",
      "edu.sd.title": "SDN BORO",
      "edu.sd.address":
        "Boro, Kec. Tanggulangin, Kabupaten Sidoarjo, Jawa Timur 61272",
      "edu.sd.period": "2011 - 2017",

      "edu.smp.title": "SMP DHARMAWANITA 7 TANGGULANGIN",
      "edu.smp.address":
        "Kalitengah Utara Rt.01 Rw.01, Kalitengah, Kec. Tanggulangin, Kec. Sidoarjo, Prov, Jawa Timur",
      "edu.smp.period": "2018 - 2019",

      "edu.smk.title": "SMK — SMK ANTARTIKA 2 SIDOARJO",
      "edu.smk.address":
        "Jl. Raya Siwalanpanji No.6, Bedrek, Siwalanpanji, Kec. Buduran, Kabupaten Sidoarjo, Jawa Timur 61252",
      "edu.smk.period": "2020 - 2023",
      "edu.smk.note.1": "Obtained BNSP Certification",
      "edu.smk.note.2": "Scouting (Pramuka)",

      "edu.univ.title": "S1 — UNIVERSITAS MUHAMMADIYAH SIDOARJO",
      "edu.univ.address":
        "Jl. Mojopahit No.666 B, Sidowayah, Celep, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61215",
      "edu.univ.period": "2025 - Present",
      "edu.univ.note.1": "Participating in ASLAB (Laboratory Assistant)",
      "edu.univ.note.2": "Archery UKM",

      /* skills */
      "skills.soft.title": "Soft Skills",
      "skills.soft.team": "Teamwork",
      "skills.soft.discipline": "Work ethic / Discipline",
      "skills.soft.communication": "Effective communication",

      "skills.hard.title": "Hard / Software Skills",
      "skills.hard.ai": "Adobe Illustrator",
      "skills.hard.indesign": "Adobe InDesign",
      "skills.hard.lightroom": "Adobe Lightroom",
      "skills.hard.photoshop": "Adobe Photoshop",
      "skills.hard.premiere": "Adobe Premiere Pro",
      "skills.hard.blender": "Blender",
      "skills.hard.canva": "Canva",
      "skills.hard.corel": "CorelDraw",
      "skills.hard.java": "Java",
      "skills.hard.js": "JavaScript",
      "skills.hard.ppt": "Microsoft PowerPoint",
      "skills.hard.word": "Microsoft Word",
      "skills.hard.python": "Python",

      /* projects */
      "project.one.title": "Portfolio Website",
      "project.one.desc":
        "Personal portfolio website built with HTML, CSS, and JavaScript",
      "project.one.tag.1": "HTML",
      "project.one.tag.2": "CSS",
      "project.one.tag.3": "JavaScript",

      "project.two.title": "Java Calculator App",
      "project.two.desc":
        "Scientific calculator with advanced mathematical functions",
      "project.two.tag.1": "Java",
      "project.two.tag.2": "JavaFX",
      "project.two.tag.3": "UI Design",

      "project.three.title": "Python Data Visualization",
      "project.three.desc":
        "Data analysis and visualization tool using Python libraries",
      "project.three.tag.1": "Python",
      "project.three.tag.2": "Pandas",
      "project.three.tag.3": "Matplotlib",

      /* contact */
      "contact.intro":
        "Want to collaborate? Send a short message — I'll reply.",
      "contact.form.name": "Name",
      "contact.form.email": "Email",
      "contact.form.message": "Message",
      "contact.form.submit": "Send",
      "contact.form.reset": "Reset",

      /* dev skills */
      "devskills.title": "Development Skills",
      "devskills.frontend": "Front-end Development",
      "devskills.responsive": "Responsive Design",
      "devskills.ux": "UX & Visual Design",

      /* footer */
      "footer.copyright": "© 2025 Achmad Andi Prayoga — Made with ♥",
    },
    id: {
      /* stats */
      "stats.lines": "Baris Kode",
      "stats.commits": "Git Commits",
      "stats.uptime": "Uptime %",
      "stats.coffee": "Kopi (ml)",

      "nav.about": "About",
      "nav.education": "Pendidikan",
      "nav.experience": "Pengalaman",
      "nav.projects": "Projects",
      "nav.contact": "Contact",
      "btn.hire": "Hire me",
      "hero.greeting": "Hi, Saya Achmad Andi Prayoga.",
      "hero.role": "Junior IT Support",
      "hero.bio":
        "Seorang lulusan S1 Teknik Informatika dengan dasar kuat dalam logika pemrograman dan pengembangan aplikasi. Berusia {age} tahun, kelahiran Sidoarjo, dengan passion di bidang IT dan web development.",
      "hero.cta.experience": "Lihat pengalaman saya",
      "hero.cta.contact": "Hubungi",
      "experience.title": "Pengalaman Kerja",
      "education.title": "Pendidikan",
      "skills.title": "Skills",
      "projects.title": "Projects",
      "contact.title": "Contact",
      "project.link.live": "Live Demo",
      "project.link.code": "Source Code",

      /* quick info */
      "quick.location": "Sidoarjo",
      "quick.degree": "S1 Teknik Informatika",
      "quick.availability": "Available for hire",

      /* identity */
      "identity.birth.label": "Tempat, Tanggal Lahir",
      "identity.birth.value": "Sidoarjo, 28 Januari 2005",
      "identity.religion.label": "Agama",
      "identity.religion.value": "Islam",
      "identity.height.label": "Tinggi Badan",
      "identity.height.value": "180 Cm",
      "identity.weight.label": "Berat Badan",
      "identity.weight.value": "65 Kg",
      "identity.hobby.label": "Hobi",
      "identity.hobby.value": "Renang",

      /* experience */
      "exp.period.label": "Periode:",
      "exp.one.title": "OFERO JX SIDOARJO — Staff Toko (Store Boy)",
      "exp.one.address":
        "Jl. Diponegoro No.98, Lemah Putro, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61212",
      "exp.one.period": "Januari 2025 - Mei 2025",
      "exp.one.resp.1": "Mengelola penjualan toko setiap hari",
      "exp.one.resp.2": "Melakukan penyebaran brosur di setiap kalangan rumah",
      "exp.one.resp.3": "Membersihkan area toko",
      "exp.one.resp.4":
        "Melakukan penjualan online (live di media sosial, share brosur di grup media sosial)",

      "exp.two.title": "Toko Pelangi Stationary — SPB (Sales Promotion Boy)",
      "exp.two.address":
        "Jl. Raya Kemantren No.26, RT.7/RW.2, Keputran, Kemantren, Sidoarjo, Sidoarjo Regency, East Java 61273",
      "exp.two.period": "Agustus 2023 - Desember 2023",
      "exp.two.resp.1": "Membersihkan stand toko",
      "exp.two.resp.2":
        "Memberi label produk (barcode) dan price tag di setiap stand",
      "exp.two.resp.3": "Membersihkan produk",
      "exp.two.resp.4": "Merestock barang / produk",

      /* education */
      "edu.period.label": "Periode:",
      "edu.sd.title": "SDN BORO",
      "edu.sd.address":
        "Boro, Kec. Tanggulangin, Kabupaten Sidoarjo, Jawa Timur 61272",
      "edu.sd.period": "2011 - 2017",

      "edu.smp.title": "SMP DHARMAWANITA 7 TANGGULANGIN",
      "edu.smp.address":
        "Kalitengah Utara Rt.01 Rw.01, Kalitengah, Kec. Tanggulangin, Kec. Sidoarjo, Prov, Jawa Timur",
      "edu.smp.period": "2018 - 2019",

      "edu.smk.title": "SMK — SMK ANTARTIKA 2 SIDOARJO",
      "edu.smk.address":
        "Jl. Raya Siwalanpanji No.6, Bedrek, Siwalanpanji, Kec. Buduran, Kabupaten Sidoarjo, Jawa Timur 61252",
      "edu.smk.period": "2020 - 2023",
      "edu.smk.note.1": "Mendapatkan Sertifikasi BNSP",
      "edu.smk.note.2": "Pramuka",

      "edu.univ.title": "S1 — UNIVERSITAS MUHAMMADIYAH SIDOARJO",
      "edu.univ.address":
        "Jl. Mojopahit No.666 B, Sidowayah, Celep, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61215",
      "edu.univ.period": "2025 - Sekarang",
      "edu.univ.note.1": "Mengikuti ASLAB (Asisten Laboratorium)",
      "edu.univ.note.2": "UKM (Panahan)",

      /* skills */
      "skills.soft.title": "Soft Skills",
      "skills.soft.team": "Kerja sama tim",
      "skills.soft.discipline": "Etos kerja / Disiplin",
      "skills.soft.communication": "Komunikasi efektif",

      "skills.hard.title": "Hard / Software Skills",
      "skills.hard.ai": "Adobe Illustrator",
      "skills.hard.indesign": "Adobe InDesign",
      "skills.hard.lightroom": "Adobe Lightroom",
      "skills.hard.photoshop": "Adobe Photoshop",
      "skills.hard.premiere": "Adobe Premiere Pro",
      "skills.hard.blender": "Blender",
      "skills.hard.canva": "Canva",
      "skills.hard.corel": "CorelDraw",
      "skills.hard.java": "Java",
      "skills.hard.js": "JavaScript",
      "skills.hard.ppt": "Microsoft PowerPoint",
      "skills.hard.word": "Microsoft Word",
      "skills.hard.python": "Python",

      /* projects */
      "project.one.title": "Portfolio Website",
      "project.one.desc":
        "Personal portfolio website built with HTML, CSS, and JavaScript",
      "project.one.tag.1": "HTML",
      "project.one.tag.2": "CSS",
      "project.one.tag.3": "JavaScript",

      "project.two.title": "Java Calculator App",
      "project.two.desc":
        "Scientific calculator with advanced mathematical functions",
      "project.two.tag.1": "Java",
      "project.two.tag.2": "JavaFX",
      "project.two.tag.3": "UI Design",

      "project.three.title": "Python Data Visualization",
      "project.three.desc":
        "Data analysis and visualization tool using Python libraries",
      "project.three.tag.1": "Python",
      "project.three.tag.2": "Pandas",
      "project.three.tag.3": "Matplotlib",

      /* contact */
      "contact.intro":
        "Want to collaborate? Send a short message — I'll reply.",
      "contact.form.name": "Name",
      "contact.form.email": "Email",
      "contact.form.message": "Message",
      "contact.form.submit": "Send",
      "contact.form.reset": "Reset",

      /* dev skills */
      "devskills.title": "Development Skills",
      "devskills.frontend": "Front-end Development",
      "devskills.responsive": "Responsive Design",
      "devskills.ux": "UX & Visual Design",

      /* footer */
      "footer.copyright": "© 2025 Achmad Andi Prayoga — Made with ♥",
    },
    nl: {
      /* stats */
      "stats.lines": "Regels Code",
      "stats.commits": "Git Commits",
      "stats.uptime": "Uptime %",
      "stats.coffee": "Koffie (ml)",

      "nav.about": "Over",
      "nav.education": "Opleiding",
      "nav.experience": "Ervaring",
      "nav.projects": "Projecten",
      "nav.contact": "Contact",
      "btn.hire": "Huur mij",
      "hero.greeting": "Hoi, ik ben Achmad Andi Prayoga.",
      "hero.role": "Junior IT Support",
      "hero.bio":
        "Afgestudeerd in Informatica met een sterke basis in programmeerlogica en applicatieontwikkeling. Leeftijd: {age} jaar, geboren in Sidoarjo, gepassioneerd door IT en webontwikkeling.",
      "hero.cta.experience": "Bekijk mijn ervaring",
      "hero.cta.contact": "Neem contact op",
      "experience.title": "Werkervaring",
      "education.title": "Opleiding",
      "skills.title": "Vaardigheden",
      "projects.title": "Projecten",
      "contact.title": "Contact",
      "project.link.live": "Live Demo",
      "project.link.code": "Broncode",

      /* quick info */
      "quick.location": "Sidoarjo",
      "quick.degree": "Bachelor Informatica",
      "quick.availability": "Beschikbaar voor werk",

      /* identity */
      "identity.birth.label": "Geboorteplaats, -datum",
      "identity.birth.value": "Sidoarjo, 28 januari 2005",
      "identity.religion.label": "Religie",
      "identity.religion.value": "Islam",
      "identity.height.label": "Lengte",
      "identity.height.value": "180 cm",
      "identity.weight.label": "Gewicht",
      "identity.weight.value": "65 kg",
      "identity.hobby.label": "Hobby",
      "identity.hobby.value": "Zwemmen",

      /* experience */
      "exp.period.label": "Periode:",
      "exp.one.title": "OFERO JX SIDOARJO — Winkelmedewerker (Store Boy)",
      "exp.one.address":
        "Jl. Diponegoro No.98, Lemah Putro, Lemahputro, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61212",
      "exp.one.period": "Januari 2025 - Mei 2025",
      "exp.one.resp.1": "Beheer van dagelijkse winkelverkoop",
      "exp.one.resp.2": "Flyers verspreiden naar lokale huishoudens",
      "exp.one.resp.3": "Winkel schoonmaken",
      "exp.one.resp.4":
        "Online verkoop afgehandeld (social media live, promoties delen in groepen)",

      "exp.two.title": "Toko Pelangi Stationary — SPB (Sales Promotion Boy)",
      "exp.two.address":
        "Jl. Raya Kemantren No.26, RT.7/RW.2, Keputran, Kemantren, Sidoarjo, Sidoarjo Regency, East Java 61273",
      "exp.two.period": "Augustus 2023 - December 2023",
      "exp.two.resp.1": "Stands van de winkel schoongemaakt",
      "exp.two.resp.2": "Productlabels (barcode) en prijskaartjes aangebracht",
      "exp.two.resp.3": "Producten schoongemaakt",
      "exp.two.resp.4": "Goederen bijgevuld",

      /* education */
      "edu.period.label": "Periode:",
      "edu.sd.title": "SDN BORO",
      "edu.sd.address":
        "Boro, Kec. Tanggulangin, Kabupaten Sidoarjo, Jawa Timur 61272",
      "edu.sd.period": "2011 - 2017",

      "edu.smp.title": "SMP DHARMAWANITA 7 TANGGULANGIN",
      "edu.smp.address":
        "Kalitengah Utara Rt.01 Rw.01, Kalitengah, Kec. Tanggulangin, Kec. Sidoarjo, Prov, Jawa Timur",
      "edu.smp.period": "2018 - 2019",

      "edu.smk.title": "SMK — SMK ANTARTIKA 2 SIDOARJO",
      "edu.smk.address":
        "Jl. Raya Siwalanpanji No.6, Bedrek, Siwalanpanji, Kec. Buduran, Kabupaten Sidoarjo, Jawa Timur 61252",
      "edu.smk.period": "2020 - 2023",
      "edu.smk.note.1": "BNSP-certificaat behaald",
      "edu.smk.note.2": "Scouting (Pramuka)",

      "edu.univ.title": "S1 — UNIVERSITAS MUHAMMADIYAH SIDOARJO",
      "edu.univ.address":
        "Jl. Mojopahit No.666 B, Sidowayah, Celep, Kec. Sidoarjo, Kabupaten Sidoarjo, Jawa Timur 61215",
      "edu.univ.period": "2025 - Heden",
      "edu.univ.note.1": "Deelname aan ASLAB (Laboratoriumassistent)",
      "edu.univ.note.2": "Archery UKM (boogschieten)",

      /* skills */
      "skills.soft.title": "Soft Skills",
      "skills.soft.team": "Teamwork",
      "skills.soft.discipline": "Arbeidsethos / Discipline",
      "skills.soft.communication": "Effectieve communicatie",

      "skills.hard.title": "Hard / Software Skills",
      "skills.hard.ai": "Adobe Illustrator",
      "skills.hard.indesign": "Adobe InDesign",
      "skills.hard.lightroom": "Adobe Lightroom",
      "skills.hard.photoshop": "Adobe Photoshop",
      "skills.hard.premiere": "Adobe Premiere Pro",
      "skills.hard.blender": "Blender",
      "skills.hard.canva": "Canva",
      "skills.hard.corel": "CorelDraw",
      "skills.hard.java": "Java",
      "skills.hard.js": "JavaScript",
      "skills.hard.ppt": "Microsoft PowerPoint",
      "skills.hard.word": "Microsoft Word",
      "skills.hard.python": "Python",

      /* projects */
      "project.one.title": "Portfolio Website",
      "project.one.desc":
        "Persoonlijke portfolio-website gebouwd met HTML, CSS en JavaScript",
      "project.one.tag.1": "HTML",
      "project.one.tag.2": "CSS",
      "project.one.tag.3": "JavaScript",

      "project.two.title": "Java Calculator App",
      "project.two.desc":
        "Wetenschappelijke rekenmachine met geavanceerde wiskundige functies",
      "project.two.tag.1": "Java",
      "project.two.tag.2": "JavaFX",
      "project.two.tag.3": "UI-ontwerp",

      "project.three.title": "Python Data Visualization",
      "project.three.desc":
        "Data-analyse en visualisatietool met Python-bibliotheken",
      "project.three.tag.1": "Python",
      "project.three.tag.2": "Pandas",
      "project.three.tag.3": "Matplotlib",

      /* contact */
      "contact.intro":
        "Wil je samenwerken? Stuur een kort bericht — ik zal antwoorden.",
      "contact.form.name": "Naam",
      "contact.form.email": "E-mail",
      "contact.form.message": "Bericht",
      "contact.form.submit": "Versturen",
      "contact.form.reset": "Reset",

      /* dev skills */
      "devskills.title": "Ontwikkelingsvaardigheden",
      "devskills.frontend": "Front-end Development",
      "devskills.responsive": "Responsive Design",
      "devskills.ux": "UX & Visual Design",

      /* footer */
      "footer.copyright": "© 2025 Achmad Andi Prayoga — Gemaakt met ♥",
    },
  };

  function applyTranslations(lang) {
    if (!translations[lang]) lang = "id";
    const dict = translations[lang];
    const elems = document.querySelectorAll("[data-i18n]");
    elems.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const txt = dict[key];
      if (!txt) return; // skip missing keys
      // if text contains {age} placeholder, replace with computed age
      let out = txt;
      if (out && out.indexOf("{age}") !== -1) {
        out = out.replace("{age}", String(calculateAge(BIRTH_DATE)));
      }
      // set content (allow HTML for cases like spans)
      el.innerHTML = out;
    });
    // update active button
    document
      .querySelectorAll(".lang-btn")
      .forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));
    // set html class so inline translations (elements with `lang` attribute) show only the active language
    try {
      document.documentElement.classList.remove(
        "site-lang-id",
        "site-lang-en",
        "site-lang-nl"
      );
      document.documentElement.classList.add("site-lang-" + lang);
    } catch (e) {
      /* ignore */
    }
    // persist
    try {
      localStorage.setItem("siteLang", lang);
    } catch (e) {}
  }

  // Initialize and animate stat counters
  function initStatCounters() {
    const counters = document.querySelectorAll(".stat-value");

    function updateCounter(counter) {
      const target = parseFloat(counter.dataset.value);
      const increment = parseFloat(counter.dataset.increment);
      const decimals = parseInt(counter.dataset.decimals || "0");
      let current = parseFloat(counter.textContent);

      // If we hit the target, restart from a bit below
      if (current >= target) {
        current = target - target * 0.15; // restart from 85% of target
      }

      // Increment
      current += increment;

      // Update display (fixed decimal places if specified)
      counter.textContent = current.toFixed(decimals);

      // Schedule next update
      setTimeout(() => {
        requestAnimationFrame(() => updateCounter(counter));
      }, 50); // Update every 50ms
    }

    // Start each counter
    counters.forEach((counter) => {
      counter.textContent = "0";
      updateCounter(counter);
    });
  }

  // Call counter init after a small delay to let other stuff load
  setTimeout(initStatCounters, 500);

  // init language selector
  const langSelector = document.getElementById("langSelector");
  const saved = (function () {
    try {
      return localStorage.getItem("siteLang");
    } catch (e) {
      return null;
    }
  })();
  let initialLang =
    saved ||
    (navigator.language && navigator.language.startsWith("en")
      ? "en"
      : navigator.language && navigator.language.startsWith("nl")
      ? "nl"
      : "id");
  // ensure age updated before applying translations so {age} is available
  updateAge();
  applyTranslations(initialLang);

  if (langSelector) {
    langSelector.addEventListener("click", (e) => {
      const btn = e.target.closest(".lang-btn");
      if (!btn) return;
      const lang = btn.dataset.lang;
      applyTranslations(lang);
    });
  }

  // Profile image switcher
  (function initProfileSwitcher() {
    const profileImg = document.getElementById("profilePhoto");
    const thumbs = document.querySelectorAll(".profile-switch .thumb");
    if (!profileImg || !thumbs.length) return;

    // load saved choice
    try {
      const saved = localStorage.getItem("profilePhoto");
      if (saved) profileImg.src = saved;
    } catch (e) {}

    // update active thumbnail based on current src
    function refreshActive() {
      thumbs.forEach((t) => {
        const src = t.dataset.src;
        const isActive = normalizePath(profileImg.src).endsWith(
          normalizePath(src)
        );
        t.classList.toggle("active", isActive);
        t.setAttribute("aria-pressed", String(isActive));
      });
    }

    function normalizePath(p) {
      // keep only file name part
      try {
        return p.split("/").pop().toLowerCase();
      } catch (e) {
        return String(p).toLowerCase();
      }
    }

    refreshActive();

    thumbs.forEach((t) => {
      t.addEventListener("click", () => {
        const src = t.dataset.src;
        if (!src) return;
        profileImg.src = src;
        // update UI
        refreshActive();
        try {
          localStorage.setItem("profilePhoto", src);
        } catch (e) {}
      });
      t.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") t.click();
      });
    });
  })();

  // Contact CTA -> jump to contact (kept after translations)
  const contactBtn = document.getElementById("contactBtn");
  if (contactBtn) {
    contactBtn.addEventListener("click", () => {
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    });
  }
});
