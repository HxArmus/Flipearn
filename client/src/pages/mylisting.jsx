import {
  ArrowDownCircleIcon,
  BanIcon,
  CheckCircle,
  Clock,
  CoinsIcon,
  DollarSign,
  DollarSignIcon,
  Edit,
  EditIcon,
  Eye,
  EyeOffIcon,
  Lock,
  LockIcon,
  Plus,
  PlusIcon,
  StarIcon,
  TrashIcon,
  TrendingUp,
  TrendingUpIcon,
  User,
  WalletIcon,
  XCircle,
  EyeIcon,
} from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Statcard from "../components/Statcard";
import {} from "../app/features/listingSlice";
import { platformIcons } from "../assets/assets";
import { useState } from "react";
import CredentialSubmission from "../components/CredentialSubmission";
import WithdrawModel from "../components/WithdrawModel";

const MyListing = () => {
  const { userListings, balance } = useSelector((state) => state.listing);
  const currency = import.meta.env.VITE_CURRENCY || "$";

  const navigate = useNavigate();

  const [showCredentialSubmissions, setShowCredentialSubmissions] =
    useState(null);
  const [showWithdrawal, setShowWithdrawal] = useState(false);

  const totalValue = userListings.reduce(
    (sum, listing) => sum + (listing.price || 0),
    0,
  );
  const activeListings = userListings.filter(
    (listing) => listing.status === "active",
  ).length;
  const soldListings = userListings.filter(
    (listing) => listing.status === "sold",
  ).length;
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num?.toString() || "0";
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="size-4 text-green-600" />;
      case "ban":
        return <BanIcon className="size-4 text-indigo-600" />;
      case "sold":
        return <DollarSignIcon className="size-4 text-yellow-600" />;
      case "inactive":
        return <XCircle className="size-4 text-gray-600" />;
      default:
        return <Clock className="size-4 text-gray-600" />;
    }
  };
  const getStatuscolor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "ban":
        return "text-red-600";
      case "sold":
        return "text-yellow-600";
      case "inactive":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };
  const toggleStatus = async (listingId) => {
    // Simulate API call to toggle listing status
    console.log("Toggling status for listing ID:", listingId);
  };
  const deleteListing = async (listingId) => {
    // Simulate API call to toggle listing status
    console.log("Toggling status for listing ID:", listingId);
  };
  const markAsFeatured = async (listingId) => {
    // Simulate API call to toggle listing status
    console.log("Toggling status for listing ID:", listingId);
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Listings</h1>
          <p className="text-gray-600 mt-1">
            Manage your social media account listings
          </p>
        </div>

        <button
          onClick={() => navigate("/create-listing")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium flex items-center space-x-2 mt-4 md:mt-0"
        >
          <Plus className="size-4" />
          <span>New Listing</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Statcard
          title="Total Listings"
          value={userListings.length}
          icon={<Eye className="size-6 text-indigo-600" />}
          color="indigo"
        />
        <Statcard
          title="Active Listings"
          value={activeListings}
          icon={<CheckCircle className="size-6 text-green-600" />}
          color="green"
        />
        <Statcard
          title="Sold Listings"
          value={soldListings}
          icon={<TrendingUp className="size-6 text-indigo-600" />}
          color="indigo"
        />
        <Statcard
          title="Total Value"
          value={`${currency}${totalValue.toLocaleString()}`}
          icon={<DollarSign className="size-6 text-yellow-600" />}
          color="yellow"
        />
      </div>
      {/* balance table */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 xl:gap-20 p-6 mb-10 bg-white rounded-xl border border-gray-100">
        {[
          { label: "Earned", value: balance.earned, icon: WalletIcon },
          {
            label: "Withdrawn",
            value: balance.withdrawn,
            icon: ArrowDownCircleIcon,
          },
          {
            label: "Available Balance",
            value: balance.available,
            icon: CoinsIcon,
          },
        ].map(({ label, value, icon: Icon }, index) => {
          const isAvailableCard = label === "Available Balance";
          return (
            <div
              key={index}
              onClick={() => isAvailableCard && setShowWithdrawal(true)}
              className={`flex flex-1 items-center justify-between p-4 rounded-lg border border-gray-100 ${isAvailableCard ? "cursor-pointer hover:border-indigo-300" : ""}`}
              role={isAvailableCard ? "button" : undefined}
              tabIndex={isAvailableCard ? 0 : -1}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-indigo-600" />
                <span className="font-medium text-gray-600">{label}</span>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xl font-medium text-gray-700">{`${currency}${Number(value ?? 0).toFixed(2)}`}</span>
                {isAvailableCard && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowWithdrawal(true);
                    }}
                    className="px-3 py-1 text-sm text-indigo-600 border border-indigo-200 rounded hover:bg-indigo-50"
                  >
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Listings Table */}
      {userListings.length === 0 ? (
        <div className="bg-white p-16 rounded-lg border border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlusIcon className="w-8 h-8 text-gray-400" />
            <h3 className="font-medium mb-2 text-gray-800 text-xl">
              You have no listings yet. Click "New Listing" to create one.
            </h3>
            <button
              onClick={() => navigate("/create-listing")}
              className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              create first listing
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white border border-gray-200 rounded-lg hover:shadow-lg shadow-gray-200/70 transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 justify-between mb-4">
                  {platformIcons[listing.platform]}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {listing.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="relative group">
                          <LockIcon size={14} />
                          <div className="invisible group-hover:visible absolute right-0 top-0 pt-4.5 z-10">
                            <div className="bg-white text-gray-600 text-xs rounded border border-gray-200 p-2 px-3">
                              {!listing.isCredentialSubmitted && (
                                <>
                                  <button onClick={()=>setShowCredentialSubmissions(listing)} className="flex items-center gap-2 text-nowrap">
                                    Add Credentials
                                  </button>
                                  <hr className="border-gray-200 my-2" />
                                </>
                              )}
                              <button className="text-nowrap">
                                status:{" "}
                                <span
                                  className={
                                    listing.isCredentialSubmitted
                                      ? listing.isCredentialVerified
                                        ? listing.isCredentialChanged
                                          ? "text-yellow-600 font-semibold"
                                          : "text-green-600 font-semibold"
                                        : "text-indigo-600 font-semibold"
                                      : "text-slate-600 font-semibold"
                                  }
                                >
                                  {listing.isCredentialSubmitted
                                    ? listing.isCredentialVerified
                                      ? listing.isCredentialChanged
                                        ? "Changed"
                                        : "Verified"
                                      : "submitted"
                                    : "Not Submitted"}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                        {listing.status === "active" && (
                          <StarIcon
                            onClick={() => {
                              markAsFeatured(listing.id);
                            }}
                            size={18}
                            className={`text-yellow-500 cursor-pointer ${listing.featured ? "fill-yellow-500" : ""}`}
                          />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      <span>@{listing.username}</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space x-2">
                      <User className="size-4 text-gray-300" />
                      <span className="ml-2">
                        {formatNumber(listing.followers_count) || 0} followers
                      </span>
                    </div>
                    <span
                      className={`flex items-center justify-end gap-1 ${getStatuscolor(listing.status)}`}
                    >
                      {getStatusIcon(listing.status)}{" "}
                      <span>{listing.status}</span>
                    </span>
                    <div className="flex items-center space-x-2">
                      <TrendingUpIcon className="size-4 text-gray-300" />
                      <span className="ml-1">
                        {formatNumber(listing.engagement_rate) || 0}% engagement
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className="text-2xl font-bold text-gray-800">
                      {currency}
                      {listing.price.toLocaleString() || 0}
                    </span>
                    <div className="flex items-center space-x-2">
                      {listing.status !== "sold" && (
                        <button
                          onClick={() => {
                            deleteListing(listing.id);
                          }}
                          className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-500"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/edit-listing/${listing.id}`)}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-indigo-500"
                      >
                        <Edit className="size-4" />
                      </button>
                      <button
                        onClick={() => {
                          toggleStatus(listing.id);
                        }}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-purple-500"
                      >
                        {listing.status === "active" && (
                          <EyeOffIcon className="size-4" />
                        )}
                        {listing.status !== "active" && (
                          <EyeIcon className="size-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showCredentialSubmissions && (
        <CredentialSubmission
          listing={showCredentialSubmissions}
          onClose={() => setShowCredentialSubmissions(null)}
        />
      )}
      {showWithdrawal && (
        <WithdrawModel onclose={() => setShowWithdrawal(false)} />
      )}

      {/* footer */}
      <div className="bg-white border-t border-gray-200 p-4 text-center mt-28">
        <p className="text-sm text-gray-500">
          © 2026 <span className="text-indigo-300">Hx_Armus</span>. All rights
          reserved.
        </p>
      </div>
    </div>
  );
};

export default MyListing;


