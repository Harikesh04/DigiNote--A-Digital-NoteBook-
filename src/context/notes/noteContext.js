//What is a context?
//constext is a colection of state which hold all the state and our each and every component in our app will  access these states from this
//context api
import { createContext } from "react";

const noteContext = createContext();
//this is a syntax for creating the context .

export default noteContext;                 