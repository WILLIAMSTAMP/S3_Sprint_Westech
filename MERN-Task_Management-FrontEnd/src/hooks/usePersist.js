import { useState, useEffect } from "react"
// The usePersist function is a custom Hook that retrieves and updates a value in the local storage of the user's browser. The value is a boolean that determines whether to persist the login state of the user.
// The Hook uses the useState Hook from React to declare a state variable persist and a function setPersist to update the state. The initial value of persist is determined by the value in the local storage, or false if the value is not found.
// The Hook uses the useEffect Hook from React to update the value in the local storage when the value of persist changes. The useEffect Hook is called with an effect function that updates the value in the local storage using the setItem method of the localStorage object.
// The Hook returns an array with the current value of persist and the setPersist function. This array could be destructured and used in other parts of the application to retrieve and update the value in the local storage.
const usePersist = () => {
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}
export default usePersist