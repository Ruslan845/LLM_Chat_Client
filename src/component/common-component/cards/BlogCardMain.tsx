import { BookMarkIcon } from '@/component/common/icons';

const BlogCardMain = ({
  title,
  description,
  imageUrl,
  id, // Add id prop
}: {
  title: string;
  description: string;
  imageUrl: string;
  id: number; // Add id type
}) => {

  return (
    <div
      className='w-80 rounded-lg bg-[#202323] shadow-lg md:w-full cursor-pointer hover:translate-y-[1px] hover:opacity-95'
    >
      <div className='bg-offset dark:bg-offsetDark group relative h-56 overflow-hidden rounded-md '>
        <img
          src={imageUrl}
          alt={title}
          className='h-full w-full object-cover -mt-10 md:h-auto md:object-contain transition-all ease-in-out overflow-hidden'
        />
      </div>
      <div className='p-4 gap-2'>
        <div className='flex flex-col justify-center '>
          <h2 className='text-lg font-medium tracking-wide text-gray-200 '>
            {title}
          </h2>
          <p className='text-base line-clamp-2 break-words text-gray-400 '>
            {description}
          </p>
        </div>
        <div className='text-sm flex flex-row justify-between items-center pt-3'>
          <div className='flex flex-row gap-1'>
            <img
              alt='User avatar'
              className='h-4 w-4 flex items-center rounded-full object-cover z-10'
              src='https://imagedelivery.net/MPdwyYSWT8IY7lxgN3x3Uw/9e305ddd-7dcf-486c-0a78-a4ba48609700/thumbnail'
            />
            <p className='text-xs font-medium text-gray-400'>Logo</p>
          </div>
          <BookMarkIcon className='w-3 h-3 text-gray-500' />
        </div>
      </div>
    </div>
  );
};

export default BlogCardMain;
