import { redirect } from "next/navigation";

import Comment from "@/components/forms/Comment";
import ThreadCard from "@/components/cards/ThreadCard";

import { fetchThreadById } from "@/lib/actions/thread.actions";

export const revalidate = 0;

async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const thread = await fetchThreadById(params.id);

  return (
    <section className='relative'>
      <div>
        <ThreadCard
          id={thread._id}
          currentUserId={process.env.DEFAULT_USER_ID || "default-user"}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          likes={thread.likes}
          views={thread.views}
        />
      </div>

      <div className='mt-7'>
        <Comment
          threadId={params.id}
          currentUserImg={thread.author?.image || "https://via.placeholder.com/100"}
          currentUserId={process.env.DEFAULT_USER_ID || "default-user"}
        />
      </div>

      <div className='mt-10'>
        {thread.children.map((childItem: any) => (
          <ThreadCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={process.env.DEFAULT_USER_ID || "default-user"}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}

export default page;
