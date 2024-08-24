const Company = require("../models/Company");
const Product = require("../models/Product");
const asyncHandler = require("express-async-handler");

const companyController = {
  createCompany: asyncHandler(async (req, res) => {
    const { name, address, phone, email, taxId } = req.body;

    const company = new Company({ name, address, phone, email, taxId });
    const createdCompany = await company.save();

    res.status(201).json(createdCompany);
  }),

  getCompanies: asyncHandler(async (req, res) => {
    const companies = await Company.find({});
    res.json(companies);
  }),

  getCompanyById: asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id).populate("products");

    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    res.json(company);
  }),

  // getProductsByCompany: asyncHandler(async (req, res) => {
  //   const company = await Company.findById(req.params.id);
  //   if (!company) {
  //     res.status(404);
  //     throw new Error("Company not found");
  //   }
  //   const products = await Product.find({ company: company._id });
  //   res.jso(products);
  // }),

  updateCompany: asyncHandler(async (req, res) => {
    const { name, address, phone, email, taxId } = req.body;
    const company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    // Update fields only if they are provided
    company.name = name ?? company.name;
    company.address = address ?? company.address;
    company.phone = phone ?? company.phone;
    company.email = email ?? company.email;
    company.taxId = taxId ?? company.taxId;

    const updatedCompany = await company.save();
    res.json(updatedCompany);
  }),

  deleteCompany: asyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404);
      throw new Error("Company not found");
    }

    await company.deleteOne();
    res.json({ message: "Company removed" });
  }),
};

module.exports = companyController;
