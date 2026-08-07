import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/forms/AccountProfile";

async function Page() {
  const defaultUserId = process.env.DEFAULT_USER_ID || "default-user";
  const userInfo = await fetchUser(defaultUserId);

  const userData = {
    id: defaultUserId,
    objectId: userInfo?._id,
    username: userInfo ? userInfo.username : "threadsuser",
    name: userInfo ? userInfo.name : "Threads User",
    bio: userInfo ? userInfo.bio : "",
    image: userInfo ? userInfo.image : "",
  };

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text'>Set Up Your Profile</h1>
      <p className='mt-3 text-base-regular text-light-2'>
        Customize your profile to get started.
      </p>

      <section className='mt-9 bg-dark-2 p-10'>
        <AccountProfile user={userData} btnTitle='Save Profile' />
      </section>
    </main>
  );
}

export default Page;
