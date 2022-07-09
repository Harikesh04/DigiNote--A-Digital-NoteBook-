import React, { useContext} from "react";
import noteContext from "../context/notes/noteContext";

const Noteitem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  const { note,updateNote } = props;
  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex  align-items-center">
            <h5 className="card-title">{note.title}</h5>
            <i className="fas fa-trash-alt mx-2" onClick={()=>{deleteNote(note._id)}}></i>
            <i className="far fa-edit mx-2" onClick={()=>{updateNote(note)}}></i>
          </div>
          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;

{
  /* <Heping refrencs> */
}

{
  /* here i have used mx-2 because i have required spacing in between these two logo */
}
