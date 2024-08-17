import React from "react";
import { useCompanies, useDeleteCompany } from "../../hooks/useCompanies";
import { Link, useNavigate } from "react-router-dom";
import { ImSpinner3 } from "react-icons/im";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { FaBuildingWheat } from "react-icons/fa6";

const ManageCompaniesPage = () => {
  const navigate = useNavigate();
  const { data: companies, isLoading, error } = useCompanies();
  const { mutate: deleteCompany } = useDeleteCompany();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      deleteCompany(id, {
        onSuccess: () => {
          toast.success("Company deleted successfully");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to delete company");
        },
      });
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-5">
      <div className="heading mb-3 flex justify-between">
        <h3 className="title text-xl">Comapnies ({companies?.length})</h3>
        <Link to="/dashboard/add-company">
          <button className="btn btn-primary">Add New Company</button>
        </Link>
      </div>

      <section>
        <ul>
          {companies.map((company) => (
            <li
              key={company._id}
              className="bg-orange-50 group items-center mb-2 card p-3 rounded-md flex gap-3"
            >
              <div className="image">
                <FaBuildingWheat className="text-xl text-orange-400 shadow  w-12 h-12 p-2 rounded-md bg-white" />
              </div>
              <div className="info w-full">
                <h2 className="text-xl font-semibold text-gray-700">
                  <Link to={`/dashboard/edit-company/${company._id}`}>
                    {company.name}
                  </Link>
                </h2>
                <div className="meta flex text-gray-600 gap-1 mb-1">
                  <div className="email">{company.email}</div> |
                  <div className="role">{company.address}</div>|
                  <div className="role">{company.phone}</div>|
                  <div className="role">{company.taxId}</div>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Link to={`/dashboard/edit-company/${company._id}`}>
                  <button className="h-8 w-8 shadow-2xl text-white bg-orange-600 rounded-full flex justify-center items-center">
                    <FaPencilAlt />
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(company._id)}
                  className="h-8 w-8 shadow-2xl text-white bg-red-600 rounded-full flex justify-center items-center"
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ManageCompaniesPage;
