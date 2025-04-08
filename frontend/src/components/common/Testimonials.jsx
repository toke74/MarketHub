import { testimonials } from "../../utils/data";

const Testimonials = () => {
  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4 text-gray-700 border-b border-gray-100 pb-3">
        <h2 className="text-lg font-semibold uppercase tracking-wide ">
          Testimonial
        </h2>
      </div>
      {testimonials &&
        testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="p-5 w-[360px] border border-gray-200 mb-7 rounded-lg text-center"
          >
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-25 h-25 mx-auto rounded-full my-6"
            />
            <p className="text-xl font-semibold text-gray-600 uppercase">
              {testimonial.name}
            </p>
            <p className="text-gray-500 text-[16px] mb-6">
              {testimonial.title}
            </p>
            <img
              src="images/icons/quotes.svg"
              alt="quotation"
              className="w-10 mx-auto mb-6"
            />
            <p className="text-gray-500 text-lg max-w-xs mx-auto mb-6">
              {testimonial.description}
            </p>
          </div>
        ))}
    </div>
  );
};

export default Testimonials;
