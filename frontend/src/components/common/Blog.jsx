import { blogs } from "../../utils/data";

const Blog = () => {
  return (
    <div className="mb-20">
      <div className="container mx-auto px-4">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 
          overflow-x-auto snap-x scroll-smooth"
        >
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="min-w-[300px] snap-start bg-white border border-gray-50 rounded-lg p-4"
            >
              <a href="#">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full rounded-md mb-4"
                />
              </a>
              <div>
                <a
                  href="#"
                  className="text-primary text-xs uppercase font-semibold"
                >
                  {blog.category}
                </a>
                <h3 className="text-gray-900 text-lg font-semibold hover:text-primary transition">
                  <a href="#">{blog.title}</a>
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  By{" "}
                  <cite className="text-gray-600 font-medium">
                    {blog.author}
                  </cite>{" "}
                  / <time>{blog.date}</time>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
