import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faS, faShare } from "@fortawesome/free-solid-svg-icons";

export default function BookShortcut({ book }: any) {
    const handleShare = async () => {
        const currentWeb = window.location.origin; // Get the base URL (origin)
        const currentUrl = `${currentWeb}/book/${book._id}`;    
        if (navigator.share) {
          try {
            await navigator.share({
              title: "Story Book",
              text: "Where Your Story Begin",
              url: currentUrl,
            });
            console.log("Successful share");
          } catch (error) {
            console.error("Error sharing", error);
            // Handle share errors (e.g., user cancellation) if needed
          }
        } else if (navigator.clipboard) {
          try {
            await navigator.clipboard.writeText(currentUrl);
            alert("Link copied to clipboard. Share it with your friends!");
          } catch (error) {
            console.error("Clipboard write error", error);
            alert("Failed to copy link.");
          }
        } else {
          alert("Sharing is not supported on this browser.");
        }
      };
    return (
        <>
            {" "}
            {/* Style link correctly */}
            <div className='d-flex flex-column align-items-center w-100 mb-3'>
                <a href={`/book/${book._id}`} className='text-center'>
                    <img className='img-bs' src={book.cover || "https://4kwallpapers.com/images/walls/thumbs_3t/18164.jpg"} alt={book.title} />
                </a>
                <div className={`mt-2 d-flex justify-content-between button-container`}>
                    {" "}
                    {/* w-100 added here */}
                    <a href={`/book/${book._id}`} className='text-center'>
                        <h3 className='mt-1'>{book.title}</h3>
                    </a>
                    <button className='btn btn-transparent text-white btn-lg py-0' onClick={handleShare}>
                        {" "}
                        <FontAwesomeIcon icon={faShare} />{" "}
                    </button>
                </div>
            </div>
        </>
    );
}
