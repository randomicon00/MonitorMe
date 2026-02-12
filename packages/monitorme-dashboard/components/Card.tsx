import React, { ReactNode, ReactComponentElement } from "react";

type CardType = "error" | "info" | "other";

type CardProps = {
  name: string;
  count: number;
  href: string;
  Icon: (props: React.ComponentProps<"svg">) => JSX.Element;
  type: string;
};

const Card = (props: CardProps) => {
  const { name, count, href, Icon, type } = props;

  const iconColor =
    type === "error"
      ? "text-red-500"
      : type === "info"
      ? "text-blue-500"
      : "text-gray-500";

  return (
    <div key={name} className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-8 w-8 ${iconColor}`} aria-hidden="true" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-md font-medium text-gray-500 truncate">
                {name}
              </dt>
              <dd>
                <div className="text-xl font-medium text-gray-900">{count}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <a
            href={href}
            className="font-medium text-indigo-700 hover:text-indigo-900"
          >
            View all
          </a>
        </div>
      </div>
    </div>
  );
};

export default Card;
