interface HeaderProps {
  header : string
  Icon : any
}

const Header = ({header, Icon}: HeaderProps) => {
  return (
    <div className='flex flex-col p-4 justify-center h-16 md:h-[70] '>
      <div className='px-8 w-full flex flex-row gap-2 items-center text-slate-200 tracking-wide'>
        <Icon className="w-8 mt-1" />
        <p className='text-2xl md:text-3xl items-center flex font-sans '>
          {header}
        </p>
      </div>
    </div>
  );
};

export default Header;
