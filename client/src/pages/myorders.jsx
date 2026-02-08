import React, { useEffect } from "react";
import { dummyOrders, platformIcons } from "../assets/assets";
import { CheckCircle2Icon, Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";

const Myorders = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [expandedId, setExpandedId] = React.useState(null);

  const fetchOrders = async () => {
    setOrders(dummyOrders);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const mask = (val, type = "") => {
    if (val === undefined || val === null) return "-";
    if (type.toLowerCase() === "password") {
      return "*".repeat(8);
    }
    return String(val);
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy");
    }
  };

  const toggleExpanded = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2Icon className="size-7 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-2xl mx-auto mt-14 bg-white rounded-xl border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-semibold">No orders yet</h3>
          <p className="text-sm text-gray-500 mt-2">You haven't purchased any listings yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-16 lg:px-24 xl:px-32 py-6">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => {
          const id = order.id;
          const listing = order.listing;
          const credentials = order.credentials;
          const isExpanded = expandedId === id;
          const price = order.price ?? order.amount ?? 0;

          return (
            <div
              key={id}
              className="bg-white rounded-lg border border-gray-200 p-5 flex flex-col max-w-4xl"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="p-2 rounded-lg bg-gray-50 max-sm:hidden">
                  {platformIcons[listing.platform]}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{listing.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        @{listing.username ?? listing.handle ?? "unknown"} •{" "}
                        <span className="capitalize">{listing.platform}</span>
                      </p>
                      <div className="flex gap-2 mt-2">
                        {listing.verified && (
                          <span className="flex items-center text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">
                            <CheckCircle2Icon className="w-3 h-3 mr-1" />Verified
                          </span>
                        )}
                        {listing.monetized && (
                          <span className="flex items-center text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md">
                            <span className="text-xs font-medium">$ </span>Monetized
                          </span>
                        )}
                        
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-semibold text-gray-900 mb-1">
                        {currency}
                        {price.toLocaleString()}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleExpanded(id)}
                        className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded hover:shadow text-sm"
                      >
                        {isExpanded ? "Hide Credentials" : "View Credentials"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
                  <p className="text-sm font-medium text-gray-700">Delivered Credentials</p>
                  {credentials ? (
                    Object.entries(credentials).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                      >
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">{key}</p>
                          <p className="text-sm font-medium text-gray-900">{mask(value, key)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copy(value)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                        >
                          Copy
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Seller has not shared credentials yet.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Myorders;