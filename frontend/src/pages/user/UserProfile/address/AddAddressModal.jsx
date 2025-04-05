// Package imports
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaTimes } from "react-icons/fa";
import { toast } from "sonner";

//Local Import
import { useAddUserAddressMutation } from "../../../../services/authApi/authApi";
import InputField from "../../../../components/common/InputField";
import Button from "../../../../components/common/Button";

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
  const [addUserAddress, { isLoading }] = useAddUserAddressMutation();

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
          {/* Street Field */}
          <InputField
            label="Street"
            type="text"
            placeholder="Enter street"
            register={register}
            name="street"
            errors={errors}
          />
          {/* City Field */}
          <InputField
            label="City"
            type="text"
            placeholder="Enter city"
            register={register}
            name="city"
            errors={errors}
          />

          <div className="grid grid-cols-2 gap-4">
            {/* State Field */}
            <InputField
              label="State"
              type="text"
              placeholder="Enter state"
              register={register}
              name="state"
              errors={errors}
            />
            {/* ZIP code Field */}
            <InputField
              label="ZIP Code"
              type="text"
              placeholder="Enter Zip Code"
              register={register}
              name="zipCode"
              errors={errors}
            />
          </div>
          {/* Country Field */}
          <InputField
            label="Country"
            type="text"
            placeholder="Enter country"
            register={register}
            name="country"
            errors={errors}
          />

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

          {/* Add address Button */}
          <Button text="Add Address" isLoading={isLoading} />
        </form>
      </div>
    </div>
  );
};

export default AddAddressModal;
