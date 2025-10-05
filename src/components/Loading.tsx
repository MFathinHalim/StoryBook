export default function Loading(): JSX.Element {
  return (
    <div className="container py-4">
      {/* BOOK GRID SKELETON */}
      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 g-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i}>
            <div className="skeleton rounded" style={{ width: "100%", aspectRatio: "3/4" }}></div>
            <div className="skeleton skeleton-text mt-2" style={{ width: "80%", height: "16px" }}></div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .skeleton {
          background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 37%, #e0e0e0 63%);
          background-size: 400% 100%;
          animation: shimmer 1.4s ease infinite;
        }
        .skeleton-text {
          border-radius: 6px;
        }
        .skeleton-btn {
          border-radius: 20px;
        }
        @keyframes shimmer {
          0% {
            background-position: -400px 0;
          }
          100% {
            background-position: 400px 0;
          }
        }
      `}</style>
    </div>
  );
}
