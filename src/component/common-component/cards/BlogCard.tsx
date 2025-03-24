import { BookMarkIcon } from '@/component/common/icons';

const BlogCard = ({
  title,
  description,
  imageUrl,
  id,
}: {
  title: string;
  description: string;
  imageUrl: string;
  id: number;
}) => {

  return (
    <div
      className='w-80 md:w-full rounded-lg bg-[#2C2C2C] shadow-lg h-full cursor-pointer hover:translate-y-[1px] hover:opacity-95'
    >
      <div className='bg-offset dark:bg-offsetDark group relative h-36  overflow-hidden rounded-md '>
        <img
          src={imageUrl}
          alt={title}
          className='w-full h-48 object-center  md:object-cover transition-all ease-in-out overflow-hidden'
        />
      </div>
      <div className='p-4 gap-2 flex flex-col justify-between h-44'>
        <div className='flex flex-col justify-center '>
          <h2 className=' font-medium tracking-wide text-gray-200 '>{title}</h2>
          <p className='text-sm line-clamp-2 break-words text-gray-400 '>
            {description}
          </p>
        </div>
        <div className='text-sm flex flex-row justify-between items-end bottom-0 h-full'>
          <div className='flex flex-row gap-1'>
            <img
              alt='User avatar'
              className='h-4 w-4 flex items-center rounded-full object-cover'
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

export default BlogCard;
