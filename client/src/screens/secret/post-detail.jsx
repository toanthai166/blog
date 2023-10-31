import { useParams } from "react-router-dom";
import { useGetBlogById } from "../../hooks/blog.hook";

const PostDetail = () => {
  const { id = "" } = useParams();
  console.log(id);
  const { blog, isLoading } = useGetBlogById(id);
  console.log(blog);
  return (
    <div>
      <h3>sdfsdfd</h3>

      <div className="flex flex-col w-full mt-10 gap-5">
        <h2>{blog.title}</h2>
        <img
          className="w-full max-w-[800px] object-cover rounded-lg"
          src={blog.image ?? ""}
          alt=""
        />
        <div dangerouslySetInnerHTML={{ __html: blog.content }}></div>
      </div>
    </div>
  );
};

export default PostDetail;
