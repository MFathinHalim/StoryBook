export default function BookShortcut({ book }: any) {
    return (
        <>
            <div className="d-flex flex-column align-items-center w-100">
                {book.cover && ( // Correct conditional rendering
                    <img className="img-bs" src={book.cover} alt={book.title} />
                )}
                <div className={`${book.cover && "mt-2"} d-flex justify-content-between button-container`}> {/* w-100 added here */}
                    <a href={`/book/${book._id}`} className="text-center"> {/* Style link correctly */}
                        <h3 className="mt-1">{book.title}</h3>
                    </a>
                    <button className="btn primary-btn rounded-pill px-4 ">Bagikan</button>
                </div>
            <hr className="button-container"/>
            </div>
        </>
    );
}