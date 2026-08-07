import PostThread from "@/components/forms/PostThread";

async function Page() {
  const defaultUserId = process.env.DEFAULT_USER_ID || "default-user";

  return (
    <>
      <h1 className='head-text'>Create Thread</h1>
      <PostThread userId={defaultUserId} />
    </>
  );
}

export default Page;
