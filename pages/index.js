import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { useState, useEffect } from "react";
import { useAuthContext } from "@/firebase/auth.js";
import { useRouter } from "next/router.js";
import Loader from "@/components/Loader.jsx";
import { auth, db } from "@/firebase/firebase.js";
import {
  doc,
  addDoc,
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const Home = ()=>{
  const { authUser, isLoading, signOut, setAuthUser } = useAuthContext()();
  const [todoInput, setTodoInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  
  const [placeholder, setPlaceholder] = useState("");

  const addTodo = async () => {
    if (todoInput.length < 1) {
      setPlaceholder("Enter Some Tasks");
      setTimeout(() => {
        setPlaceholder(placeholder);
      }, 1000 * 2);
      return;
    }

    const docRef = await addDoc(
      collection(db, `todo-users/${authUser.uid}/tasks`),
      {
        content: todoInput,
        complete: false,
      }
    );
    console.log("Document ID: ", docRef.id);
    setTodoInput("");
    getTodo();
  };
  
  const getTodo = async () => {
    await getDocs(collection(db, "todo-users", authUser.uid, "tasks"))
    .then((querySnapshot) => {
        let arr = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          arr.push({
            content: doc.data().content,
            docId: doc.id,
            complete: doc.data().complete,
          });
          // setTodos([...todos,  doc.data().content]);
          //   console.log(doc.data().content, doc.data().complete);
          // console.log("id "+doc.id);
        });
        setTodos(arr);
      })
      .catch((error) => {
        console.log(error);
      });
      setDataLoading(false)
    };

    const updateTodo = async (e, id) => {
    const ref = doc(db, `todo-users/${authUser.uid}/tasks`, id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(ref, { complete: e.target.checked })
      .then(() => {
      })
      .catch((error) => {
        console.log(error);
      });
    getTodo();
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, `todo-users/${authUser.uid}/tasks`, id))
      .then(() => {
      })
      .catch((error) => {
        console.log(error);
      });
    getTodo();
  };

  const router = useRouter();

  const signOutUser = () => {
    signOut();
    setAuthUser(null);
  };

  useEffect(() => {
    if (!authUser && !isLoading) {
      router.push("/login");
    } else if (authUser) {
        const placeholderText = `👋 Hello ${authUser.userName}, What to do Today?`;
        setPlaceholder(placeholderText);
        getTodo();
        console.log("Yes")
    }
  }, [authUser, isLoading, setPlaceholder]);

  return isLoading || !authUser ? (
    <Loader />
  ) : (
    <main className="">
      <div
        className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer"
        onClick={signOutUser}
      >
        <GoSignOut size={18} />
        <span>Logout</span>
      </div>
      <div className="max-w-3xl mx-auto mt-10 p-8">
        <div className="bg-white -m-6 p-3 sticky top-0">
          <div className="flex justify-center flex-col items-center">
            <span className="text-7xl mb-10">📝</span>
            <h1 className="text-5xl md:text-7xl font-bold">ToooDooo's</h1>
          </div>
          <div className="flex items-center gap-2 mt-10">
            <input
              // placeholder={`👋 Hello ${userName}, What to do Today?`}
              placeholder={placeholder}
              type="text"
              className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-yellow-400 text-lg transition-all duration-300"
              autoFocus
              value={todoInput}
              onChange={(e) => {
                setTodoInput(e.target.value);
              }}
              onKeyUp={(e)=>{ if(e.key == "Enter") addTodo()}}
            />
            <button
              className="w-[60px] h-[60px] rounded-md bg-black flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]"
              onClick={(e) => {
                addTodo(e);
              }}
            >
              <AiOutlinePlus size={30} color="#fff" />
            </button>
          </div>
        </div>
        <div className="my-10">
          {(dataLoading == false && todos.length <= 0) ? (
            <h1 className="flex justify-center text-3xl md:text-7xl font-medium">
              Tasks is Empty
            </h1>
          ) : (
            todos.map((todo, index) => (
              <div
                key={index}
                className="flex items-center justify-between mt-4"
              >
                <div className="flex items-center gap-3">
                  <input
                    id={`todo-${index}`}
                    type="checkbox"
                    className="w-4 h-4 accent-green-400 rounded-lg"
                    checked={todo.complete}
                    onChange={(e) => {
                      updateTodo(e, todo.docId);
                    }}
                  />
                  <label
                    htmlFor={`todo-${index}`}
                    className={`font-medium ${
                      todo.complete ? "line-through" : ""
                    }`}
                  >
                    {todo.content}
                  </label>
                </div>

                <div
                  className="flex items-center gap-3"
                  onClick={() => {
                    deleteTodo(todo.docId);
                  }}
                >
                  <MdDeleteForever
                    size={30}
                    className="text-red-400 hover:text-red-600 cursor-pointer"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default Home;

