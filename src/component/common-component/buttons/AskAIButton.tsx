const AskAIButton = () => {
  return (
    <div className='grid grid-cols-8  z-50 absolute  rounded-full mx-12 bg-[#232121] focus-within:bg-[#2c2929]'>
      <div className='col-span-6 w-fit md:w-fit md:min-w-[650px] fixed bg-[#232121] rounded-full bottom-7 '>
        <div className='flex flex-row justify-between gap-2 items-center p-2  m-1.5 rounded-full border border-gray-700 focus-within:border-[1.5px] focus-within:border-gray-600 caret-[#016a80]  bg-red h-fit '>
          <input
            type='text'
            className='w-full h-full p-2   appearance-none border-none outline-none bg-[#232121e9] rounded-full'
            placeholder='Ask me anything '
          />
          <p>Logo </p>
          <p>Logo </p>
        </div>
      </div>
    </div>
  );
};

export default AskAIButton;
