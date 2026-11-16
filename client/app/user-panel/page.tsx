import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import UserPanel from '@/components/UserPanel';
import './user-panel.css';

export default function UserPanelPage() {
  return (
    <>
      <Header />
      <UserPanel />
      <Footer />
      <CartDrawer />
    </>
  );
}
