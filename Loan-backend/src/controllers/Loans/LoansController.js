const express = require("express");
const Loan = require("../../models/Loan");
const Subscription = require("../../models/Subscription");
const User = require("../../models/User");
const {
  sendLoanStatusNotification,
  sendLoanUpdateNotification,
} = require("../../services/notificationService");
const { generateLoanAgreement } = require("../../services/agreementService");
const paginateQuery = require("../../utils/pagination");

const AddLoan = async (req, res) => {
  try {
    const lenderId = req.user.id;
    const LoanData = req.body;

    const user = await User.findOne({
      aadharCardNoShubham: LoanData.aadhaarNumber,
    });

    if (!user) {
      return res.status(404).json({
        message: "User with the provided Aadhar number does not exist",
      });
    }

    // Check if the user has an active subscription
    // const activeSubscription = await Subscription.findOne({
    //   user: lenderId,
    //   isActive: true,
    //   subscriptionExpiry: { $gte: new Date() },
    // });

    // if (!activeSubscription) {
    //   return res.status(403).json({
    //     message: "You must have an active subscription to add a loan",
    //   });
    // }

    const createLoan = new Loan({
      ...LoanData,
      lenderId,
    });

    // Generate loan agreement
    const agreementText = generateLoanAgreement(createLoan, req.user);
    createLoan.agreement = agreementText;

    // Save the loan with the generated agreement
    await createLoan.save();

    await sendLoanUpdateNotification(LoanData.aadhaarNumber, LoanData);

    return res.status(201).json(createLoan);
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation error",
        errors: errorMessages, // Return an array of error messages
      });
    }

    console.log(error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const ShowAllLoan = async (req, res) => {
  try {
    const allLoans = await Loan.find();
    return res.status(200).json({
      message: "Loans data fetched successfully",
      data: allLoans,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const GetLoanDetails = async (req, res) => {
  try {
    const loanId = req.params.id;
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ message: "Loan data not found" });
    }

    return res.status(200).json({
      message: "Loan data fetched successfully",
      data: loan,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteLoanDetails = async (req, res) => {
  try {
    const loanId = req.params.id;
    const loanData = await Loan.findByIdAndDelete(loanId);

    if (!loanData) {
      return res.status(404).json({ message: "Loan data not found" });
    }

    return res.status(200).json({
      message: "Loan deleted successfully",
      data: loanData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateLoanDetails = async (req, res) => {
  try {
    const loanId = req.params.id;
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ message: "Loan data not found" });
    }

    const updatedData = {
      ...req.body,
      borrowerAcceptanceStatus: "pending",
    };

    const loanUpdateData = await Loan.findByIdAndUpdate(loanId, updatedData, {
      new: true,
    });

    if (!loanUpdateData) {
      return res.status(404).json({ message: "Loan data not found" });
    }

    await sendLoanUpdateNotification(
      loanUpdateData.aadhaarNumber,
      loanUpdateData
    );

    return res.status(200).json({
      message: "Loan updated successfully",
      data: loanUpdateData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateLoanStatus = async (req, res) => {
  const { loanId } = req.params;
  const { status } = req.body;

  // Check if the status is either "pending" or "paid"
  if (!["pending", "paid"].includes(status)) {
    return res.status(400).json({
      message: "Invalid status value. Only 'pending' or 'paid' are allowed.",
    });
  }

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Check if the loan is already in the same status
    if (loan.status === status) {
      return res
        .status(400)
        .json({ message: `Loan is already marked as '${status}'` });
    }

    // Update the loan status
    loan.status = status;
    await loan.save();

    await sendLoanUpdateNotification(loan.aadhaarNumber, loan);

    return res.status(200).json({
      message: "Loan status updated successfully",
      loan,
    });
  } catch (error) {
    console.error("Error updating loan status:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message || error,
    });
  }
};

const updateLoanAcceptanceStatus = async (req, res) => {
  const { loanId } = req.params;
  const { status } = req.body;

  // Check if the status is either "pending" or "paid"
  if (!["pending", "accepted", "rejected"].includes(status)) {
    return res.status(400).json({
      message:
        "Invalid status value. Only 'pending' or 'accepted' or 'rejected' are allowed.",
    });
  }

  try {
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Check if the loan is already in the same status
    if (loan.borrowerAcceptanceStatus === status) {
      return res.status(400).json({
        message: `Loan is already marked as '${status}'`,
      });
    }

    // Update the loan status
    loan.borrowerAcceptanceStatus = status;
    await loan.save();

    console.log(loan?.lenderId?._id, "Loan lernder id means loan given by");

    // Send notification to lender
    await sendLoanStatusNotification(loan.lenderId, loan.name, status);

    return res.status(200).json({
      message: "Loan status updated successfully",
      loan,
    });
  } catch (error) {
    console.error("Error updating loan status:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// const getLoansByLender = async (req, res) => {
//   try {
//     const lenderId = req.user.id; // Extracting lender's ID from the JWT token

//     const loans = await Loan.find({ lenderId }).sort({ createdAt: -1 });

//     if (!loans || loans.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No loans found for this lender" });
//     }

//     return res.status(200).json({
//       message: "Loans fetched successfully",
//       data: loans,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };

const getLoansByLender = async (req, res) => {
  try {
    const lenderId = req.user.id;
    let { page, limit, startDate, endDate, status, minAmount, maxAmount } =
      req.query;

    minAmount = minAmount ? Number(minAmount) : undefined;
    maxAmount = maxAmount ? Number(maxAmount) : undefined;

    const query = { lenderId };

    if (startDate) query.loanStartDate = { $gte: new Date(startDate) };
    if (endDate)
      query.loanEndDate = { ...query.loanEndDate, $lte: new Date(endDate) };
    if (status) query.status = status;
    if (minAmount !== undefined || maxAmount !== undefined) {
      query.amount = {};
      if (minAmount !== undefined) query.amount.$gte = minAmount;
      if (maxAmount !== undefined) query.amount.$lte = maxAmount;
    }

    const { data: loans, pagination } = await paginateQuery(
      Loan,
      query,
      page,
      limit
    );

    if (!loans.length) {
      return res
        .status(404)
        .json({ message: "No loans found for this lender" });
    }

    return res.status(200).json({
      message: "Loans fetched successfully",
      data: loans,
      pagination,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getLoansById = async (req, res) => {
  try {
    const Id = req.user.id; // Extracting lender's ID from the JWT token

    const loans = await Loan.findById({ Id }).sort({ createdAt: -1 });

    if (!loans || loans.length === 0) {
      return res.status(404).json({ message: "No loans found" });
    }

    return res.status(200).json({
      message: "Loans fetched successfully",
      data: loans,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// const getLoanByAadhaar = async (req, res) => {
//   const { aadhaarNumber } = req.query;

//   // Validate Aadhaar Number
//   if (!aadhaarNumber) {
//     return res.status(400).json({ message: "Aadhaar number is required" });
//   }

//   try {
//     // Fetch loans based on Aadhaar number
//     const loans = await Loan.find({ aadhaarNumber })
//       .sort({ createdAt: -1 })
//       .populate("lenderId", "userName email mobileNo")
//       .exec();

//     // Check if loans are found
//     if (loans.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No loans found for this Aadhaar number" });
//     }

//     const pendingLoans = loans.filter(
//       (loan) =>
//         loan.status === "pending" &&
//         loan.borrowerAcceptanceStatus === "accepted"
//     );

//     // Calculate total amount for only pending loans
//     const totalAmount = pendingLoans.reduce(
//       (sum, loan) => sum + loan.amount,
//       0
//     );

//     // Return the response with loan data, total amount, and user's profile image
//     return res.status(200).json({
//       message: "Loan data fetched successfully",
//       totalAmount,
//       data: loans,
//     });
//   } catch (error) {
//     console.error("Error fetching loan data by Aadhaar:", error);
//     return res.status(500).json({
//       message: "Server error. Please try again later.",
//       error: error.message,
//     });
//   }
// };

const getLoanByAadhaar = async (req, res) => {
  const {
    aadhaarNumber,
    page,
    limit,
    startDate,
    endDate,
    status,
    minAmount,
    maxAmount,
  } = req.query;

  if (!aadhaarNumber) {
    return res.status(400).json({ message: "Aadhaar number is required" });
  }

  try {
    const query = { aadhaarNumber };

    // Add filters
    if (startDate) query.loanStartDate = { $gte: new Date(startDate) };
    if (endDate)
      query.loanEndDate = { ...query.loanEndDate, $lte: new Date(endDate) };
    if (status) query.status = status;
    if (minAmount !== undefined || maxAmount !== undefined) {
      query.amount = {};
      if (minAmount !== undefined) query.amount.$gte = Number(minAmount);
      if (maxAmount !== undefined) query.amount.$lte = Number(maxAmount);
    }

    // Pagination and options
    const { data: loans, pagination } = await paginateQuery(
      Loan,
      query,
      page,
      limit,
      {
        sort: { createdAt: -1 },
        populate: { path: "lenderId", select: "userName email mobileNo" },
      }
    );

    if (loans.length === 0) {
      return res.status(404).json({ message: "No loans found" });
    }

    const pendingLoans = loans.filter(
      (loan) =>
        loan.status === "pending" &&
        loan.borrowerAcceptanceStatus === "accepted"
    );
    const totalAmount = pendingLoans.reduce(
      (sum, loan) => sum + loan.amount,
      0
    );

    return res.status(200).json({
      message: "Loan data fetched successfully",
      totalAmount,
      data: loans,
      pagination,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getLoanStats = async (req, res) => {
  try {
    const { aadhaarNumber } = req.query;
    const lenderId = req.user.id;

    if (!aadhaarNumber) {
      return res.status(400).json({ message: "Aadhaar number is required" });
    }

    const loansTaken = await Loan.find({ aadhaarNumber });

    const loansPending = loansTaken.filter(
      (loan) => loan.status === "pending"
    ).length;
    const loansPaid = loansTaken.filter(
      (loan) => loan.status === "paid"
    ).length;

    const loansGiven = await Loan.find({ lenderId });

    return res.status(200).json({
      message: "Loan stats fetched successfully",
      data: {
        loansTakenCount: loansTaken.length || 0,
        loansPendingCount: loansPending || 0,
        loansPaidCount: loansPaid || 0,
        loansGivenCount: loansGiven.length || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching loan stats:", error);
    return res.status(500).json({
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

module.exports = {
  AddLoan,
  ShowAllLoan,
  GetLoanDetails,
  getLoansById,
  deleteLoanDetails,
  updateLoanDetails,
  getLoansByLender,
  getLoanByAadhaar,
  updateLoanStatus,
  getLoanStats,
  updateLoanAcceptanceStatus,
};
