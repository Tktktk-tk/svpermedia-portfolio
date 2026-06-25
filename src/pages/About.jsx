import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="page info-page">
      <Link to="/" className="go-back">← go back</Link>
      <div className="info-card">
        <h1>about</h1>
        <p>
          svpermedia’s portfolio. displaying all forms of media from short to long
          form content within various categories. showing talent, process, passion.
        </p>
      </div>
    </div>
  )
}
