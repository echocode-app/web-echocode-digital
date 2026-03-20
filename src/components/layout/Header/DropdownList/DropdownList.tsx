import DropdownLink from './DropdownLink';

const DropdownList = () => {
  return (
    <div
      className="
       absolute left-1/2 top-full pt-7.25 -translate-x-56
       z-50 transition-all duration-main
       -translate-y-2 opacity-0 pointer-events-none
       group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto"
    >
      <ul
        className="
      pointer-events-none
      transition-all duration-main
      opacity-0
      group-hover:opacity-100
      group-hover:pointer-events-auto
      flex mx-auto md:w-[710] lg:w-198.75  md:gap-2 lg:gap-3 p-3 border rounded-secondary
     border-gray10 bg-black/15 backdrop-blur-[26px]"
      >
        <li>
          <DropdownLink link="/service-direction/mobile-development">
            Mobile Development
          </DropdownLink>
        </li>
        <li>
          <DropdownLink link="/service-direction/web-development">Web Development</DropdownLink>
        </li>
        <li>
          <DropdownLink link="/service-direction/game-development">Game Development</DropdownLink>
        </li>
        <li>
          <DropdownLink link="/service-direction/igaming">iGaming</DropdownLink>
        </li>
        <li>
          <DropdownLink link="/service-direction/design">
            <span className="block w-14.5 text-center">Design</span>
          </DropdownLink>
        </li>
        <li>
          <DropdownLink link="/service-direction/qa">
            <span className="block w-15 text-center">QA</span>
          </DropdownLink>
        </li>
      </ul>
    </div>
  );
};

export default DropdownList;
