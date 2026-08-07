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
    <>
      <h1 className='head-text'>Edit Profile</h1>
      <p className='mt-3 text-base-regular text-light-2'>Make any changes</p>

      <section className='mt-12'>
        <AccountProfile user={userData} btnTitle='Save Changes' />
      </section>
    </>
  );
}

export default Page;
