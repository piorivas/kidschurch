export default function Card({ title, description, image, link, linkText, children }) {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
            {image && <img src={image} alt={title} />}
            <div className="px-6 py-4">
                <h2>{title}</h2>
                <p>{description}</p>
                {children}
                <a href={link}>{linkText}</a>
            </div>
        </div>
    )
}