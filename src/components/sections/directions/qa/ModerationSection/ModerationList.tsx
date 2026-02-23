import ModerationImage from './ModerationImage';
import ModerationItem from './ModerationItem';

const ModerationList = () => {
  return (
    <ul className="flex flex-col gap-6">
      <ModerationItem
        title={'Guideline Compliance Checks'}
        desc={'Ensure your app meets all App Store and Google Play requirements submission'}
      >
        <ModerationImage
          image="/images/directions/qa/list.svg"
          title="list"
          size={{ w: '30', h: '28' }}
        />
      </ModerationItem>
      <ModerationItem
        title={'Real Device Testing'}
        desc={'Test on actual devices across different OS versions and screen sizes'}
      >
        <ModerationImage
          image="/images/directions/qa/devices.svg"
          title="list"
          size={{ w: '36', h: '22' }}
        />
      </ModerationItem>
      <ModerationItem
        title={'Crash-Free Rate Control'}
        desc={'Monitor and maintain high stability scores required for store approval'}
      >
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
