export default function Card({ title, description, image, link, linkText, children }) {
    return (
        <div className="card">
            {image && <img src={image} alt={title} />}
            <div className="card-body">
                <h2>{title}</h2>
                <p>{description}</p>
                {children}
                <a href={link}>{linkText}</a>
            </div>
        </div>
    )
}