import { Link } from 'react-router-dom'

export default function Contact() {
  return (
    <div className="page info-page">
      <Link to="/" className="go-back">← go back</Link>
      <div className="info-card">
        <h1>contact</h1>
        <p className="contact-line">+XX XXXXXXXXX</p>
        <p className="contact-line">XXXXXXXXX@XXXXX.XXX</p>
        <p className="contact-note">(update these in src/pages/Contact.jsx)</p>
      </div>
    </div>
  )
}
