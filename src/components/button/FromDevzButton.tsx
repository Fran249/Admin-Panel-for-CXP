import { Tooltip } from "@mui/material";

type Props = {
  text?: string;
  click?: () => void;
  children: any;
  submitType?: boolean;
  
};

export const FromDevzButton = ({
  text,
  click,
  children,
  submitType,
}: Props) => {
  return submitType ? (
    <button
      type="submit"
      className=" flex justify-center items-center gap-2 transition-colors duration-300 px-4 py-1 rounded-lg text-neutral-800 bg-neutral-100 border-[.5px] border-neutral-800 font-archivo font-medium text-sm hover:bg-neutral-800 hover:text-neutral-100"
    >
      {children} <h3 className="first-letter:uppercase">{text}</h3>
    </button>
  ) : (
    <button
      onClick={click}
      type="button"
      className=" flex justify-center items-center gap-2 transition-colors duration-300 px-4 py-1 rounded-lg text-neutral-800 bg-neutral-100 border-[.5px] border-neutral-800 font-archivo font-medium text-sm hover:bg-neutral-800 hover:text-neutral-100"
    >
      {children} <h3 className="first-letter:uppercase">{text}</h3>
    </button>
  );
};

export const FromDevzButtonWithTooltip = ({ text, click, children }: Props) => {
  return (
    <Tooltip title={text}>
      <button
        onClick={click}
        className=" flex justify-center items-center gap-2 transition-colors duration-300 p-4  rounded-full text-neutral-800 bg-neutral-100 border-[.5px] border-neutral-800 font-archivo font-medium text-sm hover:bg-neutral-800 hover:text-neutral-100"
      >
        {children}
      </button>
    </Tooltip>
  );
};
