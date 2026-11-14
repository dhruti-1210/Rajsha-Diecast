import { Logo } from './Header';

export default function Footer() {
  return (
    <footer id="contact">
      <div className="fgrid">
        <div><Logo /><p>Diecast cars and collectibles, shipped across India. Every listing states its packaging condition before you buy.</p></div>
        <div><h4>Shop</h4><a href="/shop">All models</a><a href="/#brands">Hot Wheels</a><a href="/#brands">Mini GT</a><a href="/#arrivals">New arrivals</a></div>
        <div><h4>Help</h4><a href="/#contact">Contact</a><a href="/#contact">Shipping</a><a href="/#contact">Returns</a><a href="/#contact">Terms &amp; Privacy</a></div>
        <div className="footer-contact">
          <h4>Contact us</h4>
          <div className="footer-contact-item"><small>Email</small><a href="mailto:rajshadiecast@gmail.com">rajshadiecast@gmail.com</a></div>
          <div className="footer-contact-item"><small>Phone</small><a href="tel:1234567890">1234567890</a></div>
        </div>
      </div>
      <p className="copy">© 2026 Rajsha Diecast. All rights reserved.</p>
    </footer>
  );
}
