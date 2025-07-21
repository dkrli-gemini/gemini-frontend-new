import SearchIcon from "@mui/icons-material/Search";

export const SearchInput = () => {
  return (
    <div className="flex bg-[#F2F2F2] items-center p-2 rounded-xl h-13">
      <SearchIcon className="ml-2" />
      <input
        type="text"
        className="outline-none ml-3 h-max placeholder-[#999999]"
        placeholder="Pesquisar..."
      />
    </div>
  );
};
