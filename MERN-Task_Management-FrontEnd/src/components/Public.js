import { Link } from 'react-router-dom'
// The Public function is a functional component in React that renders the content for the public facing pages of the application. It returns a section element with the "public" class that contains a header, main, and footer element.
const Public = () => {
    const content = (
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">WESTech Electronics </span></h1>
            </header>
            <main className="public__main">
                <p>Located in Beautiful Downtown St. John's, Newfoundland. WESTech Electronics provides a trained staff ready to meet your tech repair needs.</p>
                <address className="public__addr">
                    WESTech Repairs & services<br />
                    123 Water Street<br />
                    St. Johns, NL, A1A1A1<br />
                    <a href="tel:(1-709-730-1234">(555) 555-5555</a>
                </address>
                <br />
                <p>Owner: William Stamp</p>
            </main>
            <footer>
                <Link to="/login">User Login</Link>
            </footer>
        </section>

    )
    return content
}
export default Public