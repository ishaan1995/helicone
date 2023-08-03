import React from "react";
import { clsx } from "./clsx";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface StarButtonProps {
  repoURL: string;
}

const StarButton: React.FC<StarButtonProps> = ({ repoURL }) => {
  const [show, setShow] = React.useState(true);
  return (
    <div
      className={clsx(
        show ? "block" : "hidden",
        "fixed inset-0 flex items-end justify-center z-50"
      )}
    >
      <div className="p-6 m-4 bg-black shadow-xl rounded-full flex flex-row justify-between items-center">
        <div className="flex flex-row gap-10">
          <h1 className="text-lg text-white">Star us on Github</h1>
          <iframe
            src="https://ghbtns.com/github-btn.html?user=helicone&repo=helicone&type=star&count=true&size=large"
            width="170"
            height="30"
            title="GitHub"
          ></iframe>
        </div>
        <button className="text-white" onClick={() => setShow(false)}>
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>{" "}
    </div>
  );
};

export default StarButton;
