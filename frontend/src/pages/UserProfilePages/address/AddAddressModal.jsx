// Package imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";

//Local Import
import { useAddUserAddressMutation } from "../../../services/authApi/authApi";

// Zod Schema for Form Validation
const addressSchema = z.object({
  street: z.string().min(3, "Street name is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(4, "ZIP Code is required"),
  country: z.string().min(2, "Country is required"),
  addressType: z.enum(["Default", "Other"]),
});

const AddAddressModal = ({ onClose }) => {
  const [addUserAddress] = useAddUserAddressMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await addUserAddress(data).unwrap();
      toast.success(response?.message);
      onClose();
      setTimeout(() => {
        window.location.reload(true);
      }, 2000);
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md lg:mt-40">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add Address</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 cursor-pointer"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Street</label>
            <input
              type="text"
              {...register("street")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-0 focus:border-gray-300"
              placeholder="Enter street"
            />
            {errors.street && (
              <p className="text-red-500 text-sm">{errors.street.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              type="text"
              {...register("city")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-0 focus:border-gray-300"
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">State</label>
              <input
                type="text"
                {...register("state")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-0 focus:border-gray-300"
                placeholder="Enter state"
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">ZIP Code</label>
              <input
                type="text"
                {...register("zipCode")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-0 focus:border-gray-300"
                placeholder="Enter ZIP Code"
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Country</label>
            <input
              type="text"
              {...register("country")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-0 focus:border-gray-300"
              placeholder="Enter country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Address Type</label>
            <select
              {...register("addressType")}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none 
                      focus:ring-0 focus:border-gray-300"
            >
              <option value="Default">Default</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg cursor-pointer"
          >
            Add Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAddressModal;
