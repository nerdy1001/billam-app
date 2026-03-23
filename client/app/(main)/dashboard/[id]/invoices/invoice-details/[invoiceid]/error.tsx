"use client";

export default function Error({
  error,
//   reset,
}: {
  error: Error;
//   reset: () => void;
}) {
  return (
    <div className="p-8 text-center mt-80">
      <h2 className="text-xl font-semibold mb-4">
        Something went wrong.
      </h2>
      <p className="text-gray-500 mb-6">
        We couldn't load this invoice.
      </p>
    </div>
  );
}