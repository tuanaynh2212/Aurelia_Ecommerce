import { useContext } from "react";
import CollectionItem from "./CollectionItem";
import { CollectionContext } from "../../contexts/SeasonContext";
import { SectionTitle } from "../UI/primitives/SectionTitle";

const ArchivesSection = () => {
  const { collectionData } = useContext(CollectionContext);
  return (
    <section className="w-full mb-20">
      <SectionTitle
        index="02"
        eyebrow="ARCHIVE VAULT"
        title="Aurelia Archives"
        className="mb-10"
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <div>
          <CollectionItem
            id={collectionData[3]?.id || ""}
            title={collectionData[3]?.name || "Spring Summer '23"}
            subtitle={collectionData[3]?.description || "Modern Nostalgia"}
            aspectRatio="aspect-[4/5]"
            image={
              collectionData[3]?.banner ||
              "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800"
            }
          />
        </div>
        <div className="md:mt-12">
          <CollectionItem
            id={collectionData[4]?.id || ""}
            title={collectionData[4]?.name || "Summer Fall '23"}
            subtitle={collectionData[4]?.description || "Ethereal Vibes"}
            aspectRatio="aspect-[4/5]"
            image={
              collectionData[4]?.banner ||
              "https://images.unsplash.com/photo-1495121605193-b116b5b09a6c?auto=format&fit=crop&q=80&w=800"
            }
          />
        </div>
      </div>
    </section>
  );
};

export default ArchivesSection;
