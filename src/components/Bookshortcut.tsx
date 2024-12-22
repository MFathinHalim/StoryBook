export default function BookShortcut({ book }: any) {
    return (
        <>
            <div className="d-flex flex-column align-items-center w-100 mb-3">
                <img className="img-bs" src={book.cover || "https://4kwallpapers.com/images/walls/thumbs_3t/18164.jpg"} alt={book.title} />
                <div className={`mt-2 d-flex justify-content-between button-container`}> {/* w-100 added here */}
                    <a href={`/book/${book._id}`} className="text-center"> {/* Style link correctly */}
                        <h3 className="mt-1">{book.title}</h3>
                    </a>
                    <button className="btn primary-btn rounded-pill px-4 ">Bagikan</button>
                </div>
            </div>
        </>
    );
}