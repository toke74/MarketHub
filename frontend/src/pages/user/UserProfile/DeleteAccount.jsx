import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const DeleteAccount = ({ onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(); // Call delete function from parent
      toast.success("Account deleted successfully!");

      setTimeout(() => {
        window.location.reload(true);
      }, 2000);
    } catch (error) {
      toast.error("Failed to delete account. Try again.");
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex justify-center">
      {/* Delete Account Button */}
      <button
        className="flex items-center justify-center gap-2 w-full cursor-pointer bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        onClick={() => setIsOpen(true)}
      >
        <FaTrash className="mb-1" /> Delete Account
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex  justify-center bg-black/60">
          <div className="bg-white p-6 rounded-lg shadow-lg h-[180px] mt-20 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Deleting your account is permanent and cannot be undone.
            </p>

            <div className="mt-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
