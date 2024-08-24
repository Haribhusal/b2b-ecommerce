import { Link, useParams } from "react-router-dom";
import { useCompany } from "./../../hooks/useCompanies";
export default function ViewCompanyDetailsPage() {
  const { id } = useParams();
  const { data: company, isLoading, error, refetch } = useCompany(id);
  console.log(company);

  return (
    <div className="p-5">
      <div className="heading mb-3 flex justify-between">
        <h3 className="title text-xl">Comapnies </h3>
        <Link to="/dashboard/manage-companies">
          <button className="btn btn-primary">Back</button>
        </Link>
      </div>
    </div>
  );
}
