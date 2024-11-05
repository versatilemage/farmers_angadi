import { useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import EditProductForm from "@/app/producers/EditProduct/index";

const MiniProductCard = ({ data, isCreator }) => {
  const [isEditing, setIsEditing] = useState(false);

  // Calculate final price and discount percentage
  const discountAmount = data.discount > 0 ? data.discount : 0;
  const finalPrice = (data.cost - discountAmount).toFixed(2);
  const discountPercentage = data.discount > 0 ? ((discountAmount / data.cost) * 100).toFixed(0) : 0;

  // Stock information
  const stock = data.stockData?.stock || "Out of Stock";
  const measurement = data.stockData?.measurement || "Kg";

  return (
    <div className="relative">
      {/* Edit button that toggles the edit modal */}
      {isCreator && (
        <button
          onClick={() => setIsEditing(true)} // Toggle editing mode on button click
          className="absolute top-2 right-2 p-1 text-black z-50 hover:text-gray-700 bg-yellow-500 rounded"
        >
          <FaPencilAlt />
        </button>
      )}

      <Link
        href={`/products/${data.category}/${data._id}`}
        className="min-w-[160px] sm:w-full max-w-[220px] sm:max-w-[300px] max-h-[350px] sm:max-h-[600px] rounded-lg shadow-[0_5px_25px_1px_rgba(0,0,0,0.3)] bg-tertiary relative h-max cursor-pointer"
      >
        {data.discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-r-lg z-10">
            {discountPercentage}% OFF
          </span>
        )}
        <div className="relative w-full h-64 overflow-hidden">
          <Image src={data.image} alt={data.name} layout="fill" objectFit="cover" quality={100} className="rounded-t-lg" />
        </div>

        <div className="flex flex-col items-start gap-2 p-4 bg-secondary rounded-b-lg">
          <span className="flex items-center justify-between w-full gap-2">
            <p className="text-primary text-sm font-medium capitalize w-32 md:w-40 truncate">{data.name}</p>
            <p className="text-red-800 p-2 rounded bg-white text-sm font-bold capitalize">{`${stock} ${measurement}`}</p>
          </span>

          <p className="text-xl text-primary font-bold">₹ {finalPrice}</p>
          {data.discount > 0 && <p className="text-sm text-tertiary line-through">₹ {data.cost.toFixed(2)}</p>}
        </div>
      </Link>

      {/* Render Edit Form as Modal */}
      {isEditing && (
        <EditProductForm productId={data._id} onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
};

export default MiniProductCard;
