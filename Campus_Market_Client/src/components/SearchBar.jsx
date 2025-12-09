import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (

        
        <div className="bg-gray-100 p-4 rounded-xl shadow-sm mb-8">
            <div className="form-control">
                <div className="input-group justify-center">
                    <input
                        type="text"
                        placeholder="Search for items..."
                        className="input input-bordered w-full max-w-2xl pl-5"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn btn-primary ml-3 px-5 bg-zinc-500">
                        <FaSearch />
                    </button>
                </div>
            </div>
        </div>

    );
};

export default SearchBar;
