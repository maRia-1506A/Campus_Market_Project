import { Link } from "react-router-dom";
import { FaMapMarkedAlt } from "react-icons/fa";

const ProductCard = ({ product }) => {
    return (
        <Link
            to={`/product/${product._id}`}
            className="card bg-base-100 shadow-xl card-hover"
        >
            <figure className="h-48">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover"
                />
            </figure>
            <div className="card-body">
                <div className="flex items-start justify-between">
                    <h2 className="card-title text-lg line-clamp-2">{product.title}</h2>
                    <span className="badge badge-primary">{product.category}</span>
                </div>
                <p className="text-gray-600 line-clamp-2 text-sm">{product.description}</p>

                <div className="flex items-center justify-between mt-2">
                    <p className="text-2xl font-bold text-primary">${product.price}</p>
                    <span className="badge badge-secondary">{product.condition}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">

                    {product.location && (
                        <div className="flex items-center gap-1"><FaMapMarkedAlt />
                            <span className="truncate">{product.location}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
