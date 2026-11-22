import AboutUs from '@widgets/AboutUs/AboutUs';
import FiveSteps from '@widgets/FiveSteps/FiveSteps';
import HeroHome from '@widgets/hero/HeroHome/HeroHome';
import TippgeberPromo from '@widgets/TippgeberPromo/TippgeberPromo';
import Categories from '@widgets/Categories/Categories';
import FAQ from '@widgets/FAQ/FAQ';
import styles from './Home.module.css';
import { useReveal } from './useReveal';

const Home = () => {
  const rootRef = useReveal<HTMLDivElement>();
  return (
    <div ref={rootRef} className={styles.home}>
      <HeroHome />
      <TippgeberPromo />
      <Categories />
      <AboutUs />
      <FiveSteps />
      <FAQ />
    </div>
  );
};
export default Home;
