import React from "react";
import { LoaderCircle } from "lucide-react";

const Loader = ({ text = "items" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <LoaderCircle className="w-12 h-12 text-green-600 animate-spin mb-4" />

      <p className="text-gray-700 text-lg font-medium">
        There are no {text} ....
      </p>
    </div>
  );
};

export default Loader;
