import { DownloadIcon } from "../../common/icons";

const DownloadButton = () => {
  return (
    <div className=' rounded-full hover:bg-[#353636] hover:text-gray-200'>
      <button className='flex flex-row gap-1.5 text-sm font-medium items-center py-1.5 px-2'>
        <DownloadIcon className='w-[14px] h-[14px] mt-[2px]' />
        <p>Download</p>
      </button>
    </div>
  );
};

export default DownloadButton;
