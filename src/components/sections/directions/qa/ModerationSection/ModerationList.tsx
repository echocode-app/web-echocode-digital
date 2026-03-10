import { useTranslations } from 'next-intl';

import ModerationImage from './ModerationImage';
import ModerationItem from './ModerationItem';

const ModerationList = () => {
  const t = useTranslations('QAPage.ModerationSection.list');

  return (
    <ul className="flex flex-col gap-6">
      <ModerationItem title={t('mod01.title')} desc={t('mod01.desc')}>
        <ModerationImage
          image="/images/directions/qa/list.svg"
          title="list"
          size={{ w: '30', h: '28' }}
        />
      </ModerationItem>
      <ModerationItem title={t('mod02.title')} desc={t('mod02.desc')}>
        <ModerationImage
          image="/images/directions/qa/devices.svg"
          title="list"
          size={{ w: '36', h: '22' }}
        />
      </ModerationItem>
      <ModerationItem title={t('mod03.title')} desc={t('mod03.desc')}>
        <ModerationImage
          image="/images/directions/qa/graphic.svg"
          title="list"
          size={{ w: '32', h: '22' }}
        />
      </ModerationItem>
    </ul>
  );
};

export default ModerationList;
