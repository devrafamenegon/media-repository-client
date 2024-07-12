import getMedias from "@/actions/get-medias";
import MediaGrid from "@/components/media-grid";

const Home = async () => {
  const medias = await getMedias();

  return (
    <div className="p-2">
      <MediaGrid medias={medias}/>
    </div>
  );
}

export default Home;