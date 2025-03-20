// Package imports
import { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "sonner";
import { useSelector } from "react-redux";

//Local Imports
import AddAddressModal from "./AddAddressModal";
import EditAddressModal from "./EditAddressModal";
import { useDeleteUserAddressMutation } from "../../../services/authApi/authApi";

const Address = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [deleteUserAddress, { isLoading }] = useDeleteUserAddressMutation();

  const handleEdit = (address) => {
    setCurrentAddress(address);
    setIsEditModalOpen(true);
  };

  // Function to delete an address
  const handleDelete = async (id) => {
    const addressID = id;

    try {
      const response = await deleteUserAddress(addressID);
      console.log(response);
      toast.success(response?.data?.message);
      setTimeout(() => {
        window.location.reload(true);
      }, 2000);
    } catch (err) {
      toast.error(err?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="px-10 py-8 w-full mt-12 max-w-3xl bg-white h-[30%]">
        <div className="flex items-center justify-between">
          <h2 className="flex gap-2 text-sm min-[420px]:text-2xl font-semibold">
            {" "}
            <span className="hidden min-[400px]:block">My</span> Addresses
          </h2>

          {/* Add Address Button */}
          <button
            className="flex items-center gap-2 text-xs bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/85 cursor-pointer transition"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus /> Add <span className="hidden md:block">Address</span>
          </button>
        </div>

        {/* Addresses List */}
        <div className="mt-6 space-y-4">
          {user?.user?.addresses.length === 0 ? (
            <p className="w-full text-center text-gray-600 py-6">
              No addresses found.
            </p>
          ) : (
            user?.user?.addresses.map((address) => (
              <div
                key={address._id}
                className="lg:flex justify-between items-center space-y-3  rounded-lg shadow p-4"
              >
                <p className="font-semibold">{address.addressType}</p>
                <div>
                  <p className="font-semibold">{address.street}</p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} {address.zipCode},{" "}
                    {address.country}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    onClick={() => handleEdit(address)}
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => handleDelete(address._id)}
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {isModalOpen && <AddAddressModal onClose={() => setIsModalOpen(false)} />}

      {isEditModalOpen && (
        <EditAddressModal
          address={currentAddress}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Address;
