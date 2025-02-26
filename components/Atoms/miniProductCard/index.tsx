"use client";

import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import EditProductForm from "@/app/producers/EditProduct/index";

const MiniProductCard = ({
  data,
  isCreator,
  refreshProducts,
}: {
  data: any;
  isCreator?: boolean;
  refreshProducts: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Calculate final price and discount percentage
  const discountAmount = data.discount > 0 ? data.discount : 0;
  const finalPrice = (data.cost - discountAmount).toFixed(2);
  const discountPercentage =
    data.discount > 0 ? ((discountAmount / data.cost) * 100).toFixed(0) : 0;

  // Stock information
  const stock = data.stockData?.stock || "Out of Stock";
  const measurement = data.stockData?.measurement || "Kg";

  return (
    <div className="relative h-full flex flex-col">
      {/* Edit button that toggles the edit modal */}
      {isCreator && (
        <button
          onClick={() => setIsEditing(true)} // Toggle editing mode on button click
          className="absolute top-2 right-2 p-1 text-white z-10 hover:text-white bg-blue-500 rounded"
        >
          <FaPencilAlt />
        </button>
      )}

      <Link
        href={`/products/${data.category}/${data._id}`}
        className="min-w-[160px] flex flex-col lg:items-center lg:justify-start sm:w-full max-w-[160px] sm:max-w-[300px] max-h-[250px] sm:max-h-[600px] lg:min-h-[400px] rounded-lg shadow-[0_5px_25px_1px_rgba(0,0,0,0.3)] bg-secondary relative cursor-pointer"
      >
        {data.discount > 0 && (
          <span className="absolute sm:top-3 sm:left-3 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-r-lg z-10">
            {discountPercentage}% OFF
          </span>
        )}
        <div className="relative w-full h-64 overflow-hidden flex">
          <Image
            src={data.image}
            alt={data.name}
            layout="fill"
            objectFit="cover"
            quality={100}
            className="rounded-t-lg"
          />
        </div>

        <div className="flex flex-col items-start gap-2 p-4 bg-secondary rounded-b-lg">
          <span className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2">
            <p className="text-primary text-xs sm:text-sm font-medium capitalize w-36 md:w-40 truncate">
              {data.name}
            </p>
            <p className="text-red-800 sm:p-2 rounded sm:bg-white text-sm font-bold capitalize">{`${stock} ${measurement}`}</p>
          </span>

          <p className="text-sm sm:text-xl text-primary sm:font-bold">₹ {finalPrice} per {measurement}</p>
          {data.discount > 0 && (
            <p className="text-sm text-tertiary line-through">
              ₹ {data.cost.toFixed(2)}
            </p>
          )}
        </div>
      </Link>

      {/* Render Edit Form as Modal */}
      {isEditing && (
        <EditProductForm
          productId={data._id}
          onClose={() => {
            setIsEditing(false);
            refreshProducts();
          }}
        />
      )}
    </div>
  );
};

export default MiniProductCard;
