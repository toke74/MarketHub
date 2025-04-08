import {
  FiDollarSign,
  FiMessageSquare,
  FiPackage,
  FiShoppingBag,
  FiStar,
} from "react-icons/fi";

const DashboardOverview = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Sales"
          value="$12,345"
          change="+12%"
          icon={<FiDollarSign size={24} />}
          bgColor="bg-blue-100"
          textColor="text-blue-600"
        />
        <StatCard
          title="Pending Orders"
          value="24"
          change="+3"
          icon={<FiShoppingBag size={24} />}
          bgColor="bg-yellow-100"
          textColor="text-yellow-600"
        />
        <StatCard
          title="Completed Orders"
          value="156"
          change="+18%"
          icon={<FiPackage size={24} />}
          bgColor="bg-green-100"
          textColor="text-green-600"
        />
        <StatCard
          title="Return Requests"
          value="5"
          change="-2"
          icon={<FiShoppingBag size={24} />}
          bgColor="bg-red-100"
          textColor="text-red-600"
        />
        <StatCard
          title="Average Rating"
          value="4.7"
          change="+0.1"
          icon={<FiStar size={24} />}
          bgColor="bg-purple-100"
          textColor="text-purple-600"
        />
        <StatCard
          title="Available Balance"
          value="$3,450"
          change="+$450"
          icon={<FiDollarSign size={24} />}
          bgColor="bg-indigo-100"
          textColor="text-indigo-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <button className="text-primary hover:underline">View All</button>
        </div>
        <div className="space-y-4">
          <ActivityItem
            icon={<FiShoppingBag />}
            title="New Order #12345"
            description="Customer: John Doe, Total: $125.99"
            time="2 minutes ago"
          />
          <ActivityItem
            icon={<FiMessageSquare />}
            title="New Message"
            description="Customer inquiry about product availability"
            time="15 minutes ago"
          />
          <ActivityItem
            icon={<FiStar />}
            title="New Review"
            description="5-star rating for 'Premium Headphones'"
            time="1 hour ago"
          />
          <ActivityItem
            icon={<FiPackage />}
            title="Product Approved"
            description="Your product 'Wireless Earbuds' is now live"
            time="3 hours ago"
          />
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Sales Overview</h2>
          <select className="border rounded px-3 py-1 text-sm">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
        <div className="h-64">
          {/* Chart would be implemented with a library like Chart.js */}
          <div className="flex items-center justify-center h-full bg-gray-100 rounded">
            <p className="text-gray-500">Sales Chart Visualization</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, bgColor, textColor }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-start ">
    <div className={`p-3 rounded-full ${bgColor} ${textColor} mr-4`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold my-1">{value}</p>
      <p
        className={`text-sm ${
          change.startsWith("+") ? "text-green-500" : "text-red-500"
        }`}
      >
        {change} from last week
      </p>
    </div>
  </div>
);

const ActivityItem = ({ icon, title, description, time }) => (
  <div className="flex items-start">
    <div className="p-2 bg-gray-100 rounded-full mr-4 text-gray-600">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="font-medium">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
      <p className="text-gray-400 text-xs mt-1">{time}</p>
    </div>
  </div>
);

export default DashboardOverview;
