import { getUniqueTopics } from "@/actions/getStory";
import { getSelectdedTopics } from "@/actions/topics";
import FollowingStories from "@/components/FollowingStories";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const topics = await getUniqueTopics();
  const userTags = await getSelectdedTopics();
  return (
    <main>
      <Navbar/>
      {/* <Hero/> */}
      <div className="max-w-[1100px] mx-auto px-4 mt-10">
        <FollowingStories topics ={topics.response} userTags={userTags.tags}/>
      </div>
    </main>
  );
}

// npm run dev
// clerk
// prisma
