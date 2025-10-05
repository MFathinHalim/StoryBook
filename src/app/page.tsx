"use client";

export default function Homepage() {
  return (
    <>
      {/* Hero Section (punya kamu, tetap dipertahankan) */}
      <div className="container py-lg-5 d-flex align-items-center justify-content-center" style={{ minHeight: "80vh", overflow: "hidden" }}>
        <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-5 w-100">
          <div className="py-5 position-relative text-center text-lg-start">
            <h2 className="mb-0" style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}>Hi, Welcome to</h2>
            <h1 className="mt-2 fw-bold" style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}>Story Book</h1>
            <p className="mt-4" style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>
              Sebuah platform ringan dan ramah pengguna untuk menulis, menyimpan, dan membagikan cerita ciptaanmu. StoryBook hadir sebagai ruang digital yang mendukung kreativitas tanpa distraksi.
            </p>
            <a href="/login" className="btn btn-primary rounded-pill px-5 mt-3">Read</a>
            <br />
            <p className="pt-5" style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>Made with ❤️ by M.Fathin Halim</p>
          </div>

          <div className="text-center text-lg-end">
            <img
              className="rounded shadow-lg d-none d-lg-block"
              style={{ maxHeight: "70vh", transition: "transform 0.3s" }}
              src="https://ik.imagekit.io/9hpbqscxd/SB/cover-02238115420610054.jpg?updatedAt=1735026872673"
              alt="Story Book Cover"
            />
          </div>
        </div>
      </div>

      {/* Section 2 — Featured Categories */}
      <section className="py-5" style={{ backgroundColor: "#FFFDF9" }}>
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Temukan Cerita Berdasarkan Suasana Hatimu ✨</h2>
          <div className="row justify-content-center g-4">
            {["Romance", "Fantasy", "Action", "Mystery"].map((genre, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-2">
                <div className="p-4 rounded-4 shadow-sm bg-white h-100 border hover-scale">
                  <h5 className="fw-semibold mb-0">{genre}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
<section
  className="container my-5 py-5"
  style={{
    borderRadius: "1.5rem",
  }}
>
  <div className="row align-items-center justify-content-between">
    {/* Image */}
    <div className="col-lg-5 text-center position-relative mb-4 mb-lg-0">
      <div
        className="rounded-4 shadow-lg overflow-hidden"
        style={{
          transform: "scale(1)",
          transition: "all 0.5s ease",
        }}
      >
        <img
          src="https://img.wattpad.com/cover/401389195-256-k563545.jpg"
          alt="Jelajahi Cerita"
          className="img-fluid rounded-4"
          style={{
            objectFit: "cover",
            height: "400px",
            width: "100%",
            filter: "brightness(0.95) contrast(1.05)",
          }}
        />
      </div>
      <div
        className="position-absolute top-0 start-0 w-100 h-100 rounded-4"
        style={{
          background:
            "linear-gradient(to bottom right, rgba(0,0,0,0.15), rgba(255,255,255,0.05))",
          pointerEvents: "none",
        }}
      ></div>
    </div>

    {/* Text */}
    <div
      className="col-lg-6 mb-4 mb-lg-0"

    >
      <h2
        className="fw-bold mb-3"
        style={{
          fontSize: "clamp(2rem, 5vw, 3rem)",
          color: "#1e1e2f",
        }}
      >
        🌍 Jelajahi Dunia Cerita
      </h2>
      <p
        style={{
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          lineHeight: "1.8",
          color: "#444",
        }}
      >
        Di StoryBook, setiap halaman adalah petualangan baru.  
        Temukan kisah yang menggugah, menenangkan, dan kadang membuatmu berpikir
        ulang tentang makna kehidupan.  
        Semua ditulis oleh penulis muda penuh imajinasi — mungkin salah satunya kamu.
      </p>
      <a
        href="/book/publish"
        className="btn btn-primary rounded-pill px-5 py-2 mt-3 shadow-sm"
        style={{
          border: "none",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        Jelajahi Sekarang
      </a>
    </div>
  </div>

</section>



      {/* Section 4 — Community */}
      <section className="py-5" style={{ backgroundColor: "#F5F8F2" }}>
        <div className="container text-center">
          <h2 className="fw-bold mb-4">👥 Bergabung dengan Komunitas Penulis</h2>
          <p className="mb-5 mx-auto" style={{ maxWidth: "600px" }}>
            Di StoryBook, kamu gak cuma nulis — kamu tumbuh bareng komunitas penulis lain. Dapatkan inspirasi, kritik membangun, dan kolaborasi yang seru!
          </p>
        </div>
      </section>

      {/* Section 5 — Footer */}
      <footer className="py-4 text-center" style={{ backgroundColor: "#EDEBE5" }}>
        <p className="mb-0 text-muted">© 2025 StoryBook — Dibuat dengan semangat dan secangkir kopi ☕</p>
      </footer>

      {/* CSS tambahan untuk efek hover */}
      <style jsx>{`
        .hover-scale {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .hover-scale:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
}
