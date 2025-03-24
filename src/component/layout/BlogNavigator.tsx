import { SectionType } from "@/data-access/mockData";

const BlogNavigator = ({
  sections,
  activeSection,
  handleScrollToSection,
}: {
  sections: SectionType[];
  activeSection: string | null;
  handleScrollToSection: (val: string) => void;
}) => {
  return (
    <div className=' z-50 p-2  flex-col h-fit w-[250px] sticky top-10 md:flex hidden'>
      {sections.map((section, index) => (
        <div
          key={index}
          className='relative flex items-center mb-1.5 line-clamp-2 cursor-pointer gap-3'
          onClick={() => handleScrollToSection(`section-${section.id}`)}
        >
          <div
            className={`h-4 w-[2px]  ${
              activeSection === `section-${section.id}`
                ? 'bg-white'
                : 'bg-[#938f90]'
            } transition-all duration-300`}
          ></div>
          <div
            className={`text-sm font-medium  ${
              activeSection === `section-${section.id}`
                ? 'text-white'
                : 'text-[#938f90]'
            }`}
          >
            {section.title}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogNavigator;
