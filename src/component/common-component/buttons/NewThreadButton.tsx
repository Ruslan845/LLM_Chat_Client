const NewThreadButton = () => {
  return (
    <div className='cursor-pointer border-2 border-gray-700 mx-2 bg-[#181b1a] rounded-3xl hover:border-[#3bd7f680]  text-white py-2 pl-4 pr-2'>
      <button className='w-full gap-4 flex flex-row justify-between  items-center text-gray-500 font-semibold text-sm'>
        <p className='line-clamp-1 text-clip flex justify-between  items-center '>
          New Thread
        </p>
        <p className='flex flex-row items-center w-fit space-x-[2px] '>
          <span className='border font-mono flex items-center justify-center text-xs border-gray-700  h-5 min-w-5 px-1 rounded'>
            Ctrl
          </span>
          <span className='border font-mono flex items-center justify-center text-xs border-gray-700  h-5  px-1 rounded'>
            I
          </span>
        </p>
      </button>
    </div>
  );
};

export default NewThreadButton;
