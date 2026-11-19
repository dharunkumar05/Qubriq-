export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container footer__inner">
        <div className="footer__left">
          <span className="footer__brand">Qubriq</span>
          <span className="footer__copy">© Qubriq. All rights reserved.</span>
        </div>
        <nav className="footer__links" aria-label="Footer">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
