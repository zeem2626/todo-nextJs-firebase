import {createContext, useContext, useState, useEffect} from "react";
import {onAuthStateChanged, signOut as authSignOut, signOut} from "firebase/auth";
import {auth} from "./firebase.js"

const authContext = createContext({
  authUser: null,
  isLoading: true
})

const authFirebase = ()=>{
  // console.log("Start")
  
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const clear = ()=>{
    // console.log("Clear")

    setAuthUser(null);
    setIsLoading(false);
  }
  
  const authStateChanged = (user)=>{
    // console.log("authStateChanged")
    setIsLoading(true);
    if(!user){
      clear();
      return;
    }
    setAuthUser(
      {
      uid: user.uid,
      email: user.email,
      userName: user.displayName
    }
    )
    setIsLoading(false);
  }
  
  const signOut = ()=>{
    console.log("signOut")

    authSignOut(auth).then(() => {
      // Sign-out successful.
      clear();
    }).catch((error) => {
      console.log(error)
    });
  }
  
  useEffect(()=>{
    // console.log("useEffect")

    // onAuthStateChanged(auth, authStateChanged);
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    // console.log("before return unsubscribe")

    return ()=> unsubscribe();
    // console.log("after return unsubscribe")

  }, [])
  
  
  return {
      authUser,
      isLoading,
      signOut,
      setAuthUser
    }
    
    console.log("End")
  }
  
  const AuthUserProvider = ({children})=>{
    const auth = authFirebase()
    // console.log("AuthFirebase")
    // console.log(authFirebase().authUser)
    
    return(
    <authContext.Provider value={authFirebase}>
      {children}
    </authContext.Provider>
  )
}

const useAuthContext =  ()=> useContext(authContext);

export {AuthUserProvider, useAuthContext} 
export default authFirebase 


