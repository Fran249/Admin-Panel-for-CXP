import { Tooltip } from '@mui/material';
import { Edit, Plus } from 'lucide-react';


type Props = {
    handleEdit: () => void;
    handleAdd: () => void;
}


export const AddEditButtons = ({handleAdd, handleEdit}: Props) => {
  return (
    <div className=" flex  gap-10  justify-center items-center w-60 h-20 fixed right-2 top-20 bg-[#222] rounded-3xl ">
    <Tooltip title="EDITAR">
      <button onClick={handleEdit} className="bg-indigo-500 hover:bg-indigo-100 hover:text-neutral-900 text-white duration-300 p-3 rounded-full">
        <Edit />
      </button>
    </Tooltip>
    <Tooltip title="AGREGAR">
      <button onClick={handleAdd} className="bg-indigo-500 hover:bg-indigo-100 hover:text-neutral-900 text-white duration-300 p-3 rounded-full">
        <Plus />
      </button>
    </Tooltip>

  </div>
  )
}