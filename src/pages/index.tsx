/* eslint-disable jsx-a11y/alt-text */
import Image from "next/image";

export default function Home({ products }: any) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="container mx-auto p-4 flex-grow flex items-center justify-center">
        <div className="relative w-full max-w-[500px] aspect-square">
          <Image
            src="/vagon_5_Transparent.png"
            alt="Centered wagon image"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
