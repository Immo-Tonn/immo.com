import HeroObject from '@widgets/hero/HeroObject/HeroObject';
import Effect from '@widgets/Effect/Effect';
import InteriorStyling from '@widgets/InteriorStyling/InteriorStyling';
import { withPageShell } from '@shared/ui/PageShell/PageShell';
const ObjectStyling = () => {
  return (
    <>
      <HeroObject />
      <Effect />
      <InteriorStyling />
    </>
  );
};
export default withPageShell(ObjectStyling);
