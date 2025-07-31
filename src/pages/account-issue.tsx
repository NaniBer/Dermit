const AccountIssue = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md text-center bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-semibold text-red-600 mb-4">
          Account Inactive
        </h1>
        <p className="text-gray-700 mb-4">
          Your profile is currently{" "}
          <span className="font-medium">inactive</span>. It may be under review
          or temporarily deactivated.
        </p>
        <p className="text-gray-600 mb-6">
          If you believe this is an error or need assistance, feel free to reach
          out to our support team at{" "}
          <span className="font-medium">support@wemdafrica.com</span>.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/"
            className="bg-brand-primary text-white px-5 py-2 rounded-md transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default AccountIssue;
