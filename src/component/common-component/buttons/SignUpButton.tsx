const SignUpButton = ({ text, className }: { text?: string, className?: string }) => {
  return (
    <div className={`mx-2 ${text === 'Log in' ? "bg-gray-500" : "bg-[#20b8cd]"} ${className} rounded-sm hover:opacity-80 flex justify-center text-white p-2`}>
      <button className='w-full flex flex-row font-medium text-gray-800 font-sans justify-center cursor-pointer'>
        {text ? text : 'Sign Up'}
      </button>
    </div>
  );
};

export default SignUpButton;
