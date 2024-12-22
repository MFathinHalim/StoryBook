export default function Loading(): JSX.Element {
    return (
        <div className="d-flex justify-content-center align-items-center" style={{height: "75vh"}}>
            <div className="text-center">
                <h1>Loading<span className="loading-dots"></span></h1>
            </div>
        </div>
    );
}