import Image from "next/image";
import Link from "next/link";

import { fetchUser, getActivity } from "@/lib/actions/user.actions";

async function Page() {
  const defaultUserId = process.env.DEFAULT_USER_ID || "default-user";
  const userInfo = await fetchUser(defaultUserId);

  if (!userInfo) {
    return (
      <section className='flex items-center justify-center min-h-[60vh]'>
        <p className='text-light-3'>No activity</p>
      </section>
    );
  }

  const activity = await getActivity(userInfo._id);

  return (
    <>
      <h1 className='head-text'>Activity</h1>

      <section className='mt-10 flex flex-col gap-5'>
        {activity.length > 0 ? (
          <>
            {activity.map((activityItem) => (
              <Link key={activityItem._id} href={`/thread/${activityItem.parentId}`}>
                <article className='activity-card'>
                  <Image
                    src={activityItem.author.image}
                    alt='user_logo'
                    width={20}
                    height={20}
                    className='rounded-full object-cover'
                  />
                  <p className='!text-small-regular text-light-1'>
                    <span className='mr-1 text-primary-500'>
                      {activityItem.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className='!text-base-regular text-light-3'>No activity yet</p>
        )}
      </section>
    </>
  );
}

export default Page;
