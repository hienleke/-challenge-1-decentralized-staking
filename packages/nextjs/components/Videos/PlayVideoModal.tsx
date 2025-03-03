import { useState } from "react";
import GenericModal from "../scaffold-stark/CustomConnectButton/GenericModal";
import Image from "next/image";
import { CloseIcon } from "../icons/CloseIcon";
import { ExpandIcon } from "../icons/ExpandIcon";
import ReactPlayer from "react-player";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  desc: string;
};
export const PlayVideoModal = ({
  isOpen,
  onClose,
  title,
  url,
  desc,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCloseModal = () => {
    onClose();
  };

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <GenericModal
      animate
      isOpen={isOpen}
      onClose={handleCloseModal}
      className={`xl:w-[1200px] w-screen mx-auto md:p-[1px] md:rounded-lg bg-white ${isExpanded ? "h-[95vh]" : ""}`}
    >
      <div className="w-full h-full">
        <div className="bg-[#4D58FF] relative md:rounded-t-lg h-[60px] flex items-center justify-center">
          <Image
            src="/homescreen/header-decore.svg"
            alt="icon"
            width={230}
            height={40}
            className="absolute left-1/2 transform -translate-x-1/2 z-10 w-full h-full"
          />

          <div className="flex items-center gap-1.5 absolute z-30 left-4">
            <CloseIcon onClose={handleCloseModal} />
            <ExpandIcon onExpand={handleExpand} />
          </div>
          <p className="text-xl relative z-30 uppercase font-vt323">{title}</p>
        </div>
        <div className="md:pb-1 md:h-[700px] h-[221px]">
          <ReactPlayer
            url={`${url}`}
            width={"100%"}
            height={isExpanded ? "calc(95vh - 65px)" : "100%"}
            controls={true}
            playing
          />
        </div>
        <div className="md:hidden block p-4">
          <p className="text-black text-base">{title}</p>
          <p className="mt-2 text-sm text-[#0C0C4F]">{desc}</p>
        </div>
      </div>
    </GenericModal>
  );
};
