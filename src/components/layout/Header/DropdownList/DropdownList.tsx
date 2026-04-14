import DropdownLink from './DropdownLink';

const DropdownList = () => {
  return (
    <div
      className="
    absolute left-1/2 top-full pt-7.25 -translate-x-56
    z-50 transition-all duration-main
    -translate-y-2 pointer-events-none
    group-hover:translate-y-0 group-hover:pointer-events-auto
  "
    >
      <div className="relative inline-block">
        <div
          className="
        absolute inset-0 rounded-secondary
        bg-black/15 backdrop-blur-[26px]
        opacity-0 transition-opacity duration-main
        group-hover:opacity-100
      "
        />
        <ul
          className="
        relative z-10
        flex mx-auto md:w-[710] lg:w-198.75 md:gap-2 lg:gap-3 p-3
        border border-gray10 rounded-secondary
        opacity-0 transition-opacity duration-main
        group-hover:opacity-100
      "
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
    </div>
  );
};

export default DropdownList;
