import { LearnMoreIcon } from "../../common/icons";

const LearnMoreButton = () => {
  return (
    <button className='w-fit hover:text-gray-500 text-center rounded text-sm leading-[3px] font-medium gap-1.5 roun text-gray-200  p-2 items-center flex bg-[#353636]'>
      <LearnMoreIcon className='w-[14px] h-[14px] mt-0.5 ' />
      <p>Learn More</p>
    </button>
  );
};

export default LearnMoreButton;
