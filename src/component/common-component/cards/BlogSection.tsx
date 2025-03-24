import { cards } from '@/data-access/mockData';
import BlogCard from './BlogCard';
import BlogCardMain from './BlogCardMain';

const BlogSection = () => {
  return (
    <div className='flex flex-col z-10 mb-10 '>
      <div className='md:grid flex flex-col  md:grid-cols-3  gap-4'>
        {cards.map((card, index) =>
          index % 4 === 0 ? (
            <div key={index} className='flex flex-col md:col-span-3 '>
              <BlogCardMain
                key={index}
                title={card.title}
                description={card.description}
                imageUrl={card.imageUrl}
                id={card.id}
              />
            </div>
          ) : (
            <BlogCard
              key={index}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              id={card.id}
            />
          )
        )}
      </div>
    </div>
  );
};

export default BlogSection;
