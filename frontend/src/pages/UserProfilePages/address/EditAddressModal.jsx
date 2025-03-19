//Package Imports
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";

//Local Imports
import { useUpdateUserAddressMutation } from "../../../services/authApi/authApi";

// Validation schema using Zod
const addressSchema = z.object({
  street: z.string().min(3, "Street is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  country: z.string().min(3, "Country is required"),
  addressType: z.enum(["Default", "Other"]).optional(),
});

const EditAddressModal = ({ address, onClose }) => {
  const [updateUserAddress, { isLoading }] = useUpdateUserAddressMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: address, // Set initial form values
  });

  // Set default form values when modal opens
  useEffect(() => {
    if (address) {
      Object.keys(address).forEach((key) => setValue(key, address[key]));
    }
  }, [address, setValue]);

  const onSubmit = async (data) => {
    try {
      const addressID = address?._id;
      const response = await updateUserAddress({ addressID, ...data }).unwrap();

      toast.success(response.message);
      onClose();
      window.location.reload(true);
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Edit Address</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Street</label>
            <input
              {...register("street")}
              className="w-full border p-2 rounded mt-1"
              placeholder="Enter street"
            />
            {errors.street && (
              <p className="text-red-500 text-sm">{errors.street.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">City</label>
            <input
              {...register("city")}
              className="w-full border p-2 rounded mt-1"
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
                {...register("state")}
                className="w-full border p-2 rounded mt-1"
                placeholder="Enter state"
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Zip Code</label>
              <input
                {...register("zipCode")}
                className="w-full border p-2 rounded mt-1"
                placeholder="Enter zip code"
              />
              {errors.zipCode && (
                <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Country</label>
            <input
              {...register("country")}
              className="w-full border p-2 rounded mt-1"
              placeholder="Enter country"
            />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium">Address Type</label>
            <select
              {...register("addressType")}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="Default">Default</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddressModal;
