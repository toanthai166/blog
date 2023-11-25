const FollowItem = ({ data, className = "" }) => {
  return (
    <div
      className={`flex text-center justify-center cursor-pointer border relative w-full border-slate-200 py-1  gap-1 hover:border-yellow-400 hover:border ${className}`}
    >
      <span className="w-4 h-4 mx-auto py-1">{data.image}</span>
      <div className=" border-slate-200 border border-t-transparent absolute h-8 top-[50%] -translate-y-[50%] -translate-x-[50%] left-[30%]  "></div>
      <span className="mx-auto">{data.title}</span>
    </div>
  );
};

export default FollowItem;
