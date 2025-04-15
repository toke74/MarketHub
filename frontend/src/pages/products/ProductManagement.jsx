// Package Imports
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

// React Icons
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

// Local Imports
import CreateProductModal from "./CreateProductModal";
import EditProductModal from "./EditProductModal";

const ProductManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const { products } = useSelector((state) => state.product);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 on search change
  }, [searchQuery]);

  const handleEdit = (productId) => {
    const selectedProduct = products.find((p) => p._id === productId);
    setEditProduct(selectedProduct);
  };

  const handleDelete = (id) => {
    console.log("Delete product:", id);
  };

  const handleCreate = () => setShowCreateModal(true);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="max-w-6xl mx-auto pt-10 pb-14 px-4">
      {showCreateModal && (
        <CreateProductModal onClose={() => setShowCreateModal(false)} />
      )}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
        />
      )}

      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <div className="flex items-center w-full lg:w-auto">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-64 p-2 pl-10 border border-gray-200 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 cursor-pointer bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded"
        >
          <FaPlus /> Create Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-10 text-lg font-medium">
          No product list
        </div>
      ) : (
        <div className="overflow-x-auto w-full bg-white rounded-md shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Sold Out
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                  Sale
                </th>
                <th className="px-6 py-3 text-center text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      ${product.discountPrice?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {product.soldOut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          product.isFeatured
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {product.isFeatured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          product.onSale
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {product.onSale ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {filteredProducts.length > productsPerPage && (
            <div className="flex justify-center items-center gap-2 mt-6 pb-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? "bg-primary text-white"
                      : "text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
