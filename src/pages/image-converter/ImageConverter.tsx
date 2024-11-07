import { ArrowBigLeft } from "lucide-react";
import { FromDevzLoader } from "../../assets/from-devz-loader/FromDevzLoader";
import { FromDevzButton } from "../../components/button/FromDevzButton";
import { Link } from "react-router-dom";

export const ImageConverter = () => {
  return (
    <section className="bg-neutral-950 w-full min-h-screen py-20 flex flex-col gap-5 justify-center items-center text-neutral-200">
      <div className="flex justify-center items-center gap-5">
        On Development
        <FromDevzLoader width="50" height="50" />
      </div>

      <div className="flex justify-center items-center gap-2">
        <Link to={'/view-picker'}>
          <FromDevzButton>
            <ArrowBigLeft />
            Back
          </FromDevzButton>
        </Link>
      </div>
    </section>
  );
};
